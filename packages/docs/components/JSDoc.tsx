import { getDeclarationUrl } from '@/util/getDeclarationUrl';
import { loadLibraryDefinition } from '@/util/loadLibraryDefinition';
import Link from 'next/link';
import ts from 'typescript';

type JSDocNode = ts.JSDoc | ts.JSDocTag | ts.JSDocComment | string;

export interface JSDocCommentProps {
  comment: JSDocNode | readonly JSDocNode[];
}

export async function JSDoc({ comment }: JSDocCommentProps) {
  const lib = await loadLibraryDefinition();

  if (typeof comment === 'string') {
    return comment;
  }
  if (isArray(comment)) {
    return (
      <>
        {comment.map((tag, index) => (
          <JSDoc comment={tag} key={index} />
        ))}
      </>
    );
  }
  if (ts.isJSDoc(comment)) {
    return comment.comment ? <JSDoc comment={comment.comment} /> : null;
  }
  if (isJSDocText(comment)) {
    return <>{comment.text}</>;
  }
  if (ts.isJSDocLink(comment)) {
    if (comment.name) {
      const def = lib.getDeclaration(comment.name);
      if (def) {
        return (
          <Link href={getDeclarationUrl(lib, def)}>
            <code>{comment.name.getText()}</code>
          </Link>
        );
      } else {
        return <>{comment.name.getText()}</>;
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
