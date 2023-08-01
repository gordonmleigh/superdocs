import ts from "typescript";
import { getSyntaxKindName } from "../internal/getSyntaxKindName.js";
import { EntityName } from "./EntityName.js";
import { Join } from "./Join.js";
import { KeywordType } from "./KeywordType.js";
import { NodeProps } from "./NodeProps.js";
import { Operator } from "./Operator.js";
import { TypeArguments } from "./TypeArguments.js";

/**
 * Format a type node in code.
 * @group Components
 */
export function TypeNode({
  collection,
  node,
}: NodeProps<ts.TypeNode>): JSX.Element {
  if (ts.isTypeReferenceNode(node)) {
    return (
      <>
        <EntityName collection={collection} node={node.typeName} />
        {node.typeArguments && (
          <TypeArguments collection={collection} node={node.typeArguments} />
        )}
      </>
    );
  }
  if (ts.isLiteralTypeNode(node)) {
    return <span className="text-code-literal-type">{node.getText()}</span>;
  }
  if (ts.isUnionTypeNode(node)) {
    return (
      <Join
        delimiter={<Operator text=" | " />}
        items={node.types}
        render={(x) => <TypeNode collection={collection} node={x} />}
      />
    );
  }
  if (getSyntaxKindName(node.kind).endsWith("Keyword")) {
    return <KeywordType>{node.getText()}</KeywordType>;
  }
  return <span className="code-unknown">{node.getText()}</span>;
}
