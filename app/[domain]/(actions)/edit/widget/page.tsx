"use client";
import AnimatedTab from "@/components/custom/AnimatedTab";
import { LeavingDialog } from "@/components/custom/LeavingDialog";
import SidebarContent from "@/components/custom/SidebarContent";
import SidebarContentTitle from "@/components/custom/SidebarContentTitle";
import { Types, WidgetIcon } from "@/components/custom/WidgetIcon";
import WidgetItem from "@/components/custom/WidgetItem";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useBreadcrumbs from "@/hooks/useBreadcrumbs";
import { capitalizeFirstChar } from "@/lib/capitalizeFirstChar ";
import { useNavigationGuard } from "@/lib/next-navigation-guard";
import { WidgetSchema } from "@/schema/WidgetSchema";
import { html } from "@codemirror/lang-html";
import { zodResolver } from "@hookform/resolvers/zod";
import { andromeda } from "@uiw/codemirror-theme-andromeda";
import ReactCodeMirror from "@uiw/react-codemirror";
import { Loader2, Plus } from "lucide-react";
import { parseAsBoolean, useQueryState } from "nuqs";
import { useState } from "react";
import { useForm } from "react-hook-form";

const page = () => {
  const [IsCreating, SetIsCreating] = useState<boolean>(false);
  const [isDialogOpen, setIsDialogOpen] = useQueryState<boolean>(
    "create",
    parseAsBoolean.withDefault(false)
  );
  const NavGuard = useNavigationGuard({ enabled: IsCreating });
  useBreadcrumbs([
    {
      href: "/edit/widget",
      label: "Widgets",
    },
  ]);

  const form = useForm({
    resolver: zodResolver(WidgetSchema),
    defaultValues: {
      name: "",
      type: undefined,
      content: "",
    },
  });
  const CreateWidgetHandler = () => {};

  return (
    <>
      {/* <PreventNavigation isDirty={ShowChangeActions} backHref="/edit/menu" /> */}
      <LeavingDialog
        isOpen={NavGuard.active}
        yesCallback={NavGuard.accept}
        noCallback={NavGuard.reject}
      />
      <SidebarContentTitle>Menus</SidebarContentTitle>
      <SidebarContent className="mb-16">
        <div className="flex flex-col gap-4">
          {true && <WidgetItem type="custom" />}
        </div>
      </SidebarContent>

      <footer className="w-full px-4 py-4 bg-background border-t-2 flex absolute bottom-0 left-0 gap-4">
        <Form {...form}>
          <Dialog
            open={isDialogOpen}
            onOpenChange={(open) => {
              if (!IsCreating) {
                setIsDialogOpen(open);
              }
            }}
          >
            <DialogTrigger asChild>
              <Button
                variant={"secondary"}
                className="w-full"
                onClick={() => setIsDialogOpen(true)}
              >
                <Plus /> Add Widget
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <form
                className="flex flex-col gap-6"
                onSubmit={form.handleSubmit(CreateWidgetHandler)}
              >
                <DialogHeader>
                  <DialogTitle>Create Widget</DialogTitle>
                  <DialogDescription>
                    a Widget is an element that displays content and
                    functionality on your page
                  </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col gap-5">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex flex-row gap-4 items-center">
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. Call Us Now" {...field} />
                          </FormControl>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex flex-row gap-4 items-center">
                          <FormLabel>Type</FormLabel>
                          <FormControl>
                            <Select
                              onValueChange={field.onChange} // Update the form state
                              value={field.value} // Set the current value
                            >
                              <SelectTrigger>
                                <div className="flex items-center w-full gap-4">
                                  {field.value ? (
                                    <>
                                      <WidgetIcon
                                        size="18px"
                                        type={field.value}
                                      />
                                      {capitalizeFirstChar(field.value)}
                                    </>
                                  ) : (
                                    "Select a Type"
                                  )}
                                </div>
                              </SelectTrigger>
                              <SelectContent>
                                {Types.map((type) => (
                                  <SelectItem
                                    className="hover:bg-offbackground cursor-pointer"
                                    key={type}
                                    value={type}
                                  >
                                    <div className="flex flex-row gap-4 py-2">
                                      <WidgetIcon size="18px" type={type} />
                                      {capitalizeFirstChar(type)}
                                    </div>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </FormControl>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={"content"}
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex flex-row gap-4 items-center">
                          <FormLabel>Type</FormLabel>
                          <FormControl>
                            <ReactCodeMirror
                              style={{
                                borderRadius: "20px",
                              }}
                              className="min-w-0 w-full"
                              height="250px"
                              theme={andromeda}
                              extensions={[
                                html({
                                  autoCloseTags: true,
                                  selfClosingTags: true,
                                }),
                              ]}
                              {...field}
                            />
                          </FormControl>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <DialogFooter>
                  <Button type="submit" disabled={IsCreating}>
                    {IsCreating ? (
                      <Loader2 className="animate-spin" />
                    ) : (
                      <Plus />
                    )}

                    {IsCreating ? "Creating..." : "Create"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </Form>
      </footer>
    </>
  );
};

export default AnimatedTab(page);
