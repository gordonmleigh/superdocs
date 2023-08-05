import ts from "typescript";
import { Modifiers } from "../ast/Modifier.js";
import { NodeProps } from "../ast/NodeProps.js";
import { Operator } from "../ast/Operator.js";
import { TypeNode } from "../ast/TypeNode.js";
import { PropertyName } from "./PropertyName.js";

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
      {node.questionToken && <Operator text="?" />}
      {node.type && (
        <>
          <Operator text=": " />
          <TypeNode collection={collection} node={node.type} />
        </>
      )}
    </>
  );
}
