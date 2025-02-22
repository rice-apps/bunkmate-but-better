"use client";

import { Suspense, useEffect, useState } from "react";
import ListingCard from "@/components/ListingCard";
import { Button } from "@/components/ui/button";
import { createClient, getImagePublicUrl } from "@/utils/supabase/client";
import { useSearchParams } from "next/navigation";
import { useRouter } from "@bprogress/next";
import LoadingCircle from "@/components/LoadingCircle";
import LoadingCard from "@/components/LoadingCard";
import { motion } from "framer-motion";
import { FcFeedback } from "react-icons/fc";
import { MdChatBubble } from "react-icons/md";

interface Listing {
  address: string;
  created_at: string;
  distance: number;
  description: string;
  duration_notes: string;
  end_date: string;
  id: number;
  image_paths: string[];
  phone_number: string;
  price: number;
  price_notes: string;
  start_date: string;
  title: string;
  user_id: string;
}

interface Favorite {
  listing_id: number;
}

export default function Index() {
  const supabase = createClient();
  const router = useRouter();
  const [listings, setListings] = useState<Listing[] | null>(null);
  const [favorites, setFavorites] = useState<{ [key: number]: boolean }>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadingCardCount, setLoadingCardCount] = useState(4);
  const [visibleListings, setVisibleListings] = useState(24);
  const [hasMore, setHasMore] = useState(true);

  const searchParams = useSearchParams();

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

        let query = supabase.from('listings').select();

        const startDate = (searchParams && searchParams.get('startDate') ? new Date(searchParams.get('startDate')!) : null);
        const endDate = (searchParams && searchParams.get('endDate') ? new Date(searchParams.get('endDate')!) : null);
        const distance = (searchParams && searchParams.get('distance')) || null;
        const search = (searchParams && searchParams.get('search')) || null;

        // Apply filters
        if (search) {
          query = query.or(`title.ilike.%${search}%,address.ilike.%${search}%`);
        }
        if (startDate) {
          const startRange = new Date(startDate);
          startRange.setDate(startRange.getDate() - 7); // One week before
          const endRange = new Date(startDate);
          endRange.setDate(endRange.getDate() + 7); // One week after

          query = query.gte('start_date', startRange.toISOString());
          query = query.lte('start_date', endRange.toISOString());
        }
        if (endDate) {
          const startRange = new Date(endDate);
          startRange.setDate(startRange.getDate() - 7); // One week before
          const endRange = new Date(endDate);
          endRange.setDate(endRange.getDate() + 7); // One week after

          query = query.gte('end_date', startRange.toISOString());
          query = query.lte('end_date', endRange.toISOString());
        }
        // Implement distance filtering logic here if applicable
        if (distance) {
          if (distance == "< 1 mile") query = query.lte('distance', 1);
          else if (distance == "< 3 miles") query = query.lte('distance', 3);
          else if (distance == "< 5 miles") query = query.lte('distance', 5);
          else if (distance == "> 5 miles") query = query.gte('distance', 5);

          query = query.order('distance');
        }

        const { data: listings, error } = await query.order('created_at', { ascending: false });

        if (listings && (startDate || endDate)) {
          listings.sort((a, b) => {
            let totalDiffA = 0;
            let totalDiffB = 0;

            if (startDate) {
              const aStartDate = new Date(a.start_date);
              const bStartDate = new Date(b.start_date);

              // Calculate start date differences
              const aStartDiff = Math.abs(aStartDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);
              const bStartDiff = Math.abs(bStartDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);

              totalDiffA += aStartDiff;
              totalDiffB += bStartDiff;
            }

            if (endDate) {
              const aEndDate = new Date(a.end_date);
              const bEndDate = new Date(b.end_date);

              // Calculate end date differences
              const aEndDiff = Math.abs(aEndDate.getTime() - endDate.getTime()) / (1000 * 60 * 60 * 24);
              const bEndDiff = Math.abs(bEndDate.getTime() - endDate.getTime()) / (1000 * 60 * 60 * 24);

              totalDiffA += aEndDiff;
              totalDiffB += bEndDiff;
            }

            // Sort by combined difference (smaller difference = more relevant)
            return totalDiffA - totalDiffB;
          });
        }

        if (error) throw error;

        setListings(listings);
        setHasMore(listings.length > visibleListings);

        const { data: favorites } = await supabase.from('users_favorites').select('listing_id').eq('user_id', user?.id);

        // Convert the list of favorites to an object for faster lookups.
        const favoritesObject: { [key: number]: boolean } = {};
        favorites?.forEach((favorite: Favorite) => {
          favoritesObject[favorite.listing_id] = true;
        });

        setFavorites(favoritesObject);

        if (!user) {
          router.push('/sign-in');
          return;
        }
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
  }, [searchParams]);

  const loadMore = async () => {
    setIsLoadingMore(true);
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate loading
    setVisibleListings(prev => {
      const next = prev + 24;
      setHasMore(listings ? listings.length > next : false);
      return next;
    });
    setIsLoadingMore(false);
  };

  const renderLoadingState = () => (
    <>
      {[...Array(loadingCardCount)].map((_, index) => (
        <LoadingCard key={`loading-${index}`} />
      ))}
    </>
  );

  const renderError = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center min-h-[50vh] space-y-4"
    >
      <p className="text-red-500">{error}</p>
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Button onClick={() => window.location.reload()}>
          Try Again
        </Button>
      </motion.div>
    </motion.div>
  );

  return (
    <Suspense>
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="mx-auto py-8 w-full"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {isLoading ? renderLoadingState() : error ? renderError() :
            (
              <>
                {listings && (listings.length > 0) ? listings.slice(0, visibleListings).map((listing) => (
                  <motion.div 
                    key={listing.id}
                    className="w-full"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <ListingCard
                      postId={listing.id.toString()}
                      name={listing.title}
                      imagePath={getImagePublicUrl("listing_images", (listing.image_paths[0]))}
                      distance={listing.distance}
                      duration={`${new Date(listing.start_date).toLocaleDateString()} - ${new Date(listing.end_date).toLocaleDateString()}`}
                      price={`$${listing.price} / month`}
                      isRiceStudent={true}
                      ownListing={false}
                      isFavorited={listing.id in favorites}
                      imagePaths={listing.image_paths}
                    />
                  </motion.div>
                )) : (
                  <motion.div 
                    className="col-span-full flex flex-col items-center justify-center py-12"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <p className="text-gray-500 text-lg">No listings found</p>
                  </motion.div>
                )}
                {isLoadingMore && (
                  <>
                    {[...Array(4)].map((_, index) => (
                      <LoadingCard key={`loading-more-${index}`} />
                    ))}
                  </>
                )}
                {hasMore && listings && listings.length > 0 && (
                  <motion.div 
                    className="col-span-full flex justify-center mt-8"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Button 
                      onClick={loadMore}
                      className="bg-[#FF7439] hover:bg-[#FF7439]/90 text-white"
                      disabled={isLoadingMore}
                    >
                      {isLoadingMore ? (
                        <div className="flex items-center gap-2">
                          <LoadingCircle /> Loading...
                        </div>
                      ) : (
                        'Load More'
                      )}
                    </Button>
                  </motion.div>
                )}
              </>
            )}
        </div>
      </motion.main>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="fixed bottom-8 right-8 z-50"
      >
        <motion.a
          href="https://9uy5o8dl8l3.typeform.com/to/fRbwnf6u"
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button className="bg-[#FF7439] hover:bg-[#FF7439]/90 text-white font-semibold px-6 py-3 rounded-full shadow-lg flex items-center space-x-1">
            <MdChatBubble />
            <p>Give Feedback</p>
          </Button>
        </motion.a>
      </motion.div>
    </Suspense>
  );
}
