import ts from "typescript";
import { HeritageClauses } from "./HeritageClause.js";
import { Modifiers } from "./Modifier.js";
import { NodeProps } from "./NodeProps.js";
import { Token } from "./Token.js";
import { TypeParameters } from "./TypeParameter.js";

/**
 * Formats an interface declaration in code.
 * @group Components
 */
export function InterfaceDeclaration({
  collection,
  node,
}: NodeProps<ts.InterfaceDeclaration>): JSX.Element {
  return (
    <>
      {node.modifiers && <Modifiers node={node.modifiers} />}
      <Token keyword>interface</Token>
      <Token identifier>{node.name.text}</Token>
      {node.typeParameters && (
        <TypeParameters collection={collection} node={node.typeParameters} />
      )}
      {node.heritageClauses && (
        <HeritageClauses collection={collection} node={node.heritageClauses} />
      )}
    </>
  );
}
