"use client";
import { Skeleton } from "@/components/ui/skeleton";
import usePage from "@/hooks/usePage";
import useRefreshToken from "@/hooks/useRefreshToken";
import { IMenu } from "@/interface/Menu.interface";
import dynamic from "next/dynamic";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

function RestaurantPageSkeleton() {
  return (
    <div className="space-y-6 p-4">
      {/* Header Skeleton */}
      <div className="space-y-2">
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

// Error component to display when theme import fails

interface ThemeProps {
  Menu: IMenu[];
}

const ErrorComponent = () => (
  <div style={{ color: "red", padding: "20px" }}>
    <h1>Error: Could not load theme. Please try again later.</h1>
  </div>
);

// Loading component to show while the theme is being loaded
const LoadingComponent = () => <RestaurantPageSkeleton />;

const page = () => {
  const params = useParams<{ domain: string }>();
  const page = usePage(params.domain);

  // State to handle theme dynamically loading
  const [themeLoaded, setThemeLoaded] = useState(false);

  // Dynamically load theme only when themeId is available
  const DynamicTheme = useMemo(() => {
    if (page?.themeId) {
      return dynamic<ThemeProps>(
        () =>
          import(`@/themes/${page.themeId}/index`).catch(() => ErrorComponent),
        { ssr: false }
      );
    }
    return null; // Return null until themeId is available
  }, [page?.themeId]);

  // Trigger re-render once theme is dynamically loaded
  useEffect(() => {
    if (page?.themeId && !!DynamicTheme) {
      setThemeLoaded(true);
    }
  }, [page?.themeId, DynamicTheme]);

  // Fallback content while theme is loading
  if (!themeLoaded) {
    return <LoadingComponent />;
  }

  return DynamicTheme ? <DynamicTheme Menu={[]} /> : <ErrorComponent />;
};

export default page;
