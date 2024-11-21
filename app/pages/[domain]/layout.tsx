import React from "react";

const layout = async ({ children }: React.PropsWithChildren) => {
  return <div className="w-screen h-screen bg-offbackground">{children}</div>;
};

export default layout;
