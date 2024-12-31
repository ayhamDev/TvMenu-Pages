import AnimatedPage from "@/components/custom/AnimatedPage";
import InitAuth from "@/components/custom/InitAuth";
import { fontSans } from "@/lib/fonts";
import { cn } from "@/lib/utils";
import AppProvider from "@/providers/AppProvider";
import { GetSession } from "@/utils/GetSession";
import { IsPageOwner } from "@/utils/IsPageOwner";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ReactNode } from "react";
import "@/app/globals.css";

const Layout = async ({
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
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        <AppProvider
          ThemeProviderProps={{
            attribute: "class",
            enableSystem: true,
            storageKey: "theme-preview",
          }}
        >
          <AnimatedPage>
            <InitAuth user={user} />

            {children}
          </AnimatedPage>
        </AppProvider>
        <script src="/widgets.js"></script>
      </body>
    </html>
  );
};

export default Layout;
