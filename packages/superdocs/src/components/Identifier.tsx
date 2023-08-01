import clsx from "clsx";
import ts from "typescript";
import { CodeWord } from "./Word";

/**
 * Properties for the {@link Identifier} component.
 * @group Components
 */
export interface IdentifierProps {
  className?: string;
  name?: string | ts.EntityName;
}

/**
 * Formats a Identifier in code.
 * @group Components
 */
export function Identifier({ className, name }: IdentifierProps): JSX.Element {
  const text = name && normaliseName(name);
  return (
    <>
      <CodeWord className={clsx(className, "text-code-identifier")}>
        {text}
      </CodeWord>
    </>
  );
}

export function normaliseName(name: string | ts.EntityName): string {
  if (typeof name === "string") {
    return name;
  }
  const id: string[] = [];

  for (let curr = name; ; ) {
    if (ts.isQualifiedName(curr)) {
      id.unshift(curr.right.text);
      curr = curr.left;
    } else {
      id.unshift(curr.text);
      break;
    }
  }
  return id.join(".");
}
