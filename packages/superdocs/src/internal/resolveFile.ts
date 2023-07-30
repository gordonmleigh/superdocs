import { statSync } from "fs";
import { dirname, join, resolve } from "path";

export function resolveFileSync(
  path: string,
  from = resolve("."),
): string | undefined {
  for (let curr = from; curr !== dirname(curr); curr = dirname(curr)) {
    try {
      const resolved = join(curr, "node_modules", path);
      statSync(resolved);
      return resolved;
    } catch (err: any) {
      if (err?.code !== "ENOENT") {
        throw err;
      }
    }
  }
}
