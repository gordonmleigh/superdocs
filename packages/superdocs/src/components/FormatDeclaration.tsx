import Link from "next/link";
import { Fragment, ReactNode } from "react";
import ts from "typescript";
import { Declaration, useLibraryLoader } from "../core/LibraryLoader.js";
import { styled } from "../internal/styled.js";

const CodeBlock = styled("code", "my-5 block whitespace-normal p-2");
const Keyword = styled("span", "text-code-keyword");
const LiteralType = styled("span", "text-code-literalType");
const Operator = styled("span", "text-code-operator");

interface NodeProps<T> {
  node: T;
}

export type FormatDeclarationProps = NodeProps<Declaration>;

export function FormatDeclaration({ node }: FormatDeclarationProps) {
  if (ts.isInterfaceDeclaration(node)) {
    return (
      <CodeBlock>
        <InterfaceDeclaration node={node} />
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
  return <CodeBlock>{node.getText()}</CodeBlock>;
}

function EntityName({ node }: NodeProps<ts.EntityName>) {
  const lib = useLibraryLoader();
  const link = lib.getDeclarationUrl(node);
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
  return link ? <Link href={link}>{text}</Link> : <>{text}</>;
}

interface JoinProps<T> {
  delimiter: ReactNode;
  items: readonly T[];
  render: (item: T) => ReactNode;
}

function Join<T>({ delimiter, items, render }: JoinProps<T>) {
  const children: ReactNode[] = [];
  for (const item of items) {
    if (children.length) {
      children.push(<Fragment key={children.length}>{delimiter}</Fragment>);
    }
    children.push(<Fragment key={children.length}>{render(item)}</Fragment>);
  }
  return <>{children}</>;
}

function TypeNode({ node }: NodeProps<ts.TypeNode>) {
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
  return <>{node.getText()}</>;
}

function TypeArguments({ node }: NodeProps<readonly ts.TypeNode[]>) {
  return (
    <>
      {"<"}
      <Join delimiter=", " items={node} render={(x) => <TypeNode node={x} />} />
      {">"}
    </>
  );
}

export function TypeParameter({
  node,
}: NodeProps<ts.TypeParameterDeclaration>) {
  return (
    <>
      <EntityName node={node.name} />
      {node.constraint && (
        <>
          {" "}
          <Keyword>extends</Keyword> <TypeNode node={node.constraint} />
        </>
      )}
      {node.default && (
        <>
          {" "}
          <Operator>=</Operator> <TypeNode node={node.default} />
        </>
      )}
    </>
  );
}

function TypeParameters({
  node,
}: NodeProps<readonly ts.TypeParameterDeclaration[]>) {
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

function HeritageClause({ node }: NodeProps<ts.HeritageClause>) {
  return (
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
  );
}

function HeritageClauses({ node }: NodeProps<ts.NodeArray<ts.HeritageClause>>) {
  return (
    <>
      {node.map((x, i) => (
        <HeritageClause key={i} node={x} />
      ))}
    </>
  );
}

function InterfaceDeclaration({ node }: NodeProps<ts.InterfaceDeclaration>) {
  return (
    <>
      <Keyword>interface</Keyword> {node.name.text}
      {node.typeParameters && <TypeParameters node={node.typeParameters} />}
      {node.heritageClauses && (
        <>
          {" "}
          <Keyword>extends</Keyword>{" "}
          <HeritageClauses node={node.heritageClauses} />
        </>
      )}
    </>
  );
}

function TypeAliasDeclaration({ node }: NodeProps<ts.TypeAliasDeclaration>) {
  return (
    <>
      <Keyword>type</Keyword> {node.name.text}
      {node.typeParameters && (
        <TypeParameters node={node.typeParameters} />
      )}{" "}
      <Operator>=</Operator> <TypeNode node={node.type} />
    </>
  );
}
