import ts from "typescript";
import { HeritageClauses } from "./HeritageClause.js";
import { Keyword } from "./Keyword.js";
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
      <Keyword>class</Keyword>
      {node.name?.text}
      {node.typeParameters && (
        <TypeParameters collection={collection} node={node.typeParameters} />
      )}
      {node.heritageClauses && (
        <HeritageClauses collection={collection} node={node.heritageClauses} />
      )}
    </>
  );
}
