import ts from "typescript";
import { Join } from "./Join.js";
import { NodeProps } from "./NodeProps.js";
import { Operator } from "./Operator.js";
import { TypeNode } from "./TypeNode.js";

/**
 * Format type arguments in code.
 * @group Components
 */
export function TypeArguments({
  collection,
  node,
}: NodeProps<readonly ts.TypeNode[]>): JSX.Element {
  return (
    <>
      <Operator text="<" />
      <Join
        delimiter={<Operator text="," spaceRight />}
        items={node}
        render={(x) => <TypeNode collection={collection} node={x} />}
      />
      <Operator text=">" />
    </>
  );
}
