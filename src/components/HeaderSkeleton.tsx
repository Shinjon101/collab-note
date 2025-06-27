import { Skeleton } from "@/components/ui/skeleton";

const HeaderSkeleton = () => {
  return (
    <header className="flex items-center justify-between p-5 bg-secondary">
      {/* User's Notes title skeleton */}
      <Skeleton className="h-8 w-32 bg-muted" />

      <section className="flex items-center gap-5">
        {/* Theme toggle button skeleton */}
        <Skeleton className="h-8 w-10 bg-muted" />

        {/* User button/Sign in button skeleton */}
        <Skeleton className="h-8 w-8 rounded-full bg-muted" />
      </section>
    </header>
  );
};

export default HeaderSkeleton;
