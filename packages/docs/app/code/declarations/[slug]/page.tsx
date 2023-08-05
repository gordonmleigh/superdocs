import { MainLayout } from "@/components/MainLayout";
import { fetchDeclarationCollection } from "@/util/declarations";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DeclarationInfo } from "superdocs/components/DeclarationInfo";
import { Token } from "superdocs/components/Token";

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
            {declaration.name && (
              <code className="declaration-code">
                <Token keyword>import</Token>
                <Token operator text=" { " />
                <Token identifier>{declaration.name}</Token>
                <Token operator text=" } " />
                <Token keyword>from</Token>
                <Token literal="string">
                  &quot;{declaration.moduleSpecifier}&quot;
                </Token>
              </code>
            )}
          </div>
        )}
        <DeclarationInfo
          className="mb-16"
          declaration={declaration}
          title={declaration.parent ? undefined : "Details"}
        />
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
