import { getSlots } from "@/util/getSlots";
import Link from "next/link";
import { ReactNode } from "react";
import { NavigationClient } from "./NavigationClient";

export interface NavigationRootProps {
  children?: ReactNode;
}

export function NavigationRoot({ children }: NavigationRootProps): JSX.Element {
  const [pages, sections] = getSlots(
    children,
    NavigationPages,
    NavigationSections,
  );
  return <NavigationClient pages={pages} sections={sections} />;
}

export interface GroupProps {
  children?: ReactNode;
}

function NavigationPages({ children }: GroupProps): JSX.Element {
  return <>{children}</>;
}

function NavigationSections({ children }: GroupProps): JSX.Element {
  return <>{children}</>;
}

export interface LinkProps {
  children?: ReactNode;
  href: string;
}

function NavigationPageLink({ children, href }: LinkProps): JSX.Element {
  return (
    <li>
      <Link
        href={href}
        className="block py-1 text-sm text-zinc-600 transition hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
      >
        {children}
      </Link>
    </li>
  );
}

function NavigationSectionLink({ children, href }: LinkProps): JSX.Element {
  return (
    <li>
      <Link
        href={href}
        className="block md:inline py-1 text-sm md:leading-5 text-zinc-600 transition hover:text-zinc-900"
      >
        {children}
      </Link>
    </li>
  );
}

export const Navigation = Object.assign(NavigationRoot, {
  PageLink: NavigationPageLink,
  Pages: NavigationPages,
  SectionLink: NavigationSectionLink,
  Sections: NavigationSections,
});
