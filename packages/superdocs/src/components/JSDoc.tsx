import ts from "typescript";
import { JSDocNode, isJSDocText } from "../core/JSDocNode";
import { isArray } from "../internal/isArray";
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
      if (
        node.name.getText() === "https" &&
        !collection.getDeclaration(node.name)
      ) {
        // see https://github.com/microsoft/TypeScript/issues/49826#issuecomment-1189640717
        // tsc parses @see tags wrongly so we have to do some manual work
        let url: string;
        let text: string;
        const indexOfBar = node.text.lastIndexOf("|");
        if (indexOfBar >= 0) {
          url = "https:" + node.text.slice(0, indexOfBar);
          text = node.text.slice(indexOfBar + 1);
        } else {
          url = "https:" + node.text;
          text = url;
        }
        return (
          <a href={url} rel="noopener noreferrer">
            {text}
          </a>
        );
      }
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
