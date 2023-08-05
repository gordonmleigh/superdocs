import clsx from "clsx";
import { ReactNode } from "react";

/**
 * Properties for the {@link Token} component.
 * @group Components
 */
export interface TokenProps {
  children?: ReactNode;
  className?: string;
  keyword?: boolean;
  identifier?: boolean | "private";
  literal?: boolean | "number" | "string";
  operator?: boolean;
  text?: string;
  type?: boolean;
  unknown?: boolean;
  word?: boolean;
}

/**
 * Formats a token in code.
 * @group Components
 */
export function Token({
  children,
  className,
  identifier,
  keyword,
  literal,
  operator,
  text,
  type,
  unknown,
  word = !!identifier || keyword || !!literal,
}: TokenProps): JSX.Element {
  const Container = word ? CodeWord : "span";

  return (
    <Container
      className={clsx(className, {
        "code-identifier": identifier,
        "code-keyword": keyword,
        "code-keyword-type": keyword && type,
        "code-literal": literal,
        "code-number-literal": literal === "number",
        "code-operator": operator,
        "code-private-identifier": identifier === "private",
        "code-string-literal": literal === "string",
        "code-type": type,
        "code-unknown": unknown,
      })}
    >
      {text ?? children}
    </Container>
  );
}

interface CodeWordProps {
  children?: ReactNode;
  className?: string;
}

function CodeWord({ className, children }: CodeWordProps): JSX.Element {
  return (
    <span className="code-word-spacing">
      <span className="code-word-spacing-space"> </span>
      <span className={className}>{children}</span>
    </span>
  );
}
