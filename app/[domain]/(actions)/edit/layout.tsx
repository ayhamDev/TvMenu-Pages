import AnimatedPage from "@/components/custom/AnimatedPage";
import EditorAppBar from "@/components/custom/EditorAppBar";
import EditorPreview from "@/components/custom/EditorPreview";
import EditorSidebar from "@/components/custom/EditorSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { GetSession } from "@/utils/GetSession";
import { IsPageOwner } from "@/utils/IsPageOwner";
import { AnimatePresence } from "framer-motion";
import { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ReactNode } from "react";
import InitAuth from "@/components/custom/InitAuth";
import PreviewHandler from "@/components/custom/PreviewHandler";
import { IClientPageProps } from "@/interface/ClientPageProps.interface";

export async function generateMetadata({
  params,
}: IClientPageProps): Promise<Metadata> {
  const props = await params;

  return {
    title: `Edit ${props.domain}`,
  };
}

const layout = async ({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ domain: string }>;
}) => {
  const props = await params;
  // Session Means The User Has a Refresh Token HttpOnly Cookie.
  const cookieStore = await cookies();
  // Get The User If He Has Session
  const user = await GetSession(cookieStore);
  // if There Was No Cookie Or Session Redirect to client page to authentiacte
  if (!user) return redirect(`${process.env.NEXT_PUBLIC_DASHBOARD_URL}/client`);

  // The Page Owner else redirect to the /
  const IsOwenr = await IsPageOwner(user, props.domain);
  if (!IsOwenr) return redirect("/");

  return (
    <AnimatedPage>
      <InitAuth user={user} />
      <PreviewHandler />
      <SidebarProvider defaultOpen={false}>
        <EditorSidebar />
        <main className="w-full h-screen transition-all duration-1000 flex relative bg-offbackground">
          <div className="flex-1 min-w-[350px] max-w-[350px] bg-background border-r md:flex hidden flex-col ">
            <AnimatePresence mode="wait">{children}</AnimatePresence>
          </div>
          <div className="flex flex-col w-full">
            <EditorAppBar user={user} />
            <EditorPreview />
          </div>
        </main>
      </SidebarProvider>
    </AnimatedPage>
  );
};

export default layout;
