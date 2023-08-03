import ts from "typescript";
import { DeclarationNodeOrChildNode } from "../../core/DeclarationCollection.js";
import { ClassElement } from "../ast/ClassElement.js";
import { NodeProps } from "../ast/NodeProps.js";
import { TypeElement } from "../ast/TypeElement.js";
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
    return <ClassDeclaration collection={collection} node={node} />;
  }
  if (ts.isClassElement(node)) {
    return <ClassElement collection={collection} node={node} />;
  }
  if (ts.isFunctionDeclaration(node)) {
    return <FunctionDeclaration collection={collection} node={node} />;
  }
  if (ts.isInterfaceDeclaration(node)) {
    return <InterfaceDeclaration collection={collection} node={node} />;
  }
  if (ts.isTypeAliasDeclaration(node)) {
    return <TypeAliasDeclaration collection={collection} node={node} />;
  }
  if (ts.isTypeElement(node)) {
    return <TypeElement collection={collection} node={node} />;
  }
  return <span className="code-unknown">{(node as any).getText()}</span>;
}
