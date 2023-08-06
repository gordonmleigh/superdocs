import { PluginUtils } from "tailwindcss/types/config";
import { SuperdocsTheme } from "../core/theme";
import { themeFontSize } from "../internal/themeFontSize";

export function darkTheme({ theme }: PluginUtils): SuperdocsTheme {
  const fontSize = themeFontSize(theme);

  return {
    base: {
      "--tw-superdocs-color-code-background": theme("colors.zinc.900"),
      "--tw-superdocs-color-code-border": theme("colors.zinc.800"),

      "--tw-superdocs-color-token-base": theme("colors.zinc.100"),
      "--tw-superdocs-color-token-literal": theme("colors.cyan.500"),
      "--tw-superdocs-color-token-keyword": theme("colors.red.500"),
      "--tw-superdocs-color-token-comment": theme("colors.zinc.400"),
      "--tw-superdocs-color-token-deleted": theme("colors.red.500"),
      "--tw-superdocs-color-token-inserted": theme("colors.green.500"),
      "--tw-superdocs-color-token-operator": theme("colors.zinc.400"),

      "--tw-superdocs-color-text": theme("colors.zinc.100"),
      "--tw-superdocs-font-size-sm": fontSize("sm").fontSize,
      "--tw-superdocs-font-size-base": fontSize("base").fontSize,
      "--tw-superdocs-font-size-lg": fontSize("lg").fontSize,
      "--tw-superdocs-font-size-xl": fontSize("xl").fontSize,
      "--tw-superdocs-font-size-2xl": fontSize("2xl").fontSize,
    },
  };
}
