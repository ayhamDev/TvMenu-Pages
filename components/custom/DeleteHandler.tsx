import React, { useState } from "react";
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogFooter,
  DialogContent,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Loader2, Router, Trash2 } from "lucide-react";
import { MenuApi } from "@/utils/api/menu";
import { useParams, useRouter } from "next/navigation";
import { CategoryApi } from "@/utils/api/category";
import { MenuItemApi } from "@/utils/api/item";
import { toast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { usePreview } from "@/providers/PreviewProvider";

const DeleteHandler = ({
  target,
  targetTitle,
  id,
  queryKey,
}: {
  target: "Menu" | "Category" | "Menu Item";
  targetTitle: string;
  id: string;
  queryKey: string[];
}) => {
  const params = useParams<{
    domain: string;
    menuId: string;
    categoryId: string;
    itemId: string;
  }>();
  const router = useRouter();
  const qc = useQueryClient();
  const { sendMessageToPreview } = usePreview();
  const [IsDialogOpen, SetIsDialogOpen] = useState<boolean>(false);
  const [IsDeleting, SetIsDeleting] = useState<boolean>(false);
  const HandleDelete = async () => {
    SetIsDeleting(true);

    const [res, error] =
      target == "Menu"
        ? await MenuApi.Delete(params.domain, id)
        : target == "Category"
        ? await CategoryApi.Delete(params.domain, id)
        : await MenuItemApi.Delete(params.domain, id);

    if (error && !error?.response) {
      toast({
        duration: 5000,
        variant: "destructive",
        title: `✘ Failed To Delete ${target}.`,
        description: "Server Is Under Maintenance.",
      });
    }
    if (error && error.response && error.response?.status > 401) {
      toast({
        duration: 5000,
        variant: "destructive",
        title: `✘ Failed To Delete ${target}.`,
        description: "Something Unexpected Happend Try Again Later.",
      });
    }
    if (error && error.response && error.response?.status == 400) {
      toast({
        duration: 5000,
        variant: "destructive",
        title: `✘ Failed To Delete ${target}.`,
        description:
          error.response?.data?.message ||
          "Something Unexpected Happend Try Again Later.",
      });
    }

    if (res && res.status <= 201) {
      toast({
        duration: 5000,
        title: `✓ ${target} Deleted Successfully.`,
        description: `${targetTitle} Was Deleted Successfully.`,
      });
      const segments = location.pathname.split("/").filter(Boolean); // Filter removes empty strings
      const previousRoute = `/${segments.slice(0, -1).join("/")}`;

      router.replace(previousRoute);
      const prevQueryKey = queryKey.slice(0, queryKey.length - 1);
      const data: { id: string }[] | null | undefined =
        qc.getQueryData(prevQueryKey);
      if (data && typeof data == "object") {
        const items = data?.filter((item) => item.id !== id);
        qc.setQueryData(prevQueryKey, items);
      }
      qc.removeQueries(queryKey);
      sendMessageToPreview({
        type: "update",
        target: "menu",
        id: null,
      });
    }
    SetIsDeleting(false);
    SetIsDialogOpen(false);
  };
  return (
    <Dialog
      open={IsDialogOpen}
      onOpenChange={(open) => {
        if (!IsDeleting) {
          SetIsDialogOpen(open);
        }
      }}
    >
      <DialogTrigger asChild>
        <footer className="w-full px-4 py-4 bg-background border-t-2 flex gap-4 absolute bottom-0 z-10">
          <Button
            variant={"destructive"}
            className="w-full"
            type="button"
            onClick={() => SetIsDialogOpen(true)}
          >
            <Trash2 />
            Delete
          </Button>
        </footer>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete {target}</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          Are You Sure You Want To Delete{" "}
          <span className="text-red-500 font-bold tracking-wider">
            {targetTitle}
          </span>{" "}
          ?
        </DialogDescription>
        <DialogFooter>
          <Button
            variant={"secondary"}
            onClick={() => SetIsDialogOpen(false)}
            disabled={IsDeleting}
          >
            Cancel
          </Button>
          <Button
            variant={"destructive"}
            onClick={HandleDelete}
            disabled={IsDeleting}
          >
            {IsDeleting ? (
              <>
                <Loader2 className="animate-spin" />
                Deleting...
              </>
            ) : (
              <>Delete</>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteHandler;
