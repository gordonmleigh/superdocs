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

  const flags =
    ts.findAncestor(node, (node) => ts.isVariableDeclarationList(node))
      ?.flags ?? ts.NodeFlags.None;

  return (
    <>
      {statement?.modifiers && <Modifiers node={statement.modifiers} />}
      {flags & ts.NodeFlags.Const ? (
        <Token keyword>const</Token>
      ) : flags & ts.NodeFlags.BlockScoped ? (
        <Token keyword>let</Token>
      ) : (
        <Token keyword>var</Token>
      )}
      {ts.isIdentifier(node.name) ? (
        <Token identifier>{node.name.text}</Token>
      ) : (
        <UnknownCode collection={collection} node={node.name} />
      )}
      {node.type ? (
        <>
          <Token operator text=": " />
          <TypeNode collection={collection} node={node.type} />
        </>
      ) : node.initializer ? (
        <>
          <Token operator text=" = " />
          {ts.isStringLiteral(node.initializer) ? (
            <Token literal="string">"{node.initializer.text}"</Token>
          ) : ts.isNumericLiteral(node.initializer) ? (
            <Token literal="number">{node.initializer.text}</Token>
          ) : (
            <UnknownCode collection={collection} node={node.initializer} />
          )}
        </>
      ) : undefined}
    </>
  );
}
