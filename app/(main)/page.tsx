"use client";

import { useEffect, useState } from 'react';
import ListingCard from "@/components/ListingCard";
import { Button } from "@/components/ui/button";
import { createClient, getImagePublicUrl } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

interface Listing {
  address: string;
  created_at: string; // ISO date string
  description: string;
  duration_notes: string;
  end_date: string; // ISO date string
  id: number;
  image_paths: string[]; // Array of image path strings
  phone_number: string;
  price: number;
  price_notes: string;
  start_date: string; // ISO date string
  title: string;
  user_id: string; // Allow null if `user_id` is not provided
}

interface Favorite {
  listing_id: number
}

export default function Index() {
  const supabase = createClient();
  const router = useRouter();
  const [listings, setListings] = useState<Listing[] | null>(null);
  const [favorites, setFavorites] = useState<{[key: number]: boolean}>({});

  useEffect(() => {
    async function fetchPosts() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        const { data: listings } = await supabase.from('listings').select();
        const { data: favorites } = await supabase.from('users_favorites').select('listing_id').eq('user_id', user?.id);

        setListings(listings);

        // Convert the list of favorites to an object for faster lookups.
        const favoritesObject: {[key: number]: boolean} = {}
        favorites?.forEach((favorite: Favorite) => {
          favoritesObject[favorite.listing_id] = true;
        })

        setFavorites(favoritesObject);
      }
      catch (error) {
        console.error(error);
      }
      
    }
    fetchPosts();
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut();
    // Redirect to Sign-in page
    router.push("/sign-in");
  };

  return (
    <>
      <Button onClick={handleLogout}>Logout</Button>
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
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
                isFavorited={listing.id in favorites}
              />
            </div>
          ))}
        </div>
      </main>
    </>
  );
}
