import { Skeleton } from "@/components/ui/skeleton";

const DocumentSkeleton = () => {
  return (
    <div>
      <div>
        <form className="flex justify-between gap-10">
          {/* Title input skeleton */}
          <Skeleton className="h-10 flex-1" />

          {/* Update button skeleton */}
          <Skeleton className="h-10 w-20" />

          {/* Owner action buttons skeleton */}
          <Skeleton className="h-10 w-16" />
          <Skeleton className="h-10 w-20" />
        </form>
      </div>

      {/* Horizontal rule */}
      <hr className="mb-5 mt-10" />

      {/* Editor skeleton */}
      <div>
        <Skeleton className="h-100 w-full" />
      </div>
    </div>
  );
};

export default DocumentSkeleton;
