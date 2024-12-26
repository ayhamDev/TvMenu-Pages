"use client";
import AnimatedTab from "@/components/custom/AnimatedTab";
import ChangesHandler from "@/components/custom/ChangesHandler";
import { LeavingDialog } from "@/components/custom/LeavingDialog";
import SidebarContent from "@/components/custom/SidebarContent";
import SidebarContentTitle from "@/components/custom/SidebarContentTitle";
import ThemeItem, { ThemeItemLoading } from "@/components/custom/ThemeItem";
import { RadioGroup } from "@/components/ui/radio-group";
import { toast } from "@/hooks/use-toast";
import useBreadcrumbs from "@/hooks/useBreadcrumbs";
import useChangeHandler from "@/hooks/useChangeHandler";
import useMenuTheme from "@/hooks/useMenuTheme";
import usePage from "@/hooks/usePage";
import { usePreview } from "@/providers/PreviewProvider";
import { ThemeApi } from "@/utils/api/theme";
import { useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const page = () => {
  const [selectedTheme, setSelectedTheme] = useState<string | undefined>(
    undefined
  );
  const { sendMessage, PreviewLoaded } = usePreview();
  const {
    ShowChangeActions,
    SetShowChangeActions,
    IsSaving,
    SetIsSaving,
    NavGuard,
  } = useChangeHandler();

  const params = useParams<{ domain: string }>();
  const Themes = useMenuTheme(params.domain);
  const Page = usePage(params.domain);
  const qc = useQueryClient();
  const handleThemeSelect = (ThemeId: string) => {
    setSelectedTheme(ThemeId);
  };

  const HandleSaveTheme = async () => {
    if (!selectedTheme) return null;
    SetIsSaving(true);
    const [res, error] = await ThemeApi.Save(params.domain, selectedTheme);
    if (error && !error?.response) {
      toast({
        duration: 5000,
        variant: "destructive",
        title: `✘ Failed To Change Theme.`,
        description: "Server Is Under Maintenance.",
      });
    }
    if (error && error.response && error.response?.status > 401) {
      toast({
        duration: 5000,
        variant: "destructive",
        title: `✘ Failed To Change Theme.`,
        description: "Something Unexpected Happend Try Again Later.",
      });
    }
    if (error && error.response && error.response?.status == 400) {
      toast({
        duration: 5000,
        variant: "destructive",
        title: `✘ Failed To Change Theme.`,
        description:
          error.response?.data?.message ||
          "Something Unexpected Happend Try Again Later.",
      });
    }
    if (res && res.data) {
      toast({
        duration: 5000,
        title: "✓ Theme Changed Successfully.",
        description: "Your Theme Was Changed Successfully.",
      });
      SetShowChangeActions(false);
      qc.setQueryData(["page", params.domain], {
        ...Page,
        themeId: selectedTheme,
      });
    }
    SetIsSaving(false);
  };

  useBreadcrumbs([
    {
      href: "/edit/theme",
      label: "Theme",
    },
  ]);

  useEffect(() => {
    if (Page && Page.themeId) {
      setSelectedTheme(Page.themeId);
    }
  }, [Page]);
  useEffect(() => {
    if (Page && Page.themeId != selectedTheme) {
      sendMessage({
        type: "edit",
        target: "theme",
        data: { id: selectedTheme },
      });
      SetShowChangeActions(true);
    } else {
      sendMessage({
        type: "edit",
        target: "theme",
        data: { id: selectedTheme },
      });
      SetShowChangeActions(false);
    }
  }, [selectedTheme, Page]);
  // useEffect(() => {
  //   if (Page && PreviewLoaded && selectedTheme != Page?.themeId) {
  //     console.log(true);

  //   }
  // }, [PreviewLoaded, selectedTheme, Page]);
  return (
    <>
      <LeavingDialog
        isOpen={NavGuard.active}
        yesCallback={() => {
          sendMessage({
            type: "edit",
            target: "theme",
            data: { id: Page?.themeId },
          });
          NavGuard.accept();
        }}
        noCallback={NavGuard.reject}
      />
      <SidebarContentTitle>Themes</SidebarContentTitle>
      <SidebarContent>
        <RadioGroup
          value={selectedTheme}
          onValueChange={handleThemeSelect}
          className="my-4 px-2 mb-4 grid-cols-2 md:grid-cols-1 gap-4"
        >
          {Themes && Page
            ? Themes.map((theme, index) => (
                <ThemeItem theme={theme} key={index} />
              ))
            : Array(10)
                .fill(true)
                .map((_, index) => <ThemeItemLoading key={index} />)}
        </RadioGroup>
      </SidebarContent>
      <ChangesHandler
        ShowChangeActions={ShowChangeActions}
        IsSaving={IsSaving}
        onSave={HandleSaveTheme}
        onCancel={() => setSelectedTheme(Page?.themeId)}
      />
    </>
  );
};

export default AnimatedTab(page);
