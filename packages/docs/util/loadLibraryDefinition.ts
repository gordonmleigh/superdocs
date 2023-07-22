import { basename, dirname, relative, resolve } from "path";
import ts from "typescript";
import { assert } from "./assert";
import { getWorkspaceRoot } from "./getWorkspaceRoot";
import { loadProgram } from "./loadProgram";

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

let cached: LibraryLoader | undefined;

export async function loadLibraryDefinition(): Promise<LibraryLoader> {
  if (cached) {
    return cached;
  }
  return (cached = new LibraryLoader(resolve("../test-pkg/lib/index.d.ts")));
}

export class LibraryLoader {
  private readonly checker: ts.TypeChecker;
  private readonly declarations = new Set<Declaration>();
  private readonly groups: Record<string, Declaration[]> = {};
  private readonly program: ts.Program;
  private readonly resolveExtensions = [".ts", ".js", ".d.ts"];
  private readonly sourceMapCache = new Map<ts.SourceFile, string>();

  constructor(entrypoint: string) {
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

  public getDocumentation(
    declaration: Declaration
  ): readonly (ts.JSDoc | ts.JSDocTag)[] {
    return ts.getJSDocCommentsAndTags(declaration);
  }

  public getGroupName(def: Declaration): string {
    return basename(dirname(def.getSourceFile().fileName));
  }

  public getPosition(node: ts.Node): NodePosition {
    const pos = ts.getLineAndCharacterOfPosition(
      node.getSourceFile(),
      node.pos
    );
    const root = getWorkspaceRoot();

    return {
      char: pos.character + 1,
      line: pos.line + 1,
      path: relative(root, node.getSourceFile().fileName),
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
