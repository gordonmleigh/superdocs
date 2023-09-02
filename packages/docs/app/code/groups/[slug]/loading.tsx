import { DeclarationSkeleton } from "@gordonmleigh/superdocs-kit/components/DeclarationSkeleton";

export default function LoadingContent(): JSX.Element {
  return (
    <div className="flex flex-col gap-24">
      <div className="h-10 animate-pulse bg-zinc-200 w-48" />
      <DeclarationSkeleton />
      <DeclarationSkeleton />
      <DeclarationSkeleton />
    </div>
  );
}
