import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <div className="flex flex-col min-h-screen items-center w-[90%] sm:w-[90%] mx-auto">
      <Navbar />
      <div className="w-full flex-grow flex-1 flex flex-col items-center">
        {children}
      </div>
      <Footer/>
    </div>
  );
}
