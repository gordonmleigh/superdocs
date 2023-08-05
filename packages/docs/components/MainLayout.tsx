import { fetchAllContent } from "@/util/content";
import { fetchDeclarationGroups } from "@/util/declarations";
import { styled } from "@/util/styled";
import { ReactNode } from "react";
import { Navigation } from "./Navigation";
import { NavigationLink } from "./NavigationLink";

const NavigationSection = styled("div", "text-xs uppercase mt-8");

export interface MainLayoutProps {
  children?: ReactNode;
}

export async function MainLayout({
  children,
}: MainLayoutProps): Promise<JSX.Element> {
  const pages = await fetchAllContent();
  const groups = fetchDeclarationGroups();

  return (
    <div className="lg:ml-72 xl:ml-80">
      <Navigation>
        <Navigation.Pages>
          <NavigationSection>Getting Started</NavigationSection>
          {pages.map((page) => (
            <NavigationLink
              href={"/docs" + page.meta.slug}
              key={page.meta.slug}
              title={page.meta.title}
            />
          ))}
          <NavigationSection>API</NavigationSection>
          {groups.map((group) => (
            <NavigationLink
              href={`/code/groups/${group.slug}`}
              key={group.slug}
              title={group.name}
            >
              {group.declarations.map((def) => (
                <NavigationLink
                  href={`/code/groups/${group.slug}#${def.slug}`}
                  key={def.slug}
                  title={def.name}
                />
              ))}
            </NavigationLink>
          ))}
        </Navigation.Pages>
        <Navigation.Sections>
          <Navigation.SectionLink href="/docs/introduction">
            Documentation
          </Navigation.SectionLink>
          <Navigation.SectionLink href="/code">API</Navigation.SectionLink>
        </Navigation.Sections>
      </Navigation>

      <div className="relative">
        <main className="min-h-[100vh] px-4 pb-16 pt-28 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  );
}
