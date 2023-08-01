import colors from "tailwindcss/colors";
import plugin from "tailwindcss/plugin";

const superdocsPlugin = plugin(
  ({ addUtilities }) => {
    addUtilities({
      ".code-word-spacing-space": {
        display: "none",
      },
      ".code-word-spacing + .code-word-spacing > .code-word-spacing-space": {
        display: "inline",
      },
      ".code-unknown": {
        textDecoration: "underline",
        textDecorationStyle: "dotted",
      },
    });
  },
  {
    theme: {
      extend: {
        colors: {
          code: {
            keyword: colors.red[500],
            "keyword-type": colors.red[500],
            "literal-type": colors.blue[700],
            operator: colors.zinc[400],
          },
        },
      },
    },
  },
);

export default superdocsPlugin;
