import Link from "next/link";
import ts from "typescript";
import { ImportInfo } from "../../core/DeclarationCollection.js";
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
}: NodeProps<ts.EntityName>): JSX.Element {
  return ts.isIdentifier(node) ? (
    <LinkedIdentifier collection={collection} node={node} />
  ) : (
    <>
      <EntityName collection={collection} node={node.left} />
      <Token operator text="." />
      <EntityName collection={collection} node={node.right} />
    </>
  );
}

function ImportedIdentifier({
  info,
  node,
}: {
  info: ImportInfo;
  node: ts.Identifier;
}): JSX.Element {
  return (
    <Token
      className="relative group underline decoration-dotted cursor-help"
      identifier
    >
      <code className="group-hover:block absolute top-0 left-0 declaration-code-popup whitespace-nowrap drop-shadow-lg">
        <Token keyword>import</Token>
        {info.kind === "named" && (
          <>
            <Token operator text=" { " />
            <Token identifier>{info.name}</Token>
            {info.localName && (
              <>
                <Token keyword>as</Token>
                <Token identifier>{info.localName}</Token>
              </>
            )}
            <Token operator text=" } " />
          </>
        )}
        {info.kind === "default" && <Token identifier>{info.name}</Token>}
        {info.kind === "star" && (
          <>
            <Token operator text="*" />
            <Token keyword>as</Token>
            <Token identifier>{info.name}</Token>
          </>
        )}
        <Token keyword>from</Token>
        <Token literal="string">&quot;{info.module}&quot;</Token>
      </code>
      {node.text}
    </Token>
  );
}

function LinkedIdentifier({
  collection,
  node,
}: NodeProps<ts.Identifier>): JSX.Element {
  const def = collection.getDeclaration(node);
  if (def) {
    return (
      <Token identifier>
        <Link href={def.documentationLink}>{node.text}</Link>
      </Token>
    );
  }

  const importInfo = collection.getImportInfo(node);
  if (importInfo) {
    return <ImportedIdentifier node={node} info={importInfo} />;
  }

  return <Token identifier>{node.text}</Token>;
}
