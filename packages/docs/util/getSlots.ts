import {
  Children,
  ComponentProps,
  ElementType,
  isValidElement,
  ReactElement,
  ReactNode,
} from 'react';

/**
 * Get a ReactElement type for a given ElementType.
 */
export type TypeToElement<T extends ElementType> = ReactElement<
  ComponentProps<T>,
  T
>;

/**
 * Map an array of ElementType types to an array of ReactElement types.
 */
export type TypesToElements<Types extends ElementType[]> = {
  [Index in keyof Types]: TypeToElement<Types[Index]> | undefined;
};

/**
 * Get a list of elements with specific slot types.
 */
export function getSlots<T extends ElementType[]>(
  children: ReactNode,
  ...types: T
): [...TypesToElements<T>, ...ReactNode[]] {
  const childrenArray = Children.toArray(children);

  // map each type to a matching element
  const mappedChildren = types.map((type) =>
    childrenArray.find((child) => isValidElement(child) && child.type === type),
  );

  // get a list of unmapped children
  const restChildren = childrenArray.filter(
    (child) => !isValidElement(child) || !types.includes(child.type as any),
  );

  return [...mappedChildren, ...restChildren] as any;
}
