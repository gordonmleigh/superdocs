import { MainLayout } from "@/components/MainLayout";
import { fetchDeclarationCollection } from "@/util/declarations";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DeclarationInfo } from "superdocs/components/DeclarationInfo";
import { FormatImport } from "superdocs/components/FormatImport";
import { JSDocMarkdown } from "superdocs/components/JSDocMarkdown";

interface DeclarationPageParams {
  params: { slug: string };
}

export function generateStaticParams(): DeclarationPageParams["params"][] {
  const declarations = fetchDeclarationCollection().declarations;
  return declarations.map(({ slug }) => ({ slug }));
}

export default function DeclarationPage({
  params: { slug },
}: DeclarationPageParams): JSX.Element {
  const collection = fetchDeclarationCollection();
  const declaration = collection.getDeclarationBySlug(slug);

  if (!declaration) {
    return notFound();
  }

  return (
    <MainLayout>
      <div className="superdocs dark:superdocs-dark">
        {declaration.parent ? (
          <div className="mb-12">
            <h1 className="text-2xl font-semibold">
              <Link href={declaration.parent.documentationLink}>
                {declaration.parent.name}
              </Link>
            </h1>
            <Link
              className="text-zinc-500 text-sm hover:underline"
              href={declaration.parent.documentationLink}
            >
              &laquo; Back
            </Link>
          </div>
        ) : (
          <div className="mb-12">
            <h1 className="text-3xl font-semibold">{declaration.name}</h1>
            {declaration.importInfo && (
              <pre className="language-typescript my-4">
                <code className="language-typescript">
                  <FormatImport info={declaration.importInfo} />
                </code>
              </pre>
            )}
          </div>
        )}
        <div className="mb-16">
          <DeclarationInfo
            className="mb-4"
            declaration={declaration}
            title={declaration.parent ? undefined : "Details"}
          />
          {!!declaration.remarks?.length && (
            <JSDocMarkdown collection={collection} node={declaration.remarks} />
          )}
        </div>
        {!!declaration.examples?.length &&
          declaration.examples.map(
            (example) =>
              example.comment && (
                <div className="mb-16" key={example.pos}>
                  <h3 className="text-base font-semibold">Example</h3>
                  <JSDocMarkdown
                    collection={collection}
                    node={example.comment}
                  />
                </div>
              ),
          )}
        {!!declaration.see?.length && (
          <div className="mb-16 prose dark:prose-invert">
            <h3 className="font-semibold text-xl">See also</h3>
            {declaration.see.map((see) => (
              <JSDocMarkdown collection={collection} node={see} key={see.pos} />
            ))}
          </div>
        )}
        {!!declaration.parameters?.length && (
          <div className="mb-16">
            <h3 className="font-semibold text-xl mb-8">Parameters</h3>
            {declaration.parameters.map((def) => (
              <DeclarationInfo
                className="mb-12"
                child
                key={def.slug}
                declaration={def}
              />
            ))}
          </div>
        )}
        {!!declaration.returns?.length && (
          <div className="mb-16">
            <h3 className="font-semibold text-xl mb-8">Returns</h3>
            <JSDocMarkdown collection={collection} node={declaration.returns} />
          </div>
        )}
        {!!declaration.members?.length && (
          <div className="mb-16">
            <h3 className="font-semibold text-xl mb-8">Members</h3>
            {declaration.members.map((def) => (
              <DeclarationInfo
                className="mb-12"
                child
                key={def.slug}
                declaration={def}
              />
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
