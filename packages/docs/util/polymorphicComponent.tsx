import {
  ComponentPropsWithRef,
  ComponentPropsWithoutRef,
  ElementType,
  ReactNode,
  forwardRef,
} from 'react';

export type PolymorphicComponentPropsWithoutRef<As extends ElementType> = {
  as?: As;
} & ComponentPropsWithoutRef<As>;

export type PolymorphicComponentPropsWithRef<As extends ElementType> =
  PolymorphicComponentPropsWithoutRef<As> & { ref?: RefFor<As> };

export type RefFor<T extends ElementType> = ComponentPropsWithRef<T>['ref'];

export type PolymorphicComponentRenderFunction<Props> = <
  As extends ElementType,
>(
  props: Props & ComponentPropsWithoutRef<As> & { as: As },
  ref: RefFor<As>,
) => ReactNode;

export type PolymorphicComponent<Props, DefaultAs extends ElementType> = <
  As extends ElementType = DefaultAs,
>(
  props: Props & PolymorphicComponentPropsWithRef<As>,
) => ReactNode;

export function polymorphicComponent<
  Props,
  DefaultAs extends ElementType = 'div',
>(
  render: PolymorphicComponentRenderFunction<Props>,
): PolymorphicComponent<Props, DefaultAs> {
  // eslint-disable-next-line react/display-name
  return forwardRef(render);
}
