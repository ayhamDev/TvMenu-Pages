import React from "react";
import EditorBreadCrumpsBackBtn from "./EditorBreadCrumpsBackBtn";

const SidebarContentTitle = ({ children }: React.PropsWithChildren) => {
  return (
    <h4 className="scroll-m-20 text-xl font-semibold tracking-tight w-full min-h-[65px] px-5 border-b-2 sticky top-0 bg-background z-10 flex items-center">
      <EditorBreadCrumpsBackBtn />
      {children}
    </h4>
  );
};

export default SidebarContentTitle;
