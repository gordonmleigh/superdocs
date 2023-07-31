import { Fragment, ReactNode } from "react";

/**
 * Properties for {@link Join} component.
 * @group Components
 */
export interface JoinProps<T> {
  delimiter: ReactNode;
  items: readonly T[];
  render: (item: T) => ReactNode;
}

/**
 * Utility component for joining other components with separators.
 * @group Components
 */
export function Join<T>({
  delimiter,
  items,
  render,
}: JoinProps<T>): JSX.Element {
  const children: ReactNode[] = [];
  for (const item of items) {
    if (children.length) {
      children.push(<Fragment key={children.length}>{delimiter}</Fragment>);
    }
    children.push(<Fragment key={children.length}>{render(item)}</Fragment>);
  }
  return <>{children}</>;
}
