"use client";

import { useEffect, useState } from 'react';
import ListingCard from "@/components/ListingCard";
import Navbar from "@/components/Navbar";
import { createClient, getImagePublicUrl } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { BsArrowUpCircleFill } from "react-icons/bs";
import LoadingCard from '@/components/LoadingCard';
import { Button } from '@/components/ui/button';
import { motion } from "framer-motion";


interface Listing {
  id: string;
  title: string;
  distance: number;
  dates: string;
  price: number;
  location: string;
  imageUrl: string;
  renterType: "Rice Student" | string;
  isFavorite: boolean;
  image_paths: string[];
};

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
            distance: favorite.listings.distance,
            dates: `${new Date(favorite.listings.start_date).toLocaleDateString()} - ${new Date(favorite.listings.end_date).toLocaleDateString()}`,
            price: favorite.listings.price,
            location: favorite.listings.address,
            imageUrl: getImagePublicUrl(
              "listing_images",
              favorite.listings.image_paths[0]
            ),
            renterType: favorite.listings.affiliation,
            isFavorite: true,
            image_paths: favorite.listings.image_paths
          };
        }) || []);

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
      <motion.p 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-red-500"
      >
        {error}
      </motion.p>
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Button onClick={() => window.location.reload()}>
          Try Again
        </Button>
      </motion.div>
    </div>
  );

  const renderNoFavorites = () => (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center w-full min-h-[50vh] space-y-6 text-center px-4 col-span-full"
    >
      <motion.p 
        className="text-gray-500 text-xl font-medium"
        animate={{ scale: [1, 1.02, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        You haven't favorited any listings yet.
      </motion.p>
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Button 
          onClick={() => router.push('/')}
          className="bg-[#FF7439] hover:bg-[#FF7439]/90 text-white px-8 py-3 rounded-full text-lg shadow-lg transition-all duration-300"
        >
          Browse Listings
        </Button>
      </motion.div>
    </motion.div>
  );

  
  return (
    <div className="mb-20 w-[90%] mx-auto">
      <Navbar />
      <div className="mx-auto py-0 w-full mt-4">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex justify-between items-center mb-6"
        >
          <h1
            className="font-dm-sans text-[32px] font-bold leading-[41.66px] text-left"
            style={{
              textUnderlinePosition: "from-font",
              textDecorationSkipInk: "none",
            }}
          >
            Your Favorite Listings
          </h1>
        </motion.div>
        <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 w-full`}>
          {isLoading ? renderLoadingState() : error ? renderError() :
            listings && listings.length > 0 ? (
              listings.map((listing, index) => (
                <motion.div 
                  key={listing.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="w-full"
                >
                  <ListingCard
                    postId={listing.id.toString()}
                    name={listing.title}
                    imagePath={listing.imageUrl}
                    distance={listing.distance}
                    duration={listing.dates}
                    price={`$${listing.price} / month`}
                    isRiceStudent={true}
                    ownListing={false}
                    isFavorited={true}
                    imagePaths={listing.image_paths}
                  />
                </motion.div>
              ))
            ) : renderNoFavorites()
          }
        </div>
      </div>
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-9 right-9 p-0.5 cursor-pointer rounded-full shadow-lg bg-[#FF7439] border-[#FF7439] hover:bg-white transition-all duration-300"
        onClick={scrollToTop}
      >
        <BsArrowUpCircleFill className="w-16 h-16 text-white group-hover:text-[#FF7439]" />
      </motion.div>
    </div>
  );
}