import { Logo } from "@/components/Logo";
import { SiteMeta } from "@/util/SiteMeta.js";
import { markdownContent, packageDeclarations } from "@/util/context";
import { DarkModeScript } from "@gordonmleigh/superdocs-kit/components/DarkModeScript";
import { MainLayout } from "@gordonmleigh/superdocs-kit/components/MainLayout";
import { SidebarSection } from "@gordonmleigh/superdocs-kit/components/Sidebar";
import { SymbolIcon } from "@gordonmleigh/superdocs/components/SymbolIcon";
import clsx from "clsx";
import { Inter } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: SiteMeta.title,
  description: "A test of some documentation",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return (
    <html lang="en" className="h-full scroll-pt-20 scroll-smooth">
      <head>
        <link
          rel="icon"
          href={`${SiteMeta.basePath}/icon-32.png`}
          sizes="32x32"
        />
        <link
          rel="icon"
          href={`${SiteMeta.basePath}/icon-128.png`}
          sizes="128x128"
        />
        <link
          rel="icon"
          href={`${SiteMeta.basePath}/icon-256.png`}
          sizes="256x256"
        />
        <DarkModeScript />
      </head>
      <body
        className={clsx(
          "h-full bg-white dark:bg-zinc-900",
          "superdocs dark:superdocs-dark",
          inter.className,
        )}
      >
        <MainLayout
          logo={<Logo className="h-6" />}
          pages={<NavigationPages />}
          repoHref={SiteMeta.repo}
          sections={<NavigationSections />}
          title={SiteMeta.title}
        >
          {children}
        </MainLayout>
      </body>
    </html>
  );
}

async function NavigationPages(): Promise<JSX.Element> {
  const groups = packageDeclarations.current.groups;
  const pages = [...(await markdownContent.current)];
  return (
    <>
      <SidebarSection title="Getting Started">
        {pages.map((page) => (
          <li key={page.meta.slug}>
            <Link href={"/docs" + page.meta.slug}>{page.meta.title}</Link>
          </li>
        ))}
      </SidebarSection>

      <SidebarSection title="API">
        {groups.map((group) => (
          <li key={group.slug}>
            <Link href={`/code/groups/${group.slug}`}>{group.name}</Link>
            <ul>
              {group.declarations.map((def) => (
                <li key={def.slug}>
                  <Link href={`/code/groups/${group.slug}#${def.slug}`}>
                    <>
                      <SymbolIcon node={def.node} />
                      &nbsp;{def.name}
                    </>
                  </Link>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </SidebarSection>
    </>
  );
}

function NavigationSections(): JSX.Element {
  return (
    <>
      <li>
        <Link href="/docs/introduction">Documentation</Link>
      </li>
      <li>
        <Link href="/code">API</Link>
      </li>
    </>
  );
}
