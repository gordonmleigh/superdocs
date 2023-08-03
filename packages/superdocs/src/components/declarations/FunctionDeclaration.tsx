import ts from "typescript";
import { NodeProps } from "../ast/NodeProps.js";
import { SignatureDeclaration } from "../ast/SignatureDeclaration.js";

/**
 * Formats a function declaration in code.
 * @group Components
 */
export function FunctionDeclaration({
  collection,
  node,
}: NodeProps<ts.FunctionDeclaration>): JSX.Element {
  return <SignatureDeclaration collection={collection} node={node} />;
}
