import plugin from "tailwindcss/plugin";
import { PluginUtils } from "tailwindcss/types/config";
import { SuperdocsOptions, SuperdocsThemes } from "./core/theme.js";
import { darkTheme } from "./themes/dark.js";
import { defaultIconsTheme } from "./themes/default-icons.js";
import { defaultTheme } from "./themes/default.js";

const superdocsPlugin = plugin.withOptions(
  ({ className = "superdocs" }: SuperdocsOptions = {}) =>
    ({ addBase, addComponents, addUtilities, theme }) => {
      const superdocsTheme = theme("superdocs") as SuperdocsThemes;

      for (const [modifier, config] of Object.entries(superdocsTheme)) {
        const themes = Array.isArray(config) ? config : [config];

        for (const theme of themes) {
          const wrapper =
            modifier === "DEFAULT"
              ? `.${className}`
              : `.${className}-${modifier}`;

          if (theme.base) {
            addBase({
              [wrapper]: theme.base as any,
            });
          }
          if (theme.components) {
            addComponents({
              [wrapper]: theme.components as any,
            });
          }
          if (theme.utilities) {
            addUtilities({
              [wrapper]: theme.utilities as any,
            });
          }
        }
      }
    },
  (opts) => ({
    theme: {
      superdocs: (utils: PluginUtils): SuperdocsThemes => {
        return {
          DEFAULT: [defaultTheme(utils), defaultIconsTheme(utils, opts)],
          dark: darkTheme(utils),
        };
      },
    },
  }),
);

export default superdocsPlugin;
