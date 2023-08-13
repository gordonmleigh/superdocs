import ts from "typescript";
import { ClassDeclaration } from "./ClassDeclaration.js";
import { ClassElement } from "./ClassElement.js";
import { FunctionDeclaration } from "./FunctionDeclaration.js";
import { InterfaceDeclaration } from "./InterfaceDeclaration.js";
import { NodeProps } from "./NodeProps.js";
import { ParameterDeclaration } from "./ParameterDeclaration.js";
import { TypeAliasDeclaration } from "./TypeAliasDeclaration.js";
import { TypeElement } from "./TypeElement.js";
import { UnknownCode } from "./UnknownCode.js";
import { VariableDeclaration } from "./VariableDeclaration.js";

/**
 * Properties for the {@link FormatDeclaration} component.
 * @group Components
 */
export type FormatDeclarationProps = NodeProps<ts.Node>;

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
  if (ts.isParameter(node)) {
    return <ParameterDeclaration collection={collection} node={node} />;
  }
  if (ts.isTypeAliasDeclaration(node)) {
    return <TypeAliasDeclaration collection={collection} node={node} />;
  }
  if (ts.isTypeElement(node)) {
    return <TypeElement collection={collection} node={node} />;
  }
  if (ts.isVariableDeclaration(node)) {
    return <VariableDeclaration collection={collection} node={node} />;
  }
  return <UnknownCode collection={collection} node={node} />;
}
