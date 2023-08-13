import chalk from "chalk";
import ts from "typescript";
import { DeclarationCollection } from "../core/DeclarationCollection";
import { formatLocation } from "../core/NodeLocation";
import { getSyntaxKindName } from "../internal/getSyntaxKindName";
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
 * Formats an unknown AST node in code. This shows the underlying text content
 * of the node, with a blue wiggly underline in the default theme.
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
  const locationStr = formatLocation(location);
  const warning = `unknown AST node ${kind} (${locationStr})`;

  console.warn(`- ${chalk.yellow("warn")} ${warning}`);

  return (
    <Token
      className={className}
      unknown
      word={word}
      tooltip={
        <span className="drop-shadow-lg tooltip whitespace-nowrap">
          Unknown AST node {kind} (
          {location.codeLink ? (
            <a href={location.codeLink}>{locationStr}</a>
          ) : (
            locationStr
          )}
          )
        </span>
      }
    >
      {node.getText()}
    </Token>
  );
}
