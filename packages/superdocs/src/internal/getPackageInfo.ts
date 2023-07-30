import { readFileSync } from "fs";
import { basename, dirname, join } from "path";
import { normalisePackageExports } from "./normalisePackageExports";
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
  const entryPoints = normalisePackageExports(packagePath, packageJson);

  return {
    name: packageJson.name,
    version: packageJson.version,
    entryPoints,
  };
}
