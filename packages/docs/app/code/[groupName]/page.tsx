import { DeclarationInfo } from "@/components/DeclarationInfo";
import { MainLayout } from "@/components/MainLayout";
import { notFound } from "next/navigation";
import { useLibraryLoader } from "superdocs";

interface GroupPageParams {
  params: { groupName: string };
}

export default function GroupPage({ params: { groupName } }: GroupPageParams) {
  const lib = useLibraryLoader();
  const group = lib.getDeclarationsForGroupUrl(groupName);

  if (!group) {
    return notFound();
  }

  return (
    <MainLayout>
      <h1>{groupName}</h1>
      {group.map((def) => (
        <DeclarationInfo
          declaration={def}
          key={lib.getDeclarationFragment(def)}
        />
      ))}
    </MainLayout>
  );
}
