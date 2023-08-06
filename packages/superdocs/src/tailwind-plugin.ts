import { CSSProperties } from "react";
import plugin from "tailwindcss/plugin";
import { PluginUtils } from "tailwindcss/types/config";
import { themeFontSize } from "./internal/themeFontSize";

export interface CSSRuleObject {
  [selector: string]:
    | CSSProperties[keyof CSSProperties]
    | CSSProperties
    | CSSRuleObject;
}

type CSSFontSize = CSSProperties["fontSize"];

export interface SuperdocsFontSizes {
  sm?: CSSFontSize;
  base?: CSSFontSize;
  lg?: CSSFontSize;
  xl?: CSSFontSize;
}

export interface SuperdocsOptions {
  className?: string;
}

export interface SuperdocsTheme {
  [key: string]: {
    base?: CSSRuleObject;
    components?: CSSRuleObject;
    utilities?: CSSRuleObject;
  };
}

const superdocsPlugin = plugin.withOptions(
  ({ className = "superdocs" }: SuperdocsOptions = {}) =>
    ({ addBase, addComponents, addUtilities, theme }) => {
      const superdocsTheme = theme("superdocs") as SuperdocsTheme;

      for (const [modifier, config] of Object.entries(superdocsTheme)) {
        if (config.base) {
          const wrapper =
            modifier === "DEFAULT"
              ? `.${className}`
              : `.${className}-${modifier}`;

          addBase({
            [wrapper]: config.base as any,
          });
        }
      }

      for (const [modifier, config] of Object.entries(superdocsTheme)) {
        if (config.components) {
          const wrapper =
            modifier === "DEFAULT"
              ? `.${className}`
              : `.${className}-${modifier}`;

          addComponents({
            [wrapper]: config.components as any,
          });
        }
      }

      for (const [modifier, config] of Object.entries(superdocsTheme)) {
        if (config.utilities) {
          const wrapper =
            modifier === "DEFAULT"
              ? `.${className}`
              : `.${className}-${modifier}`;

          addUtilities({
            [wrapper]: config.utilities as any,
          });
        }
      }
    },
  () => ({
    theme: {
      superdocs: ({ theme }: PluginUtils): SuperdocsTheme => {
        const fontSize = themeFontSize(theme);
        return {
          DEFAULT: {
            base: {
              "--tw-superdocs-color-code-background": theme("colors.zinc.100"),
              "--tw-superdocs-color-code-border": theme("colors.zinc.200"),
              "--tw-superdocs-color-code-popup-background":
                theme("colors.zinc.100"),
              "--tw-superdocs-color-code-popup-border":
                theme("colors.zinc.300"),
              "--tw-superdocs-color-code": theme("colors.zinc.900"),
              "--tw-superdocs-color-code-keyword": theme("colors.red.500"),
              "--tw-superdocs-color-code-keyword-type": theme("colors.red.500"),
              "--tw-superdocs-color-code-literal": theme("colors.blue.700"),
              "--tw-superdocs-color-code-operator": theme("colors.zinc.400"),
              "--tw-superdocs-color-declaration-members-border":
                theme("colors.zinc.100"),
              "--tw-superdocs-color-text": theme("colors.zinc.900"),
              "--tw-superdocs-font-size-sm": fontSize("sm").fontSize,
              "--tw-superdocs-font-size-base": fontSize("base").fontSize,
              "--tw-superdocs-font-size-lg": fontSize("lg").fontSize,
              "--tw-superdocs-font-size-xl": fontSize("xl").fontSize,
              "--tw-superdocs-font-size-2xl": fontSize("2xl").fontSize,
            },

            components: {
              "&": {
                color: "var(--tw-superdocs-color-text)",
              },

              ".code-identifier": {
                a: {
                  textDecoration: "underline",
                },
              },

              ".code-keyword": {
                color: "var(--tw-superdocs-color-code-keyword)",
              },

              ".code-keyword-type": {
                color: "var(--tw-superdocs-color-code-keyword-type)",
              },

              ".code-literal-type": {
                color: "var(--tw-superdocs-color-code-literal)",
              },

              ".code-operator": {
                color: "var(--tw-superdocs-color-code-operator)",
              },

              ".code-string-literal": {
                color: "var(--tw-superdocs-color-code-literal)",
              },

              ".declaration-code": {
                backgroundColor: "var(--tw-superdocs-color-code-background)",
                borderColor: "var(--tw-superdocs-color-code-border)",
                borderRadius: theme("borderRadius.DEFAULT"),
                borderStyle: "solid",
                borderWidth: "1px",
                color: "var(--tw-superdocs-color-code)",
                display: "block",
                fontSize: "var(--tw-superdocs-font-size-sm)",
                marginBottom: theme("spacing.4"),
                marginTop: theme("spacing.4"),
                padding: theme("spacing.2"),
              },

              ".declaration-code-popup": {
                backgroundColor:
                  "var(--tw-superdocs-color-code-popup-background)",
                borderColor: "var(--tw-superdocs-color-code-popup-border)",
                borderRadius: theme("borderRadius.DEFAULT"),
                borderStyle: "solid",
                borderWidth: "1px",
                color: "var(--tw-superdocs-color-code)",
                display: "none",
                fontSize: "var(--tw-superdocs-font-size-sm)",
                marginBottom: theme("spacing.4"),
                marginTop: theme("spacing.4"),
                padding: theme("spacing.2"),
              },

              ".declaration-code-link": {
                color: theme("colors.zinc.500"),
                fontSize: "var(--tw-superdocs-font-size-sm)",
                fontWeight: theme("fontWeight.light"),
              },

              "a.declaration-code-link:hover": {
                textDecoration: "underline",
              },

              ".declaration-description": {
                maxWidth: "65ch",
              },

              ".declaration-heading": {
                fontSize: "var(--tw-superdocs-font-size-2xl)",
                fontWeight: theme("fontWeight.semibold"),
              },

              ".declaration-child": {
                ".declaration-heading": {
                  fontSize: "var(--tw-superdocs-font-size-lg)",
                  fontWeight: theme("fontWeight.semibold"),
                },
              },

              ".jsdoc-code-link": {
                backgroundColor: "var(--tw-superdocs-color-code-background)",
                borderColor: "var(--tw-superdocs-color-code-border)",
                borderRadius: theme("borderRadius.DEFAULT"),
                borderStyle: "solid",
                borderWidth: "1px",
                color: "var(--tw-superdocs-color-code)",
                fontSize: "var(--tw-superdocs-font-size-sm)",
                padding: theme("spacing.1"),
              },
            },

            utilities: {
              ".code-word-spacing-space": {
                display: "none",
              },

              ".code-word-spacing + .code-word-spacing > .code-word-spacing-space":
                {
                  display: "inline",
                },

              ".code-unknown": {
                textDecoration: "underline",
                textDecorationColor: theme("colors.blue.600"),
                textDecorationStyle: "wavy",
              },
            },
          },

          dark: {
            base: {
              "--tw-superdocs-color-code-background": theme("colors.zinc.900"),
              "--tw-superdocs-color-code-border": theme("colors.zinc.800"),
              "--tw-superdocs-color-code-popup-background":
                theme("colors.zinc.900"),
              "--tw-superdocs-color-code-popup-border":
                theme("colors.zinc.800"),
              "--tw-superdocs-color-code": theme("colors.zinc.100"),
              "--tw-superdocs-color-code-keyword": theme("colors.red.500"),
              "--tw-superdocs-color-code-keyword-type": theme("colors.red.500"),
              "--tw-superdocs-color-code-literal": theme("colors.cyan.500"),
              "--tw-superdocs-color-code-operator": theme("colors.zinc.400"),
              "--tw-superdocs-color-declaration-members-border":
                theme("colors.zinc.100"),
              "--tw-superdocs-color-text": theme("colors.zinc.100"),
              "--tw-superdocs-font-size-sm": fontSize("sm").fontSize,
              "--tw-superdocs-font-size-base": fontSize("base").fontSize,
              "--tw-superdocs-font-size-lg": fontSize("lg").fontSize,
              "--tw-superdocs-font-size-xl": fontSize("xl").fontSize,
              "--tw-superdocs-font-size-2xl": fontSize("2xl").fontSize,
            },
          },
        };
      },
    },
  }),
);

export default superdocsPlugin;
