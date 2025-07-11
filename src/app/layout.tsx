import type { Metadata } from "next";
import "@blocknote/core/style.css";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import Header from "@/components/Header";
import SideBar from "@/components/sidebar/SideBar";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { Toaster } from "@/components/ui/sonner";
import { LiveBlocksGlobalProvider } from "@/components/providers/LiveBlocksGlobalProvider";

export const metadata: Metadata = {
  title: "CollabNote",
  description: "Collaborative note-taking app",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <LiveBlocksGlobalProvider>
        <html lang="en" suppressHydrationWarning>
          <body>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <Header />
              <div className="flex min-h-screen">
                <SideBar />
                <div className="flex-1 p-5 overflow-y-auto scrollbar-hide">
                  {children}
                </div>
              </div>
              <Toaster position="top-center" />
            </ThemeProvider>
          </body>
        </html>
      </LiveBlocksGlobalProvider>
    </ClerkProvider>
  );
}
