import ts from "typescript";
import { NodeProps } from "./NodeProps";
import { PropertySignature } from "./PropertySignature";
import { SignatureDeclaration } from "./SignatureDeclaration";

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
  return <span className="code-unknown">{(node as any).getText()}</span>;
}
