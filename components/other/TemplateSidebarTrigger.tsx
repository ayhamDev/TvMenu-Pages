import { Menu } from "lucide-react";
import { Button } from "../ui/button";
import { useSidebar } from "../ui/sidebar";

const TemplateSidebarTrigger = () => {
  const { setOpenMobile } = useSidebar();

  const OpenSidebar = () => {
    setOpenMobile(true);
  };

  return (
    <Button
      onClick={OpenSidebar}
      variant={"outline"}
      className="absolute top-4 left-2 z-10 shadow-lg rounded-full"
      size={"icon"}
    >
      <Menu />
    </Button>
  );
};

export default TemplateSidebarTrigger;
