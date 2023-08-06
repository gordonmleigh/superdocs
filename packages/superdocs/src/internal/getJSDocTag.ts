import ts from "typescript";

/**
 * Get an array of {@link ts.JSDocTag} elements by name.
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
