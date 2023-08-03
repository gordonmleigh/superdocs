import ts from "typescript";
import { HeritageClauses } from "../ast/HeritageClause.js";
import { Identifier } from "../ast/Identifier.js";
import { Keyword } from "../ast/Keyword.js";
import { Modifiers } from "../ast/Modifier.js";
import { NodeProps } from "../ast/NodeProps.js";
import { TypeParameters } from "../ast/TypeParameter.js";

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
      <Keyword>interface</Keyword>
      <Identifier name={node.name} />
      {node.typeParameters && (
        <TypeParameters collection={collection} node={node.typeParameters} />
      )}
      {node.heritageClauses && (
        <HeritageClauses collection={collection} node={node.heritageClauses} />
      )}
    </>
  );
}
