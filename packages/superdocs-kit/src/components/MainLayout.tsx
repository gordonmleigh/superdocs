import { ReactNode } from "react";
import { MenuStateContextProvider } from "./MenuStateContext";
import { Sidebar } from "./Sidebar";
import { TopNav } from "./TopNav";

export interface MainLayoutProps {
  children?: ReactNode;
  logo?: ReactNode;
  repoHref?: string;
  pages?: ReactNode;
  sections?: ReactNode;
  title: string;
}

export function MainLayout({
  children,
  logo,
  repoHref,
  pages,
  sections,
  title,
}: MainLayoutProps): JSX.Element {
  return (
    <div className="lg:ml-72 xl:ml-80">
      <MenuStateContextProvider>
        <TopNav
          logo={logo}
          repoHref={repoHref}
          sections={sections}
          title={title}
        />
        <Sidebar logo={logo} sections={sections} title={title}>
          {pages}
        </Sidebar>
      </MenuStateContextProvider>

      <div className="relative">
        <main className="min-h-[100vh] px-4 pb-16 pt-28 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  );
}
