import React, { ReactNode } from "react";

const SidebarContentTitle = ({ children }: React.PropsWithChildren) => {
  return (
    <h4 className="scroll-m-20 text-xl font-semibold tracking-tight w-full py-4 px-6 border-b-2 sticky top-0 bg-background z-10">
      {children}
    </h4>
  );
};

export default SidebarContentTitle;
