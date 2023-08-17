import { PluginUtils } from "tailwindcss/types/config";

import { CSSRuleObject, SuperdocsOptions, SuperdocsTheme } from "../core/theme";

export interface IconThemeOptions {
  className?: string;
}

export function defaultIconsTheme(
  _: PluginUtils,
  { iconPrefix: className = "icon" }: SuperdocsOptions = {},
): SuperdocsTheme {
  const blue = "var(--tw-superdocs-color-vs-blue)";
  const orange = "var(--tw-superdocs-color-vs-orange)";
  const purple = "var(--tw-superdocs-color-vs-purple)";

  return {
    components: {
      [`.${className}`]: {
        fontStyle: "normal",
        fontVariant: "normal",
        fontWeight: "normal",
        lineHeight: 1,
        display: "inline-block",
        textDecoration: "none",
        textRendering: "auto",
        textAlign: "center",
        textTransform: "none",
        userSelect: "none",

        ...icons(className, {
          // see https://github.com/microsoft/vscode/blob/719a6a6cdfe132852ab26434e5e80fae16a44941/src/vs/base/common/codicons.ts#L43
          // MIT licensed
          "symbol-array": 0xea8a,
          "symbol-boolean": 0xea8f,
          "symbol-class": [0xeb5b, orange],
          "symbol-color": 0xeb5c,
          "symbol-constant": 0xeb5d,
          "symbol-constructor": [0xea8c, purple],
          "symbol-customcolor": 0xeb5c,
          "symbol-enum-member": [0xeb5e, orange],
          "symbol-enum": [0xea95, orange],
          "symbol-event": 0xea86,
          "symbol-field": 0xeb5f,
          "symbol-file": 0xeb60,
          "symbol-folder": 0xea83,
          "symbol-function": [0xea8c, purple],
          "symbol-interface": [0xeb61, blue],
          "symbol-key": 0xea93,
          "symbol-keyword": 0xeb62,
          "symbol-method": [0xea8c, purple],
          "symbol-misc": 0xeb63,
          "symbol-module": 0xea8b,
          "symbol-namespace": 0xea8b,
          "symbol-null": 0xea8f,
          "symbol-number": 0xea90,
          "symbol-numeric": 0xea90,
          "symbol-object": 0xea8b,
          "symbol-operator": 0xeb64,
          "symbol-package": 0xea8b,
          "symbol-parameter": 0xea92,
          "symbol-property": 0xeb65,
          "symbol-reference": 0xea94,
          "symbol-ruler": 0xea96,
          "symbol-snippet": 0xeb66,
          "symbol-string": 0xeb8d,
          "symbol-struct": 0xea91,
          "symbol-structure": 0xea91,
          "symbol-text": 0xea93,
          "symbol-type-parameter": 0xea92,
          "symbol-unit": 0xea96,
          "symbol-value": 0xea95,
          "symbol-variable": [0xea88, blue],
        }),
      },
    },
  };
}

function icons(
  prefix: string,
  settings: Record<string, number | [number, string]>,
): CSSRuleObject {
  return Object.fromEntries(
    Object.entries(settings).map(([name, spec]) => {
      let codepoint: number;
      let color: string | undefined;
      if (Array.isArray(spec)) {
        [codepoint, color] = spec;
      } else {
        codepoint = spec;
      }
      return [
        `&.${prefix}-${name}`,
        {
          "&::before": {
            content: `"\\${codepoint.toString(16)}"`,
          },

          "&:not(.no-color)": {
            color,
          },
        },
      ];
    }),
  );
}
