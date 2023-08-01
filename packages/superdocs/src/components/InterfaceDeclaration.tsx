import ts from "typescript";
import { HeritageClauses } from "./HeritageClause.js";
import { Identifier } from "./Identifier.js";
import { Keyword } from "./Keyword.js";
import { Modifiers } from "./Modifier.js";
import { NodeProps } from "./NodeProps.js";
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
