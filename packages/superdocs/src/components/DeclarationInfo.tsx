import { Declaration } from "../core/DeclarationCollection.js";
import { FormatDeclaration } from "./FormatDeclaration.js";
import { JSDoc } from "./JSDoc.js";

/**
 * Properties for {@link DeclarationInfo} component.
 * @group Components
 */
export interface DeclarationInfoProps {
  declaration: Declaration;
}

/**
 * Formats information about a declaration.
 * @group Components
 */
export function DeclarationInfo({
  declaration,
}: DeclarationInfoProps): JSX.Element {
  return (
    <section className="declaration">
      <h2 className="declaration-heading" id={declaration.slug}>
        {declaration.name}
      </h2>
      {declaration.codeLink ? (
        <a className="declaration-code-link" href={declaration.codeLink}>
          {declaration.location.path}:{declaration.location.line}
        </a>
      ) : (
        <span className="declaration-code-link">
          {declaration.location.path}:{declaration.location.line}
        </span>
      )}
      <FormatDeclaration
        collection={declaration.collection}
        node={declaration.node}
      />
      <p>
        <JSDoc
          collection={declaration.collection}
          comment={declaration.documentation}
        />
      </p>
    </section>
  );
}
