import { GeistSans } from "geist/font/sans";
import { ThemeProvider } from "next-themes";
import { DM_Sans } from "next/font/google";
// import "./globals.css";
import Navbar from "@/components/Navbar";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "BunkMate - On Demand Subletting and Off-Campus Leasing",
  description: "Find Off-campus housing and subletters with ease using Bunkmate.",
};

const dmsans = DM_Sans({ subsets: ["latin"] });

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <div className="flex flex-col items-center">
      <Navbar />
      <div className="w-full flex-1 flex flex-col items-center">
        {children}
      </div>
      
    </div>
  );
}
