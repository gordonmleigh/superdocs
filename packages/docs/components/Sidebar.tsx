import clsx from "clsx";
import Link from "next/link";
import { ReactNode } from "react";
import { Logo } from "./Logo";

export interface SidebarProps {
  onClose?: () => void;
  open?: boolean;
  pages: ReactNode;
  sections?: ReactNode;
}

export function Sidebar({
  onClose,
  open,
  pages,
  sections,
}: SidebarProps): JSX.Element {
  return (
    <>
      <div
        className={clsx(
          "fixed left-0 top-0 z-30 h-full bg-zinc-400/20 backdrop-blur-sm transition lg:hidden",
          open ? "w-full" : "w-0",
        )}
        onClick={onClose}
      />
      <div
        className={clsx(
          "fixed inset-0 z-50 mt-14 flex w-72 border-r bg-white shadow-lg shadow-zinc-900/10 transition-transform",
          "lg:mt-0 lg:transform-none lg:border-zinc-200 lg:pb-8 lg:pt-4 lg:shadow-none xl:w-80",
          open ? "transform-none" : "-translate-x-full",
        )}
      >
        <div className="flex w-full flex-col">
          <div className="hidden h-14 content-center px-6 lg:flex">
            <Link href="/" aria-label="Home">
              <Logo className="h-6" />
            </Link>
          </div>
          <div className="overflow-y-auto px-6" onClick={onClose}>
            <nav className="mt-5 md:hidden">
              <ul role="list" className="flex flex-col">
                {sections}
              </ul>
            </nav>
            {pages}
          </div>
        </div>
      </div>
    </>
  );
}
