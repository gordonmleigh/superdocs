import ts from "typescript";
import { Keyword } from "./Keyword";
import { NodeOnlyProps } from "./NodeProps";

export function Modifier({
  node,
}: NodeOnlyProps<ts.ModifierLike>): JSX.Element | null {
  if (ts.isModifier(node)) {
    if (node.kind === ts.SyntaxKind.DeclareKeyword) {
      return null;
    }
    return <Keyword>{node.getText()}</Keyword>;
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
