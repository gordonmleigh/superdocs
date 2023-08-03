import ts from "typescript";
import { EntityName } from "./EntityName.js";
import { Join } from "./Join.js";
import { Keyword } from "./Keyword.js";
import { NodeProps } from "./NodeProps.js";
import { Operator } from "./Operator.js";
import { TypeNode } from "./TypeNode.js";

/**
 * Format a type parameter in code.
 * @group Components
 */
export function TypeParameter({
  collection,
  node,
}: NodeProps<ts.TypeParameterDeclaration>): JSX.Element {
  return (
    <>
      <EntityName collection={collection} node={node.name} />
      {node.constraint && (
        <>
          <Keyword>extends</Keyword>
          <TypeNode collection={collection} node={node.constraint} />
        </>
      )}
      {node.default && (
        <>
          <Operator text=" = " />
          <TypeNode collection={collection} node={node.default} />
        </>
      )}
    </>
  );
}

/**
 * Format type parameters in code.
 * @group Components
 */
export function TypeParameters({
  collection,
  node,
}: NodeProps<readonly ts.TypeParameterDeclaration[]>): JSX.Element {
  return (
    <>
      <Operator>{"<"}</Operator>
      <Join
        delimiter=", "
        items={node}
        render={(x) => <TypeParameter collection={collection} node={x} />}
      />
      <Operator>{">"}</Operator>
    </>
  );
}
