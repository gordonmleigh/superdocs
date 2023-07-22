import slugify from '@sindresorhus/slugify';
import ts from 'typescript';
import { Declaration, LibraryLoader } from './loadLibraryDefinition';
import { slugifyDeclarationName } from './slugifyDeclarationName';

export function getDeclarationUrl(
  lib: LibraryLoader,
  def: Declaration,
): string {
  const groupName = lib.getGroupName(def);
  return `/code/${slugify(groupName)}#${slugifyDeclarationName(def)}`;
}

export function getDeclarationUrlForName(
  lib: LibraryLoader,
  name: ts.EntityName | ts.JSDocMemberName,
): string | undefined {
  const def = lib.getDeclaration(name);
  return def && getDeclarationUrl(lib, def);
}
