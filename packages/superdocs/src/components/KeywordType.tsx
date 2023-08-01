import clsx from "clsx";
import { ReactNode } from "react";
import { CodeWord } from "./Word";

/**
 * Properties for the {@link KeywordType} component.
 * @group Components
 */
export interface KeywordTypeProps {
  children?: ReactNode;
  className?: string;
  text?: string;
}

/**
 * Formats a keyword type in code.
 * @group Components
 */
export function KeywordType({
  children,
  className,
  text,
}: KeywordTypeProps): JSX.Element {
  return (
    <>
      <CodeWord className={clsx(className, "text-code-keyword-type")}>
        {text ?? children}
      </CodeWord>
    </>
  );
}
