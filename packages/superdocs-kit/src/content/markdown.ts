import { glob } from "fast-glob";
import { readFile } from "fs/promises";
import { compileMDX, MDXRemoteProps } from "next-mdx-remote/rsc";
import { basename, relative, resolve } from "path";
import { ReactNode } from "react";
import { SortFunction, then } from "../util/sort";

export interface ContentInputMeta {
  hideTitle?: boolean;
  order?: number | string;
  pageTitle?: string;
  slug?: string;
  title?: string;
}

export interface ContentMeta {
  hideTitle?: boolean;
  order: number;
  pageTitle: string;
  slug: string;
  title: string;
}

export interface ContentOptions {
  components?: MdxComponents;
  contentBasePath?: string;
  metaDefaults?: Partial<ContentMeta>;
  mdxOptions?: MdxOptions;
}

export interface ContentPage {
  content: ReactNode;
  meta: ContentMeta;
}

export type MdxComponents = Required<MDXRemoteProps>["components"];
export type MdxOptions = Required<MDXRemoteProps>["options"]["mdxOptions"];

export interface ContentCollectionOptions {
  contentBasePath?: string;
  components?: MdxComponents;
  mdxOptions?: MdxOptions;
}

function normalizeMeta(input: ContentInputMeta, fileName: string): ContentMeta {
  const defaultTitle = "Untitled";

  return {
    pageTitle: input.title ?? defaultTitle,
    title: defaultTitle,
    ...input,
    slug: normalizeSlug(input.slug ?? fileName.replace(/\.mdx?$/, "")),
    order:
      input.order !== undefined
        ? typeof input.order === "string"
          ? parseInt(input.order, 10)
          : input.order
        : Number.MAX_VALUE,
  };
}

export class ContentCollection implements Iterable<ContentPage> {
  private readonly content: ContentPage[] = [];

  constructor(private readonly options: ContentCollectionOptions = {}) {}

  public [Symbol.iterator](): Iterator<ContentPage> {
    return this.content[Symbol.iterator]();
  }

  public async addPage(
    path: string,
    opts?: ContentOptions,
  ): Promise<ContentPage> {
    const page = await this.readPage(path, opts);
    this.content.push(page);
    return page;
  }

  public async addPages(
    globs: string | string[],
    opts?: ContentOptions,
  ): Promise<void> {
    const files = await glob(globs);

    for (const file of files) {
      await this.addPage(file, opts);
    }
  }

  public getPage(slug: string | string[] | undefined): ContentPage | undefined {
    const normalizedSlug = normalizeSlug(slug);
    return this.content.find((x) => x.meta.slug === normalizedSlug);
  }

  public async readPage(
    path: string,
    opts?: ContentOptions,
  ): Promise<ContentPage> {
    // https://github.com/vercel/next.js/discussions/50897#discussioncomment-6122518
    const fileContent = await readFile(path, "utf-8");

    const { frontmatter, content } = await compileMDX({
      source: fileContent,
      options: {
        mdxOptions: {
          ...this.options.mdxOptions,
          ...opts?.mdxOptions,
        },
        parseFrontmatter: true,
      },
      components: {
        ...this.options.components,
        ...opts?.components,
      },
    });

    const contentBasePath =
      opts?.contentBasePath ?? this.options.contentBasePath;

    const relativePath = contentBasePath
      ? relative(resolve(contentBasePath), resolve(path))
      : basename(path);

    return {
      meta: normalizeMeta(
        {
          ...opts?.metaDefaults,
          ...frontmatter,
        },
        relativePath,
      ),
      content,
    };
  }

  public sort(...sorts: SortFunction<ContentPage>[]): void {
    const defaultedSorts: SortFunction<ContentPage>[] =
      sorts.length === 0
        ? [
            (a, b) => a.meta.order - b.meta.order,
            (a, b) => a.meta.title.localeCompare(b.meta.title),
          ]
        : sorts;
    this.content.sort(then(...defaultedSorts));
  }
}

function normalizeSlug(slug: string | string[] | undefined): string {
  if (Array.isArray(slug)) {
    // join and split again in case array elements also need normalized
    return normalizeSlug(slug.join("/"));
  }
  if (!slug) {
    return "/";
  }
  return "/" + slug.split("/").filter(Boolean).join("/");
}
