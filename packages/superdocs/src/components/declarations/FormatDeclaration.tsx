import ts from "typescript";
import { DeclarationNodeOrChildNode } from "../../core/DeclarationCollection.js";
import { IndexSignatureDeclaration } from "../ast/IndexSignatureDeclaration.js";
import { NodeProps } from "../ast/NodeProps.js";
import { PropertySignature } from "../ast/PropertySignature.js";
import { ClassDeclaration } from "./ClassDeclaration.js";
import { FunctionDeclaration } from "./FunctionDeclaration.js";
import { InterfaceDeclaration } from "./InterfaceDeclaration.js";
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
  if (ts.isIndexSignatureDeclaration(node)) {
    return (
      <code className="declaration-code">
        <IndexSignatureDeclaration collection={collection} node={node} />
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
  if (ts.isPropertySignature(node)) {
    return (
      <code className="declaration-code">
        <PropertySignature collection={collection} node={node} />
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
