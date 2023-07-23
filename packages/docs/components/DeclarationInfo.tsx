import { getGitSha } from "@/util/getGitSha";
import { SiteMeta } from "@/util/metadata";
import { Declaration, useLibraryLoader } from "superdocs";
import { FormatDeclaration } from "./FormatDeclaration";
import { JSDoc } from "./JSDoc";

export interface DeclarationInfoProps {
  declaration: Declaration;
}

export function DeclarationInfo({ declaration }: DeclarationInfoProps) {
  const lib = useLibraryLoader();
  const description = lib.getDocumentation(declaration);
  const pos = lib.getPosition(declaration);

  return (
    <>
      <h2 className="mb-0" id={lib.getDeclarationFragment(declaration)}>
        {declaration.name?.text}
      </h2>
      <a
        className="text-sm font-light text-zinc-500"
        href={`${SiteMeta.repo}/blob/${getGitSha()}/${pos.path}`}
      >
        {pos.path}:{pos.line}
      </a>
      <FormatDeclaration node={declaration} />
      <p>
        <JSDoc comment={description} />
      </p>
    </>
  );
}
