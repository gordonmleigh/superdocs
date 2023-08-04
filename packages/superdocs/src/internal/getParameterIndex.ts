import ts from "typescript";
import { assert } from "./assert";

export function getParameterIndex(node: ts.ParameterDeclaration): number {
  assert(ts.isFunctionLike(node.parent));
  const index = node.parent.parameters.indexOf(node);
  assert(index >= 0);
  return index;
}
