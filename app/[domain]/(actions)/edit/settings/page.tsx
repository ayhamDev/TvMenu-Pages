"use client";
import AnimatedTab from "@/components/custom/AnimatedTab";
import ChangesHandler from "@/components/custom/ChangesHandler";
import { LeavingDialog } from "@/components/custom/LeavingDialog";
import MediaBrowser from "@/components/custom/MediaBrowser";
import RenderImage from "@/components/custom/RenderImage";
import RenderImageData from "@/components/custom/RenderImageData";
import SidebarContent from "@/components/custom/SidebarContent";
import SidebarContentTitle from "@/components/custom/SidebarContentTitle";
import SidebarItem from "@/components/custom/SidebarItem";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import useAuth from "@/hooks/useAuth";
import useBreadcrumbs from "@/hooks/useBreadcrumbs";
import useChangeHandler from "@/hooks/useChangeHandler";
import useEnableQuery from "@/hooks/useEnableQuery";
import { IPage } from "@/interface/Page.interface";
import { cn } from "@/lib/utils";
import { SettingsFormSchema } from "@/schema/SettingsFormSchema";
import { GetPage } from "@/utils/api/common/GetPageData";
import { UpdateSettings } from "@/utils/api/settings/UpdateSettings";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Globe, Lock } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { DeepPartial, useForm } from "react-hook-form";

import CustomCode from "@/components/custom/CustomCode";
import { z } from "zod";
import { usePreview } from "@/providers/PreviewProvider";

const page = () => {
  const {
    ShowChangeActions,
    SetShowChangeActions,
    IsSaving,
    SetIsSaving,
    NavGuard,
  } = useChangeHandler();

  const { admin } = useAuth();
  const qc = useQueryClient();
  const params = useParams<{ domain: string }>();
  const QueryKey = ["page", params.domain];
  const enabledQuery = useEnableQuery();
  const { data, isLoading } = useQuery<IPage>({
    queryKey: QueryKey,
    queryFn: () => GetPage(params.domain),
    enabled: enabledQuery,
  });
  const { Reload } = usePreview();
  useBreadcrumbs([
    {
      href: "/edit/settings",
      label: "Settings",
    },
  ]);

  const form = useForm<z.infer<typeof SettingsFormSchema>>({
    resolver: zodResolver(SettingsFormSchema),
    defaultValues: {
      title: "",
      shortName: "",
      description: "",
      faviconUrl: "",
      faviconId: "",
      customCode: "",
      public: true,
      subdomain: params.domain,
    },
  });
  const IsPublic = form.watch("public");
  const detectChanges = () => {
    if (!data) return false;
    const currentValues = form.getValues();
    return (
      currentValues.title !== data.meta.title ||
      currentValues.shortName !== data.meta.shortName ||
      currentValues.description !== data.meta.description ||
      currentValues.faviconUrl !== data.meta.faviconUrl ||
      currentValues.faviconId !== data.meta.faviconId ||
      currentValues.description !== data.meta.description ||
      currentValues.subdomain !== data.subdomain ||
      currentValues.customCode !== data.customCode ||
      currentValues.public !== data.public
    );
  };

  // Monitor changes
  useEffect(() => {
    SetShowChangeActions(detectChanges());
  }, [form.watch(), data]);
  const SaveSettings = async (changes: z.infer<typeof SettingsFormSchema>) => {
    if (!data) return null;
    SetIsSaving(true);
    const ChangesInstance: DeepPartial<IPage> = {};
    if (data.customCode != changes.customCode) {
      ChangesInstance.customCode = changes.customCode;
    }
    if (params.domain != changes.subdomain) {
      ChangesInstance.subdomain = changes.subdomain;
    }
    if (data.public != changes.public) {
      ChangesInstance.public = changes.public;
    }
    if (data.meta.title != changes.title) {
      ChangesInstance.meta = ChangesInstance.meta || {}; // Ensure `meta` exists
      ChangesInstance.meta.title = changes.title;
    }

    if (data.meta.shortName != changes.shortName) {
      ChangesInstance.meta = ChangesInstance.meta || {}; // Ensure `meta` exists
      ChangesInstance.meta.shortName = changes.shortName;
    }

    if (data.meta.description != changes.description) {
      ChangesInstance.meta = ChangesInstance.meta || {}; // Ensure `meta` exists
      ChangesInstance.meta.description = changes.description;
    }
    if (data.meta.faviconUrl != changes.faviconUrl) {
      ChangesInstance.meta = ChangesInstance.meta || {}; // Ensure `meta` exists
      ChangesInstance.meta.faviconUrl =
        changes.faviconUrl == undefined ? null : changes.faviconUrl;
    }
    if (data.meta.faviconId != changes.faviconId) {
      ChangesInstance.meta = ChangesInstance.meta || {}; // Ensure `meta` exists
      ChangesInstance.meta.faviconId =
        changes.faviconId == undefined ? null : changes.faviconId;
    }

    const [res, error] = await UpdateSettings(params.domain, {
      ...ChangesInstance,
    });
    if (error && !error?.response) {
      toast({
        duration: 5000,
        variant: "destructive",
        title: "✘ Failed To Save Changes.",
        description: "Server Is Under Maintenance.",
      });
    }
    if (error && error.response && error.response?.status > 401) {
      toast({
        duration: 5000,
        variant: "destructive",
        title: "✘ Failed To Save Changes.",
        description: "Something Unexpected Happend Try Again Later.",
      });
    }
    if (error && error.response && error.response?.status == 400) {
      toast({
        duration: 5000,
        variant: "destructive",
        title: "✘ Failed To Save Changes.",
        description:
          error.response?.data?.message ||
          "Something Unexpected Happend Try Again Later.",
      });
    }
    if (res && res.data) {
      toast({
        duration: 5000,
        title: "✓ Changes Saved Successfully.",
        description: "Your Changes Were Saved Successfully.",
      });
      if (res.data.data.subdomain !== params.domain) {
        location.href = location.href.replace(
          `${params.domain}.`,
          `${res.data.data.subdomain}.`
        );
      } else {
        if (res.data.data.customCode != data.customCode) {
          Reload();
        }
        qc.invalidateQueries(QueryKey);
      }
      SetShowChangeActions(false);
    }
    SetIsSaving(false);
  };
  const CancelChangesHandler = () => {
    // Reset the form values to the default or fetched data
    SetIsSaving(false);
    SetShowChangeActions(false);
    if (data) {
      form.reset({
        title: data?.meta.title,
        shortName: data?.meta.shortName,
        description: data?.meta.description,
        public: data?.public,
        subdomain: data?.subdomain,
        faviconUrl: data?.meta.faviconUrl || "",
        faviconId: data?.meta.faviconId || "",
        customCode: data.customCode || "",
      });
    } else {
      form.reset(); // Reset to the default initial state if `data` is unavailable
    }
  };

  useEffect(() => {
    if (data) {
      if (!data.meta.faviconUrl) {
        data.meta.faviconUrl = "";
      }
      if (!data.meta.faviconId) {
        data.meta.faviconId = "";
      }
      if (!data.customCode) {
        data.customCode = "";
      }
      form.setValue("title", data?.meta.title);
      form.setValue("shortName", data?.meta.shortName);
      form.setValue("description", data?.meta.description);
      form.setValue("faviconId", data?.meta.faviconId);
      form.setValue("faviconUrl", data?.meta.faviconUrl);
      form.setValue("public", data?.public);
      form.setValue("subdomain", data?.subdomain);
      form.setValue("customCode", data?.customCode);
    }
  }, [data]);

  return (
    <>
      <LeavingDialog
        isOpen={NavGuard.active}
        yesCallback={NavGuard.accept}
        noCallback={NavGuard.reject}
      />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(SaveSettings)}
          className="flex-1 flex flex-col overflow-hidden relative"
        >
          <SidebarContentTitle>Settings</SidebarContentTitle>
          <SidebarContent className={cn(ShowChangeActions && "mb-[70px]")}>
            <div className="flex flex-col gap-5">
              <SidebarItem title="Site Details">
                <div className="flex flex-col gap-2">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        {isLoading ? (
                          <Skeleton className="w-full h-[40px]" />
                        ) : (
                          <Input
                            placeholder="e.g. Coffe Master..."
                            {...field}
                          />
                        )}
                        <FormControl></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {/* <Label htmlFor="title-input">Title</Label>
                  <Input id="title-input" placeholder="e.g. Coffe Master..." /> */}
                </div>
                <div className="flex flex-col gap-2">
                  <FormField
                    control={form.control}
                    name="shortName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>App Name</FormLabel>
                        <FormControl>
                          {isLoading ? (
                            <Skeleton className="w-full h-[40px]" />
                          ) : (
                            <Input
                              placeholder="e.g. Coffe Master..."
                              {...field}
                            />
                          )}
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          {isLoading ? (
                            <Skeleton className="w-full h-[80px]" />
                          ) : (
                            <Textarea
                              placeholder="e.g. This is a coffe shop..."
                              {...field}
                            />
                          )}
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex flex-col gap-4">
                  <Label>Favicon</Label>
                  <div className="flex items-center gap-4 w-full">
                    {isLoading ? (
                      <Skeleton className="w-full aspect-square" />
                    ) : (
                      <RenderImage
                        className="bg-background min-w-[40px] max-w-[40px] min-h-[40px] max-h-[40px] aspect-square rounded-md border"
                        imageId={form.getValues("faviconId") || ""}
                        imageUrl={form.getValues("faviconUrl") || ""}
                      />
                    )}

                    {form.getValues("faviconId") ? (
                      <div className="flex flex-col w-full">
                        <RenderImageData
                          onRemove={() => form.setValue("faviconId", undefined)}
                          imageId={form.getValues("faviconId")}
                        />
                        <FormField
                          control={form.control}
                          name="faviconId"
                          render={() => (
                            <FormItem>
                              <FormMessage />
                            </FormItem>
                          )}
                        ></FormField>
                      </div>
                    ) : (
                      <FormField
                        control={form.control}
                        name="faviconUrl"
                        render={({ field }) => (
                          <FormItem className="w-full">
                            <FormControl>
                              {isLoading ? (
                                <Skeleton className="w-full h-[40px]" />
                              ) : (
                                <Input
                                  className="w-full"
                                  placeholder="Image Url..."
                                  {...field}
                                />
                              )}
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                  </div>
                </div>
                {isLoading ? (
                  <Skeleton className="w-full h-[40px]" />
                ) : (
                  <MediaBrowser
                    type="image"
                    onChange={(imageId) => form.setValue("faviconId", imageId)}
                  />
                )}
              </SidebarItem>

              <SidebarItem title="Site visibility">
                <div className="flex items-center justify-between ">
                  <div className="flex gap-3 items-center">
                    {isLoading ? (
                      <Skeleton className="w-[30px] h-[30px] rounded-full" />
                    ) : IsPublic ? (
                      <Globe className={"text-green-300"} />
                    ) : (
                      <Lock className={"text-red-500"} />
                    )}

                    <div className={cn(isLoading && "flex flex-col gap-2")}>
                      {isLoading ? (
                        <Skeleton className="w-[60px] h-[20px]" />
                      ) : (
                        <h1>{IsPublic ? "Public" : "Private"}</h1>
                      )}
                      {isLoading ? (
                        <Skeleton className="w-[120px] h-[16px]" />
                      ) : (
                        <p className="text-muted-foreground text-xs">
                          Your site is{" "}
                          {IsPublic
                            ? "visible to everyone"
                            : "only visible to you"}
                        </p>
                      )}
                    </div>
                  </div>
                  <FormField
                    control={form.control}
                    name="public"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          {isLoading ? (
                            <Skeleton className="w-[44px] h-[24px] rounded-full" />
                          ) : (
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          )}
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </SidebarItem>
              <SidebarItem title="Embeded Code">
                <FormField
                  control={form.control}
                  name="customCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <CustomCode field={field} isLoading={isLoading} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </SidebarItem>

              {admin.accessToken && (
                <SidebarItem title={`DNS`}>
                  <Tabs className="w-full" defaultValue="defualt">
                    <TabsList className="w-full">
                      <TabsTrigger className="w-full" value="defualt">
                        Default
                      </TabsTrigger>
                      <TabsTrigger className="w-full" value="custom" disabled>
                        Custom
                      </TabsTrigger>
                    </TabsList>
                    <TabsContent value="defualt" className="mt-4">
                      <FormField
                        control={form.control}
                        name="subdomain"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <div className="flex items-center">
                                <Input
                                  className="rounded-r-none pr-0"
                                  placeholder="e.g. coffee-master"
                                  {...field}
                                />
                                <div className="h-[40px] text-nowrap flex justify-start items-center px-3 bg-background rounded-r-sm text-muted-foreground border border-l-0 select-none">
                                  .{process.env.NEXT_PUBLIC_DOMAIN}
                                </div>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </TabsContent>
                    <TabsContent value="custom" className="mt-4">
                      <p className="text-muted-foreground text-xs mb-2">
                        Custom Domain Is Optional
                      </p>

                      <div className="flex items-center">
                        <Input
                          className="rounded-r-none"
                          placeholder="e.g. coffee-master.com"
                        />
                        <Button className="rounded-l-none">Verify</Button>
                      </div>
                      <p className="text-xs text-red-400 mt-2">
                        DNS has been Verifed
                      </p>
                    </TabsContent>
                  </Tabs>
                </SidebarItem>
              )}
            </div>
          </SidebarContent>
          {/* <footer className="w-full px-4 py-4 bg-background border-t-2 flex  gap-4"></footer> */}
          <ChangesHandler
            ShowChangeActions={ShowChangeActions}
            IsSaving={IsSaving}
            onCancel={CancelChangesHandler}
          />
        </form>
      </Form>
    </>
  );
};

export default AnimatedTab(page);
