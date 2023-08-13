import { Fragment } from "react";
import ts from "typescript";
import { getSyntaxKindName } from "../internal/getSyntaxKindName.js";
import { EntityName } from "./EntityName.js";
import { Join } from "./Join.js";
import { NodeProps } from "./NodeProps.js";
import { SignatureDeclaration } from "./SignatureDeclaration.js";
import { Token, TokenProps } from "./Token.js";
import { TypeArguments } from "./TypeArguments.js";
import { TypeElement } from "./TypeElement.js";
import { UnknownCode } from "./UnknownCode.js";

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
    let literal: TokenProps["literal"];
    switch (node.literal.kind) {
      case ts.SyntaxKind.StringLiteral:
        literal = "string";
        break;
      case ts.SyntaxKind.NumericLiteral:
        literal = "number";
        break;
      default:
        literal = true;
    }
    return <Token literal={literal}>{node.getText()}</Token>;
  }
  if (ts.isUnionTypeNode(node)) {
    return (
      <Join
        operator=" | "
        items={node.types}
        render={(x) => <TypeNode collection={collection} node={x} />}
      />
    );
  }
  if (ts.isIntersectionTypeNode(node)) {
    return (
      <Join
        operator=" & "
        items={node.types}
        render={(x) => <TypeNode collection={collection} node={x} />}
      />
    );
  }
  if (ts.isArrayTypeNode(node)) {
    return (
      <>
        <TypeNode collection={collection} node={node.elementType} />
        <Token punctuation text="[]" />
      </>
    );
  }
  if (ts.isTupleTypeNode(node)) {
    return (
      <>
        <Token punctuation text="[" />
        <Join
          operator=", "
          items={node.elements}
          render={(x) => <TypeNode collection={collection} node={x} />}
        />
        <Token punctuation text="]" />
      </>
    );
  }
  if (ts.isIndexedAccessTypeNode(node)) {
    return (
      <>
        <TypeNode collection={collection} node={node.objectType} />
        <Token punctuation text="[" />
        <TypeNode collection={collection} node={node.indexType} />
        <Token punctuation text="]" />
      </>
    );
  }
  if (ts.isParenthesizedTypeNode(node)) {
    return (
      <>
        <Token word />
        <Token punctuation text="(" />
        <TypeNode collection={collection} node={node.type} />
        <Token punctuation text=")" />
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
        <Token keyword>{keyword}</Token>
        <Token word />
        <TypeNode collection={collection} node={node.type} />
      </>
    ) : (
      <UnknownCode collection={collection} node={node} />
    );
  }
  if (ts.isTypeLiteralNode(node)) {
    return (
      <>
        <Token punctuation text="{ " />
        {node.members.map((member) => (
          <Fragment key={member.pos}>
            <TypeElement collection={collection} node={member} />
            <Token punctuation text="; " />
          </Fragment>
        ))}
        <Token punctuation text=" }" />
      </>
    );
  }
  if (ts.isTypeQueryNode(node)) {
    return (
      <>
        <Token keyword>typeof</Token>
        <EntityName collection={collection} node={node.exprName} />
        {node.typeArguments && (
          <TypeArguments collection={collection} node={node.typeArguments} />
        )}
      </>
    );
  }
  if (ts.isFunctionLike(node)) {
    return <SignatureDeclaration collection={collection} node={node} />;
  }
  if (getSyntaxKindName(node.kind).endsWith("Keyword")) {
    return <Token builtin>{node.getText()}</Token>;
  }
  return <UnknownCode collection={collection} node={node} />;
}
