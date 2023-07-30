import ts from "typescript";

export function getSyntaxKindName(kind: ts.SyntaxKind): string {
  const name = Object.entries(ts.SyntaxKind).find(
    ([k, v]) => !k.startsWith("First") && !k.startsWith("Last") && v === kind,
  )?.[0];

  if (!name) {
    throw new Error(`can't find name for SyntaxKind ${kind}`);
  }
  return name;
}
