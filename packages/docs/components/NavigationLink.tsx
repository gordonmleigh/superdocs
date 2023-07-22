import Link, { LinkProps } from 'next/link';
import { ReactNode } from 'react';

export interface NavigationLinkProps {
  children?: ReactNode;
  href: LinkProps['href'];
  title: ReactNode;
}

export function NavigationLink({ children, href, title }: NavigationLinkProps) {
  return (
    <div className="block py-1 text-sm text-zinc-600 transition hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white">
      <Link href={href}>{title}</Link>
      <ul className="ml-4 list-none">{children}</ul>
    </div>
  );
}
