"use client";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/solid";
import { useMenuState } from "./MenuStateContext";

export function MenuButton(): JSX.Element {
  const { isMenuOpen, setMenuOpen } = useMenuState();

  const ToggleIcon = isMenuOpen ? XMarkIcon : Bars3Icon;
  return (
    <button
      type="button"
      className="flex h-6 w-6 items-center justify-center rounded-md transition hover:bg-zinc-900/5 dark:hover:bg-white/5"
      aria-label={isMenuOpen ? "close navigation" : "open navigation"}
      onClick={() => setMenuOpen((x) => !x)}
    >
      <ToggleIcon className="w-4 stroke-zinc-900 dark:stroke-white" />
    </button>
  );
}
