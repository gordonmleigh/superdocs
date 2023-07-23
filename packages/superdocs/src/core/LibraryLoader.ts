import { dirname, posix, relative, resolve } from "path";
import ts from "typescript";
import { assert } from "../internal/assert.js";
import { getSyntaxKindName } from "../internal/getSyntaxKindName.js";
import { loadProgram } from "../internal/loadProgram.js";
import { serverContext } from "../internal/serverContext.js";
import { slugify } from "../internal/slugify.js";

export interface NodePosition {
  path: string;
  line: number;
  char: number;
}

export type Declaration =
  | ts.ClassDeclaration
  | ts.FunctionDeclaration
  | ts.InterfaceDeclaration
  | ts.TypeAliasDeclaration;

export interface LibraryLoaderOptions {
  codeBaseRoute?: string;
  entrypoint: string;
  getGroupName?: (def: Declaration) => string;
  gitSha?: string;
  makeCodeLink?: (pos: NodePosition) => string;
  repositoryUrl?: string;
  workspaceRoot?: string;
}

type FullLibraryLoaderOptions = Required<LibraryLoaderOptions>;

class LibraryLoader {
  private readonly checker: ts.TypeChecker;
  private readonly declarations = new Set<Declaration>();
  private readonly groups: Record<string, Declaration[]> = {};
  private readonly groupsBySlug = new Map<string, string>();
  private readonly options: FullLibraryLoaderOptions;
  private readonly program: ts.Program;
  private readonly resolveExtensions = [".ts", ".js", ".d.ts"];
  private readonly sourceMapCache = new Map<ts.SourceFile, string>();

  constructor({
    codeBaseRoute = "/code",
    entrypoint,
    getGroupName = defaultGetGroupName,
    gitSha = "",
    repositoryUrl = "",
    makeCodeLink = defaultMakeCodeLink(repositoryUrl, gitSha),
    workspaceRoot = resolve("."),
  }: LibraryLoaderOptions) {
    this.options = {
      codeBaseRoute,
      entrypoint,
      getGroupName,
      gitSha,
      makeCodeLink,
      repositoryUrl,
      workspaceRoot,
    };
    this.program = loadProgram(entrypoint);
    this.checker = this.program.getTypeChecker();
    const source = this.program.getSourceFile(entrypoint);
    assert(source, `expected source file '${entrypoint}'`);
    this.loadSourceFile(source);
  }

  public entries(): [string, Declaration[]][] {
    return Object.entries(this.groups);
  }

  private add(groupName: string, declaration: Declaration) {
    const group = this.groups[groupName];
    if (!group) {
      this.groups[groupName] = [declaration];
      this.groupsBySlug.set(slugify(groupName), groupName);
    } else {
      group.push(declaration);
    }
  }

  public getDeclaration(
    name: ts.EntityName | ts.JSDocMemberName,
    alias = false
  ): Declaration | undefined {
    let symbol = this.checker.getSymbolAtLocation(name);
    if (!symbol) {
      return;
    }
    if (alias) {
      symbol = this.checker.getAliasedSymbol(symbol);
    }
    const def = symbol.declarations?.[0];
    if (!def) {
      return;
    }
    if (ts.isImportSpecifier(def)) {
      return this.getDeclaration(def.name, true);
    }
    if (this.isOwnDeclaration(def)) {
      return def;
    }
  }

  public getDeclarationFragment(def: Declaration): string {
    if (!def.name) {
      throw new Error(`expected named definition`);
    }
    return slugify(getSyntaxKindName(def.kind) + " " + def.name.text);
  }

  public getDeclarationsForGroupUrl(slug: string): Declaration[] | undefined {
    const group = this.groupsBySlug.get(slug);
    if (!group) {
      return;
    }
    return this.groups[group];
  }

  public getDeclarationUrl(
    name: Declaration | ts.EntityName | ts.JSDocMemberName
  ): string {
    const url = this.tryGetDeclarationUrl(name);
    if (!url) {
      throw new Error(`expected named definitions`);
    }
    return url;
  }

  public tryGetDeclarationUrl(
    name: Declaration | ts.EntityName | ts.JSDocMemberName
  ): string | undefined {
    const def = isDeclaration(name) ? name : this.getDeclaration(name);
    if (!def?.name) {
      return;
    }
    return posix.join(
      this.options.codeBaseRoute,
      `${slugify(this.getGroupName(def))}#${this.getDeclarationFragment(def)}`
    );
  }

  public getDocumentation(
    declaration: Declaration
  ): readonly (ts.JSDoc | ts.JSDocTag)[] {
    return ts.getJSDocCommentsAndTags(declaration);
  }

  public getGroupName(def: Declaration): string {
    return this.options.getGroupName(def);
  }

  public getPosition(node: ts.Node): NodePosition {
    const pos = ts.getLineAndCharacterOfPosition(
      node.getSourceFile(),
      node.pos
    );

    return {
      char: pos.character + 1,
      line: pos.line + 1,
      path: relative(this.options.workspaceRoot, node.getSourceFile().fileName),
    };
  }

  public isOwnDeclaration(node: ts.Node): node is Declaration {
    return isDeclaration(node) && this.declarations.has(node);
  }

  private loadExport(statement: ts.ExportDeclaration): void {
    if (statement.moduleSpecifier) {
      const source = this.resolve(
        statement.moduleSpecifier,
        statement.getSourceFile().fileName
      );
      if (source) {
        this.loadSourceFile(source);
      }
    }
  }

  private loadSourceFile(source: ts.SourceFile): void {
    this.loadSourceMap(source);
    for (const statement of source.statements) {
      if (ts.isExportDeclaration(statement)) {
        this.loadExport(statement);
      } else if (isDeclaration(statement) && isExported(statement)) {
        const group = this.getGroupName(statement);
        this.declarations.add(statement);
        this.add(group, statement);
      }
    }
  }

  private loadSourceMap(source: ts.SourceFile): void {
    const url = getSourceMapUrl(source.text);
    if (url) {
      const resolved = resolve(dirname(source.fileName), url);
      this.sourceMapCache.set(source, resolved);
    }
  }

  private resolve(
    moduleSpecifier: string | ts.Expression,
    from = "."
  ): ts.SourceFile | undefined {
    if (typeof moduleSpecifier !== "string") {
      if (!ts.isStringLiteral(moduleSpecifier)) {
        throw new Error(`expected a string `);
      }
      return this.resolve(moduleSpecifier.text, from);
    }
    if (!isLocal(moduleSpecifier)) {
      return;
    }

    if (moduleSpecifier.endsWith(".js")) {
      const source = this.resolve(moduleSpecifier.slice(0, -3), from);
      if (source) {
        return source;
      }
    }

    const source = this.program.getSourceFile(
      resolve(dirname(from), moduleSpecifier)
    );
    if (source) {
      return source;
    }
    for (const ext of this.resolveExtensions) {
      const source = this.program.getSourceFile(
        resolve(dirname(from), moduleSpecifier + ext)
      );
      if (source) {
        return source;
      }
    }
    console.warn(`WARN: failed to resolve ${moduleSpecifier}`);
  }
}

const [getLibraryLoader, setLibraryLoader] = serverContext<
  LibraryLoader | undefined
>(undefined, "LibraryLoader");

export function initLibraryLoader(opts: LibraryLoaderOptions): void {
  if (getLibraryLoader()) {
    throw new Error("`initLibraryLoader` has already been called");
  }
  setLibraryLoader(new LibraryLoader(opts));
}

export function useLibraryLoader(): LibraryLoader {
  const instance = getLibraryLoader();
  if (!instance) {
    throw new Error(
      "no instance available for LibraryLoader (call `initLibraryLoader` somewhere)"
    );
  }
  return instance;
}

function defaultGetGroupName(def: Declaration): string {
  const groupTag = ts.getAllJSDocTags(
    def,
    (tag): tag is ts.JSDocTag => tag.tagName.text === "group"
  )[0];

  if (typeof groupTag.comment === "string") {
    return groupTag.comment;
  }
  return "default";
}

function defaultMakeCodeLink(
  repositoryUrl: string,
  gitSha: string
): (pos: NodePosition) => string {
  if (!repositoryUrl || !gitSha) {
    throw new Error(
      `expected either makeCodeLink to be given, or repositoryUrl and gitSha to be given`
    );
  }
  return (pos) => {
    const url = new URL(repositoryUrl);
    url.pathname = posix.join(url.pathname, "blob", gitSha, pos.path);
    return url.toString();
  };
}

function isDeclaration(node: ts.Node): node is Declaration {
  return (
    ts.isClassDeclaration(node) ||
    ts.isFunctionDeclaration(node) ||
    ts.isInterfaceDeclaration(node) ||
    ts.isTypeAliasDeclaration(node)
  );
}

function isExported(node: Declaration): boolean {
  return !!node.modifiers?.find((x) => x.kind === ts.SyntaxKind.ExportKeyword);
}

function isLocal(path: string): boolean {
  return path.startsWith("./") || path.startsWith("../");
}

function getSourceMapUrl(source: string): string | undefined {
  // blagged from https://github.com/evanw/node-source-map-support/blob/7b5b81eb14c9ee6c6537398262bf7dab8580621c/source-map-support.js#L148C1-L177C3
  const regexp =
    /(?:\/\/[@#][\s]*sourceMappingURL=([^\s'"]+)[\s]*$)|(?:\/\*[@#][\s]*sourceMappingURL=([^\s*'"]+)[\s]*(?:\*\/)[\s]*$)/gm;
  // Keep executing the search to find the *last* sourceMappingURL to avoid
  // picking up sourceMappingURLs from comments, strings, etc.
  for (let lastMatch: RegExpExecArray | undefined; ; ) {
    const match = regexp.exec(source);
    if (!match) {
      return lastMatch?.[1];
    }
    lastMatch = match;
  }
}
