const darkScript = `(function() {
  const dark = localStorage.theme
  ? localStorage.theme === "dark"
  : window.matchMedia("(prefers-color-scheme: dark)").matches;

  if (dark) {
    document.documentElement.classList.add("[&_*]:!transition-none");
    document.documentElement.classList.add("dark")
    window.setTimeout(() => {
      document.documentElement.classList.remove("[&_*]:!transition-none");
    }, 0);
  }
})();`;

export function DarkModeScript(): JSX.Element {
  return (
    <script
      type="text/javascript"
      dangerouslySetInnerHTML={{ __html: darkScript }}
    />
  );
}
