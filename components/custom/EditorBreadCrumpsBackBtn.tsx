import useBreadcrumbs from "@/hooks/useBreadcrumbs";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { motion } from "framer-motion";

const EditorBreadCrumpsBackBtn = () => {
  const { breadcrumbs } = useBreadcrumbs();
  const router = useRouter();

  return (
    breadcrumbs.length > 1 && (
      <Button
        size={"icon"}
        variant={"ghost"}
        className="rounded-full"
        type="button"
        onClick={() => {
          const breadcrumb = breadcrumbs[breadcrumbs.length - 2];
          if (breadcrumb.href) {
            router.push(breadcrumb.href);
          }
        }}
      >
        <ChevronLeft />
      </Button>
    )
  );
};

export default EditorBreadCrumpsBackBtn;
