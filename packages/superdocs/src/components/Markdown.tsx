import clsx from "clsx";
import ReactMarkdown from "react-markdown";
import { ReactMarkdownOptions } from "react-markdown/lib/react-markdown";
import remarkGfm from "remark-gfm";
import { CodeBlock } from "./CodeBlock";

/**
 * Properties for the {@link Markdown} component.
 * @group Components
 */
export interface MarkdownProps {
  children: string;
}

/**
 * Render markdown with a few useful presets.
 *
 * @see {@link https://github.com/remarkjs/react-markdown | React Markdown GitHub} for more info.
 */
export function Markdown({
  children,
  components,
  remarkPlugins = [],
  ...rest
}: ReactMarkdownOptions): JSX.Element {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm, ...remarkPlugins]}
      components={{
        code: ({
          className,
          children,
          index,
          inline,
          node,
          siblingCount,
          ...props
        }) => {
          return !inline ? (
            <CodeBlock
              className={className}
              children={String(children).replace(/\n$/, "")}
            />
          ) : (
            <code {...props} className={clsx(className, "declaration-code")}>
              {children}
            </code>
          );
        },
        ...components,
      }}
      {...rest}
    >
      {children}
    </ReactMarkdown>
  );
}
