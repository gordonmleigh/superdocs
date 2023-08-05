import ts from "typescript";
import { Join } from "./Join.js";
import { Modifiers } from "./Modifier.js";
import { NodeProps } from "./NodeProps.js";
import { ParameterDeclaration } from "./ParameterDeclaration.js";
import { PropertyName } from "./PropertyName.js";
import { Token } from "./Token.js";
import { TypeNode } from "./TypeNode.js";
import { TypeParameters } from "./TypeParameter.js";

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

      {ts.isFunctionDeclaration(node) && <Token keyword>function</Token>}
      {ts.isGetAccessorDeclaration(node) && <Token keyword>get</Token>}
      {ts.isSetAccessorDeclaration(node) && <Token keyword>set</Token>}

      {ts.isConstructorDeclaration(node) ? (
        <Token keyword>constructor</Token>
      ) : ts.isConstructSignatureDeclaration(node) ? (
        <Token keyword>new</Token>
      ) : node.name ? (
        <PropertyName collection={collection} node={node.name} />
      ) : undefined}

      {node.typeParameters && (
        <TypeParameters collection={collection} node={node.typeParameters} />
      )}

      {ts.isIndexSignatureDeclaration(node) ? (
        <Token operator text="[" />
      ) : (
        <Token operator text="(" />
      )}
      <Join
        operator=", "
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
        <Token operator text="]" />
      ) : (
        <Token operator text=")" />
      )}

      {ts.isTypeNode(node) ? (
        <Token operator text=" => " />
      ) : (
        <Token operator text=": " />
      )}
      {node.type ? (
        <TypeNode collection={collection} node={node.type} />
      ) : ts.isTypeNode(node) ? (
        <Token keyword type>
          unknown
        </Token>
      ) : undefined}
    </>
  );
}
