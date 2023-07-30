"use client";
import { ReactNode, useState } from "react";
import { Sidebar } from "./Sidebar";
import { TopNav } from "./TopNav";

export interface NavigationClientProps {
  pages?: ReactNode;
}

export function NavigationClient({
  pages,
}: NavigationClientProps): JSX.Element {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <TopNav menuOpen={menuOpen} onMenuClick={() => setMenuOpen((x) => !x)} />
      <Sidebar open={menuOpen}>{pages}</Sidebar>
    </>
  );
}
