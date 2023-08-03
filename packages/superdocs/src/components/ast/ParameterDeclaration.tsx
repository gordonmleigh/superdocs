import ts from "typescript";
import { Identifier } from "../ast/Identifier.js";
import { KeywordType } from "../ast/KeywordType.js";
import { NodeProps } from "../ast/NodeProps.js";
import { Operator } from "../ast/Operator.js";
import { TypeNode } from "../ast/TypeNode.js";

export type ParameterDeclarationProps = NodeProps<ts.ParameterDeclaration> & {
  index: number;
};

export function ParameterDeclaration({
  collection,
  index,
  node,
}: ParameterDeclarationProps): JSX.Element {
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
