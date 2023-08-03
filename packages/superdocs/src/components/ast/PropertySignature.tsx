import ts from "typescript";
import { Identifier } from "../ast/Identifier.js";
import { Modifiers } from "../ast/Modifier.js";
import { NodeOnlyProps, NodeProps } from "../ast/NodeProps.js";
import { Operator } from "../ast/Operator.js";
import { TypeNode } from "../ast/TypeNode.js";
import { CodeWord } from "./Word.js";

/**
 * Formats a property signature in code.
 * @group Components
 */
export function PropertySignature({
  collection,
  node,
}: NodeProps<ts.PropertySignature>): JSX.Element {
  return (
    <>
      {node.modifiers && <Modifiers node={node.modifiers} />}
      <PropertyName node={node.name} />
      {node.type && (
        <>
          <Operator text=": " />
          <TypeNode collection={collection} node={node.type} />
        </>
      )}
    </>
  );
}

function PropertyName({ node }: NodeOnlyProps<ts.PropertyName>): JSX.Element {
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
      <>
        <Operator text="[" />
        <Identifier className="code-numeric-literal" name={`${node.text}`} />
        <Operator text="]" />
      </>
    );
  }
  if (ts.isPrivateIdentifier(node)) {
    return <Identifier name={node.text} />;
  }
  return <CodeWord className="code-unknown">{node.getText()}</CodeWord>;
}
