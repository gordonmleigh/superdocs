import { DeclarationCollection } from "../../core/DeclarationCollection.js";

/**
 * Properties for components which can format a TypeScript node.
 * @group Components
 */
export interface NodeProps<T> {
  collection: DeclarationCollection;
  node: T;
}

/**
 * Properties for components which can format a TypeScript node.
 * @group Components
 */
export interface NodeOnlyProps<T> {
  node: T;
}
