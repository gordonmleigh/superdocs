import ts from "typescript";
import { Join } from "./Join.js";
import { NodeProps } from "./NodeProps.js";
import { Token } from "./Token.js";
import { TypeNode } from "./TypeNode.js";

/**
 * Format an array of {@link ts.TypeNode} in code.
 * @group Components
 */
export function TypeArguments({
  collection,
  node,
}: NodeProps<readonly ts.TypeNode[]>): JSX.Element {
  return (
    <>
      <Token punctuation text="<" />
      <Join
        punctuation=", "
        items={node}
        render={(x) => <TypeNode collection={collection} node={x} />}
      />
      <Token punctuation text=">" />
    </>
  );
}
