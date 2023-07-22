import { getSlots } from '@/util/getSlots';
import Link from 'next/link';
import { ReactNode } from 'react';
import { NavigationClient } from './NavigationClient';

export interface NavigationRootProps {
  children?: ReactNode;
}

export function NavigationRoot({ children }: NavigationRootProps) {
  const [pages] = getSlots(children, NavigationPages);
  return <NavigationClient pages={pages} />;
}

export interface NavigationPagesProps {
  children?: ReactNode;
}

function NavigationPages({ children }: NavigationPagesProps) {
  return <>{children}</>;
}

export interface NavigationLinkProps {
  children?: ReactNode;
  href: string;
}

function NavigationLink({ children, href }: NavigationLinkProps) {
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

export const Navigation = Object.assign(NavigationRoot, {
  Link: NavigationLink,
  Pages: NavigationPages,
});
