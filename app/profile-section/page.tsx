"use client";

import ListingCard from "@/components/ListingCard";
import YourListingCard from "@/components/YourListingCard";

import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { FaPhoneAlt } from 'react-icons/fa';
import { IoMail } from 'react-icons/io5';
import Image from 'next/image';
import Link from 'next/link';
import { RiPencilFill } from 'react-icons/ri';
import { MdLogout } from "react-icons/md";


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
  const router = useRouter();

  return (
    <>
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center">
          <Navbar />
          
        

          <main className='flex flex-col gap-[20px] w-full h-full items-left mb-20'>
          
          <div className='flex flex-col text-left sm:items-start ml-5'>
            <h1 className="text-left text-[32px] font-bold">Profile</h1>
            <h1 className="text-left text-[20px] mb-2 mt-5">Welcome to your profile page! Here, you can access your profile information, your favorites, and your lisitings</h1>
          </div>
        

              {/* Profile Image and Rice Affiliate text */}
             
          <div className='flex flex-col items-center sm:items-start mt-10 ml-[16px]'>

            <div className='flex flex-row gap-[800px]'>
              <h1 className="text-left text-[30px] text-#000000 font-medium mb-[60px]">Your Profile Information</h1>
              
              <div className='flex flex-row gap-[20px]'>
              <Link href='/edit-profile'>
                <button className="group mr-50mr-50 w-[200px] h-[43px] bg-[#F0F0F0] gap-[5.69px] hover:bg-[#777777] rounded-[10.2px] flex items-center justify-center transform transition-all duration-150 hover:scale-105 active:scale-105">
                  <RiPencilFill className="text-[#777777] group-hover:fill-[#F0F0F0]"/>
                  <p className="text-[16px] text-[#777777] group-hover:text-[#F0F0F0] font-600">EDIT PROFILE</p>
                </button>
              </Link>

                <button className="w-[160px] h-[43px] bg-[#CC3333] gap-[5.69px] hover:bg-[#990000] rounded-[10.2px] flex items-center justify-center transform transition-all duration-150 hover:scale-105 active:scale-95">
                  <MdLogout className="text-[#FFFFFF]" />
                  <p className="text-[16px] text-[#FFFFFF] font-600">Log out</p>
                </button>
              </div>

            </div>

        <div className='flex flex-row items-center sm:items-start gap-[150px]'>
          <div className='flex flex-col items-center sm:items-start'>

            <h1 className='text-[24px] font-semibold'>Profile Picture</h1>

          
            <div className='relative w-[196px] h-[196px] border-[4px] overflow-hidden rounded-full mt-7'>
                <Image 
                  src={'/profile_pic.jpeg'} 
                  fill={true}
                  alt='profile pic' 
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" 
                  className='object-cover'
                />
            </div>
            
            <h1 className="text-[24px] font-medium mt-10">Rice Affiliate</h1>

            <div className='flex flex-row gap-[5.1px] items-center mt-8 sm:mt-5'>
                  <Image 
                    src={'/owl.png'} 
                    width={20}  
                    height={5}
                    alt='owl'
                    className='w-5 h-5 scale-75'
                  />
                  <p className='text-[#FF7439] text-sm'>Rice Student</p>
             </div>    
          </div>

             <div className="flex flex-col sm:mt-0 sm:ml-[20px]">
                <div className="flex flex-col  mb-7">
                  <h1 className="text-[24px] font-medium mb-[2.27px]">Name</h1>
                  <p className="text-[16px] text-gray-400">First Last</p>
                </div>

                <div className="flex flex-col mt-7  mb-7">
                  <h1 className="text-[24px] font-medium mb-[2.27px]">Email Address</h1>
                  <p className="text-[16px] text-gray-400">netid@rice.edu</p>
                </div>

                <div className="flex flex-col mt-7 mb-7">
                  <h1 className="text-[24px] font-medium mb-[2.27px]">Phone Number</h1>
                  <p className="text-[16px] text-gray-400">+1 (XXX) XXX-XXXX</p>
                </div>
              </div>
            </div>
          </div>
        </main>

          <div className="container mx-auto px-4 py-8">
            <h1 className="text-left text-[30px] font-medium mb-[-20px] ">Your Favorite Listings</h1>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
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

          <div className="container mx-auto px-4 py-8">
            <h1 className="text-left text-[30px] font-medium mt-10 mb-[-20px]">Your Listings</h1>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {listings.map((listing) => (
              <div key={listing.id} className="transform scale-90">
                <YourListingCard
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
