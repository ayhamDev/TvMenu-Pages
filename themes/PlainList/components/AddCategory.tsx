import { Button } from "@/components/ui/button";
import { usePreview } from "@/providers/PreviewProvider";
import { Plus } from "lucide-react";
import React from "react";

const AddCategory = ({ menuId }: { menuId: string }) => {
  const { IsPreview, sendMessage } = usePreview();

  const HandleClick = () => {
    sendMessage({
      type: "create",
      target: "category",
      data: {
        menuId,
      },
    });
  };

  if (!IsPreview) return null;
  return (
    <Button
      variant={"secondary"}
      className="mb-6"
      size={"lg"}
      onClick={HandleClick}
    >
      <Plus /> Add Category
    </Button>
  );
};

export default AddCategory;
