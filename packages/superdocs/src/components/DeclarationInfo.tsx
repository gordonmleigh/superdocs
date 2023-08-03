import clsx from "clsx";
import {
  Declaration,
  DeclarationNodeOrChildNode,
} from "../core/DeclarationCollection.js";
import { JSDoc } from "./ast/JSDoc.js";
import { FormatDeclaration } from "./declarations/FormatDeclaration.js";

/**
 * Properties for {@link DeclarationInfo} component.
 * @group Components
 */
export interface DeclarationInfoProps {
  /**
   * True if the node is a child of a declaration.
   */
  child?: boolean;
  /**
   * The declaration to format.
   */
  declaration: Declaration<DeclarationNodeOrChildNode>;
}

/**
 * Formats information about a declaration.
 * @group Components
 */
export function DeclarationInfo({
  child,
  declaration,
}: DeclarationInfoProps): JSX.Element {
  return (
    <section className={clsx("declaration", child && "declaration-child")}>
      <h2
        className={clsx(
          child ? "declaration-subsubheading" : "declaration-heading",
        )}
        id={declaration.slug}
      >
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
      <code className="declaration-code">
        <FormatDeclaration
          collection={declaration.collection}
          node={declaration.node}
        />
      </code>
      <JSDoc
        collection={declaration.collection}
        comment={declaration.documentation}
      />
      {declaration.members && (
        <div className="declaration-members">
          <h3 className="declaration-subheading">Members</h3>
          {declaration.members
            .slice()
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((member) => (
              <DeclarationInfo key={member.slug} declaration={member} child />
            ))}
        </div>
      )}
    </section>
  );
}
