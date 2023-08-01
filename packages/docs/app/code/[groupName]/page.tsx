import { MainLayout } from "@/components/MainLayout";
import { fetchDeclarationCollection } from "@/util/declarations";
import { notFound } from "next/navigation";
import { DeclarationInfo } from "superdocs/components/DeclarationInfo";

interface GroupPageParams {
  params: { groupName: string };
}

export function generateStaticParams(): GroupPageParams["params"][] {
  const collection = fetchDeclarationCollection();
  return collection.groups.map(({ slug }) => ({ groupName: slug }));
}

export default function GroupPage({
  params: { groupName },
}: GroupPageParams): JSX.Element {
  const collection = fetchDeclarationCollection();
  const group = collection.groups.find((x) => x.slug === groupName);

  if (!group) {
    return notFound();
  }

  const sortedDeclarations = group.declarations
    .slice()
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <MainLayout>
      <h1>{group.name}</h1>
      {sortedDeclarations.map((def) => (
        <DeclarationInfo declaration={def} key={def.slug} />
      ))}
    </MainLayout>
  );
}
