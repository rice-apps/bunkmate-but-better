import CardContainer from "@/components/ListingCard";
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
  isFavorite: boolean;
}

const listings: Listing[] = [
  {
    id: '1',
    title: 'Life Tower',
    distance: '1.2 miles away',
    dates: 'August - May',
    price: 1350,
    location: 'Houston, TX',
    imageUrl: '/cherry_house.jpeg',
    renterType: 'Rice Student',
    isFavorite: true
  },
  {
    id: '2',
    title: 'The Nest on Dryden',
    distance: '0.7 miles away',
    dates: 'August - May',
    price: 1400,
    location: 'Houston, TX',
    imageUrl: '/hobbit_house.jpeg',
    renterType: 'Not Rice Student',
    isFavorite: true
  },
  {
    id: '3',
    title: 'The Nest on Dryden',
    distance: '0.7 miles away',
    dates: 'August - May',
    price: 1400,
    location: 'Houston, TX',
    imageUrl: '/hobbit_house.jpeg',
    renterType: 'Rice Student',
    isFavorite: false
  },
  {
    id: '4',
    title: 'The Nest on Dryden',
    distance: '0.7 miles away',
    dates: 'August - May',
    price: 1400,
    location: 'Houston, TX',
    imageUrl: '/hobbit_house.jpeg',
    renterType: 'Rice Student',
    isFavorite: false
  },
  {
    id: '5',
    title: 'The Nest on Dryden',
    distance: '0.7 miles away',
    dates: 'August - May',
    price: 1400,
    location: 'Houston, TX',
    imageUrl: '/hobbit_house.jpeg',
    renterType: 'Not Rice Student',
    isFavorite: true
  },
  // Add more listings as needed
];

export default async function Index() {
  return (
    <>
    <Navbar />
    <main className="container mx-auto px-4 py-8">
      <div className="flex flex-wrap justify-center gap-6">
      {listings.map((listing) => (
        <div className="flex-none w-1/4">
              <CardContainer
                key={listing.id}
                name={listing.title}
                imagePath={listing.imageUrl}
                distance={listing.distance}
                duration={listing.dates}
                price={`$${listing.price} / month`}
                isRiceStudent={listing.renterType === 'Rice Student'}
                isFavorited={listing.isFavorite}
              />
        </div>
            ))}
      </div>
    </main>
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
