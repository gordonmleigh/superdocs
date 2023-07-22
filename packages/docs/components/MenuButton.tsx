import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/solid';

export interface MenuButtonProps {
  onClick?: () => void;
  open?: boolean;
}

export function MenuButton({ open, onClick }: MenuButtonProps) {
  const ToggleIcon = open ? XMarkIcon : Bars3Icon;
  return (
    <button
      type="button"
      className="flex h-6 w-6 items-center justify-center rounded-md transition hover:bg-zinc-900/5 dark:hover:bg-white/5"
      aria-label={open ? 'close navigation' : 'open navigation'}
      onClick={onClick}
    >
      <ToggleIcon className="w-4 stroke-zinc-900 dark:stroke-white" />
    </button>
  );
}
