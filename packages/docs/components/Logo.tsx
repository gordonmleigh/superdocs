import { SiteMeta } from "@/util/metadata.js";
import clsx from "clsx";

export interface LogoProps {
  className?: string;
}

export function Logo({ className }: LogoProps) {
  return (
    <div className={clsx(className, "flex content-center gap-2")}>
      <img alt="logo" src="/icon-256.png" />
      <div className="">{SiteMeta.title}</div>
    </div>
  );
}
