"use client";

import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Link from 'next/link';
import { FaHeart, FaEye } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";
import TitleDescription from './../../TitleDescription';
import Pricing from './../../Pricing';
import Location from './../../Location';
import Photos from './../../Photos';
import Profile from './../../Profile';

import { createClient, getImagePublicUrl } from '@/utils/supabase/client';
import { v4 } from 'uuid';
import Duration from './../../Duration';
import CategoryStatusIndicator from './../../CategoryStatusIndicator';
import LoadingCircle from '@/components/LoadingCircle';

interface ConsolidatedFormData {
  // Listing data
  title: string;
  description: string;
  price: number;
  priceNotes: string;
  startDate: string;
  endDate: string;
  durationNotes: string;
  address: string;
  locationNotes: string;
  photos: File[];
  photoLabels: string[];
  imagePaths: string[];
  phone: string;
  loadImages: boolean;  // Add this property

  // User data
  userId: string;
  userName: string;
  userEmail: string;
  userProfileImagePath: string | null;
  affiliation: string;
}

type ImageResponse = {
  data: {
    id: string;
    path: string;
    fullPath: string;
  };
  error: null;
} | {
  data: null;
  error: any;
}

type ImagePromiseType = Promise<ImageResponse>


// Main PostListing component
const EditListing = () => {
  const router = useRouter();
  const params = useParams();
  const listingId = params.id as string;
  const [selectedCategory, setSelectedCategory] = useState('title');
  const [formData, setFormData] = useState<ConsolidatedFormData>({
    title: '',
    description: '',
    price: 0,
    priceNotes: '',
    startDate: '',
    endDate: '',
    durationNotes: '',
    address: '',
    locationNotes: '',
    photos: [],
    photoLabels: [],
    imagePaths: [],
    phone: '',
    userId: '',
    userName: '',
    userEmail: '',
    userProfileImagePath: null,
    affiliation: '',
    loadImages: true,  // Add this
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    let isMounted = true;

    const fetchListingAndUser = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Get authenticated user first
        const { data: authData } = await supabase.auth.getUser();
        if (!authData.user) throw new Error('Not authenticated');

        if (!listingId) throw new Error('No listing ID provided');

        // Fetch listing data
        const { data: listingData, error: queryError } = await supabase
          .from('listings')
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
          .eq('id', listingId)
          .single();

        if (queryError) throw queryError;
        if (!listingData) throw new Error('No listing found');

        // Verify user owns this listing
        if (listingData.user_id !== authData.user.id) {
          // If not, route to profile-section
          router.push('/profile-section');
          return;
        }

        // Fetch current user data
        const { data: userData, error: userError } = await supabase
          .from("users")
          .select()
          .eq("id", authData.user.id)
          .single();

        if (userError) throw userError;

        if (isMounted) {
          setFormData({
            // Listing data
            title: listingData.title || '',
            description: listingData.description || '',
            price: listingData.price || 0,
            priceNotes: listingData.price_notes || '',
            startDate: listingData.start_date || '',
            endDate: listingData.end_date || '',
            durationNotes: listingData.duration_notes || '',
            address: listingData.address || '',
            locationNotes: listingData.location_notes || '',
            photos: [],  // Keep this empty for new uploads
            photoLabels: [],
            imagePaths: listingData.image_paths || [],  // Store existing image paths here
            loadImages: true,

            // User data
            userId: listingData.user_id,
            userName: userData.name || '',
            phone: userData.phone || listingData.phone_number || listingData.user?.phone || '',
            userEmail: userData.email || '',
            userProfileImagePath: userData.profile_image_path
              ? getImagePublicUrl("profile_images", userData.profile_image_path)
              : authData.user.user_metadata.avatar_url,
            affiliation: userData.affiliation || '',
          });
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load data';
        if (isMounted) setError(errorMessage);
        console.warn('Error fetching data:', err);
        router.push('/profile-section'); // Route back on any error
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchListingAndUser();

    return () => {
      isMounted = false;
    };
  }, [listingId, supabase]);

  const isComplete = Boolean(
    formData.title.length >= 1 &&
    formData.description.length >= 100 &&
    formData.price &&
    formData.address &&
    formData.startDate &&
    formData.endDate &&
    //formData.photos.length >= 5 &&
    formData.phone
  );

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    // const userId = (await supabase.auth.getUser()).data.user?.id;
    // const insertions: ImagePromiseType[] = [];

    // // Cache the name of our file paths.
    // const filePaths: string[] = [];

    // formData.photos.forEach((photo) => {
    //   const filePath = `${userId}/${v4()}`;
    //   const insertion = supabase.storage.from('listing_images').upload(filePath, photo);
    //   insertions.push(insertion);
    //   filePaths.push(filePath);
    // });

    try {
      // // Handle image uploads
      // const imageUploads = await Promise.all(insertions);
      // const successfulUploads = imageUploads.filter((imageUploads) => imageUploads.data);
      // if (successfulUploads.length != filePaths.length) {
      //   const successfulFilePaths = successfulUploads.map((imgResp: ImageResponse) => imgResp.data?.path);
      //   throw new Error('Some image(s) failed to upload', { cause: successfulFilePaths });
      // }

      // Update the listing
      const { error: updateError } = await supabase
        .from('listings')
        .update({
          phone_number: formData.phone,
          title: formData.title,
          description: formData.description,
          price: formData.price,
          price_notes: formData.priceNotes,
          start_date: formData.startDate,
          end_date: formData.endDate,
          duration_notes: formData.durationNotes,
          address: formData.address,
          location_notes: formData.locationNotes,
          // image_paths: filePaths, // Commented out for now
        })
        .eq('id', listingId);

      if (updateError) {
        throw new Error(`Failed to update listing: ${updateError.message}`);
      }

      // // Handle image captions
      // const imageCaptions = filePaths.map((path, index) => ({
      //   user_id: userId,
      //   image_path: path,
      //   caption: formData.photoLabels[index] || '',
      // }))

      // const { error: captionError } = await supabase
      //   .from('images_captions')
      //   .insert(imageCaptions)
      //   .select();
      // if (captionError) {
      //   throw new Error(captionError.message, { cause: filePaths });
      // }

      // Update user affiliation if changed
      const { error: userError } = await supabase
        .from('users')
        .update({
          affiliation: formData.affiliation,
        })
        .eq('id', formData.userId);

      if (userError) {
        throw new Error(`Failed to update user: ${userError.message}`);
      }

      // Redirect on success
      router.push('/profile-section');
    }
    catch (error: any) {
      //revert all uploads
      console.error(error.message);
      // await cleanupUploads(error.cause);
    }

    // async function cleanupUploads(paths: string[]) {
    //   const supabase = createClient();
    //   await supabase.storage.from('listing_images').remove(paths);
    //   await supabase.from('images_captions').delete().in('image_path', paths);
    // }
  };

  const renderComponent = () => {
    switch (selectedCategory) {
      case 'title':
        return <TitleDescription
          formData={formData}
          setFormData={setFormData}
          onNext={handleNextCategory}
        />;
      case 'pricing':
        return <Pricing
          formData={formData}
          setFormData={setFormData}
          onNext={handleNextCategory}
          onBack={handlePreviousCategory}
        />;
      case 'location':
        return <Location
          formData={formData}
          setFormData={setFormData}
          onNext={handleNextCategory}
          onBack={handlePreviousCategory}
        />;
      case 'duration':
        return <Duration
          formData={formData}
          setFormData={setFormData}
          onNext={handleNextCategory}
          onBack={handlePreviousCategory}
        />;
      case 'photos':
        return <Photos
          formData={formData}
          setFormData={setFormData}
          onNext={handleNextCategory}
          onBack={handlePreviousCategory}
        />;
      case 'profile':
        return <Profile
          formData={formData}
          setFormData={setFormData}
          onBack={handlePreviousCategory}
        />;
      default:
        return <TitleDescription
          formData={formData}
          setFormData={setFormData}
          onNext={handleNextCategory}
        />;
    }
  };

  const categories = useMemo(() => [
    {
      id: 'title',
      name: 'Title & Description',
      completed: formData.title.length >= 1 && formData.description.length >= 100
    },
    {
      id: 'pricing',
      name: 'Pricing',
      completed: Boolean(formData.price)
    },
    {
      id: 'location',
      name: 'Location',
      completed: Boolean(formData.address)
    },
    {
      id: 'duration',
      name: 'Duration',
      completed: Boolean(formData.startDate && formData.endDate)
    },
    {
      id: 'photos',
      name: 'Photos',
      completed: formData.photos.length >= 1
    },
    {
      id: 'profile',
      name: 'Profile',
      completed: Boolean(formData.phone)
    }
  ], [formData]);

  const handleNextCategory = () => {
    const currentIndex = categories.findIndex(cat => cat.id === selectedCategory);
    if (currentIndex < categories.length - 1) {
      setSelectedCategory(categories[currentIndex + 1].id);
    }
  };

  const handlePreviousCategory = () => {
    const currentIndex = categories.findIndex(cat => cat.id === selectedCategory);
    if (currentIndex > 0) {
      setSelectedCategory(categories[currentIndex - 1].id);
    }
  };

  return (
    <div className="min-h-screen w-full bg-white">
      {/* Navbar */}
      <nav className="bg-white top-0 z-10 h-16 fixed w-full">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href='/'>
            <div className="flex items-center space-x-2">
              <Image src="/bunkmate_logo.png" alt="Bunkmate" width={32} height={32} />
              <span className="text-2xl text-[#FF7439] font-semibold">bunkmate</span>
            </div>
          </Link>
          <div className="flex items-center space-x-4">
            <Link href='/favorites'>
              <FaHeart
                className="text-[24px] text-gray-300 hover:text-gray-500 hover:scale-105 hover:cursor-pointer transition-transform duration-150 w-[35px] h-[31px]"
              />
            </Link>
            <CgProfile className="text-[24px] text-gray-300 hover:text-gray-500 hover:scale-105 hover:cursor-pointer transition-transform duration-150 w-[35px] h-[31px]" />
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 mt-16">
        <div className="max-w-6xl mx-auto">
          <div className="flex gap-16">
            {/* Sidebar */}
            <div className='fixed'>
              <div className="w-64 pr-16 h-svh">
                <h1 className="text-2xl font-bold mb-10">Listing Editor</h1>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <div
                      key={category.id}
                      className={`flex items-center p-3 rounded-xl cursor-pointer ${selectedCategory === category.id
                        ? 'text-[#FF7439] border-[#FF7439] border bg-orange-50'
                        : 'text-gray-500'
                        }`}
                      onClick={() => setSelectedCategory(category.id)}
                    >
                      <div className="mr-2">
                        <CategoryStatusIndicator selected={selectedCategory === category.id} completed={category.completed} />
                      </div>
                      {category.name}
                    </div>
                  ))}
                  {/* Post Button */}
                  <div className="flex items-center justify-center pt-12">
                    <Button
                      className={`w-[5.3rem] rounded-lg px-6 flex items-center ${isComplete ? "bg-[#FF7439] hover:bg-[#FF7439]/90" : "bg-gray-300"
                        }`}
                      disabled={!isComplete}
                      onClick={handleSubmit}
                    >
                      <p>Save</p>
                    </Button>
                  </div>

                </div>
              </div>
            </div>
            {/* Form Content */}
            {isLoading ?
              <>
                <div className='flex ml-64 pl-16 justify-center place-items-center w-full'>
                  <LoadingCircle />
                </div>
              </> :
              <>
                <div className="flex-1 ml-64 pl-16 border-l border-gray-500">
                  {renderComponent()}
                </div>
              </>}

          </div>
        </div>
      </div>
    </div>
  );
};

export default EditListing;