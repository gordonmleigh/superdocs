import { existsSync } from "fs";
import { dirname, join } from "path";

export function getWorkspaceRoot(fromPath = process.cwd()): string {
  for (let curr = fromPath; dirname(curr) !== curr; curr = dirname(curr)) {
    if (existsSync(join(curr, "package-lock.json"))) {
      return curr;
    }
  }
  throw new Error(`couldn't find workspace root`);
}
