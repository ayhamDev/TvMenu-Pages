import { TailwindIndicator } from "@/components/custom/tailwind-indicator";
import { ThemeProvider } from "@/components/custom/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { siteConfig } from "@/config/site";
import { fontSans } from "@/lib/fonts";
import { cn } from "@/lib/utils";
import ReduxProvider from "@/store/Provider";
import type { Metadata, Viewport } from "next";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./globals.css";
import { ReactQueryClientProvider } from "@/components/custom/ReactQueryClientProvider";

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
    <>
      <html lang="en" suppressHydrationWarning>
        <head />
        <body
          className={cn(
            "min-h-screen bg-background font-sans antialiased",
            fontSans.variable
          )}
        >
          <ReduxProvider>
            <ReactQueryClientProvider>
              <ThemeProvider attribute="class" defaultTheme="dark">
                <NuqsAdapter>{children}</NuqsAdapter>
                <TailwindIndicator />
              </ThemeProvider>
              <Toaster />
            </ReactQueryClientProvider>
          </ReduxProvider>
        </body>
      </html>
    </>
  );
}
