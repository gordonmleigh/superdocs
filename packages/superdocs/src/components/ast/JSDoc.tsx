import Link from "next/link";
import ts from "typescript";
import { DeclarationCollection } from "../../core/DeclarationCollection";

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
      const def = collection.getDeclaration(comment.name);
      if (def) {
        return (
          <Link href={def.documentationLink}>
            <code className="jsdoc-code-link">{comment.name.getText()}</code>
          </Link>
        );
      } else {
        return (
          <code className="jsdoc-code-link-broken">
            {comment.name.getText()}
          </code>
        );
      }
    } else {
      return <>{comment.text}</>;
    }
  }
  return <span>unknown${ts.SyntaxKind[comment.kind]}</span>;
}

function isArray(x: unknown): x is readonly any[] {
  return Array.isArray(x);
}

function isJSDocText(x: ts.Node): x is ts.JSDocText {
  return x.kind === ts.SyntaxKind.JSDocText;
}