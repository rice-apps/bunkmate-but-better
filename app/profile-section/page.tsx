"use client";

import ListingCard from "@/components/ListingCard";
import YourListingCard from "@/components/YourListingCard";
import { motion } from 'framer-motion';
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { createClient, getImagePublicUrl } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { FaPhoneAlt } from "react-icons/fa";
import { IoMail } from "react-icons/io5";
import Image from "next/image";
import { Suspense, useEffect, useState } from "react";
import LoadingCircle from "@/components/LoadingCircle";
import Link from 'next/link';
import { RiPencilFill } from 'react-icons/ri';
import { MdLogout } from "react-icons/md";


type Listing = {
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

export default function Index() {
  const supabase = createClient();
  const [profile, setProfile] = useState<{
    username: string;
    email: string;
    phone: string;
    image: string;
    affiliation: 'student' | 'alum';
  } | null>();
  const [favoritelistings, setFavoriteListings] = useState<Listing[]>([]);
  const [listings, setListings] = useState<Listing[]>([]);
  const [reload, setReload] = useState<boolean>(false);

  const handleLogout = async () => {
    console.log("LOGOUT CLICKED")
    await supabase.auth.signOut();
    // Redirect to Sign-in page
    router.push("/sign-in");
  };

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

            let profileImageUrl = user.data.user?.user_metadata.avatar_url;
            if (data.data[0].profile_image_path) {
              profileImageUrl = getImagePublicUrl('profiles', data.data[0].profile_image_path);
            }

            setProfile({
              username: data.data[0].name,
              email: data.data[0].email,
              phone: data.data[0].phone,
              image: profileImageUrl,
              affiliation: data.data[0].affiliation
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
              address,
              distance
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
                  distance: favorite.listings.distance,
                  dates: `${new Date(favorite.listings.start_date).toLocaleDateString()} - ${new Date(favorite.listings.end_date).toLocaleDateString()}`,
                  price: favorite.listings.price,
                  location: favorite.listings.address,
                  imageUrl: getImagePublicUrl(
                    "listing_images",
                    favorite.listings.image_paths[0]
                  ),
                  renterType: "Rice Student",
                  isFavorite: true,
                  image_paths: favorite.listings.image_paths
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
                  distance: listing.distance,
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
                  image_paths: listing.image_paths
                };
              })
            );
          });
      } else {
        console.error("No user");
      }
    };
    fetchUser();
  }, [reload]);

  const router = useRouter();

  return (
    <Suspense>
      <motion.main 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="pb-8 w-[90%] mx-auto"
      >
        <div className="flex flex-col items-center">
          <Navbar />

          {profile && (
            <motion.main 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-col sm:gap-[20px] w-full h-full items-left mb-20"
            >
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="mt-4 flex flex-col text-left sm:items-start gap-4"
              >
                <h1 className="text-left text-3xl font-semibold">Profile</h1>
                <h1 className="text-left text-sm mb-2">
                  Welcome to your profile page! Here, you can access your
                  profile information, your favorites, and your listings.
                </h1>
              </motion.div>
              <div>
              <div className='mt-4 flex flex-row justify-between mt-[3vh]'>
                <h1 className="text-left text-[24px] text-#000000 font-medium">Your Profile Information</h1>
                
                <div className='flex flex-row gap-[20px]'>
                <Link href='/edit-profile'>
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="group mr-50mr-50 w-[200px] h-[43px] bg-[#F0F0F0] gap-[5.69px] hover:bg-[#777777] rounded-[10.2px] flex items-center justify-center transform transition-all duration-150"
                  >
                    <RiPencilFill className="text-[#777777] group-hover:fill-[#F0F0F0]"/>
                    <p className="text-[16px] text-[#777777] group-hover:text-[#F0F0F0] font-600">EDIT PROFILE</p>
                  </motion.button>
                </Link>

                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleLogout} 
                    className="w-[160px] h-[43px] bg-[#CC3333] gap-[5.69px] hover:bg-[#990000] rounded-[10.2px] flex items-center justify-center transform transition-all duration-150"
                  >
                    <MdLogout className="text-[#FFFFFF]" />
                    <p className="text-[16px] text-[#FFFFFF] font-600">LOG OUT</p>
                  </motion.button>
                </div>

              </div>
                {/* <h1 className="text-left text-2xl font-medium mb-6">
                  Your Profile Information
                </h1> */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className=" flex flex-col sm:flex-row sm:gap-[24vh] py-5"
                >
                  {/* Profile Image and Rice Affiliate text */}
                  <div className="flex flex-col items-center sm:items-start gap-4 sm:gap-8">
                    <div className="flex flex-col gap-4">
                      <h1 className="text-lg sm:text-xl font-medium text-center sm:text-left">
                        Profile Picture
                      </h1>
                      <motion.div 
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.5 }}
                        className="relative w-[18vh] h-[18vh] overflow-hidden rounded-full"
                      >
                        <Image
                          src={profile?.image || "/profile_pic.jpeg"}
                          fill={true}
                          alt="profile pic"
                          className="object-cover"
                        />
                      </motion.div>
                    </div>
                    <div className="flex flex-col">
                      <h1 className="text-lg font-medium">Rice Affiliation</h1>
                      <div className="flex flex-row gap-[5px] items-center mt-2 sm:mt-0">
                        <Image
                          src={"/owl.png"}
                          width={20}
                          height={5}
                          alt="owl"
                          className="w-5 h-5 scale-75"
                        />
                        <p className="text-[#FF7439] text-sm">Rice {profile.affiliation == 'student' ? "Student" : "Alumni"}</p>
                      </div>
                    </div>
                  </div>

                  {/* Additional Information */}
                  <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                    className="flex flex-col"
                  >
                    <div className="flex flex-col gap-4">
                      <div className="gap-4">
                        <h1 className="text-lg font-medium">Name</h1>
                        <p className="text-lg text-gray-400">{profile?.username}</p>
                      </div>

                      <div className="gap-4">
                        <h1 className="text-lg font-medium">Email Address</h1>
                        <p className="text-lg text-gray-400">{profile?.email}</p>
                      </div>

                      <div className="gap-4">
                        <h1 className="text-lg font-medium">Phone Number</h1>
                        <p className="text-lg text-gray-400">{profile?.phone ? profile?.phone : 'Please enter your phone number in "Edit Profile"'}</p>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.7 }}
              >
                <h1 className="text-left text-2xl font-medium mb-5">
                  Favorite Listings
                </h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mb-6 gap-8">
                  {favoritelistings.length > 0 ? (favoritelistings.map((listing) => (
                    <div key={listing.id}>
                      <ListingCard
                        postId={listing.id}
                        name={listing.title}
                        imagePath={listing.imageUrl}
                        distance={listing.distance}
                        duration={listing.dates}
                        price={`$${listing.price} / month`}
                        isRiceStudent={listing.renterType === "Rice Student"}
                        isFavorited={listing.isFavorite}
                        ownListing={false}
                        imagePaths={listing.image_paths}
                      />
                    </div>
                  ))) : (
                    <div className="text-gray-400 italic mt-6">- No Favorites Yet!</div>
                  )}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8 }}
              >
                <h1 className="text-left text-2xl font-medium mb-5">
                  Your Listings
                </h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                  {listings.map((listing) => (
                    <div key={listing.id}>
                      <ListingCard
                        postId={listing.id}
                        name={listing.title}
                        imagePath={listing.imageUrl}
                        distance={listing.distance}
                        duration={listing.dates}
                        price={`$${listing.price} / month`}
                        isRiceStudent={listing.renterType === "Rice Student"}
                        isFavorited={listing.isFavorite}
                        ownListing={true}
                        imagePaths={listing.image_paths}
                        onDelete={() => setReload(!reload)}
                      />
                    </div>
                  ))}
                </div>
              </motion.div>
            </motion.main>
          )}

          {!profile && <LoadingCircle />}
        </div>
      </motion.main>
    </Suspense>
  );
}
