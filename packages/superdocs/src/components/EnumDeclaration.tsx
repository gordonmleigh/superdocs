import ts from "typescript";
import { Modifiers } from "./Modifier.js";
import { NodeProps } from "./NodeProps.js";
import { Token } from "./Token.js";

/**
 * Formats a enum declaration in code.
 * @group Components
 */
export function EnumDeclaration({
  node,
}: NodeProps<ts.EnumDeclaration>): JSX.Element {
  return (
    <>
      {node.modifiers && <Modifiers node={node.modifiers} />}
      <Token keyword>enum</Token>
      {node.name && <Token identifier>{node.name.text}</Token>}
    </>
  );
}
