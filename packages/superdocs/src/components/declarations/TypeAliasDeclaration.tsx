import ts from "typescript";
import { Identifier } from "../ast/Identifier.js";
import { Keyword } from "../ast/Keyword.js";
import { Modifiers } from "../ast/Modifier.js";
import { NodeProps } from "../ast/NodeProps.js";
import { Operator } from "../ast/Operator.js";
import { TypeNode } from "../ast/TypeNode.js";
import { TypeParameters } from "../ast/TypeParameter.js";

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
