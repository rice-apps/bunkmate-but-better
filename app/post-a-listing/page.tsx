"use client";

import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
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
  price: number;
  priceNotes: string;
  startDate: string;
  endDate: string;
  durationNotes: string;
  address: string;
  locationNotes: string;
  photos: File[];
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

type ImagePromiseType  = Promise<ImageResponse>

// Main PostListing component
const PostListing = () => {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState('title');
  const [formData, setFormData] = useState<FormData>({
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
    affiliation: 'rice',
    // profilePicture: '',
    // firstName: '',
    // lastName: '',
    // email: '',
    phone: '',
    
  });

  const handleSubmit = async (e: MouseEvent) => {
    e.preventDefault();

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

    try {
      const imageUploads = await Promise.all(insertions);
      const successfulUploads = imageUploads.filter((imageUploads) => imageUploads.data);
      if (successfulUploads.length != filePaths.length) {
        const successfulFilePaths = successfulUploads.map((imgResp: ImageResponse) => imgResp.data?.path);
        throw new Error('Some image(s) failed to upload', { cause: successfulFilePaths });
      }

      const { data, error } = await supabase
        .from('listings')
        .insert([
          { 
            user_id: userId,
            phone_number: formData.phone,
            title: formData.title,
            description: formData.description,
            price: formData.price, 
            price_notes: formData.priceNotes,
            start_date: formData.startDate,
            end_date: formData.endDate,
            duration_notes: formData.durationNotes,
            address: formData.address,
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

      const { error: captionError } = await supabase
        .from('images_captions')
        .insert(imageCaptions)
        .select();
      if (captionError) {
        throw new Error(captionError.message, { cause: filePaths });
      }
      
      router.push('/listing');
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
        />;
      case 'location':
        return <Location
          formData={formData}
          setFormData={setFormData}
          onNext={handleNextCategory}
        />;
      case 'duration':
        return <Duration
          formData={formData}
          setFormData={setFormData}
          onNext={handleNextCategory}
        />;
      case 'photos':
        return <Photos
          formData={formData}
          setFormData={setFormData}
          onNext={handleNextCategory}
        />;
        case 'duration':
          return <Duration 
            formData={formData} 
            setFormData={setFormData} 
            onNext={handleNextCategory}
          />;
          case 'photos':
            return <Photos 
              formData={formData} 
              setFormData={setFormData} 
              onNext={handleNextCategory}
            />;
      case 'profile':
        return <Profile formData={formData} setFormData={setFormData}/>;
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
            <FaHeart className="text-[24px] text-gray-300 hover:text-gray-500 hover:scale-105 hover:cursor-pointer transition-transform duration-150 w-[35px] h-[31px]" />
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
              <div className="w-64 border-r border-gray-500 pr-16 h-svh">
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
            <div className="flex-1 ml-64 pl-16">
              {renderComponent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


export default PostListing;