import ts from "typescript";
import { Identifier } from "../ast/Identifier.js";
import { NodeProps } from "../ast/NodeProps.js";
import { UnknownCode } from "./UnknownCode.js";

/**
 * Formats a property name.
 * @group Components
 */
export function PropertyName({
  collection,
  node,
}: NodeProps<ts.PropertyName>): JSX.Element {
  if (ts.isEntityName(node)) {
    return <Identifier name={node} />;
  }
  if (ts.isStringLiteral(node)) {
    return (
      <Identifier className="code-string-literal" name={`"${node.text}"`} />
    );
  }
  if (ts.isNumericLiteral(node)) {
    return (
      <Identifier className="code-numeric-literal" name={`${node.text}`} />
    );
  }
  if (ts.isPrivateIdentifier(node)) {
    return <Identifier name={node.text} />;
  }
  return <UnknownCode collection={collection} node={node} word />;
}
