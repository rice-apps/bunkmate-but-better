import { GeistSans } from "geist/font/sans";
import { ThemeProvider } from "next-themes";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import PostListingFormProvider from "@/providers/PostListingFormProvider";
import { Suspense } from "react";

// Configure DM Sans font
const dmsans = DM_Sans({
  subsets: ["latin"],
  display: "swap", // Add display swap for better font loading
  adjustFontFallback: true, // Ensure proper font fallback
});

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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${GeistSans.className}`}
    >
      <body
        className={`bg-background text-foreground ${dmsans.className}`}
        suppressHydrationWarning
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <PostListingFormProvider>
            <main className="min-h-screen flex flex-col items-center font-sans">
              {children}
            </main>
          </PostListingFormProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
