"use client";
import clsx from "clsx";
import { ReactNode } from "react";
import { useMenuState } from "./MenuStateContext";

export interface SidebarPanelProps {
  children?: ReactNode;
}

export function SidebarPanel({ children }: SidebarPanelProps): JSX.Element {
  const { isMenuOpen, setMenuOpen } = useMenuState();

  return (
    <>
      <div
        className={clsx(
          "fixed left-0 top-0 z-30 h-full bg-zinc-400/20 backdrop-blur-sm transition lg:hidden",
          isMenuOpen ? "w-full" : "w-0",
        )}
        onClick={() => setMenuOpen(false)}
      />
      <div
        className={clsx(
          "fixed inset-0 z-50 mt-14 flex w-72 border-r bg-white dark:bg-zinc-900 shadow-lg shadow-zinc-900/10 transition-transform",
          "lg:mt-0 lg:transform-none lg:border-zinc-200 dark:lg:border-zinc-800 lg:pb-8 lg:shadow-none xl:w-80",
          isMenuOpen ? "transform-none" : "-translate-x-full",
        )}
        onClick={(e) => {
          if (e.target instanceof HTMLAnchorElement) {
            setMenuOpen(false);
          }
        }}
      >
        {children}
      </div>
    </>
  );
}
