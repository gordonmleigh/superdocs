import ts from "typescript";
import { NodeProps } from "./NodeProps.js";
import { SignatureDeclaration } from "./SignatureDeclaration.js";

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
