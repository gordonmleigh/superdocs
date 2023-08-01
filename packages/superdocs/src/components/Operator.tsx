import clsx from "clsx";

/**
 * Properties for the {@link Operator} component.
 * @group Components
 */
export interface OperatorProps {
  children?: string;
  className?: string;
  text?: string;
}

/**
 * Format an operator in code.
 * @group Components
 */
export function Operator({
  children,
  className,
  text: textProp,
}: OperatorProps): JSX.Element {
  const text = textProp ?? children;
  const spaceLeft = text?.startsWith(" ");
  const spaceRight = text?.endsWith(" ");

  return (
    <>
      {spaceLeft && " "}
      <span className={clsx(className, "text-code-operator")}>
        {text?.trim()}
      </span>
      {spaceRight && " "}
    </>
  );
}
