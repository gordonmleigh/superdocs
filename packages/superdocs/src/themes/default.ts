import { PluginUtils } from "tailwindcss/types/config";
import { SuperdocsTheme } from "../core/theme";
import { themeFontSize } from "../internal/themeFontSize";

export function defaultTheme({ theme }: PluginUtils): SuperdocsTheme {
  const fontSize = themeFontSize(theme);

  return {
    base: {
      "--tw-superdocs-color-token-base": theme("colors.zinc.900"),
      "--tw-superdocs-color-token-literal": theme("colors.blue.700"),
      "--tw-superdocs-color-token-keyword": theme("colors.red.500"),
      "--tw-superdocs-color-token-comment": theme("colors.zinc.400"),
      "--tw-superdocs-color-token-deleted": theme("colors.red.500"),
      "--tw-superdocs-color-token-inserted": theme("colors.green.500"),
      "--tw-superdocs-color-token-operator": theme("colors.zinc.400"),
      "--tw-superdocs-color-token-unknown-underline": theme("colors.blue.600"),

      "--tw-superdocs-color-token-atrule":
        "var(--tw-superdocs-color-token-keyword)",
      "--tw-superdocs-color-token-attr-name":
        "var(--tw-superdocs-color-token-identifier)",
      "--tw-superdocs-color-token-attr-value":
        "var(--tw-superdocs-color-token-literal)",
      "--tw-superdocs-color-token-bold": "var(--tw-superdocs-color-token-base)",
      "--tw-superdocs-color-token-boolean":
        "var(--tw-superdocs-color-token-keyword)",
      "--tw-superdocs-color-token-builtin":
        "var(--tw-superdocs-color-token-keyword)",
      "--tw-superdocs-color-token-cdata":
        "var(--tw-superdocs-color-token-comment)",
      "--tw-superdocs-color-token-char":
        "var(--tw-superdocs-color-token-literal)",
      "--tw-superdocs-color-token-class-name":
        "var(--tw-superdocs-color-token-identifier)",
      "--tw-superdocs-color-token-constant":
        "var(--tw-superdocs-color-token-identifier)",
      "--tw-superdocs-color-token-doctype":
        "var(--tw-superdocs-color-token-comment)",
      "--tw-superdocs-color-token-entity":
        "var(--tw-superdocs-color-token-identifier)",
      "--tw-superdocs-color-token-function":
        "var(--tw-superdocs-color-token-identifier)",
      "--tw-superdocs-color-token-identifier":
        "var(--tw-superdocs-color-token-base)",
      "--tw-superdocs-color-token-important":
        "var(--tw-superdocs-color-token-keyword)",
      "--tw-superdocs-color-token-italic":
        "var(--tw-superdocs-color-token-base)",
      "--tw-superdocs-color-token-namespace":
        "var(--tw-superdocs-color-token-identifier)",
      "--tw-superdocs-color-token-number":
        "var(--tw-superdocs-color-token-literal)",
      "--tw-superdocs-color-token-prolog":
        "var(--tw-superdocs-color-token-comment)",
      "--tw-superdocs-color-token-property":
        "var(--tw-superdocs-color-token-identifier)",
      "--tw-superdocs-color-token-punctuation":
        "var(--tw-superdocs-color-token-operator)",
      "--tw-superdocs-color-token-regex":
        "var(--tw-superdocs-color-token-literal)",
      "--tw-superdocs-color-token-selector":
        "var(--tw-superdocs-color-token-identifier)",
      "--tw-superdocs-color-token-string":
        "var(--tw-superdocs-color-token-literal)",
      "--tw-superdocs-color-token-symbol":
        "var(--tw-superdocs-color-token-identifier)",
      "--tw-superdocs-color-token-tag":
        "var(--tw-superdocs-color-token-identifier)",
      "--tw-superdocs-color-token-unknown":
        "var(--tw-superdocs-color-token-base)",
      "--tw-superdocs-color-token-url": "var(--tw-superdocs-color-token-base)",
      "--tw-superdocs-color-token-variable":
        "var(--tw-superdocs-color-token-identifier)",

      "--tw-superdocs-color-code-background": theme("colors.zinc.100"),
      "--tw-superdocs-color-code-border": theme("colors.zinc.200"),
      "--tw-superdocs-color-tooltip-background": theme("colors.zinc.100"),
      "--tw-superdocs-color-tooltip-border": theme("colors.zinc.200"),

      "--tw-superdocs-color-text": theme("colors.zinc.900"),

      "--tw-superdocs-line-height": "1.75",
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

      "code:not(pre > code)": {
        backgroundColor: "var(--tw-superdocs-color-code-background)",
        borderColor: "var(--tw-superdocs-color-code-border)",
        borderRadius: theme("borderRadius.DEFAULT"),
        borderStyle: "solid",
        borderWidth: "1px",
        color: "var(--tw-superdocs-color-code)",
        fontSize: "var(--tw-superdocs-font-size-sm)",
        padding: theme("spacing.1"),
      },

      "pre[class*=language-], code.block": {
        backgroundColor: "var(--tw-superdocs-color-code-background)",
        borderColor: "var(--tw-superdocs-color-code-border)",
        borderRadius: theme("borderRadius.DEFAULT"),
        borderStyle: "solid",
        borderWidth: "1px",
        color: "var(--tw-superdocs-color-code)",
        fontSize: "var(--tw-superdocs-font-size-sm)",
        marginBottom: theme("spacing.4"),
        marginTop: theme("spacing.4"),
        padding: theme("spacing.4"),
      },

      ".declaration-code-link": {
        color: theme("colors.zinc.500"),
        fontSize: "var(--tw-superdocs-font-size-sm)",
        fontWeight: theme("fontWeight.light"),
      },

      "a.declaration-code-link:hover": {
        textDecoration: "underline",
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

      ".tooltip": {
        backgroundColor: "var(--tw-superdocs-color-tooltip-background)",
        borderColor: "var(--tw-superdocs-color-tooltip-border)",
        borderRadius: theme("borderRadius.DEFAULT"),
        borderStyle: "solid",
        borderWidth: "1px",
        fontSize: "var(--tw-superdocs-font-size-sm)",
        padding: theme("spacing.1"),
      },

      ".token": {
        color: "var(--tw-superdocs-color-token-base)",

        "&.atrule": {
          color: "var(--tw-superdocs-color-token-atrule)",
        },
        "&.attr-name": {
          color: "var(--tw-superdocs-color-token-attr-name)",
        },
        "&.attr-value": {
          color: "var(--tw-superdocs-color-token-attr-value)",
        },
        "&.bold": {
          color: "var(--tw-superdocs-color-token-bold)",
        },
        "&.boolean": {
          color: "var(--tw-superdocs-color-token-boolean)",
        },
        "&.builtin": {
          color: "var(--tw-superdocs-color-token-builtin)",
        },
        "&.cdata": {
          color: "var(--tw-superdocs-color-token-cdata)",
        },
        "&.char": {
          color: "var(--tw-superdocs-color-token-char)",
        },
        "&.class-name": {
          color: "var(--tw-superdocs-color-token-class-name)",
        },
        "&.comment": {
          color: "var(--tw-superdocs-color-token-comment)",
        },
        "&.constant": {
          color: "var(--tw-superdocs-color-token-constant)",
        },
        "&.deleted": {
          color: "var(--tw-superdocs-color-token-deleted)",
        },
        "&.doctype": {
          color: "var(--tw-superdocs-color-token-doctype)",
        },
        "&.entity": {
          color: "var(--tw-superdocs-color-token-entity)",
        },
        "&.function": {
          color: "var(--tw-superdocs-color-token-function)",
        },
        "&.identifier": {
          color: "var(--tw-superdocs-color-token-identifier)",
        },
        "&.important": {
          color: "var(--tw-superdocs-color-token-important)",
        },
        "&.inserted": {
          color: "var(--tw-superdocs-color-token-inserted)",
        },
        "&.italic": {
          color: "var(--tw-superdocs-color-token-italic)",
        },
        "&.keyword": {
          color: "var(--tw-superdocs-color-token-keyword)",
        },
        "&.literal": {
          color: "var(--tw-superdocs-color-token-literal)",
        },
        "&.namespace": {
          color: "var(--tw-superdocs-color-token-namespace)",
        },
        "&.number": {
          color: "var(--tw-superdocs-color-token-number)",
        },
        "&.operator": {
          color: "var(--tw-superdocs-color-token-operator)",
        },
        "&.prolog": {
          color: "var(--tw-superdocs-color-token-prolog)",
        },
        "&.property": {
          color: "var(--tw-superdocs-color-token-property)",
        },
        "&.punctuation": {
          color: "var(--tw-superdocs-color-token-punctuation)",
        },
        "&.regex": {
          color: "var(--tw-superdocs-color-token-regex)",
        },
        "&.selector": {
          color: "var(--tw-superdocs-color-token-selector)",
        },
        "&.string": {
          color: "var(--tw-superdocs-color-token-string)",
        },
        "&.symbol": {
          color: "var(--tw-superdocs-color-token-symbol)",
        },
        "&.tag": {
          color: "var(--tw-superdocs-color-token-tag)",
        },
        "&.unknown": {
          color: "var(--tw-superdocs-color-token-unknown)",
          textDecoration: "underline",
          textDecorationColor:
            "var(--tw-superdocs-color-token-unknown-underline)",
          textDecorationStyle: "wavy",
        },
        "&.url": {
          color: "var(--tw-superdocs-color-token-url)",
        },
        "&.variable": {
          color: "var(--tw-superdocs-color-token-variable)",
        },
      },
    },

    utilities: {
      ".code-word-spacing-space": {
        display: "none",
      },

      ".code-word-spacing + .code-word-spacing > .code-word-spacing-space": {
        display: "inline",
      },

      ".code-unknown": {
        textDecoration: "underline",
        textDecorationColor: theme("colors.blue.600"),
        textDecorationStyle: "wavy",
      },
    },
  };
}
