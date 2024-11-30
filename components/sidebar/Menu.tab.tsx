import useBreadcrumbs from "@/hooks/useBreadcrumbs";
import { motion } from "framer-motion";
import { Apple, Menu, Plus } from "lucide-react";
import { useEffect, useLayoutEffect } from "react";
import { Sortable, SortableDragHandle, SortableItem } from "../other/sortable";
import { Button } from "../ui/button";
import AnimatedTab from "./AnimatedTab";
import SidebarContent from "./SidebarContent";
import SidebarItem from "./SidebarItem";

const MenuTab = () => {
  const fields = [
    {
      id: "1",
      name: "dinner",
    },
    {
      id: "2",
      name: "breakfast",
    },
    {
      id: "3",
      name: "launch",
    },
  ];

  return (
    <>
      <SidebarContent className="mb-16">
        <Sortable value={fields}>
          <div className="flex flex-col gap-4">
            {fields.map((item) => (
              <SortableItem key={item.id} value={item.id} className="group ">
                <SidebarItem className="flex-row justify-between items-center overflow-hidden relative select-none cursor-pointer">
                  <motion.div
                    className="flex items-center absolute inset-0"
                    initial={{ left: -30, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    whileHover={{ left: 0, opacity: 1 }}
                  >
                    <SortableDragHandle>
                      <Menu className="size-4 p-4 box-content" />
                    </SortableDragHandle>
                  </motion.div>

                  <div className="flex items-center group-hover:ml-8 duration-150">
                    <Apple />
                    <p className="px-3">Dinner</p>
                  </div>
                </SidebarItem>
              </SortableItem>
            ))}
          </div>
        </Sortable>
      </SidebarContent>
      <footer className="w-full px-4 py-4 bg-background border-t-2 flex absolute bottom-0 left-0 gap-4">
        <Button variant={"secondary"} className="w-full">
          <Plus /> Add Menu
        </Button>
      </footer>
    </>
  );
};

export default AnimatedTab(MenuTab);
