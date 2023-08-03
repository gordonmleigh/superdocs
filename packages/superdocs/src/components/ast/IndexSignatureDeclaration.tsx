import ts from "typescript";
import { Join } from "./Join.js";
import { Modifiers } from "./Modifier.js";
import { NodeProps } from "./NodeProps.js";
import { Operator } from "./Operator.js";
import { ParameterDeclaration } from "./ParameterDeclaration.js";
import { TypeNode } from "./TypeNode.js";

/**
 * Formats an index signature in code.
 * @group Components
 */
export function IndexSignatureDeclaration({
  collection,
  node,
}: NodeProps<ts.IndexSignatureDeclaration>): JSX.Element {
  return (
    <>
      {node.modifiers && <Modifiers node={node.modifiers} />}
      <Operator text="[" />
      <Join
        delimiter={<Operator text=", " />}
        items={node.parameters}
        render={(param, index) => (
          <ParameterDeclaration
            collection={collection}
            index={index}
            node={param}
            key={param.pos}
          />
        )}
      />
      <Operator text="]" />
      {node.type && (
        <>
          <Operator text=": " />
          <TypeNode collection={collection} node={node.type} />
        </>
      )}
    </>
  );
}
