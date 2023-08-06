import { ImportInfo } from "../core/DeclarationCollection";
import { Token } from "./Token";

export interface FormatImportProps {
  info: ImportInfo;
}

export function FormatImport({ info }: FormatImportProps): JSX.Element {
  return (
    <>
      <Token keyword>import</Token>
      {info.kind === "named" && (
        <>
          <Token punctuation text=" { " />
          <Token identifier>{info.name}</Token>
          {info.localName && (
            <>
              <Token keyword>as</Token>
              <Token identifier>{info.localName}</Token>
            </>
          )}
          <Token punctuation text=" } " />
        </>
      )}
      {info.kind === "default" && (
        <Token identifier="namespace">{info.name}</Token>
      )}
      {info.kind === "star" && (
        <>
          <Token operator text="*" />
          <Token keyword>as</Token>
          <Token identifier="namespace">{info.name}</Token>
        </>
      )}
      <Token keyword>from</Token>
      <Token literal="string">&quot;{info.module}&quot;</Token>
    </>
  );
}
