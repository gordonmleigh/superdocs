import ts from "typescript";
import { EntityName } from "./EntityName.js";
import { NodeProps } from "./NodeProps.js";
import { PropertyName } from "./PropertyName.js";
import { Token } from "./Token.js";
import { UnknownCode } from "./UnknownCode.js";

/**
 * Formats a {@link ts.Expression} node in code. Anything which isn't a
 * {@link ts.StringLiteral}, {@link ts.NumericLiteral} or
 * {@link ts.PropertyAccessExpression} will be rendered as an unknown code
 * token.
 * @group Components
 */
export function AmbientConstantExpression({
  collection,
  node,
}: NodeProps<ts.Expression>): JSX.Element {
  if (ts.isStringLiteral(node)) {
    return <Token literal="string">"{node.text}"</Token>;
  } else if (ts.isNumericLiteral(node)) {
    return <Token literal="number">{node.text}</Token>;
  } else if (ts.isEntityName(node)) {
    return <EntityName collection={collection} node={node} />;
  } else if (ts.isPropertyAccessExpression(node)) {
    return (
      <>
        <AmbientConstantExpression
          collection={collection}
          node={node.expression}
        />
        {node.questionDotToken ? (
          <Token operator text="?." />
        ) : (
          <Token operator text="." />
        )}
        <PropertyName collection={collection} node={node.name} />
      </>
    );
  }
  return <UnknownCode collection={collection} node={node} />;
}
