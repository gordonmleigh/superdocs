import { Declaration, FormatDeclaration } from "superdocs";
import { JSDoc } from "./JSDoc";

export interface DeclarationInfoProps {
  declaration: Declaration;
}

export function DeclarationInfo({ declaration }: DeclarationInfoProps) {
  return (
    <>
      <h2 className="mb-0" id={declaration.slug}>
        {declaration.name}
      </h2>
      {declaration.codeLink ? (
        <a
          className="text-sm font-light text-zinc-500"
          href={declaration.codeLink}
        >
          {declaration.location.path}:{declaration.location.line}
        </a>
      ) : (
        <span className="text-sm font-light text-zinc-500">
          {declaration.location.path}:{declaration.location.line}
        </span>
      )}
      <FormatDeclaration node={declaration.node} />
      <p>
        <JSDoc comment={declaration.documentation} />
      </p>
    </>
  );
}
