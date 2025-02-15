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
import { FormDataType } from '../../page';
import { defaultFormData } from '@/providers/PostListingFormProvider';

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
  const [formData, setFormData] = useState<FormDataType>(defaultFormData);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();
  const [isPosting, setIsPosting] = useState(false);

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

        const { data: captionData, error: captionError } = await supabase
          .from("images_captions")
          .select("*")
          .in("image_path", listingData.image_paths);

        if (captionError) throw captionError;

        // Adjust caption indexes to start at 100 for existing images
        const captions = captionData?.reduce((acc, cur) => {
          const index = listingData.image_paths.indexOf(cur.image_path);
          acc[index + 100] = cur.caption; // Add 100 to index to match Photos component
          return acc;
        }, {});
        console.log(captions);

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
            address: { label: listingData.address, value: { description: listingData.address } },
            locationNotes: listingData.location_notes || '',
            photos: [],
            rawPhotos: [],
            photoLabels: captions || {},
            imagePaths: listingData.image_paths || [],
            removedImagePaths: [],
            affiliation: userData.affiliation || '',
            phone: listingData.phone_number || listingData.user?.phone || '',
            bed_num: listingData.bed_num || 0,
            bath_num: listingData.bath_num || 0,
          });
          console.log(listingData.image_paths);
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
    setIsPosting(true);
    e.preventDefault();

    const userId = (await supabase.auth.getUser()).data.user?.id;
    const insertions: ImagePromiseType[] = [];
    let newImagePaths: string[] = [...formData.imagePaths];

    try {
      // First, remove all existing captions for both current and removed images
      const allAffectedPaths = [...formData.imagePaths, ...formData.removedImagePaths];
      if (allAffectedPaths.length > 0) {
        const { error: deleteCaptionsError } = await supabase
          .from('images_captions')
          .delete()
          .in('image_path', allAffectedPaths);

        if (deleteCaptionsError) {
          throw new Error(`Error removing existing captions: ${deleteCaptionsError.message}`);
        }
      }

      // Upload new photos if any
      let uploadedPaths: string[] = [];
      if (formData.rawPhotos.length > 0) {
        formData.rawPhotos.forEach(photo => {
          const filePath = `${userId}/${v4()}`;
          const insertion = supabase.storage.from("listing_images").upload(filePath, photo);
          insertions.push(insertion);
        });

        try {
          const imageUploads = await Promise.all(insertions);
          const successfulUploads = imageUploads.filter(upload => upload.data);

          if (successfulUploads.length !== formData.rawPhotos.length) {
            throw new Error('Some image(s) failed to upload');
          }

          // Add new file paths to the existing ones
          uploadedPaths = successfulUploads.map(upload => upload.data!.path);
          newImagePaths = [...formData.imagePaths, ...uploadedPaths];
        } catch (error) {
          console.error('Error uploading new images:', error);
          return;
        }
      }

      // Update the listing with all fields including new image paths
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
          address: formData.address.label,
          location_notes: formData.locationNotes,
          image_paths: newImagePaths,
          bed_num: formData.bed_num,
          bath_num: formData.bath_num,
        })
        .eq('id', listingId);

      if (updateError) {
        throw new Error(`Failed to update listing: ${updateError.message}`);
      }

      // Handle image captions for both existing and new images
      if (formData.photoLabels && Object.keys(formData.photoLabels).length > 0) {
        // Handle existing image captions (indexes 100+)
        const existingImageCaptions = formData.imagePaths.map((path, index) => ({
          user_id: userId,
          image_path: path,
          caption: formData.photoLabels[index + 100] || '',
        })).filter(caption => caption.caption !== '');

        // Handle new image captions (regular indexes)
        const newImageCaptions = uploadedPaths.map((path, index) => ({
          user_id: userId,
          image_path: path,
          caption: formData.photoLabels[index] || '',  // Use regular index for new photos
        })).filter(caption => caption.caption !== '');

        const allCaptions = [...existingImageCaptions, ...newImageCaptions];

        if (allCaptions.length > 0) {
          // Delete any existing captions first to avoid conflicts
          await supabase
            .from('images_captions')
            .delete()
            .in('image_path', newImagePaths);

          // Insert all captions
          const { error: captionError } = await supabase
            .from('images_captions')
            .insert(allCaptions);

          if (captionError) {
            console.error('Error updating captions:', captionError);
          }
        }
      }

      // Remove deleted images from storage
      if (formData.removedImagePaths.length > 0) {
        const { error: removingError } = await supabase
          .storage
          .from('listing_images')
          .remove(formData.removedImagePaths);

        if (removingError) {
          throw new Error(`Error removing images: ${removingError.message}`);
        }
      }

      // Update user affiliation
      const { error: userError } = await supabase
        .from('users')
        .update({ affiliation: formData.affiliation })
        .eq('id', userId);

      if (userError) {
        throw new Error(`Failed to update user: ${userError.message}`);
      }

      router.push(`/listing/${listingId}`);
    } catch (error: any) {
      console.error('Error updating listing:', error.message);
    } finally {
      setIsPosting(false);
    }
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
          handleSubmit={handleSubmit}
          onBack={handlePreviousCategory}
          isPosting={isPosting}
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
      completed: Boolean(formData.address.label)
    },
    {
      id: 'duration',
      name: 'Duration',
      completed: Boolean(formData.startDate && formData.endDate)
    },
    {
      id: 'photos',
      name: 'Photos',
      completed: formData.photos.length + formData.imagePaths.length >= 5
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