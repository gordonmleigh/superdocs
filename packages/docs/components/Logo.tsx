import clsx from "clsx";
import Image from "next/image";
import logo from "../app/icon2.png";

export interface LogoProps {
  className?: string;
}

export function Logo({ className }: LogoProps): JSX.Element {
  return (
    <div className={clsx(className, "flex content-center gap-2")}>
      <Image alt="logo" src={logo} width={24} height={24} />
    </div>
  );
}
