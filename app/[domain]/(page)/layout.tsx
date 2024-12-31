import "@/app/globals.css";
import { fontSans } from "@/lib/fonts";
import { cn } from "@/lib/utils";
import AppProvider from "@/providers/AppProvider";

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
            enableSystem: true,
            storageKey: "theme-page",
          }}
        >
          {children}
        </AppProvider>
      </body>
    </html>
  );
}
