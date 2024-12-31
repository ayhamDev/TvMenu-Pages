import { siteConfig } from "@/config/site";
import { fontSans } from "@/lib/fonts";
import { cn } from "@/lib/utils";
import AppProvider from "@/providers/AppProvider";
import type { Metadata, Viewport } from "next";
import "@/app/globals.css";

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: {
    icon: "/icon-128x128.png",
  },
};
export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
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
            defaultTheme: "dark",
            storageKey: "theme-edit",
          }}
        >
          <div className="w-screen h-screen bg-offbackground">{children}</div>
        </AppProvider>
      </body>
    </html>
  );
}
