import ts from "typescript";
import { AmbientConstantExpression } from "./AmbientConstantExpression.js";
import { NodeProps } from "./NodeProps.js";
import { Token } from "./Token.js";
import { UnknownCode } from "./UnknownCode.js";

/**
 * Formats a {@link ts.PropertyName} node in code.
 * @group Components
 */
export function PropertyName({
  collection,
  node,
}: NodeProps<ts.PropertyName>): JSX.Element {
  if (ts.isEntityName(node)) {
    return <Token identifier>{node.text}</Token>;
  }
  if (ts.isStringLiteral(node)) {
    return (
      <Token identifier literal="string">
        &quot;{node.text}&quot;
      </Token>
    );
  }
  if (ts.isNumericLiteral(node)) {
    return (
      <Token identifier literal="number">
        {node.text}
      </Token>
    );
  }
  if (ts.isPrivateIdentifier(node)) {
    return <Token identifier="symbol">{node.text}</Token>;
  }
  if (ts.isComputedPropertyName(node)) {
    return (
      <>
        <Token punctuation text="[" />
        <AmbientConstantExpression
          collection={collection}
          node={node.expression}
        />
        <Token punctuation text="]" />
      </>
    );
  }
  return <UnknownCode collection={collection} node={node} word />;
}
