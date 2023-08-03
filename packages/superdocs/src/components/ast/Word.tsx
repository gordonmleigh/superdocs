import { ReactNode } from "react";

export interface CodeWordProps {
  children?: ReactNode;
  className?: string;
}

export function CodeWord({ className, children }: CodeWordProps): JSX.Element {
  return (
    <span className="code-word-spacing">
      <span className="code-word-spacing-space"> </span>
      <span className={className}>{children}</span>
    </span>
  );
}
