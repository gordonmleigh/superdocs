import { readdirSync } from "fs";
import { basename, dirname, join, resolve } from "path";

const validWildcard = /^([^*]*)\*([^*]*)$/;

export interface WildcardMatch {
  path: string;
  replacement: string;
}

export function wildcard(pattern: string, cwd = "."): WildcardMatch[] {
  let root = resolve(cwd, pattern);
  let rest = "";

  for (;;) {
    // it's written this way rather than splitting the path or whatever so that
    // it works on Windows
    const dir = dirname(root);
    const base = basename(root);

    if (base.includes("*")) {
      // found the wildcard
      const match = validWildcard.exec(base);
      if (!match) {
        throw new Error(`invalid wildcard pattern '${pattern}'`);
      }
      const [, before, after] = match;
      const regex = new RegExp(
        `^${escapeRegExp(before)}(.+)${escapeRegExp(after)}$`,
      );

      const folderEntries = readdirSync(dir);
      const matches: WildcardMatch[] = [];

      for (const entry of folderEntries) {
        const result = regex.exec(entry);
        if (result) {
          matches.push({
            path: join(dir, entry, rest),
            replacement: result[1],
          });
        }
      }
      return matches;
    } else {
      // shuffle the current portion of the root onto rest
      root = dir;
      rest = join(base, rest);
    }
    if (dir === root) {
      // we reached the root without finding a wildcard
      return [
        {
          path: pattern,
          replacement: "",
        },
      ];
    }
  }
}

//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions#escaping
function escapeRegExp(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // $& means the whole matched string
}
