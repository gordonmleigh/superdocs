import { polymorphicComponent } from '@/util/polymorphicComponent';
import clsx from 'clsx';

export const Prose = polymorphicComponent(
  ({ as: Component = 'div', className, ...props }, ref) => (
    <Component
      className={clsx(className, 'prose prose-slate')}
      ref={ref}
      {...props}
    />
  ),
);
