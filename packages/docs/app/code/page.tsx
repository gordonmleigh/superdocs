import { MainLayout } from "@/components/MainLayout";
import { NavigationLink } from "@/components/NavigationLink";
import { fetchDeclarationGroups } from "@/util/declarations";

export default function CodePage(): JSX.Element {
  const groups = fetchDeclarationGroups();

  return (
    <MainLayout>
      <h1>API Documentation</h1>
      <div>
        {groups.map((group) => (
          <NavigationLink
            href={`/code/${group.slug}`}
            key={group.slug}
            title={group.name}
          >
            {group.declarations.map((def) => (
              <NavigationLink
                href={def.documentationLink}
                key={def.slug}
                title={def.name}
              />
            ))}
          </NavigationLink>
        ))}
      </div>
    </MainLayout>
  );
}
