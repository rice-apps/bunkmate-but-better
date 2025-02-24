import { GeistSans } from "geist/font/sans";
import { ThemeProvider } from "next-themes";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import PostListingFormProvider from "@/providers/PostListingFormProvider";
import { GoogleTagManager } from '@next/third-parties/google'
import { Suspense } from "react";
import ProgressBarProvider from "@/providers/ProgressBarProvider";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "BunkMate - On Demand Subletting and Off-Campus Leasing",
  description:
    "Find Off-campus housing and subletters with ease using Bunkmate.",
};

const dmsans = DM_Sans({ subsets: ["latin"] });

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense>
      <html lang="en" className={GeistSans.className} suppressHydrationWarning>
        <GoogleTagManager gtmId="G-F6DT1CZ9YT" />
        <body className={`${dmsans.className} bg-background text-foreground`}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <PostListingFormProvider>
                <main className="min-h-screen flex flex-col items-center">
                  <ProgressBarProvider>
                  {children}
                  </ProgressBarProvider>
                </main>
            </PostListingFormProvider>
          </ThemeProvider>
        </body>
      </html>
    </Suspense>
  );
}
