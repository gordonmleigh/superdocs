import chalk from "chalk";
import clsx from "clsx";
import Link from "next/link";
import ts from "typescript";
import { ImportInfo } from "../core/DeclarationCollection.js";
import { formatLocation } from "../core/NodeLocation.js";
import { FormatImport } from "./FormatImport.js";
import { NodeProps } from "./NodeProps.js";
import { Token } from "./Token.js";

/**
 * Formats a {@link ts.EntityName} in code, linking it to a definition if
 * available.
 * @group Components
 */
export function EntityName({
  collection,
  node,
}: NodeProps<ts.EntityName | ts.JSDocMemberName>): JSX.Element {
  return ts.isIdentifier(node) ? (
    <LinkedIdentifier collection={collection} node={node} />
  ) : (
    <>
      <EntityName collection={collection} node={node.left} />
      <Token punctuation text="." />
      <EntityName collection={collection} node={node.right} />
    </>
  );
}

interface ImportedIdentifierProps {
  href?: string;
  info: ImportInfo;
  node: ts.Identifier;
}

function ImportedIdentifier({
  href,
  info,
  node,
}: ImportedIdentifierProps): JSX.Element {
  return (
    <Token
      className={clsx(!href && "underline decoration-dotted cursor-help")}
      identifier
      tooltip={
        <code className="tooltip language-typescript whitespace-nowrap drop-shadow-lg">
          <FormatImport info={info} />
        </code>
      }
    >
      {href ? <Link href={href}>{node.text}</Link> : node.text}
    </Token>
  );
}

function LinkedIdentifier({
  collection,
  node,
}: NodeProps<ts.Identifier>): JSX.Element {
  const def = collection.getDeclaration(node);
  if (def) {
    return def.importInfo ? (
      <ImportedIdentifier
        node={node}
        href={def.documentationLink}
        info={def.importInfo}
      />
    ) : (
      <Token identifier>
        <Link href={def.documentationLink}>{node.text}</Link>
      </Token>
    );
  }

  const importInfo = collection.getImportInfo(node);
  if (importInfo) {
    if (importInfo.module.match(/^\.\.?\//)) {
      const location = collection.getNodeLocation(node);
      console.warn(
        `- ${chalk.yellow("warn")} found unexported symbol` +
          ` ${node.text} (${formatLocation(location)})`,
      );
      return (
        <Token
          className="unexported"
          identifier
          tooltip={<span className="tooltip">The symbol is not exported</span>}
        >
          {node.text}
        </Token>
      );
    }
    return <ImportedIdentifier node={node} info={importInfo} />;
  }

  return <Token identifier>{node.text}</Token>;
}
