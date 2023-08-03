import ts from "typescript";
import { NodeProps } from "./NodeProps";
import { PropertySignature } from "./PropertySignature";
import { SignatureDeclaration } from "./SignatureDeclaration";

export function ClassElement({
  collection,
  node,
}: NodeProps<ts.ClassElement>): JSX.Element {
  if (ts.isFunctionLike(node)) {
    return <SignatureDeclaration collection={collection} node={node} />;
  }
  if (ts.isPropertyDeclaration(node)) {
    return <PropertySignature collection={collection} node={node} />;
  }
  return <span className="code-unknown">{(node as any).getText()}</span>;
}
