import chalk from "chalk";
import { dirname, posix, resolve } from "path";
import ts from "typescript";
import { assert } from "../internal/assert";
import { makeGetNodeLocation } from "../internal/getNodeLocation";
import { getPackageInfo } from "../internal/getPackageInfo";
import { getSyntaxKindName } from "../internal/getSyntaxKindName";
import { loadProgram } from "../internal/loadProgram";
import { slugify } from "../internal/slugify";
import { CodeError } from "./CodeError";
import { NodeLocation } from "./NodeLocation";

export type DeclarationNode =
  | ts.ClassDeclaration
  | ts.FunctionDeclaration
  | ts.InterfaceDeclaration
  | ts.TypeAliasDeclaration;

export interface DeclarationGroup {
  declarations: Declaration[];
  name: string;
  slug: string;
}

export interface Declaration<Node extends DeclarationNode = DeclarationNode> {
  codeLink?: string;
  collection: DeclarationCollection;
  documentation: readonly (ts.JSDoc | ts.JSDocTag)[];
  documentationLink: string;
  group: DeclarationGroup;
  location: NodeLocation;
  name: string;
  node: Node;
  slug: string;
}

export type CodeLinkFactory = (pos: NodeLocation) => string;

export interface RepositoryInfo {
  sha: string;
  url: string;
}

export interface DeclarationCollectionOptions {
  codeLinks?: RepositoryInfo | CodeLinkFactory;
  documentationRoot?: string;
  getGroupName?: (def: DeclarationNode) => string;
  packagePath: string;
  sourceRoot?: string;
}

export interface DeclarationCollection {
  getDeclaration(
    name: ts.EntityName | ts.JSDocMemberName,
  ): Declaration | undefined;

  groups: DeclarationGroup[];
}

const resolveExtensions = [".ts", ".d.ts"];

export function makeDeclarationCollection({
  documentationRoot = "/code",
  codeLinks,
  getGroupName = defaultGetGroupName,
  packagePath,
  sourceRoot = resolve("."),
}: DeclarationCollectionOptions): DeclarationCollection {
  const packageInfo = getPackageInfo(packagePath);
  const entryPoints = Object.values(packageInfo.entryPoints);
  const declarations = new Map<DeclarationNode, Declaration>();
  const getCodeLink = normaliseCodeLinkFactory(codeLinks);
  const groups = new Map<string, DeclarationGroup>();
  const program = loadProgram(entryPoints);
  const checker = program.getTypeChecker();

  const self = {
    getDeclaration,

    get groups(): DeclarationGroup[] {
      return [...groups.values()];
    },
  };

  init();

  debugger;
  return self;

  function init(): void {
    for (const entryPoint of entryPoints) {
      const source = program.getSourceFile(entryPoint);
      assert(source, `expected source file '${entryPoint}'`);
      loadSourceFile(source);
    }
  }

  function addDeclaration(node: DeclarationNode, location: NodeLocation): void {
    const groupName = getGroupName(node);

    let group = groups.get(groupName);
    if (!group) {
      group = {
        declarations: [],
        name: groupName,
        slug: slugify(groupName),
      };
      groups.set(groupName, group);
    }

    if (!node.name?.text) {
      throw new CodeError(`expected a named declaration`, location);
    }

    const slug = slugify(getSyntaxKindName(node.kind) + " " + node.name?.text);

    const declaration: Declaration = {
      codeLink: getCodeLink?.(location),
      collection: self,
      documentation: ts.getJSDocCommentsAndTags(node),
      documentationLink: posix.join(documentationRoot, group.slug + "#" + slug),
      group,
      location,
      name: node.name.text,
      node,
      slug,
    };
    group.declarations.push(declaration);
    declarations.set(node, declaration);
  }

  function getDeclaration(
    name: ts.EntityName | ts.JSDocMemberName,
    alias = false,
  ): Declaration | undefined {
    let symbol = checker.getSymbolAtLocation(name);
    if (!symbol) {
      return;
    }
    if (alias) {
      symbol = checker.getAliasedSymbol(symbol);
    }
    const def = symbol.declarations?.[0];
    if (!def) {
      return;
    }
    if (ts.isImportSpecifier(def)) {
      return getDeclaration(def.name, true);
    }
    return declarations.get(def as any);
  }

  function loadExport(statement: ts.ExportDeclaration): void {
    if (statement.moduleSpecifier) {
      const source = resolveSourceFile(
        statement.moduleSpecifier,
        statement.getSourceFile().fileName,
      );
      if (source) {
        loadSourceFile(source);
      }
    }
  }

  function loadSourceFile(source: ts.SourceFile): void {
    const getNodeLocation = makeGetNodeLocation(source, sourceRoot);

    for (const statement of source.statements) {
      if (ts.isExportDeclaration(statement)) {
        loadExport(statement);
      } else if (isDeclaration(statement) && isExported(statement)) {
        addDeclaration(statement, getNodeLocation(statement));
      }
    }
  }

  function resolveSourceFile(
    moduleSpecifier: string | ts.Expression,
    from = ".",
  ): ts.SourceFile | undefined {
    if (typeof moduleSpecifier !== "string") {
      if (!ts.isStringLiteral(moduleSpecifier)) {
        throw new Error(`expected a string `);
      }
      return resolveSourceFile(moduleSpecifier.text, from);
    }
    if (!isLocal(moduleSpecifier)) {
      return;
    }

    if (moduleSpecifier.endsWith(".js")) {
      const source = resolveSourceFile(moduleSpecifier.slice(0, -3), from);
      if (source) {
        return source;
      }
    }

    const source = program.getSourceFile(
      resolve(dirname(from), moduleSpecifier),
    );
    if (source) {
      return source;
    }
    for (const ext of resolveExtensions) {
      const source = program.getSourceFile(
        resolve(dirname(from), moduleSpecifier + ext),
      );
      if (source) {
        return source;
      }
    }
    console.warn(
      `- ${chalk.yellow("warn")} failed to resolve ${moduleSpecifier}`,
    );
  }
}

function defaultGetGroupName(node: DeclarationNode): string {
  const groupTag = ts.getAllJSDocTags(
    node,
    (tag): tag is ts.JSDocTag => tag.tagName.text === "group",
  )[0];

  if (typeof groupTag?.comment === "string") {
    return groupTag.comment;
  }
  return "default";
}

function isDeclaration(node: ts.Node): node is DeclarationNode {
  return (
    ts.isClassDeclaration(node) ||
    ts.isFunctionDeclaration(node) ||
    ts.isInterfaceDeclaration(node) ||
    ts.isTypeAliasDeclaration(node)
  );
}

function isExported(node: DeclarationNode): boolean {
  return !!node.modifiers?.find((x) => x.kind === ts.SyntaxKind.ExportKeyword);
}

function isLocal(path: string): boolean {
  return path.startsWith("./") || path.startsWith("../");
}

function normaliseCodeLinkFactory(
  codeLinks: RepositoryInfo | CodeLinkFactory | undefined,
): CodeLinkFactory | undefined {
  if (!codeLinks || typeof codeLinks === "function") {
    return codeLinks;
  }
  return (location) => {
    const url = new URL(codeLinks.url);
    url.pathname = posix.join(
      url.pathname,
      "blob",
      codeLinks.sha,
      location.path,
    );
    return `${url.toString()}#L${location.line}`;
  };
}
