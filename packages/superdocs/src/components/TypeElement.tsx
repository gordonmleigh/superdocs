import ts from "typescript";
import { NodeProps } from "./NodeProps";
import { PropertySignature } from "./PropertySignature";
import { SignatureDeclaration } from "./SignatureDeclaration";
import { UnknownCode } from "./UnknownCode";

/**
 * Format a {@link ts.TypeElement} node in code.
 * @group Components
 */
export function TypeElement({
  collection,
  node,
}: NodeProps<ts.TypeElement>): JSX.Element {
  if (ts.isFunctionLike(node)) {
    return <SignatureDeclaration collection={collection} node={node} />;
  }
  if (ts.isPropertySignature(node)) {
    return <PropertySignature collection={collection} node={node} />;
  }
  return <UnknownCode collection={collection} node={node} />;
}
