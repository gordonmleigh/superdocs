import { MainLayout } from "@/components/MainLayout";
import { Prose } from "@/components/Prose";
import { fetchAllContent, fetchContentBySlug } from "@/util/content";
import { SiteMeta } from "@/util/metadata";
import { Metadata } from "next";

interface DocsPageParams {
  params: { slug?: string[] };
}

export async function generateMetadata({
  params: { slug },
}: DocsPageParams): Promise<Metadata> {
  const { meta } = await fetchContentBySlug(slug);
  return {
    title: [SiteMeta.title, meta.pageTitle ?? meta.title]
      .filter(Boolean)
      .join(" – "),
  };
}

export async function generateStaticParams(): Promise<
  DocsPageParams["params"][]
> {
  const content = await fetchAllContent();
  return content.map((x) => ({
    slug: (x.meta.slug as string).split("/").filter(Boolean),
  }));
}

export default async function DocsPage({
  params: { slug },
}: DocsPageParams): Promise<JSX.Element> {
  const { content, meta } = await fetchContentBySlug(slug);

  return (
    <MainLayout>
      <Prose as="article">
        {!meta.hideTitle && (
          <h1>
            {meta.title} <i className="codicon codicon-github" />
          </h1>
        )}
        {content}
      </Prose>
    </MainLayout>
  );
}
