import ts from "typescript";
import { Identifier } from "./Identifier.js";
import { Keyword } from "./Keyword.js";
import { Modifiers } from "./Modifier.js";
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
      {node.modifiers && <Modifiers node={node.modifiers} />}
      <Keyword>type</Keyword>
      <Identifier name={node.name} />
      {node.typeParameters && (
        <TypeParameters collection={collection} node={node.typeParameters} />
      )}
      <Operator text=" = " />
      <TypeNode collection={collection} node={node.type} />
    </>
  );
}
