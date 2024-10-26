import ListingCard from "@/components/ListingCard";
import Navbar from "@/components/Navbar";
import { hasEnvVars } from "@/utils/supabase/check-env-vars";


type Listing = {
  id: string;
  title: string;
  distance: string;
  dates: string;
  price: number;
  location: string;
  imageUrl: string;
  renterType: 'Rice Student' | string;
}

const listings: Listing[] = [
  {
    id: '1',
    title: 'Life Tower',
    distance: '1.2 miles away',
    dates: 'August - May',
    price: 1300,
    location: 'Houston, TX',
    imageUrl: '/path-to-your-image.jpg',
    renterType: 'Rice Student'
  },
  {
    id: '2',
    title: 'The Nest on Dryden',
    distance: '0.7 miles away',
    dates: 'August - May',
    price: 1400,
    location: 'Houston, TX',
    imageUrl: '/path-to-your-image.jpg',
    renterType: 'Rice Student'
  },
  // Add more listings as needed
];

export default async function Index() {
  return (
    <>
    <Navbar />
    <ListingCard />
    </>
    // <div className="min-h-screen">
    //   <Navbar />
    //   <main className="container mx-auto px-4 py-8">
    //     <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
    //       {listings.map((listing, index) => (
    //         <ListingCard key={index} />
    //       ))}
    //     </div>
    //   </main>
    // </div>
  );
}
