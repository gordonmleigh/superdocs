"use client";
import { ReactNode, useState } from "react";
import { Sidebar } from "./Sidebar";
import { TopNav } from "./TopNav";

export interface NavigationClientProps {
  pages?: ReactNode;
  sections?: ReactNode;
}

export function NavigationClient({
  pages,
  sections,
}: NavigationClientProps): JSX.Element {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <TopNav
        menuOpen={menuOpen}
        onMenuClick={() => setMenuOpen((x) => !x)}
        sections={sections}
      />
      <Sidebar
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        pages={pages}
        sections={sections}
      />
    </>
  );
}
