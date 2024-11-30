import AnimatedPage from "@/components/other/AnimatedPage";
import EditorAppBar from "@/components/other/EditorAppBar";
import EditorPreview from "@/components/other/EditorPreview";
import EditorSidebar from "@/components/other/EditorSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { HasSession } from "@/utils/HasSession";
import { IsPageOwner } from "@/utils/IsPageOwner";
import { AnimatePresence } from "framer-motion";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

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
  const user = await HasSession(cookieStore);

  // if There Was No Cookie Or Session Redirect to client page to authentiacte
  if (!user) return redirect(`${process.env.NEXT_PUBLIC_DASHBOARD_URL}/client`);

  // The Page Owner else redirect to the /
  const IsOwenr = await IsPageOwner(user, props.domain);
  if (!IsOwenr) return redirect("/");

  return (
    <AnimatedPage>
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
