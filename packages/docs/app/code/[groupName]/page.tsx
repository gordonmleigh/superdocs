import { MainLayout } from "@/components/MainLayout";
import { fetchDeclarationCollection } from "@/util/declarations";
import { notFound } from "next/navigation";
import { DeclarationInfo } from "superdocs/components/DeclarationInfo";

interface GroupPageParams {
  params: { groupName: string };
}

export default function GroupPage({
  params: { groupName },
}: GroupPageParams): JSX.Element {
  const collection = fetchDeclarationCollection();
  const group = collection.groups.find((x) => x.slug === groupName);

  if (!group) {
    return notFound();
  }

  return (
    <MainLayout>
      <h1>{group.name}</h1>
      {group.declarations.map((def) => (
        <DeclarationInfo declaration={def} key={def.slug} />
      ))}
    </MainLayout>
  );
}
