"use client";
import { useIsMobile } from "@/hooks/use-mobile";
import { useToast } from "@/hooks/use-toast";
import useBreadcrumbs from "@/hooks/useBreadcrumbs";
import useRefreshToken from "@/hooks/useRefreshToken";
import { IUser } from "@/interface/User.interface";
import { Eye, Loader2, Send } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import AvatarMenu from "./AvatarMenu";
import EditorBreadcrumb from "./EditorBreadcrumps";
import useAuth from "@/hooks/useAuth";

const EditorAppBar = ({ user }: { user: IUser }) => {
  const { admin, client } = useAuth();
  const { InitalLoginState } = useRefreshToken(user);
  const { toast } = useToast();
  const { breadcrumbs } = useBreadcrumbs();

  const [IsPublishing, SetIsPublishing] = useState<boolean>(false);
  const IsMobile = useIsMobile();
  const HandlePublish = () => {
    SetIsPublishing(true);
    setTimeout(() => {
      SetIsPublishing(false);
      toast({
        duration: 5000,
        variant: "destructive",
        title: "✘ Failed To Publish Menu.",
        description:
          "Something Went Wrong Please Try Again later, 2023 at 5:57 PM.",
      });
      toast({
        duration: 5000,
        title: "✓ Menu Published Successfully.",
        description: "Your Menu Updates Are Live Now 2023 at 5:57 PM.",
      });
    }, 500);
  };

  useEffect(() => {
    if (
      InitalLoginState.admin == true &&
      InitalLoginState.client == true &&
      !admin.accessToken &&
      !client.accessToken
    ) {
      location.href = `${process.env.NEXT_PUBLIC_DASHBOARD_URL}/${user.Role}`;
    }
  }, [admin, client, InitalLoginState]);
  return (
    <div className="sm:min-h-[60px] sm:h-max min-h-max shadow-inner flex flex-col-reverse sm:flex-row justify-between sm:gap-6 gap-2 sm:items-center items-start px-6 sm:pt-0 pt-6">
      <div className="min-w-[200px]">
        <EditorBreadcrumb
          links={[...breadcrumbs]}
          maxItems={IsMobile ? 3 : 4}
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
