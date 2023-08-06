import { Fragment, ReactNode } from "react";
import { Token } from "./Token";

/**
 * Properties for {@link Join} component.
 * @group Components
 */
export interface JoinProps<T> {
  delimiter?: ReactNode;
  items: readonly T[];
  operator?: string;
  punctuation?: string;
  render: (item: T, index: number) => ReactNode;
}

/**
 * Utility component for joining other components with separators.
 * @group Components
 */
export function Join<T>({
  delimiter,
  items,
  operator,
  punctuation,
  render,
}: JoinProps<T>): JSX.Element {
  const children: ReactNode[] = [];
  for (let index = 0; index < items.length; ++index) {
    if (children.length) {
      if (delimiter) {
        children.push(<Fragment key={children.length}>{delimiter}</Fragment>);
      } else if (operator ?? punctuation) {
        children.push(
          <Token
            key={children.length}
            text={operator ?? punctuation}
            operator={!!operator}
            punctuation={!!punctuation}
          />,
        );
      }
    }
    children.push(
      <Fragment key={children.length}>{render(items[index], index)}</Fragment>,
    );
  }
  return <>{children}</>;
}
