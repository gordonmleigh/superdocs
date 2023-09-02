import { markdownContent } from "@/util/context";
import { SiteMeta } from "@/util/SiteMeta";
import { Metadata } from "next";
import { notFound } from "next/navigation";

interface DocsPageParams {
  params: { slug?: string[] };
}

export async function generateMetadata({
  params: { slug },
}: DocsPageParams): Promise<Metadata> {
  const content = await markdownContent.current;
  const page = content.getPage(slug);
  if (!page) {
    throw new Error(`can't find page with slug ${slug}`);
  }
  return {
    title: [SiteMeta.title, page.meta.pageTitle].filter(Boolean).join(" – "),
  };
}

export async function generateStaticParams(): Promise<
  DocsPageParams["params"][]
> {
  return [...(await markdownContent.current)].map((x) => ({
    slug: x.meta.slug.split("/").filter(Boolean),
  }));
}

export default async function DocsPage({
  params: { slug },
}: DocsPageParams): Promise<JSX.Element> {
  const collection = await markdownContent.current;
  const page = collection.getPage(slug);
  if (!page) {
    return notFound();
  }

  return (
    <article className="prose dark:prose-invert">
      {!page.meta.hideTitle && <h1>{page.meta.title}</h1>}
      {page.content}
    </article>
  );
}
