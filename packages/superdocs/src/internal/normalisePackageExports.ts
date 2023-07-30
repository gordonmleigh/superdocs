import { statSync } from "fs";
import { basename, dirname, extname, join, resolve } from "path";
import { wildcard } from "./wildcard";

export interface PackageJsonExportInfo {
  exports?: string | PackageExportMap;
  main?: string;
  module?: string;
  types?: string;
}

export interface PackageExportMap {
  [key: string]: string | ConditionalExport;
}

export interface ConditionalExport {
  default?: string;
  import?: string;
  require?: string;
  types?: string;
}

export function normalisePackageExports(
  packagePath: string,
  source: PackageJsonExportInfo,
): Record<string, string> {
  const output: Record<string, string> = {};

  if (!source.exports || typeof source.exports === "string") {
    return {
      ".": getTypesPath(
        packagePath,
        source.types,
        source.exports ?? source.module ?? source.main,
      ),
    };
  }

  for (const [key, value] of Object.entries(source.exports)) {
    const norm = typeof value === "string" ? { default: value } : value;
    const js = norm.import ?? norm.require ?? norm.default;
    const search = norm.types ?? js;
    if (!search) {
      continue;
    }

    if (search.includes("*")) {
      const matches = wildcard(search, packagePath);
      for (const { path, replacement } of matches) {
        output[key.replace("*", replacement)] = getTypesPath(
          packagePath,
          norm.types ? path : undefined,
          js,
        );
      }
    } else {
      output[key] = getTypesPath(packagePath, norm.types, js);
    }
  }

  return output;
}

function getTypesPath(
  packagePath: string,
  tsPath: string | undefined,
  jsPath: string | undefined,
): string {
  if (tsPath) {
    const fullPath = resolve(packagePath, tsPath);
    statSync(fullPath);
    return fullPath;
  }
  if (!jsPath) {
    throw new Error(`nothing to import`);
  }

  const fullPath = resolve(packagePath, jsPath);
  const dir = dirname(fullPath);
  const base = basename(fullPath, extname(fullPath));
  const resolvedTsPath = join(dir, base + ".d.ts");
  statSync(resolvedTsPath);
  return resolvedTsPath;
}
