"use client";
import { PrismAsyncLight as SyntaxHighlighter } from "react-syntax-highlighter";

export interface CodeBlockProps {
  children: string;
  className?: string;
  defaultLanguage?: string;
  language?: string;
}

export function CodeBlock({
  children,
  className,
  defaultLanguage = "typescript",
  language,
}: CodeBlockProps): JSX.Element {
  const match =
    language ?? /language-(\w+)/.exec(className || "")?.[1] ?? defaultLanguage;
  return (
    <SyntaxHighlighter
      children={children}
      language={match}
      useInlineStyles={false}
    />
  );
}
