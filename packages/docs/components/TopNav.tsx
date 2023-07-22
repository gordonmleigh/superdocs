'use client';
import clsx from 'clsx';
import Link from 'next/link';
import { ReactNode } from 'react';
import { Logo } from './Logo';
import { MenuButton } from './MenuButton';

interface TopNavItemProps {
  children?: ReactNode;
  href: string;
}

function TopNavItem({ href, children }: TopNavItemProps) {
  return (
    <li>
      <Link
        href={href}
        className="text-sm leading-5 text-zinc-600 transition hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
      >
        {children}
      </Link>
    </li>
  );
}

export interface TopNavProps {
  menuOpen?: boolean;
  onMenuClick?: () => void;
}

export function TopNav({ menuOpen, onMenuClick }: TopNavProps) {
  return (
    <div
      className={clsx(
        'fixed inset-x-0 top-0 z-50 flex h-14 items-center justify-between gap-12 border-b border-solid border-zinc-200 bg-white px-4 transition sm:px-6 lg:left-72 lg:z-30 lg:px-8 lg:shadow-none xl:left-80',
      )}
    >
      <div className="flex items-center gap-5 lg:hidden">
        <MenuButton onClick={onMenuClick} open={menuOpen} />
        <Link href="/" aria-label="Home">
          <Logo className="h-6" />
        </Link>
      </div>
      <div className="flex items-center gap-5">
        <nav className="hidden md:block">
          <ul role="list" className="flex items-center gap-8">
            <TopNavItem href="/">API</TopNavItem>
            <TopNavItem href="#">Documentation</TopNavItem>
            <TopNavItem href="#">Support</TopNavItem>
          </ul>
        </nav>
      </div>
    </div>
  );
}
