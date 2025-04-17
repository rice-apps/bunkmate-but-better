"use client";

import ListingCard from "@/components/ListingCard";
import YourListingCard from "@/components/YourListingCard";
import { motion } from 'framer-motion';
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { createClient, getImagePublicUrl, getShimmerData } from "@/utils/supabase/client";
import { useRouter } from "@bprogress/next";
import { FaPhoneAlt } from "react-icons/fa";
import { IoMail } from "react-icons/io5";
import Image from "next/image";
import { Suspense, useEffect, useState } from "react";
import LoadingCircle from "@/components/LoadingCircle";
import Link from 'next/link';
import { RiPencilFill } from 'react-icons/ri';
import { MdLogout } from "react-icons/md";
import { formatPhoneNumber } from "@/components/ui/input";
import Footer from "@/components/Footer";
import { Upload, PencilIcon } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { v4 as uuidv4 } from 'uuid';
import { Input } from "@/components/ui/input";


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
  isArchived: boolean;
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
  const [activeListings, setActiveListings] = useState<Listing[]>([]);
  const [archivedListings, setArchivedListings] = useState<Listing[]>([]);
  const [reload, setReload] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [currentProfileImagePath, setCurrentProfileImagePath] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    riceAffiliation: null as 'student' | 'alum' | null,
  });

  const handleLogout = async () => {
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
              setCurrentProfileImagePath(data.data[0].profile_image_path);
            }

            // Split name into first and last name
            const [firstName = '', lastName = ''] = data.data[0].name ? data.data[0].name.split(' ') : ['', ''];

            setFormData({
              firstName,
              lastName,
              email: data.data[0].email,
              phone: data.data[0].phone || '',
              riceAffiliation: data.data[0].affiliation
            });

            setProfile({
              username: data.data[0].name,
              email: data.data[0].email,
              phone: data.data[0].phone,
              image: profileImageUrl,
              affiliation: data.data[0].affiliation
            });

            if (user.data.user) {
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
                        renterType: favorite.listings.affiliation != 'student' ? "Rice Alumni" : "Rice Student",
                        isFavorite: true,
                        image_paths: favorite.listings.image_paths,
                        isArchived: favorite.listings.isArchived
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

                  const activeListings: Listing[] = [];
                  const archivedListings: Listing[] = [];

                  data.data.forEach((listing: any) => {
                    const formattedListing: Listing = {
                      id: listing.id,
                      title: listing.title,
                      distance: listing.distance,
                      dates: `${new Date(listing.start_date).toLocaleDateString()} - ${new Date(listing.end_date).toLocaleDateString()}`,
                      price: listing.price,
                      location: listing.address,
                      imageUrl: getImagePublicUrl(
                        "listing_images",
                        listing.image_paths[0]
                      ),
                      renterType: listing.affiliation !== "student" ? "Rice Alumni" : "Rice Student",
                      isFavorite: true,
                      image_paths: listing.image_paths,
                      isArchived: listing.isArchived
                    };

                    if (!listing.archived) {
                      activeListings.push(formattedListing);
                    } else {
                      archivedListings.push(formattedListing);
                    }
                  })

                  setActiveListings(activeListings);
                  setArchivedListings(archivedListings);
                });
            }
          });
      } else {
        console.error("No user");
      }
    };
    fetchUser();
  }, [reload]);

  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      const user = await supabase.auth.getUser();

      if (!user.data.user) {
        console.error('No authenticated user found');
        return;
      }

      // Combine first and last name
      const fullName = `${formData.firstName} ${formData.lastName}`.trim();

      const { error } = await supabase
        .from('users')
        .update({
          name: fullName,
          phone: formData.phone,
          affiliation: formData.riceAffiliation,
        })
        .eq('id', user.data.user.id);

      if (error) {
        console.error('Error updating profile:', error);
        return;
      }

      // Update local profile state to reflect changes
      setProfile(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          username: fullName,
          phone: formData.phone,
          affiliation: formData.riceAffiliation as 'student' | 'alum'
        };
      });

      setReload(!reload);
    } catch (error) {
      console.error('Error saving profile:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!e.target.files || e.target.files.length === 0) return;

      setIsUploading(true);

      const file = e.target.files[0];
      const user = await supabase.auth.getUser();
      if (!user.data.user) {
        console.error('No authenticated user found');
        return;
      }

      // Delete previous profile image if it exists
      if (currentProfileImagePath) {
        const { error: deleteError } = await supabase.storage
          .from('profiles')
          .remove([currentProfileImagePath]);

        if (deleteError) {
          console.error('Error deleting previous image:', deleteError);
        }
      }

      // Upload new image to Supabase Storage
      const fileName = `${user.data.user.id}/${uuidv4()}.${file.name.split('.').pop()}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('profiles')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (uploadError) {
        console.error('Error uploading image:', uploadError);
        return;
      }

      // Update user profile with new image path
      const { error: updateError } = await supabase
        .from('users')
        .update({ profile_image_path: fileName })
        .eq('id', user.data.user.id);

      if (updateError) {
        console.error('Error updating profile:', updateError);
        return;
      }

      // Get the updated user data to get the new profile image
      const { data: updatedUser, error: fetchError } = await supabase
        .from('users')
        .select('profile_image_path')
        .eq('id', user.data.user.id)
        .single();

      if (fetchError) {
        console.error('Error fetching updated user:', fetchError);
        return;
      }

      // Update UI with new image URL and store new path
      if (updatedUser.profile_image_path) {
        setCurrentProfileImagePath(updatedUser.profile_image_path);
        const imageUrl = getImagePublicUrl('profiles', updatedUser.profile_image_path);

        // Update profile state with new image
        setProfile(prev => {
          if (!prev) return prev;
          return {
            ...prev,
            image: imageUrl
          };
        });
      }

      setIsModalOpen(false);
      setReload(!reload);

    } catch (error) {
      console.error('Error processing image:', error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Suspense>
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="pb-8 w-[80%] sm: w-[90%] mx-auto"
      >
        <div className="flex flex-col items-center">
          <Navbar includeFilter={false}/>

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
                  Welcome to your profile page! Here, you can access and edit your
                  profile information, your favorites, and your listings.
                </h1>
              </motion.div>
              <div>
                <div className='mt-4 flex flex-row justify-between mt-[3vh] flex-wrap-reverse gap-y-4'>
                  <h1 className="text-left text-[24px] text-#000000 font-medium">Your Profile Information</h1>

                  <div className='flex flex-row gap-[20px] flex-wrap'>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleSave}
                      disabled={isSaving}
                      className="w-[120px] h-[36px] bg-[#777777] gap-[8px] hover:bg-[#777777]/80 rounded-[10px] flex items-center justify-center transform transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <p className="text-[14px] px-[10px] text-[#FFFFFF]">{isSaving ? 'Saving...' : 'Save Changes'}</p>
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleLogout}
                      className="w-[120px] h-[36px] bg-[#CC3333] gap-[5.69px] hover:bg-[#990000] rounded-[10.2px] flex items-center justify-center transform transition-all duration-150"
                    >
                      <MdLogout className="text-[#FFFFFF] text-[14px]" />
                      <p className="text-[14px] text-[#FFFFFF]">Logout</p>
                    </motion.button>
                  </div>

                </div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="flex flex-col sm:flex-row gap-12 py-5"
                >
                  {/* Left Column - Profile Picture and Rice Affiliation */}
                  <div className="flex flex-col sm:w-1/3 justify-end">
                    {/* Profile Picture Section */}
                    <div className="mb-8">
                      <h2 className="text-xl font-medium mb-2">Profile Picture</h2>
                      <p className="text-gray-500 text-sm mb-4">
                        Upload your profile picture.<br />
                        Please make sure your face is recognizable!
                      </p>
                      <motion.div
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.5 }}
                        className="relative w-32 h-32 overflow-hidden rounded-full cursor-pointer bg-gray-600 flex items-center justify-center"
                        onClick={() => setIsModalOpen(true)}
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                      >
                        {profile?.image ? (
                          <Image
                            src={profile.image}
                            placeholder={`data:image/svg+xml;base64,${getShimmerData()}`}
                            fill={true}
                            alt="profile pic"
                            className="object-cover"
                          />
                        ) : (
                          <span className="text-6xl text-white">
                            {formData.firstName.charAt(0).toUpperCase()}
                          </span>
                        )}
                        <div className={`absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center transition-opacity duration-200 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
                          <PencilIcon className="w-8 h-8 text-white" />
                        </div>
                      </motion.div>
                    </div>

                    {/* Rice Affiliation Section */}
                    <div className="mb-8">
                      <h2 className="text-xl font-medium mb-2">Rice Affiliation</h2>
                      <p className="text-gray-500 text-sm mb-4">Below, select the option that applies to you:</p>
                      <RadioGroup
                        className="space-y-3"
                        value={formData.riceAffiliation || undefined}
                        onValueChange={(value) => setFormData(prev => ({ ...prev, riceAffiliation: value as 'student' | 'alum' }))}
                      >
                        <Label
                          htmlFor="student"
                          className={`flex items-center space-x-3 border rounded-2xl px-6 py-3 cursor-pointer text-gray-600 font-normal 
                            ${formData.riceAffiliation === 'student'
                              ? 'bg-[#FF7439]/25 text-gray-600 font-normal border-[#FF7439] hover:bg-[#FF7439]/50 [&_button]:text-[#718096] [&_button]:border-[#FF7439] [&_button[data-state=checked]]:bg-[#FF7439] [&_button[data-state=checked]]:text-[#FF7439]'
                              : 'hover:bg-gray-50'}`}
                          onClick={() => setFormData(prev => ({ ...prev, riceAffiliation: 'student' }))}
                        >
                          <RadioGroupItem value="student" id="student" className="border-2" />
                          <span>I am a Rice Student</span>
                        </Label>
                        <Label
                          htmlFor="alum"
                          className={`flex items-center space-x-3 border rounded-2xl px-6 py-3 cursor-pointer text-gray-600 font-normal 
                            ${formData.riceAffiliation === 'alum'
                              ? 'bg-[#FF7439]/25 text-gray-600 font-normal border-[#FF7439] hover:bg-[#FF7439]/50 [&_button]:text-[#FF7439] [&_button]:border-[#FF7439] [&_button[data-state=checked]]:bg-[#FF7439] [&_button[data-state=checked]]:text-[#FF7439]'
                              : 'hover:bg-gray-50'}`}
                          onClick={() => setFormData(prev => ({ ...prev, riceAffiliation: 'alum' }))}
                        >
                          <RadioGroupItem value="alum" id="alum" className="border-2" />
                          <span>I am a Rice Alum</span>
                        </Label>
                      </RadioGroup>
                    </div>
                  </div>

                  {/* Right Column - Name, Email, and Phone */}
                  <div className="flex flex-col sm:w-2/3">
                    {/* Name Section */}
                    <div className="mb-8">
                      <h2 className="text-xl font-medium mb-2">Name</h2>
                      <p className="text-gray-500 text-sm mb-4">
                        {formData.riceAffiliation === 'student'
                          ? 'Make sure this matches the name on your Rice Student ID.'
                          : 'Make sure this matches the name on your government ID.'}
                      </p>
                      <div className="flex gap-4">
                        <div className="flex-1">
                          <Input
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleInputChange}
                            placeholder="First"
                            className="rounded-2xl border-neutral-300 px-6 py-3 h-12"
                          />
                        </div>
                        <div className="flex-1">
                          <Input
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleInputChange}
                            placeholder="Last"
                            className="rounded-2xl border-neutral-300 px-6 py-3 h-12"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Email Section */}
                    <div className="mb-8">
                      <h2 className="text-xl font-medium mb-2">Email address</h2>
                      <p className="text-gray-500 text-sm mb-4">
                        This is the email address associated to your Rice ID! <br />
                        This email will be associated with your account and cannot be changed.
                      </p>
                      <Input
                        value={profile?.email || ''}
                        disabled
                        className="rounded-2xl border-neutral-300 px-6 py-3 h-12 bg-gray-50"
                      />
                    </div>

                    {/* Phone Section */}
                    <div className="mb-8">
                      <h2 className="text-xl font-medium mb-2">Phone number</h2>
                      <p className="text-gray-500 text-sm mb-4">Use the number you'd like to be contacted with.</p>
                      <Input
                        type="tel"
                        name="phone"
                        value={formatPhoneNumber(formData.phone)}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, '');
                          if (value.length <= 10) {
                            setFormData(prev => ({ ...prev, phone: value }));
                          }
                        }}
                        placeholder="+1 (XXX) XXX-XXX"
                        maxLength={14}
                        className="rounded-2xl border-neutral-300 px-6 py-3 h-12"
                      />
                    </div>
                  </div>
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
                        isArchived={listing.isArchived}
                      />
                    </div>
                  ))) : (
                    <div className="text-gray-500 font-light">⤷ No Favorites Yet!</div>
                  )}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8 }}
              >
                <h1 className="text-left text-2xl font-medium mb-5">
                  Your Active Listings
                </h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mb-6 gap-8">
                  {activeListings.length > 0 ? activeListings.map((listing) => (
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
                        isArchived={listing.isArchived}
                        onDelete={() => setReload(!reload)}
                        onArchive={() => setReload(!reload)}
                      />
                    </div>
                  )) : (
                    <div className="text-gray-500 font-light">⤷ No Active Listings Yet!</div>
                  )}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8 }}
              >
                <h1 className="text-left text-2xl font-medium mb-5">
                  Your Archived Listings
                </h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                  {archivedListings.length > 0 ? archivedListings.map((listing) => (
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
                        isArchived={listing.isArchived}
                        onDelete={() => setReload(!reload)}
                        onArchive={() => setReload(!reload)}
                      />
                    </div>
                  )) : (
                    <div className="text-gray-500 font-light">⤷ No Archived Listings Yet!</div>
                  )}
                </div>
              </motion.div>
            </motion.main>
          )}

          {!profile && <LoadingCircle />}
        </div>
      </motion.main>

      {/* Image Upload Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Profile Picture</DialogTitle>
          </DialogHeader>
          <div className="p-6">
            <p className="text-sm text-gray-500 text-center mb-8">
              Upload your profile picture. Please make sure your face is recognizable!
            </p>

            <div className="w-32 h-32 mx-auto mb-6">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                id="profile-upload"
                onChange={handleFileUpload}
                disabled={isUploading}
              />
              <label
                htmlFor="profile-upload"
                className={`w-full h-full rounded-full border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:border-gray-400 transition-colors bg-gray-50 ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isUploading ? (
                  <div className="flex flex-col items-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-400"></div>
                    <span className="mt-2 text-sm text-gray-500">Uploading...</span>
                  </div>
                ) : (
                  <>
                    <Upload className="w-8 h-8 text-gray-400" />
                    <span className="mt-2 text-sm text-gray-500">Upload File</span>
                  </>
                )}
              </label>
            </div>

            <div className="flex justify-center space-x-4">
              <Button
                variant="outline"
                onClick={() => setIsModalOpen(false)}
                disabled={isUploading}
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Footer />
    </Suspense>
  );
}