import { mdxComponents } from "@/components/mdx";
import rehypePrism from "@mapbox/rehype-prism";
import { glob } from "fast-glob";
import { readFile } from "fs/promises";
import { compileMDX } from "next-mdx-remote/rsc";
import { resolve } from "path";
import { ReactNode, cache } from "react";

const ContentPath = resolve("./content");

export interface ContentPage {
  content: ReactNode;
  meta: {
    hideTitle?: boolean;
    order?: number;
    pageTitle?: string;
    slug?: string;
    title?: string;
  };
}

export const fetchAllContent = cache(fetchAllContentInternal);

async function fetchAllContentInternal(): Promise<ContentPage[]> {
  const paths = await glob("**/*.mdx", { cwd: ContentPath });
  const pages: ContentPage[] = [];

  for (const path of paths) {
    pages.push(await fetchPage(path));
  }

  const readme = await fetchPage(resolve("../../README.md"));
  readme.meta.order = 0;
  readme.meta.hideTitle = true;
  readme.meta.slug = "/introduction";
  readme.meta.title = "Introduction";
  pages.push(readme);

  pages.sort((a, b) => (a.meta.order ?? 1000) - (b.meta.order ?? 1000));
  return pages;
}

async function fetchPage(path: string): Promise<ContentPage> {
  // https://github.com/vercel/next.js/discussions/50897#discussioncomment-6122518
  const fileContent = await readFile(resolve(ContentPath, path), {
    encoding: "utf-8",
  });
  const { frontmatter, content } = await compileMDX({
    source: fileContent,
    options: {
      mdxOptions: {
        rehypePlugins: [rehypePrism],
      },
      parseFrontmatter: true,
    },
    components: mdxComponents,
  });
  if (frontmatter.order) {
    try {
      frontmatter.order = parseInt(frontmatter.order as string, 10);
    } catch {}
  }

  return {
    meta: {
      title: "Untitled",
      ...frontmatter,
      slug: normaliseSlug(
        (frontmatter.slug as string) ?? path.replace(/\.mdx$/, ""),
      ),
    },
    content,
  };
}

export const fetchContentBySlug = cache(
  async (slug: string | string[] | undefined) => {
    const content = await fetchAllContent();
    const normalised = normaliseSlug(slug);
    const page = content.find((x) => x.meta.slug === normalised);
    if (!page) {
      throw new Error(`can't find content with slug ${normalised}`);
    }
    return page;
  },
);

function normaliseSlug(slug: string | string[] | undefined): string {
  if (Array.isArray(slug)) {
    // join and split again in case array elements also need normalised
    return normaliseSlug(slug.join("/"));
  }
  if (!slug) {
    return "/";
  }
  return "/" + slug.split("/").filter(Boolean).join("/");
}
