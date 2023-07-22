import clsx, { ClassValue } from 'clsx';
import {
  ComponentPropsWithoutRef,
  createElement,
  ElementType,
  ForwardedRef,
  forwardRef,
  ReactElement,
  ReactNode,
} from 'react';

type StylableProps = {
  className?: string;
};

/**
 * Represents a function which computes a style for given props.
 */
type PropsClassValue<Props> = (props: Props) => ClassValue;

/**
 * Represents a styled component.
 */
type StyledComponent<T extends ElementType> =
  T extends keyof JSX.IntrinsicElements
    ? (props: ComponentPropsWithoutRef<T>) => ReactElement
    : (props: ComponentPropsWithoutRef<T>) => ReactNode;

/**
 * Create a styled version of a component, for consistency.
 * @param component A React component, or a string like 'div' or 'input'
 * @param classes Arguments to pass to `clsx` or a function to produce classes from the props
 */
export function styled<T extends ElementType<StylableProps>>(
  component: T,
  ...classes: (ClassValue | PropsClassValue<ComponentPropsWithoutRef<T>>)[]
): StyledComponent<T> {
  const styled = forwardRef(
    (props: ComponentPropsWithoutRef<T>, ref: ForwardedRef<T>) => {
      const { className, ...restProps } = props;

      return createElement(component, {
        className: clsx(
          ...classes.map((x) => (typeof x === 'function' ? x(props) : x)),
          className,
        ),
        ...restProps,
        ref,
      });
    },
  );

  if (typeof component === 'string') {
    styled.displayName = `Styled_${component}`;
  } else if (component.displayName) {
    styled.displayName = `Styled${component.displayName}`;
  } else {
    styled.displayName = 'StyledComponent';
  }

  // the ref will be the same type but typescript can't infer this
  return styled as any;
}
