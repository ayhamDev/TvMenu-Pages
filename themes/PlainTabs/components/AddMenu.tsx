import { Button } from "@/components/ui/button";
import { usePreview } from "@/providers/PreviewProvider";
import { Plus } from "lucide-react";
import React from "react";

const AddMenu = () => {
  const { IsPreview, sendMessage } = usePreview();

  const HandleClick = () => {
    sendMessage({
      type: "create",
      target: "menu",
    });
  };

  if (!IsPreview) return null;
  return (
    <Button variant={"secondary"} size={"lg"} onClick={HandleClick}>
      <Plus /> Add Menu
    </Button>
  );
};

export default AddMenu;
