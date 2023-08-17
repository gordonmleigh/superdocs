import clsx from "clsx";
import localFont from "next/font/local";
import ts from "typescript";

const codicon = localFont({
  src: "../../static/codicon.woff",
  display: "block",
});

/**
 * Properties for the {@link SymbolIcon} component.
 *
 * @group Components
 */
export interface SymbolIconProps {
  node: ts.Node;
  noColor?: boolean;
}

/**
 * Render an icon to represent the given {@link ts.Node}.
 *
 * @group Components
 */
export function SymbolIcon({ node, noColor }: SymbolIconProps): JSX.Element {
  let className: string;
  if (ts.isClassDeclaration(node)) {
    className = "icon-symbol-class";
  } else if (
    ts.isConstructorDeclaration(node) ||
    ts.isConstructSignatureDeclaration(node)
  ) {
    className = "icon-symbol-constructor";
  } else if (
    ts.isVariableDeclaration(node) &&
    node.parent.flags & ts.NodeFlags.Const
  ) {
    className = "icon-symbol-constant";
  } else if (ts.isEnumDeclaration(node)) {
    className = "icon-symbol-enum";
  } else if (ts.isEnumMember(node)) {
    className = "icon-symbol-enum-member";
  } else if (ts.isFunctionDeclaration(node)) {
    className = "icon-symbol-function";
  } else if (ts.isInterfaceDeclaration(node)) {
    className = "icon-symbol-interface";
  } else if (ts.isMethodDeclaration(node) || ts.isMethodSignature(node)) {
    className = "icon-symbol-method";
  } else if (ts.isParameter(node)) {
    className = "icon-symbol-parameter";
  } else if (ts.isPropertySignature(node) || ts.isAccessor(node)) {
    className = "icon-symbol-property";
  } else if (
    ts.isVariableDeclaration(node) &&
    !(node.parent.flags & ts.NodeFlags.Const)
  ) {
    className = "icon-symbol-variable";
  } else {
    className = "icon-symbol-misc";
  }
  return (
    <i
      className={clsx(
        "icon",
        codicon.className,
        className,
        noColor && "no-color",
      )}
    />
  );
}
