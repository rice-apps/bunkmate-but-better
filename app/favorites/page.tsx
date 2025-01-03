"use client";

import { useEffect, useState } from 'react';
import ListingCard from "@/components/ListingCard";
import Navbar from "@/components/Navbar";
import { createClient, getImagePublicUrl } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { BsArrowUpCircleFill } from "react-icons/bs";
import LoadingCard from '@/components/LoadingCard';
import { Button } from '@/components/ui/button';


interface Listing {
  id: string;
  title: string;
  distance: string;
  dates: string;
  price: number;
  location: string;
  imageUrl: string;
  renterType: "Rice Student" | string;
  isFavorite: boolean;
};
// const listings: Listing[] = [
//   {
//     id: "1",
//     title: "Life Tower",
//     distance: "1.2 miles away",
//     dates: "August - May",
//     price: 1350,
//     location: "Houston, TX",
//     imageUrl: "/cherry_house.jpeg",
//     renterType: "Rice Student",
//     isFavorite: true,
//   },
//   {
//     id: "2",
//     title: "The Nest on Dryden jawiojeiwoajeiwo",
//     distance: "0.7 miles away",
//     dates: "August - May",
//     price: 1400,
//     location: "Houston, TX",
//     imageUrl: "/hobbit_house.jpeg",
//     renterType: "Not Rice Student",
//     isFavorite: true,
//   },
//   {
//     id: "3",
//     title: "The Nest on Dryden",
//     distance: "0.7 miles away",
//     dates: "August - May",
//     price: 1400,
//     location: "Houston, TX",
//     imageUrl: "/hobbit_house.jpeg",
//     renterType: "Rice Student",
//     isFavorite: true,
//   },
//   {
//     id: "4",
//     title: "Modern Villa",
//     distance: "2.5 miles away",
//     dates: "June - July",
//     price: 2000,
//     location: "Austin, TX",
//     imageUrl: "/cherry_house.jpeg",
//     renterType: "Rice Student",
//     isFavorite: true,
//   },
//   {
//     id: "5",
//     title: "Cozy Apartment",
//     distance: "0.5 miles away",
//     dates: "Year-round",
//     price: 1200,
//     location: "Houston, TX",
//     imageUrl: "/cherry_house.jpeg",
//     renterType: "Not Rice Student",
//     isFavorite: true,
//   },
//   {
//     id: "6",
//     title: "Sunny Condo",
//     distance: "1.8 miles away",
//     dates: "August - May",
//     price: 1450,
//     location: "Houston, TX",
//     imageUrl: "/cherry_house.jpeg",
//     renterType: "Rice Student",
//     isFavorite: true,
//   },
//   {
//     id: "7",
//     title: "Downtown Loft",
//     distance: "0.9 miles away",
//     dates: "June - December",
//     price: 1550,
//     location: "Dallas, TX",
//     imageUrl: "/cherry_house.jpeg",
//     renterType: "Rice Student",
//     isFavorite: true,
//   },
//   {
//     id: "8",
//     title: "Luxury Penthouse",
//     distance: "5.0 miles away",
//     dates: "Year-round",
//     price: 3500,
//     location: "Houston, TX",
//     imageUrl: "/cherry_house.jpeg",
//     renterType: "Not Rice Student",
//     isFavorite: true,
//   },
//   {
//     id: "9",
//     title: "Suburban Home",
//     distance: "10.0 miles away",
//     dates: "August - May",
//     price: 1800,
//     location: "Katy, TX",
//     imageUrl: "/cherry_house.jpeg",
//     renterType: "Not Rice Student",
//     isFavorite: true,
//   },
//   {
//     id: "10",
//     title: "Beach House",
//     distance: "30.0 miles away",
//     dates: "Summer only",
//     price: 2500,
//     location: "Galveston, TX",
//     imageUrl: "/cherry_house.jpeg",
//     renterType: "Rice Student",
//     isFavorite: true,
//   },
//   {
//     id: "11",
//     title: "Studio Apartment",
//     distance: "0.3 miles away",
//     dates: "Year-round",
//     price: 950,
//     location: "Houston, TX",
//     imageUrl: "/cherry_house.jpeg",
//     renterType: "Rice Student",
//     isFavorite: true,
//   },
//   {
//     id: "12",
//     title: "Elegant Townhouse",
//     distance: "3.0 miles away",
//     dates: "August - May",
//     price: 1600,
//     location: "Houston, TX",
//     imageUrl: "/cherry_house.jpeg",
//     renterType: "Rice Student",
//     isFavorite: true,
//   },
// ];

interface Favorite {
  listing_id: number;
}

export default function Favorites() {
  const supabase = createClient();
  const router = useRouter();
  const [listings, setListings] = useState<Listing[] | null>(null);
  const [favorites, setFavorites] = useState<{[key: number]: boolean}>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loadingCardCount, setLoadingCardCount] = useState(4);

  useEffect(() => {
    const updateLoadingCardCount = () => {
      const width = window.innerWidth;
      if (width >= 1024) setLoadingCardCount(8); // lg: 4 columns
      else if (width >= 768) setLoadingCardCount(6); // md: 3 columns
      else if (width >= 640) setLoadingCardCount(4); // sm: 2 columns
      else setLoadingCardCount(2); // mobile: 1 column
    };

    // Set initial count
    updateLoadingCardCount();

    // Add resize listener
    window.addEventListener('resize', updateLoadingCardCount);

    // Cleanup
    return () => window.removeEventListener('resize', updateLoadingCardCount);
  }, []);

  useEffect(() => {
    async function fetchPosts() {
      try {
        setIsLoading(true);
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
          router.push('/sign-in');
          return;
        }

        const { data } = await supabase.from('users_favorites').select(`
            user_id,
          listings (
            id,
            title,
            price,
            start_date,
            end_date,
            price,
            image_paths,
            address
            )
          `).eq('user_id', user?.id);

        setListings(data?.map((favorite: any): Listing => {
          return {
            id: favorite.listings.id,
            title: favorite.listings.title,
            distance: "1.2 miles away",
            dates: `${new Date(favorite.listings.start_date).toLocaleDateString()} - ${new Date(favorite.listings.end_date).toLocaleDateString()}`,
            price: favorite.listings.price,
            location: favorite.listings.address,
            imageUrl: getImagePublicUrl(
              "listing_images",
              favorite.listings.image_paths[0]
            ),
            renterType: "Rice Student",
            isFavorite: true,
          };
        }) || []);

        // Convert the list of favorites to an object for faster lookups.
        // const favoritesObject: { [key: number]: boolean } = {};
        // favorites?.forEach((favorite: Favorite) => {
        //   favoritesObject[favorite.listing_id] = true;
        // });

        // setFavorites(favoritesObject);

        // const { data, error } = await supabase
        //   .from('listings')
        //   .select()
        //   .order('created_at', { ascending: false });

        // if (error) throw error;
        // setListings(data);
      }
      catch (error) {
        console.error(error);
        setError('Failed to load listings');
      }
      finally {
        setIsLoading(false);
      }
    }
    fetchPosts();
  }, [router]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const renderLoadingState = () => (
    <>
      {[...Array(loadingCardCount)].map((_, index) => (
        <LoadingCard key={`loading-${index}`} />
      ))}
    </>
  );

  const renderError = () => (
    <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
      <p className="text-red-500">{error}</p>
      <Button onClick={() => window.location.reload()}>
        Try Again
      </Button>
    </div>
  );

  return (
    <div className = "mb-20">
      <Navbar />
      <div className="container mx-auto px-4 py-0">
        <div className="flex justify-between items-center mb-6">
          <h1
            className="font-dm-sans text-[32px] font-bold leading-[41.66px] text-left"
            style={{
              textUnderlinePosition: "from-font",
              textDecorationSkipInk: "none",
            }}
          >
            Your Favorite Listings
          </h1>

        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {isLoading ? renderLoadingState() : error ? renderError() :
            (
              <>
              {listings && listings.map((listing) => (
                <div key={listing.id} className="w-full">
                  <ListingCard
                    postId={listing.id.toString()}
                    name={listing.title}
                    imagePath={listing.imageUrl}
                    distance={"2 miles away"}
                    duration={listing.dates}
                    price={`$${listing.price} / month`}
                    isRiceStudent={true}
                    ownListing={false}
                    isFavorited={true}
                  />
                </div>
              ))}
              </>
            )}
        </div>
      </div>
        {/* Scroll to Top Icon */}
        <div
          className="group fixed bottom-9 right-9 p-0.5 cursor-pointer rounded-full shadow-lg bg-[#FF7439] border-[#FF7439] hover:bg-white"
          onClick={scrollToTop}
        >
          <BsArrowUpCircleFill className="w-16 h-16 text-white group-hover:text-[#FF7439]" />
        </div>
    </div>
  );
}