import ts from "typescript";
import { DeclarationNodeOrChildNode } from "../core/DeclarationCollection.js";
import { ClassDeclaration } from "./ClassDeclaration.js";
import { FunctionDeclaration } from "./FunctionDeclaration.js";
import { InterfaceDeclaration } from "./InterfaceDeclaration.js";
import { NodeProps } from "./NodeProps.js";
import { TypeAliasDeclaration } from "./TypeAliasDeclaration.js";

/**
 * Properties for the {@link FormatDeclaration} component.
 * @group Components
 */
export type FormatDeclarationProps = NodeProps<DeclarationNodeOrChildNode>;

/**
 * Properties for the {@link FormatDeclaration} component.
 * @group Components
 */
export function FormatDeclaration({
  collection,
  node,
}: FormatDeclarationProps): JSX.Element {
  if (ts.isClassDeclaration(node)) {
    return (
      <code className="declaration-code">
        <ClassDeclaration collection={collection} node={node} />
      </code>
    );
  }
  if (ts.isFunctionDeclaration(node)) {
    return (
      <code className="declaration-code">
        <FunctionDeclaration collection={collection} node={node} />
      </code>
    );
  }
  if (ts.isInterfaceDeclaration(node)) {
    return (
      <code className="declaration-code">
        <InterfaceDeclaration collection={collection} node={node} />
      </code>
    );
  }
  if (ts.isTypeAliasDeclaration(node)) {
    return (
      <code className="declaration-code">
        <TypeAliasDeclaration collection={collection} node={node} />
      </code>
    );
  }
  return (
    <code className="declaration-code code-unknown">
      {(node as any).getText()}
    </code>
  );
}
