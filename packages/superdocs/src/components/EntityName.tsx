import Link from "next/link";
import ts from "typescript";
import { NodeProps } from "./NodeProps.js";

/**
 * Formats a {@link ts.EntityName} in code, linking it to a definition if
 * available.
 * @group Components
 */
export function EntityName({
  collection,
  node,
}: NodeProps<ts.EntityName>): JSX.Element {
  const def = collection.getDeclaration(node);
  const id: string[] = [];

  for (let curr = node; ; ) {
    if (ts.isQualifiedName(curr)) {
      id.unshift(curr.right.text);
      curr = curr.left;
    } else {
      id.unshift(curr.text);
      break;
    }
  }
  const text = id.join(".");
  return def ? (
    <Link className="text-code-identifier" href={def.documentationLink}>
      {text}
    </Link>
  ) : (
    <span className="text-code-identifier">{text}</span>
  );
}
