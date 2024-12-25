import AnimatedPage from "@/components/custom/AnimatedPage";
import InitAuth from "@/components/custom/InitAuth";
import { TailwindIndicator } from "@/components/custom/tailwind-indicator";
import { Toaster } from "@/components/ui/toaster";
import { fontSans } from "@/lib/fonts";
import { cn } from "@/lib/utils";
import { PreviewProvider } from "@/providers/PreviewProvider";
import { ReactQueryClientProvider } from "@/providers/ReactQueryClientProvider";
import { ThemeProvider } from "@/providers/theme-provider";
import ReduxProvider from "@/store/Provider";
import { GetSession } from "@/utils/GetSession";
import { IsPageOwner } from "@/utils/IsPageOwner";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { ReactNode } from "react";
import "../../globals.css";
import EditPageButton from "@/components/custom/EditPageButton";

const Layout = async ({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ domain: string }>;
  searchParams: any;
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
    <html lang="en" suppressHydrationWarning>
      <head />
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        <ReduxProvider>
          <PreviewProvider>
            <ReactQueryClientProvider>
              <ThemeProvider
                attribute="class"
                defaultTheme="dark"
                storageKey="preview-theme"
              >
                <NuqsAdapter>
                  <AnimatedPage>
                    <InitAuth user={user} />
                    {children}
                  </AnimatedPage>
                </NuqsAdapter>
                <TailwindIndicator />
              </ThemeProvider>
              <Toaster />
            </ReactQueryClientProvider>
          </PreviewProvider>
        </ReduxProvider>
      </body>
    </html>
  );
};

export default Layout;
