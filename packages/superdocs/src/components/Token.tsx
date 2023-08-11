"use client";
import clsx from "clsx";
import {
  CSSProperties,
  ReactNode,
  cloneElement,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";

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
 * Properties for the {@link Token} component.
 * @group Components
 */
export interface TokenProps extends TokenQuickKinds {
  children?: ReactNode;
  className?: string;
  kind?: TokenKind;
  text?: string;
  tooltip?: React.ReactElement<{ style?: CSSProperties }>;
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
  const [position, setPosition] = useState<[number, number]>();
  const kind = kindProp ?? quickKind(quick);
  const ref = useRef<HTMLSpanElement>(null);
  const wordSpace = word || (kind && wordKinds[kind]);

  const token = (
    <span
      ref={ref}
      className={clsx(className, "token", kind)}
      onMouseEnter={() => {
        if (!ref.current) {
          return;
        }
        const bounds = ref.current.getBoundingClientRect();
        setPosition([
          bounds.left + document.body.scrollLeft,
          bounds.top + document.body.scrollTop + bounds.height,
        ]);
      }}
      onMouseLeave={() => setPosition(undefined)}
    >
      {position &&
        tooltip &&
        createPortal(
          cloneElement(tooltip, {
            style: {
              left: position[0],
              top: position[1],
              position: "absolute",
              zIndex: 100,
            },
          }),
          document.body,
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
