import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import { Toaster } from "sonner";
import ContainerWrapper from "@/components/ContainerWrapper";
import Header from "@/components/Header";
import { ContainerProvider } from "@/contexts/ContainerContext";
import { FetchingMethodProvider } from "@/contexts/FetchingMethodContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { CSPostHogProvider } from "./providers";
import "./globals.css";
import { TooltipProvider } from "@radix-ui/react-tooltip";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MyAnimeList Episode Ratings",
  description: "Fetch episode ratings from MyAnimeList",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#ffffff" />
        <Script
          id="theme-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(){var t=localStorage.getItem("theme");var isDark=t==="dark";if(isDark){document.documentElement.classList.add("dark");document.querySelector('meta[name="theme-color"]')?.setAttribute("content","#111111");}else{document.documentElement.classList.remove("dark");document.querySelector('meta[name="theme-color"]')?.setAttribute("content","#ffffff");}})();`,
          }}
        />
      </head>
      <CSPostHogProvider>
        <body className={inter.className}>
          <ThemeProvider>
            <ContainerProvider>
              <FetchingMethodProvider>
                <TooltipProvider delayDuration={0}>
                  <Header />
                  <ContainerWrapper>{children}</ContainerWrapper>
                </TooltipProvider>
              </FetchingMethodProvider>
            </ContainerProvider>
          </ThemeProvider>
          <Toaster />
        </body>
      </CSPostHogProvider>
    </html>
  );
}
