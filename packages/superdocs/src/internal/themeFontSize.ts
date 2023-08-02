import { CSSProperties } from "react";
import { PluginUtils } from "tailwindcss/types/config";

export function themeFontSize(
  theme: PluginUtils["theme"],
): (
  key: string,
) => Pick<
  CSSProperties,
  "fontSize" | "fontWeight" | "letterSpacing" | "lineHeight"
> {
  return (key) => {
    const value = theme(`fontSize.${key}`);
    if (Array.isArray(value)) {
      const fontSize = value[0];
      let others = value[1];

      if (typeof others !== "object") {
        others = {
          lineHeight: others,
        };
      }

      return {
        fontSize,
        ...others,
      };
    }
  };
}
