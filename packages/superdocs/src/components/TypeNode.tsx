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
import { TypeParameter } from "./TypeParameter.js";
import { UnknownCode } from "./UnknownCode.js";

/**
 * Format a {@link ts.TypeNode} node in code.
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
  if (ts.isImportTypeNode(node)) {
    return (
      <>
        {node.qualifier ? (
          <EntityName collection={collection} node={node.qualifier} />
        ) : (
          <>
            <Token keyword>import</Token>
            <Token punctuation text="(" />
            <TypeNode collection={collection} node={node.argument} />
            <Token punctuation text=")" />
          </>
        )}
      </>
    );
  }
  if (ts.isConditionalTypeNode(node)) {
    return (
      <>
        <TypeNode collection={collection} node={node.checkType} />
        <Token keyword>extends</Token>
        <TypeNode collection={collection} node={node.extendsType} />
        <Token operator text=" ? " />
        <TypeNode collection={collection} node={node.trueType} />
        <Token operator text=" : " />
        <TypeNode collection={collection} node={node.falseType} />
      </>
    );
  }
  if (ts.isInferTypeNode(node)) {
    return (
      <>
        <Token keyword>infer</Token>
        <TypeParameter collection={collection} node={node.typeParameter} />
      </>
    );
  }
  if (ts.isMappedTypeNode(node)) {
    return (
      <>
        <Token punctuation text="{ " />

        {node.readonlyToken?.kind === ts.SyntaxKind.PlusToken && (
          <Token operator text="+" />
        )}
        {node.readonlyToken?.kind === ts.SyntaxKind.MinusToken && (
          <Token operator text="-" />
        )}
        {node.readonlyToken && <Token keyword>readonly</Token>}

        <Token punctuation text=" [" />
        <EntityName collection={collection} node={node.typeParameter.name} />
        {node.typeParameter.constraint && (
          <>
            <Token keyword>in</Token>
            <TypeNode
              collection={collection}
              node={node.typeParameter.constraint}
            />
          </>
        )}
        {node.nameType && (
          <>
            <Token keyword>as</Token>
            <TypeNode collection={collection} node={node.nameType} />
          </>
        )}
        <Token punctuation text="]" />

        {node.questionToken?.kind === ts.SyntaxKind.PlusToken && (
          <Token operator text="+" />
        )}
        {node.questionToken?.kind === ts.SyntaxKind.MinusToken && (
          <Token operator text="-" />
        )}
        {node.questionToken && <Token operator text="?" />}

        <Token punctuation text=": " />
        <TypeNode collection={collection} node={node.type!} />
        <Token punctuation text=" }" />
      </>
    );
  }
  if (ts.isTemplateLiteralTypeNode(node)) {
    return (
      <>
        <Token literal="string" word={false}>
          `{node.head.text}
        </Token>
        {node.templateSpans.map((span) => (
          <Fragment key={span.pos}>
            <Token operator text="$" />
            <Token punctuation text="{ " />
            <TypeNode collection={collection} node={span.type} />
            <Token punctuation text=" }" />
            <Token literal="string" word={false}>
              {span.literal.text}
            </Token>
          </Fragment>
        ))}
        <Token literal="string" word={false}>
          `
        </Token>
      </>
    );
  }
  if (ts.isTypePredicateNode(node)) {
    return (
      <>
        {node.assertsModifier && <Token keyword>asserts</Token>}
        {ts.isIdentifier(node.parameterName) ? (
          <Token identifier>{node.parameterName.text}</Token>
        ) : (
          <Token keyword>this</Token>
        )}
        {node.type && (
          <>
            <Token keyword>is</Token>
            <TypeNode collection={collection} node={node.type} />
          </>
        )}
      </>
    );
  }
  if (getSyntaxKindName(node.kind).endsWith("Keyword")) {
    return <Token builtin>{node.getText()}</Token>;
  }
  return <UnknownCode collection={collection} node={node} />;
}
