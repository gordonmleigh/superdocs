import clsx from "clsx";
import Link from "next/link";
import {
  Declaration,
  DeclarationNodeOrChildNode,
} from "../core/DeclarationCollection.js";
import { FormatDeclaration } from "./FormatDeclaration.js";
import { JSDoc } from "./JSDoc.js";

/**
 * Properties for {@link DeclarationInfo} component.
 * @group Components
 */
export interface DeclarationInfoProps {
  /**
   * Additional styles to apply.
   */
  className?: string;

  /**
   * True to format this declaration as a child of another declaration.
   */
  child?: boolean;

  /**
   * The declaration to format.
   */
  declaration: Declaration<DeclarationNodeOrChildNode>;

  /**
   * Optional title to show in place of the declaration name.
   */
  title?: string;
}

/**
 * Formats information about a declaration.
 * @group Components
 */
export function DeclarationInfo({
  className,
  child,
  declaration,
  title,
}: DeclarationInfoProps): JSX.Element {
  return (
    <section
      className={clsx("declaration", child && "declaration-child", className)}
    >
      <h2 className="declaration-heading" id={declaration.slug}>
        <Link href={declaration.documentationLink}>
          {title ?? declaration.name}
        </Link>
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
      <div className="declaration-description">
        <JSDoc
          collection={declaration.collection}
          comment={declaration.documentation}
        />
      </div>
    </section>
  );
}
