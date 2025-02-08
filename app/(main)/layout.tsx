import Navbar from "@/components/Navbar";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <div className="flex flex-col items-center w-full">
      <Navbar />
      <div className="w-full flex-1 flex flex-col items-center">
        {children}
      </div>
      
    </div>
  );
}
