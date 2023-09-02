import { packageDeclarations } from "@/util/context";
import { DeclarationInfo } from "@gordonmleigh/superdocs/components/DeclarationInfo";
import { FormatImport } from "@gordonmleigh/superdocs/components/FormatImport";
import { JSDocMarkdown } from "@gordonmleigh/superdocs/components/JSDocMarkdown";
import { SymbolIcon } from "@gordonmleigh/superdocs/components/SymbolIcon";
import Link from "next/link";
import { notFound } from "next/navigation";

interface DeclarationPageParams {
  params: { slug: string };
}

export function generateStaticParams(): DeclarationPageParams["params"][] {
  return [...packageDeclarations.current].map(({ slug }) => ({ slug }));
}

export default function DeclarationPage({
  params: { slug },
}: DeclarationPageParams): JSX.Element {
  const collection = packageDeclarations.current;
  const declaration = collection.getDeclarationBySlug(slug);

  if (!declaration) {
    return notFound();
  }

  return (
    <div>
      {declaration.parent ? (
        <div className="mb-12">
          <h1 className="text-2xl font-semibold">
            <Link
              className="flex items-center"
              href={declaration.parent.documentationLink}
            >
              <SymbolIcon node={declaration.parent.node} />
              &nbsp;
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
          <h1 className="text-3xl font-semibold flex items-center">
            <SymbolIcon node={declaration.node} />
            &nbsp;{declaration.name}
          </h1>
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
                <JSDocMarkdown collection={collection} node={example.comment} />
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
  );
}
