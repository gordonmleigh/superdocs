import { CSSProperties } from "react";

export interface CSSRuleObject {
  [selector: string]:
    | CSSProperties[keyof CSSProperties]
    | CSSProperties
    | CSSRuleObject;
}

type CSSFontSize = CSSProperties["fontSize"];

export interface SuperdocsFontSizes {
  sm?: CSSFontSize;
  base?: CSSFontSize;
  lg?: CSSFontSize;
  xl?: CSSFontSize;
}

export interface SuperdocsTheme {
  base?: CSSRuleObject;
  components?: CSSRuleObject;
  utilities?: CSSRuleObject;
}

export interface SuperdocsThemes {
  [key: string]: SuperdocsTheme;
}
