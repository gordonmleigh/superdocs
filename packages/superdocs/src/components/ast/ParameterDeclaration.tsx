import ts from "typescript";
import { getParameterIndex } from "../../internal/getParameterIndex.js";
import { NodeProps } from "../ast/NodeProps.js";
import { TypeNode } from "../ast/TypeNode.js";
import { Token } from "./Token.js";

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
      {node.dotDotDotToken && <Token operator text="..." />}
      <Token identifier>{name}</Token>
      <Token operator text=": " />
      {node.type ? (
        <TypeNode collection={collection} node={node.type} />
      ) : (
        <Token keyword type>
          unknown
        </Token>
      )}
    </>
  );
}
