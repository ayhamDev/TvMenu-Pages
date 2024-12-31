"use client";
import { RestaurantPageSkeleton } from "@/components/custom/RestaurantPageSkeleton";
import { IMenu } from "@/interface/Menu.interface";
import { IPage } from "@/interface/Page.interface";
import dynamic from "next/dynamic";
import { useLayoutEffect, useMemo, useState } from "react";
import AnimatePage from "./AnimatedPage";
import RenderCode from "./RenderCode";

// Error component to display when theme import fails

interface ThemeProps {
  menu: IMenu[];
}

const ErrorComponent = () => (
  <div style={{ color: "red", padding: "20px" }}>
    <h1>Error: Could not load Page. Please try again later.</h1>
  </div>
);

// Loading component to show while the theme is being loaded

const RenderPage = ({ page }: { page: Partial<IPage> }) => {
  const [themeLoaded, setThemeLoaded] = useState(false);

  // Dynamically load theme only when themeId is available
  const DynamicTheme = useMemo(() => {
    if (page?.themeId) {
      return dynamic<ThemeProps>(
        () =>
          import(`../../themes/${page.themeId || "PlainList"}/index`).catch(
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
  useLayoutEffect(() => {
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
      <RenderCode content={page?.customCode || null} />

      {DynamicTheme ? (
        <AnimatePage>
          <DynamicTheme menu={page?.menu || []} />{" "}
        </AnimatePage>
      ) : (
        <ErrorComponent />
      )}
    </>
  );
};

export default RenderPage;
