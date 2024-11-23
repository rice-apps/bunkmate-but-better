"use client";

import ListingCard from "@/components/ListingCard";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { createClient, getImagePublicUrl } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { FaPhoneAlt } from "react-icons/fa";
import { IoMail } from "react-icons/io5";
import Image from "next/image";
import { useEffect, useState } from "react";

type Listing = {
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

const favoritelistings: Listing[] = [
  {
    id: "1",
    title: "Life Tower",
    distance: "1.2 miles away",
    dates: "August - May",
    price: 1350,
    location: "Houston, TX",
    imageUrl: "/cherry_house.jpeg",
    renterType: "Rice Student",
    isFavorite: true,
  },
  {
    id: "2",
    title: "The Nest on Dryden jawiojeiwoajeiwo",
    distance: "0.7 miles away",
    dates: "August - May",
    price: 1400,
    location: "Houston, TX",
    imageUrl: "/hobbit_house.jpeg",
    renterType: "Not Rice Student",
    isFavorite: true,
  },
  {
    id: "3",
    title: "The Nest on Dryden",
    distance: "0.7 miles away",
    dates: "August - May",
    price: 1400,
    location: "Houston, TX",
    imageUrl: "/hobbit_house.jpeg",
    renterType: "Rice Student",
    isFavorite: false,
  },
  {
    id: "4",
    title: "The Nest on Dryden",
    distance: "0.7 miles away",
    dates: "August - May",
    price: 1400,
    location: "Houston, TX",
    imageUrl: "/house1.jpeg",
    renterType: "Rice Student",
    isFavorite: false,
  },
];

const listings: Listing[] = [
  {
    id: "5",
    title: "The Nest on Dryden",
    distance: "0.7 miles away",
    dates: "August - May",
    price: 1400,
    location: "Houston, TX",
    imageUrl: "/house1.jpeg",
    renterType: "Not Rice Student",
    isFavorite: true,
  },
  {
    id: "6",
    title: "pretty house jeiwoajeiowjaoieaweiwoe",
    distance: "15.8 miles away",
    dates: "August - May",
    price: 1400,
    location: "Houston, TX",
    imageUrl: "/modern_house.jpeg",
    renterType: "Rice Student",
    isFavorite: true,
  },
];

export default function Index() {
  const supabase = createClient();
  const [profile, setProfile] = useState<{
    username: string;
    email: string;
    phone: string;
  } | null>();
  const [favoritelistings, setFavoriteListings] = useState<Listing[]>([]);
  const [listings, setListings] = useState<Listing[]>([]);
  useEffect(() => {
    const fetchUser = async () => {
      const user = await supabase.auth.getUser();
      if (user.data.user) {
        supabase
          .from("users")
          .select()
          .eq("id", user.data.user.id)
          .then((data) => {
            if (data.error) {
              console.error("Error fetching user");
              return;
            }
            if (data.data.length === 0) {
              console.error("No user");
              return;
            }
            setProfile({
              username: data.data[0].name,
              email: data.data[0].email,
              phone: data.data[0].phone,
            });
          });
        supabase
          .from("users_favorites")
          .select(
            `
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
          `
          )
          .eq("user_id", user.data.user.id)
          .then((data) => {
            if (data.error) {
              console.error("Error fetching favorites");
              return;
            }
            setFavoriteListings(
              data.data.map((favorite: any): Listing => {
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
              })
            );
          });

        supabase
          .from("listings")
          .select()
          .eq("user_id", user.data.user.id)
          .then((data) => {
            if (data.error) {
              console.error("Error fetching listings");
              return;
            }
            setListings(
              data.data.map((listing: any): Listing => {
                return {
                  id: listing.id,
                  title: listing.title,
                  distance: "1.2 miles away",
                  dates: `${new Date(listing.start_date).toLocaleDateString()} - ${new Date(listing.end_date).toLocaleDateString()}`,
                  price: listing.price,
                  location: listing.address,
                  imageUrl: listing.image_paths[0]
                    ? getImagePublicUrl(
                        "listing_images",
                        listing.image_paths[0]
                      )
                    : "",
                  renterType: "Rice Student",
                  isFavorite: true,
                };
              })
            );
          });
      } else {
        console.error("No user");
      }
    };
    fetchUser();
  }, []);

  const router = useRouter();

  return (
    <>
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center">
          <Navbar />

          <main className="flex flex-col gap-[20px] w-full h-full items-left mb-20">
            <div className="flex flex-col text-left sm:items-start ml-5">
              <h1 className="text-left text-2xl font-semibold">Profile</h1>
              <h1 className="text-left text-sm mb-2">
                Welcome to your profile page! Here, you can access your profile
                information, your favorites, and your lisitings
              </h1>
            </div>
            <div className="p-5 flex flex-col sm:flex-row gap-[42.7px]">
              {/* Profile Image and Rice Affiliate text */}
              <div className="flex flex-col items-center sm:items-start">
                <h1 className="text-left text-2xl font-semibold mb-6">
                  Your Profile Information
                </h1>

                <h1 className="text-lg sm:text-xl">Profile Picture</h1>
                <div className="relative w-32 h-32 overflow-hidden rounded-full mb-5">
                  <Image
                    src={"/profile_pic.jpeg"}
                    fill={true}
                    alt="profile pic"
                    className="object-cover"
                  />
                </div>
                <h1 className="text-lg font-semibold mt-10">Rice Affiliate</h1>
                <div className="flex flex-row gap-[5.1px] items-center mt-2 sm:mt-0">
                  <Image
                    src={"/owl.png"}
                    width={20}
                    height={5}
                    alt="owl"
                    className="w-5 h-5 scale-75"
                  />
                  <p className="text-[#FF7439] text-sm">Rice Student</p>
                </div>
              </div>

              {/* Additional Information */}
              <div className="flex flex-col justify-center">
                <div className="flex flex-col mt-4">
                  <div className="flex flex-col mb-7">
                    <h1 className="text-lg font-semibold mb-[2.27px]">Name</h1>
                    <p className="text-lg">{profile?.username}</p>
                  </div>

                  <div className="mb-7">
                    <h1 className="text-lg font-semibold mb-[2.27px]">
                      Email Address
                    </h1>
                    <p className="text-xs text-gray-400">{profile?.email}</p>
                  </div>

                  <div className="mb-7 mt-8">
                    <h1 className="text-lg font-semibold mb-[2.27px]">
                      Phone Number
                    </h1>
                    <p className="text-xs text-gray-400">{profile?.phone}</p>
                  </div>
                </div>
              </div>
            </div>
          </main>

          <div className="container">
            <h1 className="text-left text-xl font-semibold mb-1">
              Favorite Listings
            </h1>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mb-6">
            {favoritelistings.map((listing) => (
              <div key={listing.id} className="transform scale-90">
                <ListingCard
                  postId={listing.id}
                  name={listing.title}
                  imagePath={listing.imageUrl}
                  distance={listing.distance}
                  duration={listing.dates}
                  price={`$${listing.price} / month`}
                  isRiceStudent={listing.renterType === "Rice Student"}
                  isFavorited={listing.isFavorite}
                />
              </div>
            ))}
          </div>

          <div className="container">
            <h1 className="text-left text-xl font-semibold mb-1 mt-10">
              Your Listings
            </h1>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {listings.map((listing) => (
              <div key={listing.id} className="transform scale-90 -gap-1">
                <ListingCard
                  postId={listing.id}
                  name={listing.title}
                  imagePath={listing.imageUrl}
                  distance={listing.distance}
                  duration={listing.dates}
                  price={`$${listing.price} / month`}
                  isRiceStudent={listing.renterType === "Rice Student"}
                  isFavorited={listing.isFavorite}
                />
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
