import { GeistSans } from "geist/font/sans";
import { ThemeProvider } from "next-themes";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import PostListingFormProvider from "@/providers/PostListingFormProvider";
import { Suspense } from "react";

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
        <body className={`${dmsans.className} bg-background text-foreground`}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <PostListingFormProvider>
              <main className="min-h-screen flex flex-col items-center">
                {children}
              </main>
            </PostListingFormProvider>
          </ThemeProvider>
        </body>
      </html>
    </Suspense>
  );
}
