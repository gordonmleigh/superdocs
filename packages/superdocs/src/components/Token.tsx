"use client";
import { autoPlacement, useFloating } from "@floating-ui/react-dom";
import clsx from "clsx";
import { CSSProperties, ReactNode, useState } from "react";

const tokenKinds = [
  "atrule",
  "attr-name",
  "attr-value",
  "bold",
  "boolean",
  "builtin",
  "cdata",
  "char",
  "class-name",
  "comment",
  "constant",
  "deleted",
  "doctype",
  "entity",
  "function",
  "identifier",
  "important",
  "inserted",
  "italic",
  "keyword",
  "literal",
  "namespace",
  "number",
  "operator",
  "prolog",
  "property",
  "punctuation",
  "regex",
  "selector",
  "string",
  "symbol",
  "tag",
  "unknown",
  "url",
  "variable",
] as const;

const isTokenKind = (value: any): value is TokenKind =>
  tokenKinds.includes(value);

/**
 * Valid values for the `kind` property for the {@link Token} component.
 * @group Components
 */
export type TokenKind = (typeof tokenKinds)[number];

const wordKinds: Record<TokenKind, boolean> = {
  atrule: false,
  "attr-name": true,
  "attr-value": false,
  bold: false,
  boolean: true,
  builtin: true,
  cdata: false,
  char: true,
  "class-name": true,
  comment: false,
  constant: true,
  deleted: false,
  doctype: false,
  entity: false,
  function: true,
  identifier: true,
  important: true,
  inserted: false,
  italic: false,
  keyword: true,
  literal: true,
  namespace: true,
  number: true,
  operator: false,
  prolog: false,
  property: true,
  punctuation: false,
  regex: true,
  selector: false,
  string: true,
  symbol: true,
  tag: true,
  unknown: false,
  url: false,
  variable: true,
};

/**
 * Shortcuts for {@link TokenKind} values.
 * @group Components
 */
export interface TokenQuickKinds {
  builtin?: boolean;
  identifier?: boolean | "class-name" | "namespace" | "property" | "symbol";
  keyword?: boolean;
  literal?: boolean | "number" | "string";
  operator?: boolean;
  punctuation?: boolean;
  unknown?: boolean;
}

/**
 * Properties for a tooltip of the {@link Token} element.
 * @group Components
 */
export interface TokenTooltipProps {
  ref: (el: HTMLElement | null) => void;
  style: CSSProperties;
}

/**
 * Properties for the {@link Token} component.
 * @group Components
 */
export interface TokenProps extends TokenQuickKinds {
  children?: ReactNode;
  className?: string;
  kind?: TokenKind;
  text?: string;
  tooltip?: ReactNode;
  word?: boolean;
}

function quickKind(quick: TokenQuickKinds): TokenKind | undefined {
  for (const [key, value] of Object.entries(quick)) {
    if (!isTokenKind(key)) {
      continue;
    }
    if (value === true) {
      return key;
    }
    if (value && isTokenKind(value)) {
      return value;
    }
  }
}

/**
 * Formats a token in code.
 * @group Components
 */
export function Token({
  children,
  className,
  kind: kindProp,
  text,
  tooltip,
  word,
  ...quick
}: TokenProps): JSX.Element {
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const { refs, floatingStyles } = useFloating({
    middleware: [autoPlacement({ alignment: "start" })],
    placement: "top-start",
  });
  const kind = kindProp ?? quickKind(quick);
  const wordSpace = word || (kind && wordKinds[kind]);

  const token = (
    <span
      ref={refs.setReference}
      className={clsx(className, "token", kind)}
      onMouseEnter={() => setTooltipOpen(true)}
      onMouseLeave={() => setTooltipOpen(false)}
    >
      {tooltip && tooltipOpen && (
        <span
          className="z-50 py-1.5"
          ref={refs.setFloating}
          style={floatingStyles}
        >
          {tooltip}
        </span>
      )}
      {text ?? children}
    </span>
  );

  return wordSpace ? (
    <span className="code-word-spacing">
      <span className="code-word-spacing-space"> </span>
      {token}
    </span>
  ) : (
    token
  );
}
