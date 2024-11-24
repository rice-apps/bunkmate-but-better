"use client";

import ListingCard from "@/components/ListingCard";
import Navbar from "@/components/Navbar";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { BsArrowUpCircleFill } from "react-icons/bs";


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

const listings: Listing[] = [
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
    isFavorite: true,
  },
  {
    id: "4",
    title: "Modern Villa",
    distance: "2.5 miles away",
    dates: "June - July",
    price: 2000,
    location: "Austin, TX",
    imageUrl: "/cherry_house.jpeg",
    renterType: "Rice Student",
    isFavorite: true,
  },
  {
    id: "5",
    title: "Cozy Apartment",
    distance: "0.5 miles away",
    dates: "Year-round",
    price: 1200,
    location: "Houston, TX",
    imageUrl: "/cherry_house.jpeg",
    renterType: "Not Rice Student",
    isFavorite: true,
  },
  {
    id: "6",
    title: "Sunny Condo",
    distance: "1.8 miles away",
    dates: "August - May",
    price: 1450,
    location: "Houston, TX",
    imageUrl: "/cherry_house.jpeg",
    renterType: "Rice Student",
    isFavorite: true,
  },
  {
    id: "7",
    title: "Downtown Loft",
    distance: "0.9 miles away",
    dates: "June - December",
    price: 1550,
    location: "Dallas, TX",
    imageUrl: "/cherry_house.jpeg",
    renterType: "Rice Student",
    isFavorite: true,
  },
  {
    id: "8",
    title: "Luxury Penthouse",
    distance: "5.0 miles away",
    dates: "Year-round",
    price: 3500,
    location: "Houston, TX",
    imageUrl: "/cherry_house.jpeg",
    renterType: "Not Rice Student",
    isFavorite: true,
  },
  {
    id: "9",
    title: "Suburban Home",
    distance: "10.0 miles away",
    dates: "August - May",
    price: 1800,
    location: "Katy, TX",
    imageUrl: "/cherry_house.jpeg",
    renterType: "Not Rice Student",
    isFavorite: true,
  },
  {
    id: "10",
    title: "Beach House",
    distance: "30.0 miles away",
    dates: "Summer only",
    price: 2500,
    location: "Galveston, TX",
    imageUrl: "/cherry_house.jpeg",
    renterType: "Rice Student",
    isFavorite: true,
  },
  {
    id: "11",
    title: "Studio Apartment",
    distance: "0.3 miles away",
    dates: "Year-round",
    price: 950,
    location: "Houston, TX",
    imageUrl: "/cherry_house.jpeg",
    renterType: "Rice Student",
    isFavorite: true,
  },
  {
    id: "12",
    title: "Elegant Townhouse",
    distance: "3.0 miles away",
    dates: "August - May",
    price: 1600,
    location: "Houston, TX",
    imageUrl: "/cherry_house.jpeg",
    renterType: "Rice Student",
    isFavorite: true,
  },
];

export default function Favorites() {
  const supabase = createClient();
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/sign-in");
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

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
          {listings.map((listing) => (
            <div key={listing.id} className="w-full">
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