import ts from "typescript";
import { DeclarationCollection } from "../core/DeclarationCollection";
import { EntityName } from "./EntityName";
import { UnknownCode } from "./UnknownCode";

/**
 * The union of valid AST nodes within a JSDoc.
 * @group Utilities
 */
export type JSDocNode = ts.JSDoc | ts.JSDocTag | ts.JSDocComment | string;

/**
 * Properties for the {@link JSDoc} component.
 * @group Components
 */
export interface JSDocProps {
  collection: DeclarationCollection;
  comment: JSDocNode | readonly JSDocNode[];
}

/**
 * Format a JSDoc comment nicely.
 * @group Components
 */
export function JSDoc({ collection, comment }: JSDocProps): JSX.Element | null {
  if (typeof comment === "string") {
    return <>{comment}</>;
  }
  if (isArray(comment)) {
    return (
      <>
        {comment.map((tag, index) => (
          <JSDoc collection={collection} comment={tag} key={index} />
        ))}
      </>
    );
  }
  if (ts.isJSDoc(comment)) {
    return comment.comment ? (
      <JSDoc collection={collection} comment={comment.comment} />
    ) : null;
  }
  if (isJSDocText(comment)) {
    return <>{comment.text}</>;
  }
  if (ts.isJSDocLink(comment)) {
    if (comment.name) {
      return (
        <code className="jsdoc-code-link">
          <EntityName collection={collection} node={comment.name} />
        </code>
      );
    } else {
      return <>{comment.text}</>;
    }
  }
  return <UnknownCode collection={collection} node={comment} />;
}

function isArray(x: unknown): x is readonly any[] {
  return Array.isArray(x);
}

function isJSDocText(x: ts.Node): x is ts.JSDocText {
  return x.kind === ts.SyntaxKind.JSDocText;
}
