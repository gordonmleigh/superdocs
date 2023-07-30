import { readFileSync, statSync } from "fs";
import { basename, dirname, extname, join, resolve } from "path";
import { resolveFileSync } from "./resolveFile";

export interface PackageInfo {
  entryPoints: Record<string, string>;
  name: string;
  version: string;
}

export function getPackageInfo(pathOrModuleId: string): PackageInfo {
  let packageJsonPath: string | undefined;
  if (basename(pathOrModuleId) === "package.json") {
    packageJsonPath = pathOrModuleId;
  } else {
    packageJsonPath = resolveFileSync(join(pathOrModuleId, "package.json"));
    if (!packageJsonPath) {
      throw new Error(`unable to resolve module '${pathOrModuleId}'`);
    }
  }

  const packagePath = dirname(packageJsonPath);
  const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf8"));

  if (!packageJson.exports) {
    return {
      name: packageJson.name,
      version: packageJson.version,
      entryPoints: {
        ".": getTypesPath(
          packagePath,
          packageJson.types,
          packageJson.main ?? packageJson.module,
        ),
      },
    };
  }

  return {
    name: packageJson.name,
    version: packageJson.version,
    entryPoints: Object.fromEntries(
      Object.entries(packageJson.exports).map(
        ([name, exports]: [string, any]) => [
          name,
          typeof exports === "string"
            ? getTypesPath(packagePath, undefined, exports)
            : getTypesPath(
                packagePath,
                exports.types,
                exports.import ?? exports.require ?? exports.default,
              ),
        ],
      ),
    ),
  };
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
