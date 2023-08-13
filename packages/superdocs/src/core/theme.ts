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
  [key: string]: SuperdocsTheme;
}
