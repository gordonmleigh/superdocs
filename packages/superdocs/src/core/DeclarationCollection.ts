import chalk from "chalk";
import { dirname, posix, resolve } from "path";
import ts from "typescript";
import { NodeLocationMap } from "../internal/NodeLocationMap";
import { assert } from "../internal/assert";
import { getPackageInfo } from "../internal/getPackageInfo";
import {
  JSDocNode,
  getJSDocTagContentByName,
  getJSDocTagsByName,
  hasJSDocTag,
} from "../internal/jsdoc";
import { loadProgram } from "../internal/loadProgram";
import {
  getName,
  getNodeId,
  isExported,
  isPrivateMember,
  slugifyNode,
} from "../internal/node";
import { NodeLocation } from "./NodeLocation";

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
export interface Declaration<Node extends ts.Node = ts.Node> {
  codeLink?: string;
  collection: DeclarationCollection;
  documentation: readonly JSDocNode[];
  documentationLink: string;
  examples?: readonly ts.JSDocTag[];
  group?: string;
  id: string;
  importInfo?: ImportInfo;
  location: NodeLocation;
  moduleSpecifier: string;
  members?: Declaration<ts.ClassElement | ts.TypeElement>[];
  name?: string;
  node: Node;
  parameters?: Declaration<ts.ParameterDeclaration>[];
  parent?: Declaration;
  remarks?: readonly JSDocNode[];
  returns?: readonly JSDocNode[];
  see?: readonly ts.JSDocTag[];
  throws?: readonly ts.JSDocTag[];
  slug: string;
}

/**
 * Represents the location of a node with an optional link to the source code in
 * a repository.
 * @group Utilities
 */
export interface NodeLocationWithLink extends NodeLocation {
  codeLink?: string;
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
 *
 * @example
 * ```typescript
 * const collection = new DeclarationCollection({
 *   codeLinks: {
 *     sha: getGitSha(),
 *     url: SiteMeta.repo,
 *   },
 *   packagePath: "superdocs",
 *   sourceRoot: getWorkspaceRoot(),
 * });
 * ```
 *
 * @group Core
 */
export class DeclarationCollection implements Iterable<Declaration> {
  private readonly checker: ts.TypeChecker;
  private readonly declarationsByNode = new Map<ts.Node, Declaration>();
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

  public [Symbol.iterator](): Iterator<Declaration, any, undefined> {
    return this.declarationsBySlug.values();
  }

  /**
   * Try to find a declaration for the given name.
   * @param name - The name of the declaration.
   * @param alias - True to try to follow the symbol to the original
   * declaration.
   * @returns The declaration if found, or `undefined`.
   */
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

  public getNodeLocation(node: ts.Node): NodeLocationWithLink {
    const location = this.nodeLocations.getNodeLocation(node);
    return {
      ...location,
      codeLink: this.getCodeLink?.(location),
    };
  }

  private addDeclaration<T extends ts.Node>(
    node: T,
    moduleSpecifier: string,
    parent?: Declaration,
  ): Declaration<T> {
    const location = this.nodeLocations.getNodeLocation(node);
    const slug = slugifyNode(node, parent?.node);
    const name = getName(node);

    const declaration: Declaration<T> = {
      codeLink: this.getCodeLink?.(location),
      collection: this,
      documentation: ts.getJSDocCommentsAndTags(node),
      documentationLink: posix.join(this.documentationRoot, slug),
      examples: getJSDocTagsByName(node, "example"),
      group: getGroupName(node),
      id: getNodeId(node),
      location,
      moduleSpecifier,
      importInfo:
        name !== undefined
          ? {
              kind: "named",
              module: moduleSpecifier,
              name: name,
            }
          : undefined,
      name: name ?? "Unnamed",
      node,
      parent,
      remarks: getJSDocTagContentByName(node, "remarks"),
      returns: getJSDocTagContentByName(node, "returns"),
      see: getJSDocTagsByName(node, "see"),
      throws: getJSDocTagsByName(node, "throws"),
      slug,
    };
    declaration.members = this.getMembers(declaration);
    declaration.parameters = this.getParameters(declaration);

    this.declarationsByNode.set(node, declaration);
    this.declarationsBySlug.set(declaration.slug, declaration);
    return declaration;
  }

  private getMembers(
    parent: Declaration,
  ): Declaration<ts.ClassElement | ts.TypeElement>[] | undefined {
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
    parent: Declaration,
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
      } else if (isExported(statement) && !hasJSDocTag(statement, "internal")) {
        if (ts.isVariableStatement(statement)) {
          for (const def of statement.declarationList.declarations) {
            this.addDeclaration(def, moduleSpecifier);
          }
        } else {
          this.addDeclaration(statement, moduleSpecifier);
        }
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
  const groupTag = getJSDocTagsByName(node, "group")[0];
  if (typeof groupTag?.comment === "string") {
    return groupTag.comment;
  }
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
