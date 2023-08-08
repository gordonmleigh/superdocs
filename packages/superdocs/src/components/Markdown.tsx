import clsx from "clsx";
import ReactMarkdown from "react-markdown";
import { ReactMarkdownOptions } from "react-markdown/lib/react-markdown";
import remarkGfm from "remark-gfm";
import { CodeBlock } from "./CodeBlock";

export interface MarkdownProps {
  children: string;
}

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
