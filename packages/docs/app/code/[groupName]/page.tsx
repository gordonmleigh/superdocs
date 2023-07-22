import { DeclarationInfo } from '@/components/DeclarationInfo';
import { MainLayout } from '@/components/MainLayout';
import { loadLibraryDefinition } from '@/util/loadLibraryDefinition';
import { slugifyDeclarationName } from '@/util/slugifyDeclarationName';
import { notFound } from 'next/navigation';
import ts from 'typescript';

function getKey(node: ts.Node): string {
  return `${node.getSourceFile().fileName}#${node.pos}`;
}

interface GroupPageParams {
  params: { groupName?: string };
}

export default async function GroupPage({
  params: { groupName },
}: GroupPageParams) {
  const group = (await loadLibraryDefinition())
    .entries()
    .find(([name]) => name === groupName)?.[1];

  if (!group) {
    return notFound();
  }

  return (
    <MainLayout>
      <h1>{groupName}</h1>
      {group.map((def) => (
        <DeclarationInfo declaration={def} key={slugifyDeclarationName(def)} />
      ))}
    </MainLayout>
  );
}
