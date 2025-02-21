"use client";

import { PostgrestError } from '@supabase/supabase-js';
import Listing from "@/components/Listing";
import ListingDescription from "@/components/ListingDescription";
import MeetSubleaser from "@/components/MeetSubleaser";
import { createClient, getImagePublicUrl } from "@/utils/supabase/client";
import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";

interface UserData {
  id: string;
  name: string;
  email: string;
  created_at: string;
  phone: string | null;
  profile_image_path: string | null;
  affiliation: string | null;
}

interface ListingData {
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
  user?: UserData;
  bed_num: number;
  bath_num: number;
  distance: number;
}

// Type guard for PostgrestError
function isPostgrestError(error: unknown): error is PostgrestError {
  return (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    "details" in error &&
    "hint" in error &&
    "code" in error
  );
}

// Search params component
function SearchParamsProvider({
  onParamsChange
}: {
  onParamsChange: (params: ReturnType<typeof useSearchParams>) => void;
}) {
  const searchParams = useSearchParams();
  
  useEffect(() => {
    onParamsChange(searchParams);
  }, [searchParams, onParamsChange]);

  return null;
}

const ListingPage = () => {
  const params = useParams();
  const listingId = params.id as string;
  const [listing, setListing] = useState<ListingData | null>(null);
  const [captions, setCaptions] = useState<{ [key: number]: string }>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();
  const [currentSearchParams, setCurrentSearchParams] = useState<ReturnType<typeof useSearchParams> | null>(null);

  // Grabbing the isFavorited value & converting from the URL of Listing.
  const searchParams = useSearchParams();
  const isFavorited = searchParams?.get("isFavorited");
  const isFavoritedValue = isFavorited === "true";
  useEffect(() => {
    const fetchListing = async () => {
      try {
        setIsLoading(true);
        setError(null);

        if (!listingId) {
          throw new Error("No listing ID provided");
        }

        const { data, error: queryError } = await supabase
          .select(`
            *,
            user:users!user_id(
              id,
              name,
              email,
              created_at,
              phone,
              profile_image_path,
              affiliation
            )
          `)
          .eq("id", listingId)
          .single();

        if (queryError) throw queryError;
        if (!data) throw new Error("No listing found");

        setListing(data);

        const { data: captionData, error: captionError } = await supabase
          .from("images_captions")
          .select("*")
          .in("image_path", data.image_paths);

        if (captionError) throw captionError;

        const captions = captionData?.reduce((acc, cur) => {
          const index = data.image_paths.indexOf(cur.image_path);
          acc[index] = cur.caption;
          return acc;
        }, {} as { [key: number]: string });

        setCaptions(captions);
      } catch (err: unknown) {
        let errorMessage: string;

        if (isPostgrestError(err)) {
          console.warn("Supabase error:", {
            message: err.message,
            details: err.details,
            hint: err.hint,
          });
          errorMessage = err.message;
        } else if (err instanceof Error) {
          console.warn("Error fetching listing:", err.message);
          errorMessage = err.message;
        } else {
          console.warn("Unknown error:", err);
          errorMessage = "An unexpected error occurred";
        }

        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchListing();
  }, [listingId, supabase]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error || !listing) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen space-y-4">
        <p className="text-red-500 text-lg">{error || "Listing not found"}</p>
        <button
          onClick={() => window.history.back()}
          className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
        >
          Go Back
        </button>
      </div>
    );
  }

  const formatDateRange = (startDate: string, endDate: string) => {
    const formatDate = (dateString: string) => {
      return new Date(dateString).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      });
    };

    return `${formatDate(startDate)} - ${formatDate(endDate)}`;
  };

  return (
    <>
      <Suspense fallback={null}>
        <SearchParamsProvider onParamsChange={setCurrentSearchParams} />
      </Suspense>
      <Listing
        data={{
          id: listing.id.toString(),
          title: listing.title,
          distance: `${listing.distance} away`,
          start_date: listing.start_date,
          end_date: listing.end_date,
          price: listing.price,
          location: listing.address,
          isFavorited: isFavoritedValue,
          imagePaths: listing.image_paths,
          loadImages: true,
          description: listing.description,
          phoneNumber: listing.phone_number,
          durationNotes: listing.duration_notes,
          priceNotes: listing.price_notes,
          captions: captions,
          user: listing.user
            ? {
              fullName: listing.user.name,
              avatarUrl: listing.user.profile_image_path,
              email: listing.user.email,
              isRiceStudent: listing.user.affiliation === "Rice Student",
            }
            : null,
        }}
      />
      <div className="flex flex-col lg:flex-row w-full mt-4 justify-between mb-10 gap-10">
        <div className="lg:w-1/2 xl:w-2/3">
          <ListingDescription
            data={{
              location: listing.address,
              description: listing.description,
              price: listing.price,
              priceNotes: listing.price_notes,
              start_date: listing.start_date,
              end_date: listing.end_date,
              durationNotes: listing.duration_notes,
              distance: listing.distance,
              bed_num: listing.bed_num,
              bath_num: listing.bath_num,
            }}
          />
        </div>
        <div className="lg:w-1/2 xl:w-1/3">
          <MeetSubleaser
            data={{
              phone_number: listing.phone_number,
              user: listing.user
                ? {
                  full_name: listing.user.name,
                  email: listing.user.email,
                  profile_image_path: listing.user.profile_image_path ||
                    undefined,
                  avatar_url: listing.user.profile_image_path
                    ? getImagePublicUrl(
                      "profiles",
                      listing.user.profile_image_path,
                    )
                    : undefined,
                  is_rice_student: listing.user.affiliation === "Rice Student",
                }
                : undefined,
            }}
          />
        </div>
      </div>
    </Suspense>
  );
};

export default ListingPage;
