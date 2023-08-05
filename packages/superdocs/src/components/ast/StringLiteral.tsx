import clsx from "clsx";
import { ReactNode } from "react";
import { CodeWord } from "./Word";

/**
 * Properties for the {@link StringLiteral} component.
 * @group Components
 */
export interface StringLiteralProps {
  children?: ReactNode;
  className?: string;
  text?: string;
}

/**
 * Formats a string literal in code.
 * @group Components
 */
export function StringLiteral({
  children,
  className,
  text,
}: StringLiteralProps): JSX.Element {
  return (
    <>
      <CodeWord className={clsx(className, "code-string-literal")}>
        {text ?? children}
      </CodeWord>
    </>
  );
}
