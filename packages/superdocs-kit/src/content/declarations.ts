import {
  Declaration,
  DeclarationCollection,
  sortDeclarationsByName,
} from "@gordonmleigh/superdocs/core/DeclarationCollection";
import { slugify } from "@gordonmleigh/superdocs/core/slugify";
import { getGitSha } from "../util/getGitSha";
import { getWorkspaceRoot } from "../util/getWorkspaceRoot";
import { SortFunction } from "../util/sort";

export interface GroupedDeclarationCollectionOptions {
  declarationSort?: SortFunction<Declaration>;
  groupSort?: SortFunction<DeclarationGroup>;
  packagePath: string;
  repoUrl: string;
  sourceRoot?: string;
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

export class GroupedDeclarationCollection extends DeclarationCollection {
  public readonly groups: DeclarationGroup[];

  constructor({
    declarationSort = sortDeclarationsByName,
    groupSort = (a, b) => a.name.localeCompare(b.name),
    packagePath,
    repoUrl,
    sourceRoot = getWorkspaceRoot(),
  }: GroupedDeclarationCollectionOptions) {
    super({
      codeLinks: {
        sha: getGitSha(),
        url: repoUrl,
      },
      packagePath,
      sourceRoot,
    });

    const groups = new Map<string, DeclarationGroup>();

    for (const declaration of this) {
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

    this.groups = [...groups.values()].sort(groupSort);

    for (const group of this.groups) {
      group.declarations.sort(declarationSort);
    }
  }

  public getGroupBySlug(slug: string): DeclarationGroup | undefined {
    return this.groups.find((x) => x.slug === slug);
  }
}
