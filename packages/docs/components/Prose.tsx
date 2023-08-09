import { polymorphicComponent } from "@/util/polymorphicComponent";
import clsx from "clsx";

export const Prose = polymorphicComponent(
  ({ as: Component = "div", className, ...props }, ref) => (
    <Component
      className={clsx(className, "prose dark:prose-invert")}
      ref={ref}
      {...props}
    />
  ),
);
