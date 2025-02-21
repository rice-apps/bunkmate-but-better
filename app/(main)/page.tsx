"use client";

import { Suspense, useEffect, useState } from "react";
import ListingCard from "@/components/ListingCard";
import { Button } from "@/components/ui/button";
import { createClient, getImagePublicUrl } from "@/utils/supabase/client";
import { useRouter, useSearchParams } from "next/navigation";
import LoadingCard from "@/components/LoadingCard";
import { motion } from "framer-motion";
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

function SearchParamsProvider({
  onParamsChange,
}: {
  onParamsChange: (params: ReturnType<typeof useSearchParams>) => void;
}) {
  const searchParams = useSearchParams();

  useEffect(() => {
    onParamsChange(searchParams);
  }, [searchParams, onParamsChange]);

  return null;
}

export default function Page() {
  const supabase = createClient();
  const router = useRouter();
  const [listings, setListings] = useState<Listing[] | null>(null);
  const [favorites, setFavorites] = useState<{ [key: number]: boolean }>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loadingCardCount, setLoadingCardCount] = useState(4);
  const [currentSearchParams, setCurrentSearchParams] = useState<
    ReturnType<typeof useSearchParams> | null
  >(null);

  useEffect(() => {
    const updateLoadingCardCount = () => {
      const width = window.innerWidth;
      if (width >= 1024) setLoadingCardCount(8);
      else if (width >= 768) setLoadingCardCount(6);
      else if (width >= 640) setLoadingCardCount(4);
      else setLoadingCardCount(2);
    };

    updateLoadingCardCount();
    window.addEventListener("resize", updateLoadingCardCount);
    return () => window.removeEventListener("resize", updateLoadingCardCount);
  }, []);

  useEffect(() => {
    async function fetchPosts() {
      try {
        setIsLoading(true);
        const { data: { user } } = await supabase.auth.getUser();

        let query = supabase.from("listings").select();

        const startDate = currentSearchParams?.get("startDate")
          ? new Date(currentSearchParams.get("startDate")!)
          : null;
        const endDate = currentSearchParams?.get("endDate")
          ? new Date(currentSearchParams.get("endDate")!)
          : null;
        const distance = currentSearchParams?.get("distance") || null;

        if (startDate) {
          const startRange = new Date(startDate);
          startRange.setMonth(startRange.getMonth() - 1);
          const endRange = new Date(startDate);
          endRange.setMonth(endRange.getMonth() + 1);

          query = query.gte("start_date", startRange.toISOString());
          query = query.lte("start_date", endRange.toISOString());
        }
        if (endDate) {
          const startRange = new Date(endDate);
          startRange.setMonth(startRange.getMonth() - 1);
          const endRange = new Date(endDate);
          endRange.setMonth(endRange.getMonth() + 1);

          query = query.gte("end_date", startRange.toISOString());
          query = query.lte("end_date", endRange.toISOString());
        }

        if (distance) {
          if (distance === "< 1 mile") query = query.lte("distance", 1);
          else if (distance === "< 3 miles") query = query.lte("distance", 3);
          else if (distance === "< 5 miles") query = query.lte("distance", 5);
          else if (distance === "> 5 miles") query = query.gte("distance", 5);

          query = query.order("distance");
        }

        const { data: listings, error } = await query.order("created_at", {
          ascending: false,
        });

        if (error) throw error;

        setListings(listings);

        if (!user) {
          router.push("/sign-in");
          return;
        }

        const { data: favorites } = await supabase.from("users_favorites")
          .select("listing_id").eq("user_id", user?.id);

        const favoritesObject: { [key: number]: boolean } = {};
        favorites?.forEach((favorite: Favorite) => {
          favoritesObject[favorite.listing_id] = true;
        });

        setFavorites(favoritesObject);
      } catch (error) {
        console.error(error);
        setError("Failed to load listings");
      } finally {
        setIsLoading(false);
      }
    }
    fetchPosts();
  }, [router, currentSearchParams, supabase]);

  const renderLoadingState = () => (
    <>
      {Array.from({ length: loadingCardCount }).map((_, index) => (
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
    <div>
      <Suspense fallback={null}>
        <SearchParamsProvider onParamsChange={setCurrentSearchParams} />
      </Suspense>
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="mx-auto py-8 w-full"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {isLoading ? renderLoadingState() : error ? renderError() : (
            <>
              {listings && listings.length > 0
                ? listings.map((listing, index) => (
                  <motion.div
                    key={listing.id}
                    className="w-full"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <ListingCard
                      postId={listing.id.toString()}
                      name={listing.title}
                      imagePath={getImagePublicUrl(
                        "listing_images",
                        listing.image_paths[0],
                      )}
                      distance={listing.distance}
                      duration={`${
                        new Date(listing.start_date).toLocaleDateString()
                      } - ${new Date(listing.end_date).toLocaleDateString()}`}
                      price={`$${listing.price} / month`}
                      isRiceStudent={true}
                      ownListing={false}
                      isFavorited={listing.id in favorites}
                      imagePaths={listing.image_paths}
                    />
                  </motion.div>
                ))
                : (
                  <motion.div
                    className="col-span-full flex flex-col items-center justify-center py-12"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <p className="text-gray-500 text-lg">No listings found</p>
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
    </div>
  );
}
