export type DeclarationSkeletonProps = {
  className?: string;
};

export function DeclarationSkeleton({
  className,
}: DeclarationSkeletonProps): JSX.Element {
  return (
    <div className={className}>
      <div className="h-8 animate-pulse bg-zinc-200 w-32 mb-2" />
      <div className="h-4 animate-pulse bg-zinc-200 w-96 mb-4" />
      <div className="h-14 animate-pulse bg-zinc-200 rounded mb-4" />
      <div className="h-32 animate-pulse bg-zinc-200 w-[650px] rounded mb-12" />
    </div>
  );
}
