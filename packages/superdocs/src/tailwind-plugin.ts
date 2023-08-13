import plugin from "tailwindcss/plugin";
import { PluginUtils } from "tailwindcss/types/config";
import { SuperdocsThemes } from "./core/theme.js";
import { darkTheme } from "./themes/dark.js";
import { defaultTheme } from "./themes/default.js";

/**
 * The options for the superdocs plugin.
 * @group Plugin
 */
export interface SuperdocsOptions {
  /**
   * The CSS class name, under which all of the other styles are defined.
   * Defaults to `"superdocs"`.
   */
  className?: string;
}

const superdocsPlugin = plugin.withOptions(
  ({ className = "superdocs" }: SuperdocsOptions = {}) =>
    ({ addBase, addComponents, addUtilities, theme }) => {
      const superdocsTheme = theme("superdocs") as SuperdocsThemes;

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
      superdocs: (utils: PluginUtils): SuperdocsThemes => {
        return {
          DEFAULT: defaultTheme(utils),
          dark: darkTheme(utils),
        };
      },
    },
  }),
);

export default superdocsPlugin;
