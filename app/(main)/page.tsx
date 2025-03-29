"use client";

import ListingCard from "@/components/ListingCard";
import LoadingCard from "@/components/LoadingCard";
import LoadingCircle from "@/components/LoadingCircle";
import {Button} from "@/components/ui/button";
import {createClient, getImagePublicUrl} from "@/utils/supabase/client";
import {useRouter} from "@bprogress/next";
import {motion} from "framer-motion";
import {useSearchParams} from "next/navigation";
import {Suspense, useEffect, useMemo, useState} from "react";
import {MdChatBubble} from "react-icons/md";

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
  const [favorites, setFavorites] = useState<{[key: number]: boolean}>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadingCardCount, setLoadingCardCount] = useState(4);
  const [visibleListings, setVisibleListings] = useState(48);
  const [hasMore, setHasMore] = useState(true);
  const [lastLoadedIndex, setLastLoadedIndex] = useState(0); // Track last loaded index

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
    window.addEventListener("resize", updateLoadingCardCount);

    // Cleanup
    return () => window.removeEventListener("resize", updateLoadingCardCount);
  }, []);

  useEffect(() => {
    async function fetchPosts() {
      try {
        setIsLoading(true);
        const {
          data: {user},
        } = await supabase.auth.getUser();

        let query = supabase.from("listings").select().eq("archived", false);

        const startDate =
          searchParams && searchParams.get("startDate") ? new Date(searchParams.get("startDate")!) : null;
        const endDate = searchParams && searchParams.get("endDate") ? new Date(searchParams.get("endDate")!) : null;
        const distance = (searchParams && searchParams.get("distance")) || null;
        const search = (searchParams && searchParams.get("search")) || null;
        const leaseDuration = (searchParams && searchParams.get("leaseDuration")) || null;
        const location = (searchParams && searchParams.get("location")) || null;

        // Apply filters
        if (search) {
          query = query.or(`title.ilike.%${search}%,address.ilike.%${search}%`);
        }

        // Location filtering
        if (location) {
          query = query.or(`title.ilike.%${location}%,address.ilike.%${location}%`);
        }

        // Date filtering with flexibility for lease durations
        if (startDate) {
          query = query.gte("start_date", startDate.toISOString());
        }
        if (endDate) {
          query = query.lte("end_date", endDate.toISOString());
        }

        // Add lease duration handling
        if (leaseDuration) {
          const now = new Date();
          const year = now.getMonth() >= 6 ? now.getFullYear() : now.getFullYear() - 1;

          switch (leaseDuration) {
            case "academic":
              query = query
                .gte("start_date", new Date(year, 7, 1).toISOString()) // August 1st
                .lte("end_date", new Date(year + 1, 4, 31).toISOString()); // May 31st
              break;
            case "fall":
              query = query
                .gte("start_date", new Date(year, 7, 1).toISOString()) // August 1st
                .lte("end_date", new Date(year, 11, 31).toISOString()); // December 31st
              break;
            case "spring":
              query = query
                .gte("start_date", new Date(year + 1, 0, 1).toISOString()) // January 1st
                .lte("end_date", new Date(year + 1, 4, 30).toISOString()); // April 30th
              break;
            case "summer":
              query = query
                .gte("start_date", new Date(year + 1, 4, 1).toISOString()) // May 1st
                .lte("end_date", new Date(year + 1, 6, 31).toISOString()); // July 31st
              break;
            case "yearly":
              // For yearly, we'll look for listings that span approximately a year
              query = query.gte(
                "end_date",
                new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString(),
              );
              break;
          }
        }
        if (distance) {
          if (distance == "< 1 mile") query = query.lte("distance", 1);
          else if (distance == "< 3 miles") query = query.lte("distance", 3);
          else if (distance == "< 5 miles") query = query.lte("distance", 5);
          else if (distance == "> 5 miles") query = query.gte("distance", 5);

          query = query.order("distance");
        }
        if (searchParams.get("minPrice")) {
          query = query.gte("price", parseInt(searchParams.get("minPrice")!));
        }
        if (searchParams.get("maxPrice")) {
          query = query.lte("price", parseInt(searchParams.get("maxPrice")!));
        }
        if (searchParams.get("bedNum")) {
          query = query.eq("bed_num", parseInt(searchParams.get("bedNum")!));
        }
        if (searchParams.get("bathNum")) {
          query = query.eq("bath_num", parseInt(searchParams.get("bathNum")!));
        }

        const {data: listings, error} = await query.order("created_at", {ascending: false});

        if (listings && (startDate || endDate)) {
          listings.sort((a, b) => {
            let totalDiffA = 0;
            let totalDiffB = 0;

            if (startDate) {
              const aStartDate = new Date(a.start_date);
              const bStartDate = new Date(b.start_date);
              const aStartDiff = Math.abs(aStartDate.getTime() - startDate.getTime());
              const bStartDiff = Math.abs(bStartDate.getTime() - startDate.getTime());
              totalDiffA += aStartDiff;
              totalDiffB += bStartDiff;
            }

            if (endDate) {
              const aEndDate = new Date(a.end_date);
              const bEndDate = new Date(b.end_date);
              const aEndDiff = Math.abs(aEndDate.getTime() - endDate.getTime());
              const bEndDiff = Math.abs(bEndDate.getTime() - endDate.getTime());
              totalDiffA += aEndDiff;
              totalDiffB += bEndDiff;
            }

            // Sort by total difference (smaller difference = more relevant)
            return totalDiffA - totalDiffB;
          });
        }

        if (error) throw error;

        setListings(listings);
        setHasMore(listings.length > visibleListings);
        setLastLoadedIndex(0); // Reset last loaded index on new search

        const {data: favorites} = await supabase.from("users_favorites").select("listing_id").eq("user_id", user?.id);

        // Convert the list of favorites to an object for faster lookups.
        const favoritesObject: {[key: number]: boolean} = {};
        favorites?.forEach((favorite: Favorite) => {
          favoritesObject[favorite.listing_id] = true;
        });

        setFavorites(favoritesObject);

        if (!user) {
          router.push("/sign-in");
          return;
        }
      } catch (error) {
        console.error(error);
        setError("Failed to load listings");
      } finally {
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
      setLastLoadedIndex(prev); // Update last loaded index
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
      initial={{opacity: 0, y: 20}}
      animate={{opacity: 1, y: 0}}
      transition={{duration: 0.5}}
      className="flex flex-col items-center justify-center min-h-[50vh] space-y-4"
    >
      <p className="text-red-500">{error}</p>
      <motion.div whileHover={{scale: 1.05}} whileTap={{scale: 0.95}}>
        <Button onClick={() => window.location.reload()}>Try Again</Button>
      </motion.div>
    </motion.div>
  );

  const categorizeListingByDate = (listing: Listing, startDate: Date | null, endDate: Date | null) => {
    if (!startDate || !endDate) return "other";

    const listingStart = new Date(listing.start_date).getTime();
    const listingEnd = new Date(listing.end_date).getTime();
    const startDiff = Math.abs(listingStart - startDate.getTime());
    const endDiff = Math.abs(listingEnd - endDate.getTime());

    const weekInMs = 7 * 24 * 60 * 60 * 1000;
    const monthInMs = 30 * 24 * 60 * 60 * 1000;

    if (startDiff === 0 && endDiff === 0) return "exact";
    if (startDiff <= weekInMs && endDiff <= weekInMs) return "week";
    if (startDiff <= monthInMs && endDiff <= monthInMs) return "month";
    return "other";
  };

  const categorizedListings = useMemo(() => {
    if (!listings) return null;

    const startDate = searchParams.get("startDate") ? new Date(searchParams.get("startDate")!) : null;
    const endDate = searchParams.get("endDate") ? new Date(searchParams.get("endDate")!) : null;

    return ["exact", "week", "month", "other"].reduce((acc, category) => {
      acc[category] = listings
        .filter(listing => categorizeListingByDate(listing, startDate, endDate) === category)
        .slice(0, visibleListings);
      return acc;
    }, {} as Record<string, Listing[]>);
  }, [listings, searchParams, visibleListings]);

  const renderListings = (mappedListings: Listing[]) => {
    return mappedListings.map((listing, index) => (
      <motion.div
        key={listing.id}
        className="w-full"
        initial={{opacity: 0, y: 20}}
        animate={{opacity: 1, y: 0}}
        transition={{
          duration: 0.5,
          delay: index < lastLoadedIndex ? 0 : (index - lastLoadedIndex) * 0.1,
        }}
      >
        <ListingCard
          postId={listing.id.toString()}
          name={listing.title}
          imagePath={getImagePublicUrl("listing_images", listing.image_paths[0])}
          distance={listing.distance}
          duration={`${new Date(listing.start_date).toLocaleDateString()} - ${new Date(
            listing.end_date,
          ).toLocaleDateString()}`}
          price={`$${listing.price} / month`}
          isRiceStudent={true}
          ownListing={false}
          isFavorited={listing.id in favorites}
          imagePaths={listing.image_paths}
          isArchived={false}
        />
      </motion.div>
    ));
  };

  const renderListingsByDateCategories = () => {
    return ["exact", "week", "month", "other"].map(category => {
      const categoryListings = categorizedListings?.[category] || [];
      if (!categoryListings.length) return null;

      return (
        <div key={category} className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 px-4">
            {category === "exact"
              ? "Exact Date Matches"
              : category === "week"
              ? "Available Within a Week"
              : category === "month"
              ? "Available Within a Month"
              : "Other Available Listings"}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {renderListings(categoryListings)}
          </div>
        </div>
      );
    })
  }

  return (
    <Suspense>
      <motion.main
        initial={{opacity: 0}}
        animate={{opacity: 1}}
        transition={{duration: 0.5}}
        className="mx-auto lg:py-8 sm:py-2 w-full"
      >
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {renderLoadingState()}
          </div>
        ) : error ? (
          renderError()
        ) : (
          <>
            {listings && listings.length > 0 ? (
              searchParams.get("startDate") || searchParams.get("endDate") ? (
                renderListingsByDateCategories()
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                  {renderListings(listings.slice(0, visibleListings))}
                </div>
              )
            ) : (
              <motion.div
                className="flex flex-col items-center justify-center py-12"
                initial={{opacity: 0, y: 20}}
                animate={{opacity: 1, y: 0}}
                transition={{duration: 0.5}}
              >
                <p className="text-gray-500 text-lg">No listings found</p>
              </motion.div>
            )}
            {isLoadingMore && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mt-8">
                {[...Array(4)].map((_, index) => (
                  <LoadingCard key={`loading-more-${index}`} />
                ))}
              </div>
            )}
            {hasMore && listings && listings.length > 0 && (
              <motion.div
                className="col-span-full flex justify-center mt-8"
                initial={{opacity: 0}}
                animate={{opacity: 1}}
                transition={{duration: 0.5}}
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
                    "Load More"
                  )}
                </Button>
              </motion.div>
            )}
          </>
        )}
      </motion.main>
      <motion.div
        initial={{opacity: 0, scale: 0.8}}
        animate={{opacity: 1, scale: 1}}
        transition={{duration: 0.3}}
        className="fixed bottom-8 right-8 z-50"
      >
        <motion.a
          href="https://9uy5o8dl8l3.typeform.com/to/fRbwnf6u"
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{scale: 1.05}}
          whileTap={{scale: 0.95}}
        >
          <Button className="bg-[#FF7439] hover:bg-[#FF7439]/90 text-white font-semibold px-6 py-3 rounded-full shadow-lg flex items-center space-x-1">
            <MdChatBubble />
            <p className="text-white hidden md:block">Give Feedback</p>
          </Button>
        </motion.a>
      </motion.div>
    </Suspense>
  );
}
