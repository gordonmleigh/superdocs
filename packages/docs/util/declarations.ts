import { getGitSha } from "@/util/getGitSha.js";
import { getWorkspaceRoot } from "@/util/getWorkspaceRoot.js";
import { SiteMeta } from "@/util/metadata.js";
import { DeclarationCollection } from "superdocs/core/DeclarationCollection";
import { assert } from "./assert";
import { serverContext } from "./serverContext";

const [getContext, setContext] = serverContext<DeclarationCollection>(
  "DeclarationCollection",
);

if (!getContext()) {
  setContext(
    new DeclarationCollection({
      codeLinks: {
        sha: getGitSha(),
        url: SiteMeta.repo,
      },
      packagePath: "superdocs",
      sourceRoot: getWorkspaceRoot(),
    }),
  );
}

export function fetchDeclarationCollection(): DeclarationCollection {
  const value = getContext();
  assert(value, "no value for DeclarationCollection");
  return value;
}
