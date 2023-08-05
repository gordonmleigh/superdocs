import Link from "next/link";
import ts from "typescript";
import { NodeProps } from "./NodeProps.js";
import { Token } from "./Token.js";

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
  const text = normaliseName(node);
  return (
    <Token identifier>
      {def ? <Link href={def.documentationLink}>{text}</Link> : text}
    </Token>
  );
}

function normaliseName(name: string | ts.EntityName): string {
  if (typeof name === "string") {
    return name;
  }
  const id: string[] = [];

  for (let curr = name; ; ) {
    if (ts.isQualifiedName(curr)) {
      id.unshift(curr.right.text);
      curr = curr.left;
    } else {
      id.unshift(curr.text);
      break;
    }
  }
  return id.join(".");
}
