import ts from "typescript";
import { Modifiers } from "./Modifier.js";
import { NodeProps } from "./NodeProps.js";
import { PropertyName } from "./PropertyName.js";
import { Token } from "./Token.js";
import { TypeNode } from "./TypeNode.js";

/**
 * Formats a property signature in code.
 * @group Components
 */
export function PropertySignature({
  collection,
  node,
}: NodeProps<ts.PropertySignature | ts.PropertyDeclaration>): JSX.Element {
  return (
    <>
      {node.modifiers && <Modifiers node={node.modifiers} />}
      <PropertyName collection={collection} node={node.name} />
      {node.questionToken && <Token operator text="?" />}
      {node.type && (
        <>
          <Token operator text=": " />
          <TypeNode collection={collection} node={node.type} />
        </>
      )}
    </>
  );
}
