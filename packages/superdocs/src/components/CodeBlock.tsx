"use client";
import clsx from "clsx";
import { PrismAsyncLight as SyntaxHighlighter } from "react-syntax-highlighter";

/**
 * Properties for the {@link CodeBlock} component.
 * @group Components
 */
export interface CodeBlockProps {
  /**
   * The code to format.
   */
  children: string;
  /**
   * Additional CSS classes to apply.
   */
  className?: string;
  /**
   * The default language (defaults to `"typescript"`).
   */
  defaultLanguage?: string;
  /**
   * The language of the code sample (defaults to the value of the
   * `defaultLanguage` property).
   */
  language?: string;
}

/**
 * Format a code sample.
 * @group Components
 */
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
      codeTagProps={{
        className: clsx(className, "block my-4", `language-${language}`),
      }}
      children={children}
      language={match}
      useInlineStyles={false}
    />
  );
}
