import plugin from "tailwindcss/plugin";

const superdocsKitPlugin = plugin(({ addVariant }) => {
  addVariant("nav-item", ["& > li", "& > li > ul > li"]);
  addVariant("nav-link", ["& > li > a", " & > li > ul > li > a"]);
  addVariant("nav-submenu", "& > li > ul");
});

export default superdocsKitPlugin;
