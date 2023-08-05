import { getGitSha } from "@/util/getGitSha.js";
import { getWorkspaceRoot } from "@/util/getWorkspaceRoot.js";
import { SiteMeta } from "@/util/metadata.js";
import {
  Declaration,
  DeclarationCollection,
  sortDeclarationsByName,
} from "superdocs/core/DeclarationCollection";
import { assert } from "./assert";
import { serverContext } from "./serverContext";
import { slugify } from "./slugify";

interface DeclarationContext {
  collection: DeclarationCollection;
  groups: DeclarationGroup[];
}

export interface DeclarationGroup {
  declarations: Declaration[];
  name: string;
  slug: string;
}

export const DefaultGroup: DeclarationGroup = {
  declarations: [],
  name: "Other",
  slug: "other",
};

const [getContext, setContext] = serverContext<DeclarationContext>(
  "DeclarationCollection",
);

if (!getContext()) {
  const collection = new DeclarationCollection({
    codeLinks: {
      sha: getGitSha(),
      url: SiteMeta.repo,
    },
    packagePath: "superdocs",
    sourceRoot: getWorkspaceRoot(),
  });

  const groups = new Map<string, DeclarationGroup>();

  for (const declaration of collection) {
    if (declaration.parent) {
      // is not a top level declaration
      continue;
    }

    let group: DeclarationGroup | undefined;
    if (!declaration.group) {
      group = groups.get(DefaultGroup.name);
      if (!group) {
        group = { ...DefaultGroup };
        groups.set(DefaultGroup.name, group);
      }
    } else {
      group = groups.get(declaration.group);

      if (!group) {
        group = {
          declarations: [],
          name: declaration.group,
          slug: slugify(declaration.group),
        };
        groups.set(declaration.group, group);
      }
    }
    group.declarations.push(declaration);
  }

  const groupsList = [...groups.values()].sort((a, b) =>
    a.name.localeCompare(b.name),
  );
  for (const group of groupsList) {
    group.declarations.sort(sortDeclarationsByName);
  }

  setContext({
    collection,
    groups: groupsList,
  });
}

export function fetchDeclarationCollection(): DeclarationCollection {
  const value = getContext();
  assert(value, "no value for DeclarationCollection");
  return value.collection;
}

export function fetchDeclarationGroups(): DeclarationGroup[] {
  const value = getContext();
  assert(value, "no value for DeclarationCollection");
  return value.groups;
}
