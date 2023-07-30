import { MainLayout } from "@/components/MainLayout";
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

export async function generateStaticParams(): Promise<(string | undefined)[]> {
  const content = await fetchAllContent();
  return content.map((x) => x.meta.slug);
}

export default async function DocsPage({
  params: { slug },
}: DocsPageParams): Promise<JSX.Element> {
  const { content, meta } = await fetchContentBySlug(slug);

  return (
    <MainLayout>
      <h1>{meta.title}</h1>
      {content}
    </MainLayout>
  );
}
