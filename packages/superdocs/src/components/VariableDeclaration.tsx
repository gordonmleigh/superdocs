import ts from "typescript";
import { Modifiers } from "./Modifier.js";
import { NodeProps } from "./NodeProps.js";
import { Token } from "./Token.js";
import { TypeNode } from "./TypeNode.js";
import { UnknownCode } from "./UnknownCode.js";

/**
 * Format a {@link ts.VariableDeclaration} node in code.
 * @group Components
 */
export function VariableDeclaration({
  collection,
  node,
}: NodeProps<ts.VariableDeclaration>): JSX.Element {
  const statement = ts.findAncestor(node, (node) =>
    ts.isVariableStatement(node),
  ) as ts.VariableStatement | undefined;

  return (
    <>
      {statement?.modifiers && <Modifiers node={statement.modifiers} />}
      {ts.isIdentifier(node.name) ? (
        <Token identifier>{node.name.text}</Token>
      ) : (
        <UnknownCode collection={collection} node={node.name} />
      )}
      {node.type && (
        <>
          <Token operator text=": " />
          <TypeNode collection={collection} node={node.type} />
        </>
      )}
    </>
  );
}
