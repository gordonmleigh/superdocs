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
          <Token operator text=" { " />
          <Token identifier>{info.name}</Token>
          {info.localName && (
            <>
              <Token keyword>as</Token>
              <Token identifier>{info.localName}</Token>
            </>
          )}
          <Token operator text=" } " />
        </>
      )}
      {info.kind === "default" && <Token identifier>{info.name}</Token>}
      {info.kind === "star" && (
        <>
          <Token operator text="*" />
          <Token keyword>as</Token>
          <Token identifier>{info.name}</Token>
        </>
      )}
      <Token keyword>from</Token>
      <Token literal="string">&quot;{info.module}&quot;</Token>
    </>
  );
}
