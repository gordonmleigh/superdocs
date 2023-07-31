import ts from "typescript";
import { DeclarationNode } from "../core/DeclarationCollection.js";
import { styled } from "../internal/styled.js";
import { ClassDeclaration } from "./ClassDeclaration.js";
import { InterfaceDeclaration } from "./InterfaceDeclaration.js";
import { NodeProps } from "./NodeProps.js";
import { TypeAliasDeclaration } from "./TypeAliasDeclaration.js";

const CodeBlock = styled("code", "my-5 block whitespace-normal p-2");

/**
 * Properties for the {@link FormatDeclaration} component.
 * @group Components
 */
export type FormatDeclarationProps = NodeProps<DeclarationNode>;

/**
 * Properties for the {@link FormatDeclaration} component.
 * @group Components
 */
export function FormatDeclaration({
  collection,
  node,
}: FormatDeclarationProps): JSX.Element {
  if (ts.isInterfaceDeclaration(node)) {
    return (
      <CodeBlock>
        <InterfaceDeclaration collection={collection} node={node} />
      </CodeBlock>
    );
  }
  if (ts.isClassDeclaration(node)) {
    return (
      <CodeBlock>
        <ClassDeclaration collection={collection} node={node} />
      </CodeBlock>
    );
  }
  if (ts.isTypeAliasDeclaration(node)) {
    return (
      <CodeBlock>
        <TypeAliasDeclaration collection={collection} node={node} />
      </CodeBlock>
    );
  }
  return <CodeBlock className="code-unknown">{node.getText()}</CodeBlock>;
}
