import ts from "typescript";
import { AmbientConstantExpression } from "./AmbientConstantExpression.js";
import { NodeProps } from "./NodeProps.js";
import { PropertyName } from "./PropertyName.js";
import { Token } from "./Token.js";

/**
 * Formats a {@link ts.EnumMember} node in code.
 * @group Components
 */
export function EnumMember({
  collection,
  node,
}: NodeProps<ts.EnumMember>): JSX.Element {
  return (
    <>
      <PropertyName collection={collection} node={node.name} />
      {node.initializer && (
        <>
          <Token operator text=" = " />
          <AmbientConstantExpression
            collection={collection}
            node={node.initializer}
          />
        </>
      )}
    </>
  );
}
