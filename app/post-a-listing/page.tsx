"use client";

import React, { useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Link from 'next/link';
import { FaHeart, FaEye } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";
import TitleDescription from './TitleDescription';
import Pricing from './Pricing';
import Location from './Location';
import Photos from './Photos';
import Profile from './Profile';

import { createClient } from '@/utils/supabase/client';
import { v4 } from 'uuid';
import Duration from './Duration';
import CategoryStatusIndicator from './CategoryStatusIndicator';

interface FormData {
  title: string;
  description: string;
  price: string;
  priceNotes: string;
  startDate: string;
  endDate: string;
  durationNotes: string;
  address: string;
  locationNotes: string;
  photos: string[];
  photoLabels: string[];
  affiliation: string;
  // name: string;
  // email: string;
  phone: string;
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
const PostListing = () => {
  const router = useRouter();
  const params = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState('title');
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    price: '',
    priceNotes: '',
    startDate: '',
    endDate: '',
    durationNotes: '',
    address: '',
    locationNotes: '',
    photos: [],
    photoLabels: [],
    affiliation: 'rice',
    phone: '',
  });


  useEffect(() => {
    const savedData = params.get("data");
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      setFormData(parsedData);
    }
  }, []);


  const handleSubmit = async () => {
    const supabase = createClient();
    const userId = (await supabase.auth.getUser()).data.user?.id;
    const insertions: ImagePromiseType[] = [];

    // Cache the name of our file paths.
    const filePaths: string[] = [];

    formData.photos.forEach((photo) => {
      const filePath = `${userId}/${v4()}`;
      const insertion = supabase.storage.from('listing_images').upload(filePath, photo);
      insertions.push(insertion);
      filePaths.push(filePath);
    });

    const geocodeAddress = async (address: string) => {
      if (!address) {
        throw new Error('Valid address is required');
      }
      try {
        const API_KEY = process.env.NEXT_PUBLIC_GEOCODE_API_KEY;
        const response = await fetch(`https://geocode.maps.co/search?q=${address}&api_key=${API_KEY}`);
        if (!response.ok) {
          throw new Error('Failed to geocode address')   
        }
        const data = await response.json();
        if (data && data.length > 0) {
          return {
            lat: data[0].lat,
            lon: data[0].lon,
          };
        }
        else {
          throw new Error('No results found');
        }
      }
      catch (error) {
        console.error('Error geocoding address:', error);
        throw error;
      }
    };

    const calculateDistance = async (address: string) => {
      if (!address) {
        throw new Error('Valid address is required');
      }
      try {
        const RICE_ADDRESS = '6100 Main St, Houston, TX 77005';
        const [riceCoords, listingCoords] = await Promise.all([
          geocodeAddress(RICE_ADDRESS),
          geocodeAddress(address),
        ]);
        if (!riceCoords || !listingCoords) {
          throw new Error('Could not geocode addresses');
        }
        const osrmResponse = await fetch(`https://router.project-osrm.org/route/v1/driving/${riceCoords.lon},${riceCoords.lat};${listingCoords.lon},${listingCoords.lat}?overview=false`);
        if(!osrmResponse.ok) {
          throw new Error('Failed to calculate distance');
        }
        const osrmData = await osrmResponse.json();
        if(!osrmData.routes || osrmData.routes.length === 0) {
          throw new Error('No distance results found');
        }
        const distanceMeters = osrmData.routes[0].distance;
        const distanceMiles = (distanceMeters * 0.000621371).toFixed(1);
        return distanceMiles;
      }
      catch (error) {
        console.error('Error calculating distance:', error);
        throw error;
      }
    };


    try {
      const imageUploads = await Promise.all(insertions);
      const successfulUploads = imageUploads.filter((imageUploads) => imageUploads.data);
      if (successfulUploads.length != filePaths.length) {
        const successfulFilePaths = successfulUploads.map((imgResp: ImageResponse) => imgResp.data?.path);
        throw new Error('Some image(s) failed to upload', { cause: successfulFilePaths });
      }
      const results = await Promise.all(insertions);
      //calculate distance from address
      const distance = await calculateDistance(formData.address);
      if (!distance) {
        throw new Error('Unable to validate address or calculate distance. Please check the address.');
      }

      const { data, error } = await supabase
        .from('listings')
        .insert([
          {
            user_id: userId,
            phone_number: formData.phone,
            description: formData.description,
            address: formData.address,
            location_notes: formData.locationNotes,
            distance: distance,
            title: formData.title,
            price: formData.price, 
            price_notes: formData.priceNotes,
            start_date: formData.startDate,
            end_date: formData.endDate,
            duration_notes: formData.durationNotes,
            image_paths: filePaths,
          },

        ])
        .select()
        .single();

      if (error) {
        throw new Error(error.message, { cause: successfulUploads.map((imgResp: ImageResponse) => imgResp.data?.path) });
      }

      const imageCaptions = filePaths.map((path, index) => ({
        user_id: userId,
        image_path: path,
        caption: formData.photoLabels[index] || '',
      }))

      const filteredImageCaptions = imageCaptions.filter((imageCaption) => imageCaption.caption != '');

      const { error: captionError } = await supabase
        .from('images_captions')
        .insert(filteredImageCaptions)
        .select();
      if (captionError) {
        throw new Error(captionError.message, { cause: filePaths });
      }
      router.push('/');
    }
    catch (error: any) {
      //revert all uploads
      console.error(error.message);
      await cleanupUploads(error.cause);
    }

    async function cleanupUploads(paths: string[]) {
      const supabase = createClient();
      await supabase.storage.from('listing_images').remove(paths);
      await supabase.from('images_captions').delete().in('image_path', paths);
    }

  }

  const handlePreviewClick = () => {
    // Convert File objects to URLs for storage
    // const photoURLs = formData.photos.map((photo: File) => URL.createObjectURL(photo));
    
    // Prepare data for storage
    const previewData = {
      ...formData,
      photos: formData.photos // Store URLs instead of File objects
    };

    // Save to localStorage
    localStorage.setItem('listingFormData', JSON.stringify(previewData));
    
    // Navigate to preview
    router.push('/post-a-listing/preview');
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
        return <Profile formData={formData} setFormData={setFormData} onBack={handlePreviousCategory} onPost={handleSubmit}/>;
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
      {/* Navbar. */}
      <nav className='mt-10 md:px-8 items-center lg:px-20 xl:px-20 flex flex-row place-items-center w-screen justify-between'>
        {/* Logo — make consistent with the previous nav bar. */}
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <button className='hidden hide-logo:flex justify-center'>
            <Link href='/' className='flex flex-row gap-[8.33] place-items-center'>
              <Image src="/bunkmate_logo.png" alt="Bunkmate Logo" width={35} height={35} />
              <p className="ml-4 text-[30px] text-[#FF7439] font-semibold">bunkmate</p>
            </Link>
          </button>
          <div className="flex items-center space-x-4">
            <FaHeart className="text-[24px] text-gray-300 hover:text-gray-500 hover:scale-105 hover:cursor-pointer transition-transform duration-150 w-[35px] h-[31px]" />
            <CgProfile className="text-[24px] text-gray-300 hover:text-gray-500 hover:scale-105 hover:cursor-pointer transition-transform duration-150 w-[35px] h-[31px]" />
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
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
                </div>
              </div>
            </div>
            {/* Form Content */}
            <div className="flex-1 ml-64 pl-16 border-l border-gray-500">
              {renderComponent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


export default PostListing;