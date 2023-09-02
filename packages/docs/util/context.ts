import { GroupedDeclarationCollection } from "@gordonmleigh/superdocs-kit/content/declarations";
import { ContentCollection } from "@gordonmleigh/superdocs-kit/content/markdown";
import { serverContext } from "@gordonmleigh/superdocs-kit/util/serverContext";
import rehypePrism from "@mapbox/rehype-prism";
import { SiteMeta } from "./SiteMeta";

export const packageDeclarations = serverContext(
  "packageDeclarations",
  () =>
    new GroupedDeclarationCollection({
      packagePath: "@gordonmleigh/superdocs",
      repoUrl: SiteMeta.repo,
    }),
);

export const markdownContent = serverContext("markdownContent", async () => {
  const collection = new ContentCollection({
    mdxOptions: {
      rehypePlugins: [rehypePrism],
    },
  });

  await collection.addPages("./content/**/*.mdx", {
    contentBasePath: "./content/",
  });

  await collection.addPage("../../README.md", {
    metaDefaults: {
      hideTitle: true,
      order: 0,
      slug: "introduction",
      title: "Introduction",
    },
  });

  collection.sort();
  return collection;
});
