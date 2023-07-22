import { getGitSha } from '@/util/getGitSha';
import {
  Declaration,
  loadLibraryDefinition,
} from '@/util/loadLibraryDefinition';
import { SiteMeta } from '@/util/metadata';
import { slugifyDeclarationName } from '@/util/slugifyDeclarationName';
import { FormatDeclaration } from './FormatDeclaration';
import { JSDoc } from './JSDoc';

export interface DeclarationInfoProps {
  declaration: Declaration;
}

export async function DeclarationInfo({ declaration }: DeclarationInfoProps) {
  const lib = await loadLibraryDefinition();
  const description = lib.getDocumentation(declaration);
  const pos = lib.getPosition(declaration);

  return (
    <>
      <h2 className="mb-0" id={slugifyDeclarationName(declaration)}>
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
