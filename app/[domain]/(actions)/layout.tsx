import { TailwindIndicator } from "@/components/custom/tailwind-indicator";
import { Toaster } from "@/components/ui/toaster";
import { siteConfig } from "@/config/site";
import { fontSans } from "@/lib/fonts";
import { cn } from "@/lib/utils";
import { PreviewProvider } from "@/providers/PreviewProvider";
import { ReactQueryClientProvider } from "@/providers/ReactQueryClientProvider";
import { ThemeProvider } from "@/providers/theme-provider";
import ReduxProvider from "@/store/Provider";
import type { Metadata, Viewport } from "next";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import "../../globals.css";
import AppProvider from "@/providers/AppProvider";

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
      <head />
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        <AppProvider>
          <div className="w-screen h-screen bg-offbackground">{children}</div>
        </AppProvider>
      </body>
    </html>
  );
}
