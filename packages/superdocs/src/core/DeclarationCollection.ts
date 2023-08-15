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
 * Represents a declaration in a code file.
 * @group Core
 */
export interface Declaration<Node extends ts.Node = ts.Node> {
  /**
   * A link to the node location in the source code file in the repository, if
   * available.
   */
  codeLink?: string;
  /**
   * The collection instance that created this instance.
   */
  collection: DeclarationCollection;
  /**
   * The JSDoc summary associated with this declaration.
   */
  documentation: readonly JSDocNode[];
  /**
   * A link to the documentation for this declaration.
   */
  documentationLink: string;
  /**
   * A list of examples given in the JSDoc for this node, if any.
   */
  examples?: readonly ts.JSDocTag[];
  /**
   * The value of the `@group` tag, if present.
   */
  group?: string;
  /**
   * An unique identifier generated for this declaration.
   */
  id: string;
  /**
   * A description of how this symbol can be imported.
   */
  importInfo?: ImportInfo;
  /**
   * The location of this node in the source file, if source maps are present;
   * otherwise, the location of this node in the declaration file.
   */
  location: NodeLocation;
  /**
   * The module that this declaration is defined in.
   */
  moduleSpecifier: string;
  /**
   * A list of members that this declaration defines, where relevant.
   */
  members?: Declaration<ts.ClassElement | ts.EnumMember | ts.TypeElement>[];
  /**
   * The name of this declaration.
   */
  name?: string;
  /**
   * The AST node associated with this declaration.
   */
  node: Node;
  /**
   * A list of parameters that this declaration defines, where relevant.
   */
  parameters?: Declaration<ts.ParameterDeclaration>[];
  /**
   * The parent declaration for this declaration, where relevant. E.g. for
   * parameters, this will point to the function declaration.
   */
  parent?: Declaration;
  /**
   * Extended JSDoc documentation defined using the `@remarks` tag, if
   * available.
   */
  remarks?: readonly JSDocNode[];
  /**
   * Details about what is returned from this declaration, if it is a
   * function-like node and the `@returns` tag has been provided.
   */
  returns?: readonly JSDocNode[];
  /**
   * A list of links provided using the `@see` tag, if any.
   */
  see?: readonly ts.JSDocTag[];
  /**
   * Documentation about values thrown by this declaration, if any, as
   * documented using the `@throws` tag.
   */
  throws?: readonly ts.JSDocTag[];
  /**
   * The URL slug for this declaration.
   */
  slug: string;
}

/**
 * Represents the location of a node with an optional link to the source code in
 * a repository.
 * @group Utilities
 */
export interface NodeLocationWithLink extends NodeLocation {
  /**
   * A link to the node location in the source code file in the repository, if
   * available.
   */
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
  /**
   * The SHA hash of the current commit, from which this documentation has been
   * generated.
   */
  sha: string;
  /**
   * The URL to the repository.
   */
  url: string;
}

/**
 * Options for the {@link DeclarationCollection} class.
 * @group Core
 */
export interface DeclarationCollectionOptions {
  /**
   * A function to generate links to the code in the repository, or information
   * about the repository to use the default logic to create links.
   */
  codeLinks?: RepositoryInfo | CodeLinkFactory;
  /**
   * The root path in the documentation to use as the base for documentation
   * links. Defaults to `"/code/declarations"`.
   */
  documentationRoot?: string;
  /**
   * The path to find the package.json file. You can also pass the name of a
   * package to automatically resolve the package.
   */
  packagePath: string;
  /**
   * The root path of the source code, used to generate relative paths to source
   * code files
   */
  sourceRoot?: string;
}

/**
 * Information about an imported symbol.
 * @group Core
 */
export interface ImportInfo {
  /**
   * The kind of import:
   * - `default`: `import X from 'module';`
   * - `named`: `import { X } from 'module';`
   * - `star`: `import * as X from 'module';`
   */
  kind: "default" | "named" | "star";
  /**
   * The local name for named imports (e.g. `import { name as localName } from
   * 'module';`).
   */
  localName?: string;
  /**
   * The module specifier for the import.
   */
  module: string;
  /**
   * The imported name.
   */
  name: string;
}

const resolveExtensions = [".ts", ".d.ts"];

/**
 * A class which can parse package type declarations and generate metadata about
 * the declarations.
 *
 * @remarks
 * The class will automatically resolve all of the entry-points available in the
 * `exports` section of `package.json`, or choose either `module` or `main` as a
 * single entry-point.
 *
 * For each of the entry-points, all declarations will be read and added as
 * {@link Declaration} instances to the collection. If a re-export node (e.g.
 * `export * from './module'`) is encountered, the path will be followed and the
 * all of the Declarations from the referenced source file will be added,
 * recursively. The code isn't currently smart enough to limit this only to
 * named symbols specified in the export clause, or to track renames where the
 * symbols are given a different alias (e.g. `export { name as aliasName } from
 * './module'`).
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

  /**
   * Get a copy of the list of {@link Declaration} elements in this collection.
   */
  public get declarations(): Declaration[] {
    return [...this.declarationsByNode.values()];
  }

  /**
   * Create a new instance with the given options.
   */
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

  /**
   * Implementation of the {@link Iterator} protocol, to return
   * {@link Declaration} instances when this instance is iterated.
   * @returns An iterator which returns {@link Declaration} instances.
   */
  public [Symbol.iterator](): Iterator<Declaration, any, undefined> {
    return this.declarationsBySlug.values();
  }

  /**
   * Try to find a declaration for the given name.
   * @param name The name of the declaration.
   * @param alias True to try to follow the symbol to the original
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

  /**
   * Get the {@link ImportInfo} for the given name, if available.
   */
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

  /**
   * Find a declaration with the given URL slug, if it exists.
   */
  public getDeclarationBySlug(slug: string): Declaration | undefined {
    return this.declarationsBySlug.get(slug);
  }

  /**
   * Get the source location of the given AST node, along with the link to the
   * source code file in the source repository, if possible.
   */
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
  ):
    | Declaration<ts.ClassElement | ts.EnumMember | ts.TypeElement>[]
    | undefined {
    const node = parent.node;

    if (ts.isClassDeclaration(node)) {
      const members = node.members;
      const filtered = members.filter((member) => !isPrivateMember(member));
      return filtered.map((member) =>
        this.addDeclaration(member, parent.moduleSpecifier, parent),
      );
    }
    if (ts.isInterfaceDeclaration(node) || ts.isEnumDeclaration(node)) {
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

/**
 * For use as a sort function with {@link Array.prototype.sort}, in order to
 * sort {@link Declaration} instances by name.
 * @group Utilities
 */
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
