import clsx from "clsx";
import Link from "next/link";
import { ReactNode } from "react";
import { SidebarPanel } from "./SidebarPanel";

export interface SidebarProps {
  children?: ReactNode;
  logo?: ReactNode;
  sections?: ReactNode;
  title: string;
}

export function Sidebar({
  children,
  logo,
  sections,
  title,
}: SidebarProps): JSX.Element {
  return (
    <SidebarPanel>
      <div className="flex w-full flex-col">
        <div className="hidden h-14 content-center px-6 py-4 lg:flex bg-inherit">
          <Link href="/" aria-label="Home">
            <div className="flex content-center gap-2 h-6">
              {logo}
              <div className="dark:text-white">{title}</div>
            </div>
          </Link>
        </div>
        <div className="overflow-y-auto px-6">
          <nav className="mt-5 md:hidden">
            <ul
              className={clsx(
                "flex flex-col",
                "nav-link:block nav-link:py-1 nav-link:text-sm nav-link:text-zinc-600",
                "nav-link:transition nav-link:hover:text-zinc-900",
                "dark:nav-link:text-zinc-400 dark:nav-link:hover:text-white",
              )}
            >
              {sections}
            </ul>
          </nav>

          {children}
        </div>
      </div>
    </SidebarPanel>
  );
}

export interface SidebarSectionProps {
  children?: ReactNode;
  title?: ReactNode;
}

export function SidebarSection({
  children,
  title,
}: SidebarSectionProps): JSX.Element {
  return (
    <>
      {title && (
        <h3 className="text-xs semibold mt-8 dark:text-white">{title}</h3>
      )}
      <ul
        className={clsx(
          "nav-link:block nav-link:py-1 nav-link:text-sm nav-link:text-zinc-600",
          "nav-link:transition nav-link:hover:text-zinc-900",
          "dark:nav-link:text-zinc-400 dark:nav-link:hover:text-white",
        )}
      >
        {children}
      </ul>
    </>
  );
}
