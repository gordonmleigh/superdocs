import ts from "typescript";
import { JSDocNode } from "../core/DeclarationCollection";
import { EntityName } from "./EntityName";
import { NodeProps } from "./NodeProps";
import { UnknownCode } from "./UnknownCode";

/**
 * Format a JSDoc comment nicely.
 * @group Components
 */
export function JSDoc({
  collection,
  node,
}: NodeProps<JSDocNode | readonly JSDocNode[]>): JSX.Element | null {
  if (typeof node === "string") {
    return <>{node}</>;
  }
  if (isArray(node)) {
    return (
      <>
        {node.map((tag, index) => (
          <JSDoc collection={collection} node={tag} key={index} />
        ))}
      </>
    );
  }
  if (ts.isJSDoc(node)) {
    return node.comment ? (
      <JSDoc collection={collection} node={node.comment} />
    ) : null;
  }
  if (isJSDocText(node)) {
    return <>{node.text}</>;
  }
  if (ts.isJSDocLink(node)) {
    if (node.name) {
      return (
        <code className="jsdoc-code-link">
          <EntityName collection={collection} node={node.name} />
        </code>
      );
    } else {
      return <>{node.text}</>;
    }
  }
  return <UnknownCode collection={collection} node={node} />;
}

function isArray(x: unknown): x is readonly any[] {
  return Array.isArray(x);
}

function isJSDocText(x: ts.Node): x is ts.JSDocText {
  return x.kind === ts.SyntaxKind.JSDocText;
}
