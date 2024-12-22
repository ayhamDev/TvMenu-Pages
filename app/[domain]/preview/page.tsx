"use client";
import { Skeleton } from "@/components/ui/skeleton";
import useEnableQuery from "@/hooks/useEnableQuery";
import { IMenu } from "@/interface/Menu.interface";
import { IPage } from "@/interface/Page.interface";
import { IMessage } from "@/providers/PreviewProvider";
import { PreviewApi } from "@/utils/api/Preview";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import dynamic from "next/dynamic";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

export function RestaurantPageSkeleton() {
  return (
    <div className="space-y-24 space-x-12 p-4">
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

// Error component to display when theme import fails

interface ThemeProps {
  menu: IMenu[];
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
  const QueryKey = ["page", params.domain, "preview"];
  const EnabledQuery = useEnableQuery();
  const qc = useQueryClient();
  const {
    data: page,
    isLoading,
    error,
    refetch,
  } = useQuery<IPage>({
    queryKey: QueryKey,
    queryFn: () => PreviewApi.Get(params.domain),
    retry: 3,
    enabled: EnabledQuery,
  });

  function HandleMessage(e: MessageEvent<IMessage>) {
    if (e.origin != location.origin) return null;
    const message = e.data;
    if (!message) return null;
    if (message.type == "update") {
      return refetch();
    }
  }
  useEffect(() => {
    window.addEventListener("message", HandleMessage);
    return () => {
      window.removeEventListener("message", HandleMessage);
    };
  }, []);

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

  return DynamicTheme ? (
    <DynamicTheme menu={page?.menu || []} />
  ) : (
    <ErrorComponent />
  );
};

export default page;
