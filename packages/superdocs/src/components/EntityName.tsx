import Link from "next/link";
import ts from "typescript";
import { normaliseName } from "./Identifier.js";
import { NodeProps } from "./NodeProps.js";
import { CodeWord } from "./Word.js";

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
    <CodeWord className="text-code-identifier">
      {def ? <Link href={def.documentationLink}>{text}</Link> : text}
    </CodeWord>
  );
}
