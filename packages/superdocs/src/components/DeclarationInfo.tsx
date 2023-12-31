import clsx from "clsx";
import Link from "next/link";
import { Declaration } from "../core/DeclarationCollection.js";
import { FormatDeclaration } from "./FormatDeclaration.js";
import { JSDocMarkdown } from "./JSDocMarkdown.js";
import { SymbolIcon } from "./SymbolIcon.js";

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
  declaration: Declaration;
  /**
   * True to hide the icon.
   */
  noIcon?: boolean;
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
  noIcon = !!title,
}: DeclarationInfoProps): JSX.Element {
  return (
    <section
      className={clsx("declaration", child && "declaration-child", className)}
    >
      <h2 className="declaration-heading" id={declaration.slug}>
        <Link
          className="flex items-center"
          href={declaration.documentationLink}
        >
          {!noIcon && (
            <>
              <SymbolIcon node={declaration.node} />
              &nbsp;
            </>
          )}
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
      <code className="language-typescript block">
        <FormatDeclaration
          collection={declaration.collection}
          node={declaration.node}
        />
      </code>
      <JSDocMarkdown
        collection={declaration.collection}
        node={declaration.documentation}
      />
    </section>
  );
}
