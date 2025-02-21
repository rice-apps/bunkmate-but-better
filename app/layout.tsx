import { GeistSans } from "geist/font/sans";
import { DM_Sans } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import PostListingFormProvider from "@/providers/PostListingFormProvider";

const dmsans = DM_Sans({ subsets: ["latin"] });

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "BunkMate - On Demand Subletting and Off-Campus Leasing",
  description:
    "Find Off-campus housing and subletters with ease using Bunkmate.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${dmsans.className} bg-background text-foreground`}
        suppressHydrationWarning
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
          suppressHydrationWarning
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
