/**
 * This script expands the "exportPatterns" key in a package.json to the
 * "exports" key. Node supports wildcards in the "exports" field but TypeScript
 * support for auto-import sucks a bit.
 *
 * Normally the resolution algorithm works in reverse to what we're trying to do
 * here: it starts with an import from say "package/components/Widget" and then
 * looks in the "exports" field for a matching key. Here we're trying to infer
 * all the possible keys from the file system, but since a key can map to
 * multiple files, this could get tricky. Therefore we expect an extra "src"
 * key, which points to the files that should be used to generate the keys.
 *
 * @see {@link https://github.com/microsoft/TypeScript/issues/53116}
 */
import { readFile, readdir, writeFile } from "fs/promises";
import { join, posix, resolve } from "path";
import Prettier from "prettier";

const packageJson = JSON.parse(await readFile("package.json", "utf8"));
const prettierConfig = await Prettier.resolveConfig("package.json");

if (!packageJson.exportPatterns) {
  console.error(`no "exportPatterns" section found in package.json`);
  process.exit(1);
}

packageJson.exports = await expandPatterns(packageJson.exportPatterns);
await writePretty("package.json", JSON.stringify(packageJson, null, 2));

async function writePretty(path, data) {
  await writeFile(
    path,
    await Prettier.format(data, {
      filepath: path,
      ...prettierConfig,
    }),
  );
}

async function expandPatterns(patterns, cwd = resolve(".")) {
  const expanded = {};

  for (const [key, value] of Object.entries(patterns)) {
    if (typeof value === "string" || !value.src) {
      if (key.includes("*")) {
        console.warn(`WARN: key "${key}": no value for "src" given`);
      }
      expanded[key] = value;
      continue;
    }

    const { src, ...rest } = value;
    const srcArray = Array.isArray(src) ? src : [src];

    for (const src of srcArray) {
      const fileName = posix.basename(src);
      const dir = posix.dirname(src);

      const starIndex = fileName.indexOf("*");
      if (starIndex === -1) {
        console.error(
          `export "${key}": the "src" value must contain a wildcard`,
        );
        process.exit(1);
      }

      const prefix = fileName.slice(0, starIndex);
      const suffix = fileName.slice(starIndex + 1);
      const files = await readdir(join(cwd, dir));

      for (const file of files) {
        if (!file.startsWith(prefix) || !file.endsWith(suffix)) {
          continue;
        }
        const replacement = file.slice(prefix.length, -suffix.length);

        let conditions = Object.fromEntries(
          Object.entries(rest).map(([k, v]) => [
            k,
            v.replace("*", replacement),
          ]),
        );

        if (Object.keys(conditions).length === 1 && "default" in conditions) {
          // collapse an object like { default: '...' } into '...' directly.
          conditions = conditions.default;
        }

        expanded[key.replace("*", replacement)] = conditions;
      }
    }
  }

  return expanded;
}
