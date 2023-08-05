import ts from "typescript";
import { Modifiers } from "../ast/Modifier.js";
import { NodeProps } from "../ast/NodeProps.js";
import { Token } from "../ast/Token.js";
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
      <Token keyword>type</Token>
      <Token identifier>{node.name.text}</Token>
      {node.typeParameters && (
        <TypeParameters collection={collection} node={node.typeParameters} />
      )}
      <Token operator text=" = " />
      <TypeNode collection={collection} node={node.type} />
    </>
  );
}
