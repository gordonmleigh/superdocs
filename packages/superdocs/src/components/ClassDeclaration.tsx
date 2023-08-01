import ts from "typescript";
import { HeritageClauses } from "./HeritageClause.js";
import { Identifier } from "./Identifier.js";
import { Keyword } from "./Keyword.js";
import { Modifiers } from "./Modifier.js";
import { NodeProps } from "./NodeProps.js";
import { TypeParameters } from "./TypeParameter.js";

/**
 * Formats a class declaration in code.
 * @group Components
 */
export function ClassDeclaration({
  collection,
  node,
}: NodeProps<ts.ClassDeclaration>): JSX.Element {
  return (
    <>
      {node.modifiers && <Modifiers node={node.modifiers} />}
      <Keyword>class</Keyword>
      {node.name && <Identifier name={node.name} />}
      {node.typeParameters && (
        <TypeParameters collection={collection} node={node.typeParameters} />
      )}
      {node.heritageClauses && (
        <HeritageClauses collection={collection} node={node.heritageClauses} />
      )}
    </>
  );
}
