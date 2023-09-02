import { DeclarationSkeleton } from "@gordonmleigh/superdocs-kit/components/DeclarationSkeleton";

export default function LoadingContent(): JSX.Element {
  return (
    <div>
      <div className="h-10 animate-pulse bg-zinc-200 w-96 mb-4" />
      <div className="h-14 animate-pulse bg-zinc-200 rounded mb-12" />
      <DeclarationSkeleton />
    </div>
  );
}
