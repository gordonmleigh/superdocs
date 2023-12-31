import ts from "typescript";
import { getParameterIndex } from "../internal/getParameterIndex.js";
import { NodeProps } from "./NodeProps.js";
import { Token } from "./Token.js";
import { TypeNode } from "./TypeNode.js";

/**
 * Format a {@link ts.ParameterDeclaration} node in code.
 * @group Components
 */
export function ParameterDeclaration({
  collection,
  node,
}: NodeProps<ts.ParameterDeclaration>): JSX.Element {
  const name = ts.isIdentifier(node.name)
    ? node.name.text
    : `arg${getParameterIndex(node)}`;
  return (
    <>
      {node.dotDotDotToken && <Token operator text="..." />}
      <Token identifier>{name}</Token>
      {node.questionToken && <Token operator text="?" />}
      <Token operator text=": " />
      {node.type ? (
        <TypeNode collection={collection} node={node.type} />
      ) : (
        <Token builtin>unknown</Token>
      )}
    </>
  );
}
