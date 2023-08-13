import { DeclarationCollection } from "../core/DeclarationCollection.js";

/**
 * Properties for components which can format a TypeScript AST node.
 * @group Components
 */
export interface NodeProps<T> {
  /**
   * The {@link DeclarationCollection} instance to pass down. This needs to be
   * passed through property drilling because Next.js doesn't (yet) support a
   * reliable equivalent for context for server components.
   */
  collection: DeclarationCollection;
  /**
   * The node that the component should render.
   */
  node: T;
}

/**
 * Properties for components which can format a TypeScript AST node.
 * @group Components
 */
export interface NodeOnlyProps<T> {
  /**
   * The node that the component should render.
   */
  node: T;
}
