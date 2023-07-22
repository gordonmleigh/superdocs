import { fetchAllContent } from '@/util/content';
import { getDeclarationUrl } from '@/util/getDeclarationUrl';
import { loadLibraryDefinition } from '@/util/loadLibraryDefinition';
import { styled } from '@/util/styled';
import slugify from '@sindresorhus/slugify';
import { ReactNode } from 'react';
import { Navigation } from './Navigation';
import { NavigationLink } from './NavigationLink';
import { Prose } from './Prose';

const NavigationSection = styled('div', 'text-xs uppercase mt-8');

export interface MainLayoutProps {
  children?: ReactNode;
}

export async function MainLayout({ children }: MainLayoutProps) {
  const pages = await fetchAllContent();
  const lib = await loadLibraryDefinition();

  return (
    <div className="lg:ml-72 xl:ml-80">
      <Navigation>
        <Navigation.Pages>
          <NavigationSection>Getting Started</NavigationSection>
          {pages.map((page) => (
            <NavigationLink
              href={'/docs' + page.meta.slug}
              key={page.meta.slug}
              title={page.meta.title}
            />
          ))}
          <NavigationSection>API</NavigationSection>
          {lib.entries()?.map(([groupName, defs]) => (
            <NavigationLink
              href={`/code/${slugify(groupName)}`}
              key={groupName}
              title={groupName}
            >
              {defs.map((def) => (
                <NavigationLink
                  href={getDeclarationUrl(lib, def)}
                  key={def.name?.text}
                  title={def.name?.text}
                />
              ))}
            </NavigationLink>
          ))}
        </Navigation.Pages>
      </Navigation>

      <div className="relative">
        <main className="min-h-[100vh] px-4 pb-16 pt-28 sm:px-6 lg:px-8">
          <Prose as="article">{children}</Prose>
        </main>
      </div>
    </div>
  );
}
