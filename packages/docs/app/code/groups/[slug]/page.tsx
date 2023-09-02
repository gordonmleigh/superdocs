import { packageDeclarations } from "@/util/context";
import { DeclarationInfo } from "@gordonmleigh/superdocs/components/DeclarationInfo";
import Link from "next/link";
import { notFound } from "next/navigation";

interface GroupPageParams {
  params: { slug: string };
}

export function generateStaticParams(): GroupPageParams["params"][] {
  return packageDeclarations.current.groups.map(({ slug }) => ({ slug }));
}

export default function GroupPage({
  params: { slug },
}: GroupPageParams): JSX.Element {
  const group = packageDeclarations.current.groups.find((x) => x.slug === slug);
  if (!group) {
    return notFound();
  }

  return (
    <div>
      <h1 className="text-3xl font-semibold mb-24">{group.name}</h1>
      {group.declarations.map((def) => (
        <div className="mb-24" key={def.slug}>
          <DeclarationInfo className="mb-4" declaration={def} />
          <div>
            <Link
              className="text-zinc-500 hover:underline text-sm"
              href={def.documentationLink}
            >
              More &raquo;
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}
