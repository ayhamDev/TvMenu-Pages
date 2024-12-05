import React from "react";
import { IClientPageProps } from "../page";
import { Metadata } from "next";

const layout = async ({ children }: React.PropsWithChildren) => {
  return <div className="w-screen h-screen bg-offbackground">{children}</div>;
};

export default layout;
