"use client";
import { useIsMobile } from "@/hooks/use-mobile";
import { useToast } from "@/hooks/use-toast";
import useBreadcrumbs from "@/hooks/useBreadcrumbs";
import { Eye, Loader2, Send } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Button } from "../ui/button";
import AvatarMenu from "./AvatarMenu";
import EditorBreadcrumb from "./EditorBreadcrumps";
import { IUser } from "@/interface/User.interface";
import { PublishPage } from "@/utils/api/common/PublishPage";
import { useParams } from "next/navigation";

const EditorAppBar = ({ user }: { user: IUser }) => {
  const params = useParams<{ domain: string }>();
  const { toast } = useToast();
  const { breadcrumbs } = useBreadcrumbs();

  const [IsPublishing, SetIsPublishing] = useState<boolean>(false);
  const IsMobile = useIsMobile();

  const HandlePublish = async () => {
    SetIsPublishing(true);
    const [res, error] = await PublishPage(params.domain);
    if (error && !error?.response) {
      toast({
        duration: 5000,
        variant: "destructive",
        title: "✘ Failed To Publish Page.",
        description: "Server Is Under Maintenance.",
      });
    }
    if (error && error.response && error.response?.status > 401) {
      toast({
        duration: 5000,
        variant: "destructive",
        title: "✘ Failed To Publish Page.",
        description: "Something Went Wrong Please Try Again later.",
      });
    }
    if (error && error.response && error.response?.status == 400) {
      toast({
        duration: 5000,
        variant: "destructive",
        title: "✘ Failed To Publish Page.",
        description: "Something Went Wrong Please Try Again later.",
      });
    }
    if (res && res.data) {
      console.log(true);

      toast({
        duration: 5000,
        title: "✓ Page Published Successfully.",
        description: "Your Page Updates Are Live Now.",
      });
    }
    SetIsPublishing(false);
  };

  return (
    <div className="sm:min-h-[64px] sm:h-max min-h-max shadow-inner flex flex-col-reverse sm:flex-row justify-between sm:gap-6 gap-2 sm:items-center items-start px-6 sm:pt-0 pt-6">
      <div className="min-w-[200px]">
        <EditorBreadcrumb
          links={[...breadcrumbs]}
          maxItems={IsMobile ? 3 : 5}
        />
      </div>
      <div className="flex gap-6 items-center justify-center ml-auto">
        <Link href={"/"} prefetch={false}>
          <Button variant={"secondary"}>
            <Eye />
            View Site
          </Button>
        </Link>
        <Button disabled={IsPublishing} onClick={HandlePublish}>
          {IsPublishing ? <Loader2 className="animate-spin" /> : <Send />}
          Publish
        </Button>
        <AvatarMenu user={user} />
      </div>
    </div>
  );
};

export default EditorAppBar;
