import ts from "typescript";
import { Keyword } from "./Keyword.js";
import { NodeProps } from "./NodeProps.js";
import { Operator } from "./Operator.js";
import { TypeNode } from "./TypeNode.js";
import { TypeParameters } from "./TypeParameter.js";

/**
 * Format a type alias declaration in code.
 * @group Components
 */
export function TypeAliasDeclaration({
  collection,
  node,
}: NodeProps<ts.TypeAliasDeclaration>): JSX.Element {
  return (
    <>
      <Keyword>type</Keyword>
      {node.name.text}
      {node.typeParameters && (
        <TypeParameters collection={collection} node={node.typeParameters} />
      )}
      <Operator text="=" spaceAround />
      <TypeNode collection={collection} node={node.type} />
    </>
  );
}
