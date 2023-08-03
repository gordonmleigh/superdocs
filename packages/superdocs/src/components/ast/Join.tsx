import { Fragment, ReactNode } from "react";

/**
 * Properties for {@link Join} component.
 * @group Components
 */
export interface JoinProps<T> {
  delimiter: ReactNode;
  items: readonly T[];
  render: (item: T, index: number) => ReactNode;
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
  for (let index = 0; index < items.length; ++index) {
    if (children.length) {
      children.push(<Fragment key={children.length}>{delimiter}</Fragment>);
    }
    children.push(
      <Fragment key={children.length}>{render(items[index], index)}</Fragment>,
    );
  }
  return <>{children}</>;
}
