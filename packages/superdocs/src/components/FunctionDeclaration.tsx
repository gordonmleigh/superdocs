import ts from "typescript";
import { Identifier } from "./Identifier.js";
import { Keyword } from "./Keyword.js";
import { KeywordType } from "./KeywordType.js";
import { Modifiers } from "./Modifier.js";
import { NodeProps } from "./NodeProps.js";
import { Operator } from "./Operator.js";
import { TypeNode } from "./TypeNode.js";
import { TypeParameters } from "./TypeParameter.js";

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
      {node.typeParameters && (
        <TypeParameters collection={collection} node={node.typeParameters} />
      )}
      <FunctionParameters collection={collection} node={node.parameters} />
      {node.type && (
        <>
          <Operator text=": " />
          <TypeNode collection={collection} node={node.type} />
        </>
      )}
    </>
  );
}

type FunctionParameterProps = NodeProps<ts.ParameterDeclaration> & {
  index: number;
};

function FunctionParameter({
  collection,
  index,
  node,
}: FunctionParameterProps): JSX.Element {
  const name = ts.isIdentifier(node.name) ? node.name.text : `arg${index}`;
  return (
    <>
      <Identifier name={name} />
      <Operator text=": " />
      {node.type ? (
        <TypeNode collection={collection} node={node.type} />
      ) : (
        <KeywordType>unknown</KeywordType>
      )}
    </>
  );
}

function FunctionParameters({
  collection,
  node,
}: NodeProps<readonly ts.ParameterDeclaration[]>): JSX.Element {
  return (
    <>
      <Operator text="(" />
      {node.map((param, index) => (
        <FunctionParameter
          collection={collection}
          index={index}
          node={param}
          key={param.pos}
        />
      ))}
      <Operator text=")" />
    </>
  );
}
