module.exports = ({ theme }) => ({
  DEFAULT: {
    css: {
      "--tw-prose-body": theme("colors.zinc.700"),
      "--tw-prose-headings": theme("colors.zinc.900"),
      "--tw-prose-links": theme("colors.emerald.500"),
      "--tw-prose-links-hover": theme("colors.emerald.600"),
      "--tw-prose-links-underline": theme("colors.emerald.500 / 0.3"),
      "--tw-prose-bold": theme("colors.zinc.900"),
      "--tw-prose-counters": theme("colors.zinc.500"),
      "--tw-prose-bullets": theme("colors.zinc.300"),
      "--tw-prose-hr": theme("colors.zinc.900 / 0.05"),
      "--tw-prose-quotes": theme("colors.zinc.900"),
      "--tw-prose-quote-borders": theme("colors.zinc.200"),
      "--tw-prose-captions": theme("colors.zinc.500"),
      "--tw-prose-code": theme("colors.zinc.900"),
      "--tw-prose-code-bg": theme("colors.zinc.100"),
      "--tw-prose-code-ring": theme("colors.zinc.300"),
      "--tw-prose-th-borders": theme("colors.zinc.300"),
      "--tw-prose-td-borders": theme("colors.zinc.200"),

      h1: {
        fontWeight: "600",
      },
      "code::after": {
        content: "none",
      },
      "code::before": {
        content: "none",
      },
      "a code:hover": {
        backgroundColor: theme("colors.amber.50"),
      },
      "a:has(code)": {
        textDecoration: "none",
      },
      pre: {
        backgroundColor: "transparent",
        color: "unset",
        margin: 0,
        padding: 0,
      },
      code: {
        fontWeight: "unset",
      },
    },
  },

  invert: {
    css: {
      "--tw-prose-body": theme("colors.zinc.400"),
      "--tw-prose-headings": theme("colors.white"),
      "--tw-prose-links": theme("colors.emerald.400"),
      "--tw-prose-links-hover": theme("colors.emerald.500"),
      "--tw-prose-links-underline": theme("colors.emerald.500 / 0.3"),
      "--tw-prose-bold": theme("colors.white"),
      "--tw-prose-counters": theme("colors.zinc.400"),
      "--tw-prose-bullets": theme("colors.zinc.600"),
      "--tw-prose-hr": theme("colors.white / 0.05"),
      "--tw-prose-quotes": theme("colors.zinc.100"),
      "--tw-prose-quote-borders": theme("colors.zinc.700"),
      "--tw-prose-captions": theme("colors.zinc.400"),
      "--tw-prose-code": theme("colors.white"),
      "--tw-prose-code-bg": theme("colors.zinc.700 / 0.15"),
      "--tw-prose-code-ring": theme("colors.white / 0.1"),
      "--tw-prose-th-borders": theme("colors.zinc.600"),
      "--tw-prose-td-borders": theme("colors.zinc.700"),
    },
  },
});
