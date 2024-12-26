import { Button } from "@/components/ui/button";
import { usePreview } from "@/providers/PreviewProvider";
import { Plus } from "lucide-react";
import React from "react";

const AddItem = ({
  menuId,
  categoryId,
}: {
  menuId: string;
  categoryId: string;
}) => {
  const { IsPreview, sendMessage } = usePreview();

  const HandleClick = () => {
    sendMessage({
      type: "create",
      target: "item",
      data: {
        menuId,
        categoryId,
      },
    });
  };

  if (!IsPreview) return null;
  return (
    <Button
      variant={"outline"}
      className="w-full h-full min-h-[300px]"
      size={"lg"}
      onClick={HandleClick}
    >
      <Plus /> Add Menu Item
    </Button>
  );
};

export default AddItem;
