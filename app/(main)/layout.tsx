import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <div className="flex flex-col items-center w-[80%] sm:w-[90%] mx-auto">
      <Navbar />
      <div className="w-full flex-1 flex flex-col items-center">
        {children}
      </div>
      <Footer/>
    </div>
  );
}
