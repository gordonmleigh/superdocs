import clsx from "clsx";
import { ReactNode } from "react";

/**
 * Properties for the {@link Keyword} component.
 * @group Components
 */
export interface KeywordProps {
  children?: ReactNode;
  className?: string;
  text?: string;
}

/**
 * Formats a keyword in code.
 * @group Components
 */
export function Keyword({
  children,
  className,
  text,
}: KeywordProps): JSX.Element {
  return (
    <>
      {" "}
      <span className={clsx(className, "text-code-keyword")}>
        {text ?? children}
      </span>{" "}
    </>
  );
}
