import chalk from "chalk";
import ts from "typescript";
import { DeclarationCollection } from "../../core/DeclarationCollection";
import { getSyntaxKindName } from "../../internal/getSyntaxKindName";
import { Token } from "./Token";

/**
 * Properties for the {@link UnknownCode} component.
 * @group Components
 */
export interface UnknownCodeProps {
  className?: string;
  collection: DeclarationCollection;
  node: ts.Node;
  word?: boolean;
}

/**
 * Formats a keyword type in code.
 * @group Components
 */
export function UnknownCode({
  className,
  collection,
  node,
  word,
}: UnknownCodeProps): JSX.Element {
  const kind = getSyntaxKindName(node.kind);
  const location = collection.getNodeLocation(node);
  const locationStr = `${location.path}:${location.line}:${location.char}`;

  console.warn(
    `- ${chalk.yellow("warn")} unknown AST node ${kind} (${locationStr})`,
  );

  return (
    <Token className={className} unknown word={word}>
      {node.getText()}
    </Token>
  );
}
