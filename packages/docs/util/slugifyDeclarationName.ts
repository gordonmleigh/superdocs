import slugify from '@sindresorhus/slugify';
import ts from 'typescript';
import { Declaration } from './loadLibraryDefinition';

export function slugifyDeclarationName(def: Declaration): string {
  if (!def.name) {
    throw new Error(`expected declaration to be named`);
  }
  return slugify(ts.SyntaxKind[def.kind] + ' ' + def.name.text);
}
