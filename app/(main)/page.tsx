//(main)/page.tsx

"use client";

import { useEffect, useState } from "react";
import ListingCard from "@/components/ListingCard";
import { Button } from "@/components/ui/button";
import { createClient, getImagePublicUrl } from "@/utils/supabase/client";
import { useRouter, useSearchParams } from "next/navigation";
import LoadingCircle from "@/components/LoadingCircle";

interface Listing {
  address: string;
  created_at: string;
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
const LoadingCard = () => (
  <div className="w-full">
    <div className="relative rounded-2xl overflow-hidden bg-gray-200 animate-pulse">
      {/* Image placeholder - using aspect ratio to match your images */}
      <div className="relative w-full aspect-square bg-gray-300" />

      {/* Content placeholders */}
      <div className="mt-4 space-y-3 p-4">
        <div className="flex justify-between items-center">
          {/* Title placeholder */}
          <div className="h-6 bg-gray-300 rounded w-3/5" />
          {/* Rice Student badge placeholder */}
          <div className="flex items-center gap-1 bg-gray-300 rounded h-6 w-1/4" />
        </div>
        {/* Details placeholders */}
        <div className="space-y-2.5">
          <div className="h-4 bg-gray-300 rounded w-4/5" />
          <div className="h-4 bg-gray-300 rounded w-3/4" />
          <div className="h-4 bg-gray-300 rounded w-2/4" />
        </div>
      </div>
    </div>
  </div>
);

export default function Index() {
  const supabase = createClient();
  const router = useRouter();
  const [listings, setListings] = useState<Listing[] | null>(null);
  const [favorites, setFavorites] = useState<{ [key: number]: boolean }>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loadingCardCount, setLoadingCardCount] = useState(4);

  const searchParams = useSearchParams(); // Use useSearchParams


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


        // Apply filters
        if (startDate) {
          const startRange = new Date(startDate);
          startRange.setMonth(startRange.getMonth() - 1); // One month before
          const endRange = new Date(startDate);
          endRange.setMonth(endRange.getMonth() + 1); // One month after

          query = query.gte('start_date', startRange.toISOString());
          query = query.lte('start_date', endRange.toISOString());
        }
        if (endDate) {
          const startRange = new Date(endDate);
          startRange.setMonth(startRange.getMonth() - 1); // One month before
          const endRange = new Date(endDate);
          endRange.setMonth(endRange.getMonth() + 1); // One month after

          query = query.gte('end_date', startRange.toISOString());
          query = query.lte('end_date', endRange.toISOString());
        }
        // Implement distance filtering logic here if applicable

        const { data: listings, error } = await query.order('created_at', { ascending: false });

        if (error) throw error;

        setListings(listings);

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
  }, [router, searchParams]);

  const renderLoadingState = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 min-w-[90vw]">
      {[...Array(loadingCardCount)].map((_, index) => (
        <LoadingCard key={`loading-${index}`} />
      ))}
    </div>
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
    <>
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {isLoading ? renderLoadingState() : error ? renderError() :
            (
              <>
                {listings && listings.map((listing) => (
                  <div key={listing.id} className="w-full">
                    <ListingCard
                      postId={listing.id.toString()}
                      name={listing.title}
                      imagePath={getImagePublicUrl("listing_images", (listing.image_paths[0]))}
                      distance={"2 miles away"}
                      duration={`${new Date(listing.start_date).toLocaleDateString()} - ${new Date(listing.end_date).toLocaleDateString()}`}
                      price={`$${listing.price} / month`}
                      isRiceStudent={true}
                      ownListing={false}
                      isFavorited={listing.id in favorites}
                    />
                  </div>
                ))}
              </>
            )}
        </div>
      </main>
    </>
  );
}
