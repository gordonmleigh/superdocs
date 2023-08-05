import ts from "typescript";
import { Join } from "../ast/Join.js";
import { Keyword } from "../ast/Keyword.js";
import { Modifiers } from "../ast/Modifier.js";
import { NodeProps } from "../ast/NodeProps.js";
import { Operator } from "../ast/Operator.js";
import { ParameterDeclaration } from "../ast/ParameterDeclaration.js";
import { TypeNode } from "../ast/TypeNode.js";
import { TypeParameters } from "../ast/TypeParameter.js";
import { KeywordType } from "./KeywordType.js";
import { PropertyName } from "./PropertyName.js";

/**
 * Formats a function-like declaration in code.
 * @group Components
 */
export function SignatureDeclaration({
  collection,
  node,
}: NodeProps<ts.SignatureDeclaration>): JSX.Element {
  return (
    <>
      {ts.canHaveModifiers(node) && node.modifiers && (
        <Modifiers node={node.modifiers} />
      )}

      {ts.isFunctionDeclaration(node) && <Keyword>function</Keyword>}
      {ts.isGetAccessorDeclaration(node) && <Keyword>get</Keyword>}
      {ts.isSetAccessorDeclaration(node) && <Keyword>set</Keyword>}

      {ts.isConstructorDeclaration(node) ? (
        <Keyword text="constructor" />
      ) : ts.isConstructSignatureDeclaration(node) ? (
        <Keyword text="new" />
      ) : node.name ? (
        <PropertyName collection={collection} node={node.name} />
      ) : undefined}

      {node.typeParameters && (
        <TypeParameters collection={collection} node={node.typeParameters} />
      )}

      {ts.isIndexSignatureDeclaration(node) ? (
        <Operator text="[" />
      ) : (
        <Operator text="(" />
      )}
      <Join
        delimiter={<Operator text=", " />}
        items={node.parameters}
        render={(param) => (
          <ParameterDeclaration
            collection={collection}
            node={param}
            key={param.pos}
          />
        )}
      />
      {ts.isIndexSignatureDeclaration(node) ? (
        <Operator text="]" />
      ) : (
        <Operator text=")" />
      )}

      {ts.isTypeNode(node) ? <Operator text=" => " /> : <Operator text=": " />}
      {node.type ? (
        <TypeNode collection={collection} node={node.type} />
      ) : ts.isTypeNode(node) ? (
        <KeywordType text="unknown" />
      ) : undefined}
    </>
  );
}
