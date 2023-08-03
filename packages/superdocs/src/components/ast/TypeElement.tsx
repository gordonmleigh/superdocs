import ts from "typescript";
import { IndexSignatureDeclaration } from "./IndexSignatureDeclaration";
import { NodeProps } from "./NodeProps";
import { PropertySignature } from "./PropertySignature";

export function TypeElement({
  collection,
  node,
}: NodeProps<ts.TypeElement>): JSX.Element {
  if (ts.isIndexSignatureDeclaration(node)) {
    return <IndexSignatureDeclaration collection={collection} node={node} />;
  }
  if (ts.isPropertySignature(node)) {
    return <PropertySignature collection={collection} node={node} />;
  }
  return <span className="code-unknown">{(node as any).getText()}</span>;
}
