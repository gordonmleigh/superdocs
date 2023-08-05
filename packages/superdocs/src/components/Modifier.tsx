import ts from "typescript";
import { NodeOnlyProps } from "./NodeProps";
import { Token } from "./Token";

export function Modifier({
  node,
}: NodeOnlyProps<ts.ModifierLike>): JSX.Element | null {
  if (ts.isModifier(node)) {
    if (node.kind === ts.SyntaxKind.DeclareKeyword) {
      return null;
    }
    return <Token keyword>{node.getText()}</Token>;
  }
  return null;
}

export function Modifiers({
  node,
}: NodeOnlyProps<readonly (ts.ModifierLike | ts.ModifierLike)[]>): JSX.Element {
  return (
    <>
      {node.map((modifier) => (
        <Modifier key={modifier.pos} node={modifier} />
      ))}
    </>
  );
}
