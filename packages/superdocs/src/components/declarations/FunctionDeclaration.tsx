import ts from "typescript";
import { Identifier } from "../ast/Identifier.js";
import { Join } from "../ast/Join.js";
import { Keyword } from "../ast/Keyword.js";
import { Modifiers } from "../ast/Modifier.js";
import { NodeProps } from "../ast/NodeProps.js";
import { Operator } from "../ast/Operator.js";
import { ParameterDeclaration } from "../ast/ParameterDeclaration.js";
import { TypeNode } from "../ast/TypeNode.js";
import { TypeParameters } from "../ast/TypeParameter.js";

/**
 * Formats a function declaration in code.
 * @group Components
 */
export function FunctionDeclaration({
  collection,
  node,
}: NodeProps<ts.FunctionDeclaration>): JSX.Element {
  return (
    <>
      {node.modifiers && <Modifiers node={node.modifiers} />}
      <Keyword>function</Keyword>
      {node.name && <Identifier name={node.name} />}
      {node.asteriskToken && <Operator text="*" />}
      {node.typeParameters && (
        <TypeParameters collection={collection} node={node.typeParameters} />
      )}

      <Operator text="(" />
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
      <Operator text=")" />

      {node.type && (
        <>
          <Operator text=": " />
          <TypeNode collection={collection} node={node.type} />
        </>
      )}
    </>
  );
}
