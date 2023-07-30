import clsx from "clsx";
import Link from "next/link";
import { Fragment, ReactNode } from "react";
import ts from "typescript";
import { DeclarationNode } from "../core/DeclarationCollection.js";
import { fetchDeclarationCollection } from "../core/fetchDeclarationCollection.js";
import { getSyntaxKindName } from "../internal/getSyntaxKindName.js";
import { styled } from "../internal/styled.js";

const CodeBlock = styled("code", "my-5 block whitespace-normal p-2");
const LiteralType = styled("span", "text-code-literal-type");

interface NodeProps<T> {
  node: T;
}

export type FormatDeclarationProps = NodeProps<DeclarationNode>;

export function FormatDeclaration({
  node,
}: FormatDeclarationProps): JSX.Element {
  if (ts.isInterfaceDeclaration(node)) {
    return (
      <CodeBlock>
        <InterfaceDeclaration node={node} />
      </CodeBlock>
    );
  }
  if (ts.isClassDeclaration(node)) {
    return (
      <CodeBlock>
        <ClassDeclaration node={node} />
      </CodeBlock>
    );
  }
  if (ts.isTypeAliasDeclaration(node)) {
    return (
      <CodeBlock>
        <TypeAliasDeclaration node={node} />
      </CodeBlock>
    );
  }
  return <CodeBlock className="code-unknown">{node.getText()}</CodeBlock>;
}

function EntityName({ node }: NodeProps<ts.EntityName>): JSX.Element {
  const lib = fetchDeclarationCollection();
  const def = lib.getDeclaration(node);
  const id: string[] = [];

  for (let curr = node; ; ) {
    if (ts.isQualifiedName(curr)) {
      id.unshift(curr.right.text);
      curr = curr.left;
    } else {
      id.unshift(curr.text);
      break;
    }
  }
  const text = id.join(".");
  return def ? (
    <Link className="text-code-identifier" href={def.documentationLink}>
      {text}
    </Link>
  ) : (
    <span className="text-code-identifier">{text}</span>
  );
}

interface JoinProps<T> {
  delimiter: ReactNode;
  items: readonly T[];
  render: (item: T) => ReactNode;
}

function Join<T>({ delimiter, items, render }: JoinProps<T>): JSX.Element {
  const children: ReactNode[] = [];
  for (const item of items) {
    if (children.length) {
      children.push(<Fragment key={children.length}>{delimiter}</Fragment>);
    }
    children.push(<Fragment key={children.length}>{render(item)}</Fragment>);
  }
  return <>{children}</>;
}

function TypeNode({ node }: NodeProps<ts.TypeNode>): JSX.Element {
  if (ts.isTypeReferenceNode(node)) {
    return (
      <>
        <EntityName node={node.typeName} />
        {node.typeArguments && <TypeArguments node={node.typeArguments} />}
      </>
    );
  }
  if (ts.isLiteralTypeNode(node)) {
    return <LiteralType>{node.getText()}</LiteralType>;
  }
  if (ts.isUnionTypeNode(node)) {
    return (
      <Join
        delimiter={<Operator text="|" spaceAround />}
        items={node.types}
        render={(x) => <TypeNode node={x} />}
      />
    );
  }
  if (getSyntaxKindName(node.kind).endsWith("Keyword")) {
    return <KeywordType>{node.getText()}</KeywordType>;
  }
  return <span className="code-unknown">{node.getText()}</span>;
}

function TypeArguments({
  node,
}: NodeProps<readonly ts.TypeNode[]>): JSX.Element {
  return (
    <>
      <Operator text="<" />
      <Join
        delimiter={<Operator text="," spaceRight />}
        items={node}
        render={(x) => <TypeNode node={x} />}
      />
      <Operator text=">" />
    </>
  );
}

export function TypeParameter({
  node,
}: NodeProps<ts.TypeParameterDeclaration>): JSX.Element {
  return (
    <>
      <EntityName node={node.name} />
      {node.constraint && (
        <>
          <Keyword>extends</Keyword>
          <TypeNode node={node.constraint} />
        </>
      )}
      {node.default && (
        <>
          <Operator text="=" spaceAround />
          <TypeNode node={node.default} />
        </>
      )}
    </>
  );
}

function TypeParameters({
  node,
}: NodeProps<readonly ts.TypeParameterDeclaration[]>): JSX.Element {
  return (
    <>
      <Operator>{"<"}</Operator>
      <Join
        delimiter=", "
        items={node}
        render={(x) => <TypeParameter node={x} />}
      />
      <Operator>{">"}</Operator>
    </>
  );
}

function HeritageClause({ node }: NodeProps<ts.HeritageClause>): JSX.Element {
  return (
    <>
      <br />
      {node.token === ts.SyntaxKind.ImplementsKeyword && (
        <Keyword className="ml-8">implements</Keyword>
      )}
      {node.token === ts.SyntaxKind.ExtendsKeyword && (
        <Keyword className="ml-8">extends</Keyword>
      )}
      <Join
        delimiter=", "
        items={node.types}
        render={(type) => (
          <>
            <EntityName node={type.expression as ts.EntityName} />
            {type.typeArguments && <TypeArguments node={type.typeArguments} />}
          </>
        )}
      />
    </>
  );
}

function HeritageClauses({
  node,
}: NodeProps<ts.NodeArray<ts.HeritageClause>>): JSX.Element {
  return (
    <>
      {node.map((x, i) => (
        <HeritageClause key={i} node={x} />
      ))}
    </>
  );
}

function ClassDeclaration({
  node,
}: NodeProps<ts.ClassDeclaration>): JSX.Element {
  return (
    <>
      <Keyword>class</Keyword>
      {node.name?.text}
      {node.typeParameters && <TypeParameters node={node.typeParameters} />}
      {node.heritageClauses && <HeritageClauses node={node.heritageClauses} />}
    </>
  );
}

function InterfaceDeclaration({
  node,
}: NodeProps<ts.InterfaceDeclaration>): JSX.Element {
  return (
    <>
      <Keyword>interface</Keyword>
      {node.name.text}
      {node.typeParameters && <TypeParameters node={node.typeParameters} />}
      {node.heritageClauses && <HeritageClauses node={node.heritageClauses} />}
    </>
  );
}

function TypeAliasDeclaration({
  node,
}: NodeProps<ts.TypeAliasDeclaration>): JSX.Element {
  return (
    <>
      <Keyword>type</Keyword>
      {node.name.text}
      {node.typeParameters && <TypeParameters node={node.typeParameters} />}
      <Operator text="=" spaceAround />
      <TypeNode node={node.type} />
    </>
  );
}

interface OperatorProps {
  children?: ReactNode;
  className?: string;
  spaceAround?: boolean;
  spaceLeft?: boolean;
  spaceRight?: boolean;
  text?: string;
}

function Operator({
  children,
  className,
  spaceAround,
  spaceLeft = spaceAround,
  spaceRight = spaceAround,
  text,
}: OperatorProps): JSX.Element {
  return (
    <>
      {spaceLeft && " "}
      <span className={clsx(className, "text-code-operator")}>
        {text ?? children}
      </span>
      {spaceRight && " "}
    </>
  );
}

interface KeywordProps {
  children?: ReactNode;
  className?: string;
  text?: string;
}

function Keyword({ children, className, text }: KeywordProps): JSX.Element {
  return (
    <>
      {" "}
      <span className={clsx(className, "text-code-keyword")}>
        {text ?? children}
      </span>{" "}
    </>
  );
}

function KeywordType({ children, className, text }: KeywordProps): JSX.Element {
  return (
    <>
      {" "}
      <span className={clsx(className, "text-code-keyword-type")}>
        {text ?? children}
      </span>{" "}
    </>
  );
}
