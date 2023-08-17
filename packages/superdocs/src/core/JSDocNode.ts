import ts from "typescript";

/**
 * The union of valid AST nodes within a JSDoc.
 *
 * @group Utilities
 */
export type JSDocNode = ts.JSDoc | ts.JSDocTag | ts.JSDocComment | string;

/**
 * Get an array of {@link ts.JSDocTag} elements by name, selected by the name of
 * the tag.
 *
 * @group Utilities
 */
export function getJSDocTagsByName(
  node: ts.Node,
  name: string,
): readonly ts.JSDocTag[] {
  return ts.getAllJSDocTags(
    node,
    (tag): tag is ts.JSDocTag => tag.tagName.text === name,
  );
}

/**
 * Returns true if the named tag is present in the JSDoc content for the given
 * node.
 *
 * @group Utilities
 */
export function hasJSDocTag(node: ts.Node, name: string): boolean {
  return !!getJSDocTagsByName(node, name).length;
}

/**
 * Get the combined contents of {@link ts.JSDocTag} elements, selected by the
 * name of the tag.
 *
 * @group Utilities
 */
export function getJSDocTagContentByName(
  node: ts.Node,
  name: string,
): readonly JSDocNode[] | undefined {
  const tags = getJSDocTagsByName(node, name).reduce(
    (a, x) => (x.comment ? a.concat(x.comment) : a),
    [] as readonly JSDocNode[],
  );
  return tags.length ? tags : undefined;
}

/**
 * Returns true if the node is a {@link ts.JSDocText}.
 *
 * @group Utilities
 */
export function isJSDocText(x: ts.Node): x is ts.JSDocText {
  return x.kind === ts.SyntaxKind.JSDocText;
}

/**
 * Returns true if the node is a JSDoc node that has a `comment` property.
 *
 * @group Utilities
 */
export function isJSDocNodeWithComment(
  x: ts.Node,
): x is ts.JSDoc | ts.JSDocParameterTag | ts.JSDocSeeTag {
  return ts.isJSDoc(x) || ts.isJSDocParameterTag(x) || ts.isJSDocSeeTag(x);
}
