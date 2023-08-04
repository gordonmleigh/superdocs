import ts from "typescript";
import { getParameterIndex } from "../../internal/getParameterIndex.js";
import { Identifier } from "../ast/Identifier.js";
import { KeywordType } from "../ast/KeywordType.js";
import { NodeProps } from "../ast/NodeProps.js";
import { Operator } from "../ast/Operator.js";
import { TypeNode } from "../ast/TypeNode.js";

export type ParameterDeclarationProps = NodeProps<ts.ParameterDeclaration>;

export function ParameterDeclaration({
  collection,
  node,
}: ParameterDeclarationProps): JSX.Element {
  const name = ts.isIdentifier(node.name)
    ? node.name.text
    : `arg${getParameterIndex(node)}`;
  return (
    <>
      {node.dotDotDotToken && <Operator text="..." />}
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
