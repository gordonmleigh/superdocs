import { Fragment } from "react";
import ts from "typescript";
import { getSyntaxKindName } from "../../internal/getSyntaxKindName.js";
import { EntityName } from "./EntityName.js";
import { Join } from "./Join.js";
import { KeywordType } from "./KeywordType.js";
import { NodeProps } from "./NodeProps.js";
import { Operator } from "./Operator.js";
import { SignatureDeclaration } from "./SignatureDeclaration.js";
import { TypeArguments } from "./TypeArguments.js";
import { TypeElement } from "./TypeElement.js";
import { CodeWord } from "./Word.js";

/**
 * Properties for the {@link TypeNode} component.
 * @group Components
 */
export type TypeNodeProps = NodeProps<ts.TypeNode>;

/**
 * Format a type node in code.
 * @group Components
 */
export function TypeNode({ collection, node }: TypeNodeProps): JSX.Element {
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
    return <span className="code-literal-type">{node.getText()}</span>;
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
  if (ts.isIntersectionTypeNode(node)) {
    return (
      <Join
        delimiter={<Operator text=" & " />}
        items={node.types}
        render={(x) => <TypeNode collection={collection} node={x} />}
      />
    );
  }
  if (ts.isArrayTypeNode(node)) {
    return (
      <>
        <TypeNode collection={collection} node={node.elementType} />
        <Operator text="[]" />
      </>
    );
  }
  if (ts.isParenthesizedTypeNode(node)) {
    return (
      <>
        <CodeWord />
        <Operator text="(" />
        <TypeNode collection={collection} node={node.type} />
        <Operator text=")" />
      </>
    );
  }
  if (ts.isTypeOperatorNode(node)) {
    let keyword: string | undefined;
    switch (node.operator) {
      case ts.SyntaxKind.KeyOfKeyword:
        keyword = "keyof";
        break;
      case ts.SyntaxKind.ReadonlyKeyword:
        keyword = "readonly";
        break;
      case ts.SyntaxKind.UniqueKeyword:
        keyword = "unique";
        break;
    }
    return keyword ? (
      <>
        <KeywordType text={keyword} />
        <TypeNode collection={collection} node={node.type} />
      </>
    ) : (
      <span className="code-unknown">{node.getText()}</span>
    );
  }
  if (ts.isTypeLiteralNode(node)) {
    return (
      <>
        <Operator text="{ " />
        {node.members.map((member) => (
          <Fragment key={member.pos}>
            <TypeElement collection={collection} node={member} />
            <Operator text="; " />
          </Fragment>
        ))}
        <Operator text=" }" />
      </>
    );
  }
  if (ts.isFunctionLike(node)) {
    return <SignatureDeclaration collection={collection} node={node} />;
  }
  if (getSyntaxKindName(node.kind).endsWith("Keyword")) {
    return <KeywordType>{node.getText()}</KeywordType>;
  }
  return <span className="code-unknown">{node.getText()}</span>;
}
