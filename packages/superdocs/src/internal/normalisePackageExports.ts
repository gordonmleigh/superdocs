import { existsSync } from "fs";
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
    const path = getTypesPath(
      packagePath,
      source.types,
      source.exports ?? source.module ?? source.main,
    );
    if (!path) {
      throw new Error(`no types found for module: ${packagePath}`);
    }
    return {
      ".": path,
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
        const typesPath = getTypesPath(
          packagePath,
          norm.types ? path : undefined,
          js,
        );
        if (typesPath) {
          output[key.replace("*", replacement)] = typesPath;
        }
      }
    } else {
      const typesPath = getTypesPath(packagePath, norm.types, js);
      if (typesPath) {
        output[key] = typesPath;
      }
    }
  }

  return output;
}

function getTypesPath(
  packagePath: string,
  tsPath: string | undefined,
  jsPath: string | undefined,
): string | undefined {
  if (tsPath) {
    const fullPath = resolve(packagePath, tsPath);
    if (!existsSync(fullPath)) {
      return;
    }
    return fullPath;
  }
  if (!jsPath) {
    return;
  }

  const fullPath = resolve(packagePath, jsPath);
  const dir = dirname(fullPath);
  const base = basename(fullPath, extname(fullPath));
  const resolvedTsPath = join(dir, base + ".d.ts");

  if (existsSync(resolvedTsPath)) {
    return resolvedTsPath;
  }
}
