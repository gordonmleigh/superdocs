"use client";
import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  createElement,
  useContext,
  useMemo,
  useState,
} from "react";

export interface MenuStateContext {
  setMenuOpen: Dispatch<SetStateAction<boolean>>;
  isMenuOpen: boolean;
}

export interface MenuStateContextProps {
  children?: ReactNode;
}

const context = createContext<MenuStateContext | undefined>(undefined);

export function MenuStateContextProvider({
  children,
}: MenuStateContextProps): JSX.Element {
  const [isMenuOpen, setMenuOpen] = useState(false);

  const value = useMemo(
    () => ({ setMenuOpen, isMenuOpen }),
    [setMenuOpen, isMenuOpen],
  );

  return createElement(context.Provider, { value }, children);
}

export function useMenuState(): MenuStateContext {
  const value = useContext(context);
  if (!value) {
    throw new Error(
      `no value for MenuStateContext (did you forget <MenuStateContextProvider />?)`,
    );
  }
  return value;
}
