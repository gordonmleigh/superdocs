import clsx from "clsx";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { CodeBlock } from "./CodeBlock";

export interface MarkdownProps {
  children: string;
}

export function Markdown({ children }: MarkdownProps): JSX.Element {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
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
        pre: ({ children }) => <>{children}</>,
      }}
    >
      {children}
    </ReactMarkdown>
  );
}
