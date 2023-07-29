import { DeclarationInfo } from "@/components/DeclarationInfo";
import { MainLayout } from "@/components/MainLayout";
import { notFound } from "next/navigation";
import { useDeclarationCollection } from "superdocs";

interface GroupPageParams {
  params: { groupName: string };
}

export default function GroupPage({ params: { groupName } }: GroupPageParams) {
  const lib = useDeclarationCollection();
  const group = lib.groups.find((x) => x.slug === groupName);

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
