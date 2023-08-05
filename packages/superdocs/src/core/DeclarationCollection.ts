import chalk from "chalk";
import { dirname, posix, resolve } from "path";
import ts from "typescript";
import { NodeLocationMap } from "../internal/NodeLocationMap";
import { assert } from "../internal/assert";
import { getPackageInfo } from "../internal/getPackageInfo";
import { getParameterIndex } from "../internal/getParameterIndex";
import { getSyntaxKindName } from "../internal/getSyntaxKindName";
import { hash } from "../internal/hash";
import { loadProgram } from "../internal/loadProgram";
import { slugify } from "../internal/slugify";
import { NodeLocation } from "./NodeLocation";

/**
 * Union of supported declaration AST node types.
 * @group Utilities
 */
export type DeclarationNode =
  | ts.ClassDeclaration
  | ts.FunctionDeclaration
  | ts.InterfaceDeclaration
  | ts.TypeAliasDeclaration;

/**
 * Union of supported declaration AST node types which can be a child of
 * declaration node.
 * @group Utilities
 */
export type DeclarationMemberNode = ts.ClassElement | ts.TypeElement;

/**
 * Union of supported AST node types which are children of declarations.
 * @group Utilities
 */
export type DeclarationChildNode =
  | DeclarationMemberNode
  | ts.ParameterDeclaration;

/**
 * Union of supported declaration AST node types and their supported children.
 * @group Utilities
 */
export type DeclarationNodeOrChildNode = DeclarationNode | DeclarationChildNode;

/**
 * Represents a group of {@link Declaration} instances.
 * @group Core
 */
export interface DeclarationGroup {
  declarations: Declaration[];
  name: string;
  slug: string;
}

/**
 * Represents a declaration in a code file.
 * @group Core
 */
export interface Declaration<
  Node extends DeclarationNodeOrChildNode = DeclarationNodeOrChildNode,
> {
  codeLink?: string;
  collection: DeclarationCollection;
  documentation: readonly (ts.JSDoc | ts.JSDocTag)[];
  documentationLink: string;
  group?: string;
  id: string;
  location: NodeLocation;
  members?: Declaration<DeclarationMemberNode>[];
  moduleSpecifier: string;
  name?: string;
  node: Node;
  parameters?: Declaration<ts.ParameterDeclaration>[];
  parent?: Declaration;
  slug: string;
}

/**
 * Represents a function which can return a code link for a given source code
 * location.
 * @group Utilities
 */
export type CodeLinkFactory = (pos: NodeLocation) => string;

/**
 * Represents information about a source code repository.
 * @group Utilities
 */
export interface RepositoryInfo {
  sha: string;
  url: string;
}

/**
 * Options for the {@link DeclarationCollection} class.
 * @group Core
 */
export interface DeclarationCollectionOptions {
  codeLinks?: RepositoryInfo | CodeLinkFactory;
  documentationRoot?: string;
  packagePath: string;
  sourceRoot?: string;
}

/**
 * Information about an imported symbol.
 * @group Core
 */
export interface ImportInfo {
  kind: "default" | "named" | "star";
  localName?: string;
  module: string;
  name: string;
}

const resolveExtensions = [".ts", ".d.ts"];

/**
 * A class which can parse package type declarations and generate metadata about
 * the declarations.
 * @group Core
 */
export class DeclarationCollection implements Iterable<Declaration> {
  private readonly checker: ts.TypeChecker;
  private readonly declarationsByNode = new Map<
    DeclarationNodeOrChildNode,
    Declaration
  >();
  private readonly declarationsBySlug = new Map<string, Declaration>();
  private readonly documentationRoot: string;
  private readonly getCodeLink: CodeLinkFactory | undefined;
  private readonly nodeLocations: NodeLocationMap;
  private readonly program: ts.Program;
  private readonly sourceRoot: string;

  public get declarations(): Declaration[] {
    return [...this.declarationsByNode.values()];
  }

  constructor(opts: DeclarationCollectionOptions) {
    this.documentationRoot = opts.documentationRoot ?? "/code/declarations";
    this.getCodeLink = normaliseCodeLinkFactory(opts.codeLinks);
    this.sourceRoot = opts.sourceRoot ?? resolve(".");
    this.nodeLocations = new NodeLocationMap({ sourceRoot: this.sourceRoot });

    const packageInfo = getPackageInfo(opts.packagePath);
    this.program = loadProgram(Object.values(packageInfo.entryPoints));
    this.checker = this.program.getTypeChecker();

    for (const [key, path] of Object.entries(packageInfo.entryPoints)) {
      const source = this.program.getSourceFile(path);
      assert(source, `expected source file '${path}'`);

      this.loadSourceFile(
        source,
        posix.normalize(posix.join(packageInfo.name, key)),
      );
    }
  }

  public [Symbol.iterator](): Iterator<
    Declaration<DeclarationNodeOrChildNode>,
    any,
    undefined
  > {
    return this.declarationsBySlug.values();
  }

  public getDeclaration(
    name: ts.EntityName | ts.JSDocMemberName,
    alias = false,
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
    return this.declarationsByNode.get(def as any);
  }

  public getImportInfo(
    name: ts.EntityName | ts.JSDocMemberName,
  ): ImportInfo | undefined {
    const symbol = this.checker.getSymbolAtLocation(name);
    if (!symbol) {
      return;
    }
    const def = symbol.declarations?.[0];
    if (!def) {
      return;
    }

    const moduleSpecifier = ts.findAncestor(def, ts.isImportDeclaration)
      ?.moduleSpecifier;
    if (!moduleSpecifier) {
      return;
    }
    assert(ts.isStringLiteral(moduleSpecifier));

    if (ts.isImportSpecifier(def)) {
      return {
        kind: "named",
        localName: def.propertyName ? def.name.text : undefined,
        module: moduleSpecifier.text,
        name: def.propertyName?.text ?? def.name.text,
      };
    }
    if (ts.isImportClause(def) && def.name) {
      return {
        kind: "default",
        module: moduleSpecifier.text,
        name: def.name.text,
      };
    }
    if (ts.isNamespaceImport(def)) {
      return {
        kind: "star",
        module: moduleSpecifier.text,
        name: def.name.text,
      };
    }
  }

  public getDeclarationBySlug(slug: string): Declaration | undefined {
    return this.declarationsBySlug.get(slug);
  }

  public getNodeLocation(node: ts.Node): NodeLocation {
    return this.nodeLocations.getNodeLocation(node);
  }

  private addDeclaration<T extends DeclarationNodeOrChildNode>(
    node: T,
    moduleSpecifier: string,
    parent?: Declaration<DeclarationNodeOrChildNode>,
  ): Declaration<T> {
    const location = this.nodeLocations.getNodeLocation(node);
    const slug = slugifyNode(node, parent?.node);

    const declaration: Declaration<T> = {
      codeLink: this.getCodeLink?.(location),
      collection: this,
      documentation: ts.getJSDocCommentsAndTags(node),
      documentationLink: posix.join(this.documentationRoot, slug),
      group: getGroupName(node),
      id: getNodeId(node),
      location,
      moduleSpecifier,
      name: getName(node) ?? "Unnamed",
      node,
      parent,
      slug,
    };
    declaration.members = this.getMembers(declaration);
    declaration.parameters = this.getParameters(declaration);

    this.declarationsByNode.set(node, declaration);
    this.declarationsBySlug.set(declaration.slug, declaration);
    return declaration;
  }

  private getMembers(
    parent: Declaration<DeclarationNodeOrChildNode>,
  ): Declaration<DeclarationMemberNode>[] | undefined {
    const node = parent.node;

    if (ts.isClassDeclaration(node)) {
      const members = node.members;
      const filtered = members.filter((member) => !isPrivateMember(member));
      return filtered.map((member) =>
        this.addDeclaration(member, parent.moduleSpecifier, parent),
      );
    }
    if (ts.isInterfaceDeclaration(node)) {
      return node.members?.map((member) =>
        this.addDeclaration(member, parent.moduleSpecifier, parent),
      );
    }
    if (ts.isTypeAliasDeclaration(node) && ts.isTypeLiteralNode(node.type)) {
      return node.type.members.map((member) =>
        this.addDeclaration(member, parent.moduleSpecifier, parent),
      );
    }
  }

  private getParameters(
    parent: Declaration<DeclarationNodeOrChildNode>,
  ): Declaration<ts.ParameterDeclaration>[] | undefined {
    const node = parent.node;

    if (ts.isFunctionLike(node)) {
      return node.parameters.map((param) =>
        this.addDeclaration(param, parent.moduleSpecifier, parent),
      );
    }
    if (ts.isTypeAliasDeclaration(node) && ts.isFunctionLike(node.type)) {
      return node.type.parameters.map((param) =>
        this.addDeclaration(param, parent.moduleSpecifier, parent),
      );
    }
  }

  private loadExport(
    statement: ts.ExportDeclaration,
    moduleSpecifier: string,
  ): void {
    if (statement.moduleSpecifier) {
      const source = this.resolveSourceFile(
        statement.moduleSpecifier,
        statement.getSourceFile().fileName,
      );
      if (source) {
        this.loadSourceFile(source, moduleSpecifier);
      }
    }
  }

  private loadSourceFile(source: ts.SourceFile, moduleSpecifier: string): void {
    for (const statement of source.statements) {
      if (ts.isExportDeclaration(statement)) {
        this.loadExport(statement, moduleSpecifier);
      } else if (isDeclaration(statement) && isExported(statement)) {
        this.addDeclaration(statement, moduleSpecifier);
      }
    }
  }

  private resolveSourceFile(
    moduleSpecifier: string | ts.Expression,
    from = ".",
  ): ts.SourceFile | undefined {
    if (typeof moduleSpecifier !== "string") {
      if (!ts.isStringLiteral(moduleSpecifier)) {
        throw new Error(`expected a string `);
      }
      return this.resolveSourceFile(moduleSpecifier.text, from);
    }
    if (!isLocal(moduleSpecifier)) {
      return;
    }

    if (moduleSpecifier.endsWith(".js")) {
      const source = this.resolveSourceFile(moduleSpecifier.slice(0, -3), from);
      if (source) {
        return source;
      }
    }

    const source = this.program.getSourceFile(
      resolve(dirname(from), moduleSpecifier),
    );
    if (source) {
      return source;
    }
    for (const ext of resolveExtensions) {
      const source = this.program.getSourceFile(
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

export function sortDeclarationsByName(a: Declaration, b: Declaration): number {
  if (a.name) {
    if (b.name) {
      return a.name.localeCompare(b.name);
    }
    return -1;
  } else if (b.name) {
    return 1;
  } else {
    return 0;
  }
}

function getGroupName(node: ts.Node): string | undefined {
  const groupTag = ts.getAllJSDocTags(
    node,
    (tag): tag is ts.JSDocTag => tag.tagName.text === "group",
  )[0];

  if (typeof groupTag?.comment === "string") {
    return groupTag.comment;
  }
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

function isPrivateMember(node: ts.TypeElement | ts.ClassElement): boolean {
  if (ts.canHaveModifiers(node) && node.modifiers) {
    if (node.modifiers.some((x) => x.kind === ts.SyntaxKind.PrivateKeyword)) {
      return true;
    }
  }
  if ("name" in node && node.name) {
    if (ts.isPrivateIdentifier(node.name)) {
      return true;
    }
  }
  return false;
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

function getName(node: DeclarationNodeOrChildNode): string | undefined {
  if ("name" in node && node.name) {
    if (ts.isIdentifier(node.name)) {
      return node.name.text;
    }
    if (ts.isStringLiteral(node.name)) {
      return `"${node.name.text}"`;
    }
    if (ts.isNumericLiteral(node.name)) {
      return `${node.name.text}`;
    }
    if (ts.isComputedPropertyName(node.name)) {
      return `${node.name.getText()}`;
    }
  }
  if (ts.isParameter(node)) {
    return `arg${getParameterIndex(node)}`;
  }
  if (
    ts.isConstructSignatureDeclaration(node) ||
    ts.isConstructorDeclaration(node)
  ) {
    return "constructor";
  }
  if (ts.isIndexSignatureDeclaration(node)) {
    return `Index [${node.parameters.map((x) => x.getText()).join(", ")}]`;
  }
}

function getNodeId(node: ts.Node): string {
  const id = hash([node.getSourceFile().fileName, `${node.pos}`])?.slice(0, 5);
  return `node-${id}`;
}

function slugifyNode(
  node: DeclarationNodeOrChildNode,
  parent?: DeclarationNodeOrChildNode,
): string {
  if (parent) {
    return slugifyNode(parent) + "-" + slugifyNode(node);
  }
  const name = getName(node) ?? getNodeId(node);
  return getSyntaxKindName(node.kind) + "-" + slugify(name);
}
