import { CSSProperties } from "react";

/**
 * Represents a list of CSS rules.
 * @group Plugin
 */
export interface CSSRuleObject {
  [selector: string]:
    | CSSProperties[keyof CSSProperties]
    | CSSProperties
    | CSSRuleObject;
}

/**
 * Theme configuration for font sizes.
 * @group Plugin
 */
export interface SuperdocsFontSizes {
  sm?: CSSProperties["fontSize"];
  base?: CSSProperties["fontSize"];
  lg?: CSSProperties["fontSize"];
  xl?: CSSProperties["fontSize"];
}

/**
 * Superdocs theme settings.
 * @group Plugin
 */
export interface SuperdocsTheme {
  base?: CSSRuleObject;
  components?: CSSRuleObject;
  utilities?: CSSRuleObject;
}

/**
 * Superdocs theme settings.
 * @group Plugin
 */
export interface SuperdocsThemes {
  [key: string]: SuperdocsTheme | SuperdocsTheme[];
}

/**
 * The options for the superdocs plugin.
 * @group Plugin
 */
export interface SuperdocsOptions {
  /**
   * The CSS class name, under which all of the other styles are defined.
   * Defaults to `"superdocs"`.
   */
  className?: string;
  /**
   * The prefix for the icon class. Icons are specified with a class name like
   * `"prefix prefix-icon-name"`, e.g. `"icon icon-symbol-function"`. Defaults
   * to `"icon"`.
   */
  iconPrefix?: string;
}
