import chalk from "chalk";
import { dirname, posix, resolve } from "path";
import ts from "typescript";
import { NodeLocationMap } from "../internal/NodeLocationMap";
import { assert } from "../internal/assert";
import { getPackageInfo } from "../internal/getPackageInfo";
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
export type DeclarationMemberNode = ts.TypeElement;

/**
 * Union of supported AST node types which are children of declarations.
 * @group Utilities
 */
export type DeclarationChildNode = DeclarationMemberNode;

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
  Node extends DeclarationNodeOrChildNode = DeclarationNode,
> {
  codeLink?: string;
  collection: DeclarationCollection;
  documentation: readonly (ts.JSDoc | ts.JSDocTag)[];
  documentationLink: string;
  location: NodeLocation;
  members?: Declaration<DeclarationMemberNode>[];
  name: string;
  node: Node;
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
  getGroupName?: (def: DeclarationNode) => string;
  packagePath: string;
  sourceRoot?: string;
}

const resolveExtensions = [".ts", ".d.ts"];

/**
 * A class which can parse package type declarations and generate metadata about
 * the declarations.
 * @group Core
 */
export class DeclarationCollection {
  private readonly checker: ts.TypeChecker;
  private readonly declarations = new Map<DeclarationNode, Declaration>();
  private readonly documentationRoot: string;
  private readonly getCodeLink: CodeLinkFactory | undefined;
  private readonly getGroupName: (def: DeclarationNode) => string;
  private readonly groupsMap = new Map<string, DeclarationGroup>();
  private readonly nodeLocations: NodeLocationMap;
  private readonly program: ts.Program;
  private readonly sourceRoot: string;

  public get groups(): DeclarationGroup[] {
    return [...this.groupsMap.values()];
  }

  constructor(opts: DeclarationCollectionOptions) {
    this.documentationRoot = opts.documentationRoot ?? "/code";
    this.getCodeLink = normaliseCodeLinkFactory(opts.codeLinks);
    this.getGroupName = opts.getGroupName ?? defaultGetGroupName;
    this.sourceRoot = opts.sourceRoot ?? resolve(".");
    this.nodeLocations = new NodeLocationMap({ sourceRoot: this.sourceRoot });

    const packageInfo = getPackageInfo(opts.packagePath);
    const entryPoints = Object.values(packageInfo.entryPoints);
    this.program = loadProgram(entryPoints);
    this.checker = this.program.getTypeChecker();

    for (const entryPoint of entryPoints) {
      const source = this.program.getSourceFile(entryPoint);
      assert(source, `expected source file '${entryPoint}'`);
      this.loadSourceFile(source);
    }
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
    return this.declarations.get(def as any);
  }

  private addDeclaration(node: DeclarationNode): void {
    const groupName = this.getGroupName(node);
    let group = this.groupsMap.get(groupName);

    if (!group) {
      group = {
        declarations: [],
        name: groupName,
        slug: slugify(groupName),
      };
      this.groupsMap.set(groupName, group);
    }

    const declaration = this.makeDeclaration(node, group);
    group.declarations.push(declaration);
    this.declarations.set(node, declaration);
  }

  private getMembers(
    node: DeclarationNodeOrChildNode,
    group: DeclarationGroup,
  ): Declaration<DeclarationMemberNode>[] | undefined {
    if (ts.isInterfaceDeclaration(node)) {
      return node.members?.map((member) => this.makeDeclaration(member, group));
    }
    if (ts.isTypeAliasDeclaration(node) && ts.isTypeLiteralNode(node.type)) {
      return node.type.members.map((member) =>
        this.makeDeclaration(member, group),
      );
    }
  }

  private loadExport(statement: ts.ExportDeclaration): void {
    if (statement.moduleSpecifier) {
      const source = this.resolveSourceFile(
        statement.moduleSpecifier,
        statement.getSourceFile().fileName,
      );
      if (source) {
        this.loadSourceFile(source);
      }
    }
  }

  private loadSourceFile(source: ts.SourceFile): void {
    for (const statement of source.statements) {
      if (ts.isExportDeclaration(statement)) {
        this.loadExport(statement);
      } else if (isDeclaration(statement) && isExported(statement)) {
        this.addDeclaration(statement);
      }
    }
  }

  private makeDeclaration<T extends DeclarationNodeOrChildNode>(
    node: T,
    group: DeclarationGroup,
  ): Declaration<T> {
    const location = this.nodeLocations.getNodeLocation(node);
    const slug = slugifyNode(node);

    return {
      codeLink: this.getCodeLink?.(location),
      collection: this,
      documentation: ts.getJSDocCommentsAndTags(node),
      documentationLink: posix.join(
        this.documentationRoot,
        group.slug + "#" + slug,
      ),
      location,
      members: this.getMembers(node, group),
      name: getName(node) ?? getNodeId(node),
      node,
      slug,
    };
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

function getName(node: DeclarationNodeOrChildNode): string | undefined {
  if ("name" in node && node.name) {
    if (ts.isIdentifier(node.name)) {
      return node.name.text;
    }
    if (ts.isStringLiteral(node.name)) {
      return `"${node.name.text}"`;
    }
    if (ts.isNumericLiteral(node.name)) {
      return `[${node.name.text}]`;
    }
    if (ts.isComputedPropertyName(node.name)) {
      return `[${node.name.getText()}]`;
    }
  }
  if (ts.isIndexSignatureDeclaration(node)) {
    return `Index [${node.parameters.map((x) => x.getText()).join(", ")}]`;
  }
}

function getNodeId(node: ts.Node): string {
  const id = hash([node.getSourceFile().fileName, `${node.pos}`])?.slice(0, 5);
  return `node-${id}`;
}

function slugifyNode(node: DeclarationNodeOrChildNode): string {
  const name = getName(node) ?? getNodeId(node);
  return getSyntaxKindName(node.kind) + "-" + slugify(name);
}
