import { packageDeclarations } from "@/util/context";
import clsx from "clsx";
import Link from "next/link";

export default function CodePage(): JSX.Element {
  const groups = packageDeclarations.current.groups;

  return (
    <>
      <h1>API Documentation</h1>
      <nav>
        <ul
          className={clsx(
            "nav-link:flex nav-link:items-center",
            "nav-link:py-1 nav-link:text-sm nav-link:text-zinc-600",
            "nav-link:transition nav-link:hover:text-zinc-900",
            "dark:nav-link:text-zinc-400 dark:nav-link:hover:text-white",
            "nav-submenu:ml-4",
          )}
        >
          {groups.map((group) => (
            <li key={group.slug}>
              <Link href={`/code/${group.slug}`}>{group.name}</Link>
              <ul>
                {group.declarations.map((def) => (
                  <li key={def.slug}>
                    <Link href={def.documentationLink}>{def.name}</Link>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}
