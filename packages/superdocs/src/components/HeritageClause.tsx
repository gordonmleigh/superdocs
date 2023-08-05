import ts from "typescript";
import { EntityName } from "./EntityName.js";
import { Join } from "./Join.js";
import { NodeProps } from "./NodeProps.js";
import { Token } from "./Token.js";
import { TypeArguments } from "./TypeArguments.js";

/**
 * Formats a heritage clause (i.e. `extends` or `implements`).
 * @group Components
 */
export function HeritageClause({
  collection,
  node,
}: NodeProps<ts.HeritageClause>): JSX.Element {
  return (
    <>
      {node.token === ts.SyntaxKind.ImplementsKeyword && (
        <Token keyword>implements</Token>
      )}
      {node.token === ts.SyntaxKind.ExtendsKeyword && (
        <Token keyword>extends</Token>
      )}
      <Join
        operator=", "
        items={node.types}
        render={(type) => (
          <>
            <EntityName
              collection={collection}
              node={type.expression as ts.EntityName}
            />
            {type.typeArguments && (
              <TypeArguments
                collection={collection}
                node={type.typeArguments}
              />
            )}
          </>
        )}
      />
    </>
  );
}

/**
 * Formats several heritage clauses (i.e. `extends` or `implements`).
 * @group Components
 */
export function HeritageClauses({
  collection,
  node,
}: NodeProps<ts.NodeArray<ts.HeritageClause>>): JSX.Element {
  return (
    <>
      {node.map((x, i) => (
        <HeritageClause collection={collection} key={i} node={x} />
      ))}
    </>
  );
}
