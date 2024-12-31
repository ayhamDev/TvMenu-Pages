import { Skeleton } from "../ui/skeleton";

export function RestaurantPageSkeleton() {
  return (
    <div className="container m-auto mt-8 space-y-24 p-4">
      {/* Header Skeleton */}
      <div className="space-y-">
        <Skeleton className="h-10 w-3/4 rounded-md" />
        <Skeleton className="h-6 w-1/2 rounded-md" />
      </div>

      {/* Image Banner Skeleton */}
      <Skeleton className="h-48 w-full rounded-lg" />

      {/* Menu Section Skeleton */}
      <div className="space-y-4">
        <Skeleton className="h-8 w-1/3 rounded-md" />

        {/* Dishes */}
        <div className="space-y-4 grid grid-cols-1 md:grid-cols-2 gap-8">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="flex items-center space-x-4">
              <Skeleton className="h-20 w-20 rounded-lg" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-6 w-1/2 rounded-md" />
                <Skeleton className="h-4 w-3/4 rounded-md" />
              </div>
              <Skeleton className="h-6 w-16 rounded-md" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
