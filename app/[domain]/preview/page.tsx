"use client";
import EditPageButton from "@/components/custom/EditPageButton";
import { RestaurantPageSkeleton } from "@/components/custom/RestaurantPageSkeleton";
import useEnableQuery from "@/hooks/useEnableQuery";
import { IMenu } from "@/interface/Menu.interface";
import { IPage } from "@/interface/Page.interface";
import { IMessage } from "@/providers/PreviewProvider";
import { PreviewApi } from "@/utils/api/Preview";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import dynamic from "next/dynamic";
import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

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

const page = () => {
  const searchParams = useSearchParams();
  const params = useParams<{ domain: string }>();
  const QueryKey = ["page", params.domain, "preview"];
  const EnabledQuery = useEnableQuery();
  const qc = useQueryClient();
  const { data: page, refetch } = useQuery<IPage>({
    queryKey: QueryKey,
    queryFn: () => PreviewApi.Get(params.domain),
    retry: 3,
    enabled: EnabledQuery,
  });

  function HandleMessage(e: MessageEvent<IMessage>) {
    if (e.origin != location.origin) return null;
    const message = e.data;
    if (!message) return null;
    if (message.type == "edit" && message.target == "theme" && message.data) {
      qc.setQueryData(QueryKey, { ...page, themeId: message.data.id });
    }
    if (message.type == "update") {
      return refetch();
    }
  }
  useEffect(() => {
    window.addEventListener("message", HandleMessage);
    return () => {
      window.removeEventListener("message", HandleMessage);
    };
  }, [page]);

  // State to handle theme dynamically loading
  const [themeLoaded, setThemeLoaded] = useState(false);

  // Dynamically load theme only when themeId is available
  const DynamicTheme = useMemo(() => {
    if (page?.themeId) {
      return dynamic<ThemeProps>(
        () =>
          import(`../../../themes/${page.themeId || "PlainList"}/index`).catch(
            (reason) => {
              console.log(reason);
              return ErrorComponent;
            }
          ),
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
    return <RestaurantPageSkeleton />;
  }

  return (
    <>
      {searchParams.get("edit") == undefined && <EditPageButton />}

      {DynamicTheme ? (
        <DynamicTheme menu={page?.menu || []} />
      ) : (
        <ErrorComponent />
      )}
    </>
  );
};

export default page;
