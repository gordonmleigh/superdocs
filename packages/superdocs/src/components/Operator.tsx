import clsx from "clsx";
import { ReactNode } from "react";

/**
 * Properties for the {@link Operator} component.
 * @group Components
 */
export interface OperatorProps {
  children?: ReactNode;
  className?: string;
  spaceAround?: boolean;
  spaceLeft?: boolean;
  spaceRight?: boolean;
  text?: string;
}

/**
 * Format an operator in code.
 * @group Components
 */
export function Operator({
  children,
  className,
  spaceAround,
  spaceLeft = spaceAround,
  spaceRight = spaceAround,
  text,
}: OperatorProps): JSX.Element {
  return (
    <>
      {spaceLeft && " "}
      <span className={clsx(className, "text-code-operator")}>
        {text ?? children}
      </span>
      {spaceRight && " "}
    </>
  );
}
