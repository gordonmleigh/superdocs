import ts from "typescript";
import { Modifiers } from "./Modifier.js";
import { NodeProps } from "./NodeProps.js";
import { Token } from "./Token.js";
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
