import ts from "typescript";
import { EntityName } from "./EntityName.js";
import { Join } from "./Join.js";
import { NodeProps } from "./NodeProps.js";
import { Token } from "./Token.js";
import { TypeNode } from "./TypeNode.js";

/**
 * Format a {@link ts.TypeParameterDeclaration} node in code.
 * @group Components
 */
export function TypeParameter({
  collection,
  node,
}: NodeProps<ts.TypeParameterDeclaration>): JSX.Element {
  return (
    <>
      <EntityName collection={collection} node={node.name} />
      {node.constraint && (
        <>
          <Token keyword>extends</Token>
          <TypeNode collection={collection} node={node.constraint} />
        </>
      )}
      {node.default && (
        <>
          <Token operator text=" = " />
          <TypeNode collection={collection} node={node.default} />
        </>
      )}
    </>
  );
}

/**
 * Format an array of {@link ts.TypeParameterDeclaration} nodes in code.
 * @group Components
 */
export function TypeParameters({
  collection,
  node,
}: NodeProps<readonly ts.TypeParameterDeclaration[]>): JSX.Element {
  return (
    <>
      <Token punctuation text="<" />
      <Join
        punctuation=", "
        items={node}
        render={(x) => <TypeParameter collection={collection} node={x} />}
      />
      <Token punctuation text=">" />
    </>
  );
}
