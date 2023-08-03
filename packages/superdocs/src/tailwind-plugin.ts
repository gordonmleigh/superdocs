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
              "--tw-superdocs-color-code-keyword": theme("colors.red.500"),
              "--tw-superdocs-color-code-keyword-type": theme("colors.red.500"),
              "--tw-superdocs-color-code-literal-type":
                theme("colors.blue.700"),
              "--tw-superdocs-color-code-operator": theme("colors.zinc.400"),
              "--tw-superdocs-font-size-sm": fontSize("sm").fontSize,
              "--tw-superdocs-font-size-base": fontSize("base").fontSize,
              "--tw-superdocs-font-size-lg": fontSize("lg").fontSize,
              "--tw-superdocs-font-size-xl": fontSize("xl").fontSize,
              "--tw-superdocs-font-size-2xl": fontSize("2xl").fontSize,
            },

            components: {
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
                color: "var(--tw-superdocs-color-code-literal-type)",
              },

              ".code-operator": {
                color: "var(--tw-superdocs-color-code-operator)",
              },

              ".declaration": {
                marginBottom: theme("spacing.28"),
              },

              ".declaration-child": {
                marginBottom: theme("spacing.8"),
              },

              ".declaration-code": {
                backgroundColor: theme("colors.zinc.100"),
                borderColor: theme("colors.zinc.200"),
                borderRadius: theme("borderRadius.DEFAULT"),
                borderStyle: "solid",
                borderWidth: "1px",
                display: "block",
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

              "a.declaration-code-link": {
                textDecoration: "underline",
              },

              ".declaration-heading": {
                fontSize: "var(--tw-superdocs-font-size-2xl)",
                fontWeight: theme("fontWeight.semibold"),
              },

              ".declaration-members": {
                marginTop: theme("spacing.8"),
              },

              ".declaration-subheading": {
                fontSize: "var(--tw-superdocs-font-size-xl)",
                fontWeight: theme("fontWeight.semibold"),
              },

              ".declaration-subsubheading": {
                fontSize: "var(--tw-superdocs-font-size-lg)",
                fontWeight: theme("fontWeight.semibold"),
              },

              ".jsdoc-code-link": {
                backgroundColor: theme("colors.zinc.100"),
                borderColor: theme("colors.zinc.200"),
                borderRadius: theme("borderRadius.DEFAULT"),
                borderStyle: "solid",
                borderWidth: "1px",
                fontSize: "var(--tw-superdocs-font-size-sm)",
                padding: theme("spacing.1"),

                "&:hover": {
                  textDecoration: "underline",
                },
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
                textDecorationStyle: "dotted",
              },
            },
          },
        };
      },
    },
  }),
);

export default superdocsPlugin;
