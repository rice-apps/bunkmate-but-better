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
import Contact from './Contact';

import { createClient } from '@/utils/supabase/client';
import { v4 } from 'uuid';
import Duration from './Duration';
import CategoryStatusIndicator from './CategoryStatusIndicator';

type ImagePromiseType  = Promise<{
  data: {
      id: string;
      path: string;
      fullPath: string;
  };
  error: null;
} | {
  data: null;
  error: any;
}>

// Main PostListing component
const PostListing = () => {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState('title');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    monthlyRent: '',
    distance: '',
    specialNotes: '',
    address: '',
    locationNotes: '',
    durationNotes: '',
    photos: [],
    photoLabels: {},
    affiliation: 'rice',
    name: '',
    email: '',
    phone: '',
    startDate: '',
    endDate: '',
  });

  const handleSubmit = async (e: MouseEvent) => {
    e.preventDefault();

    const supabase = createClient();
    const userId = (await supabase.auth.getUser()).data.user?.id;
    const insertions: ImagePromiseType[]  = [];

    // Cache the name of our file paths.
    const filePaths = [];

    formData.photos.forEach(photo => {
      const filePath = v4();
      const insertion = supabase.storage.from('listing_images').upload(filePath, photo);
      insertions.push(insertion);
      filePaths.push(filePath);
    })

    try {
      const results = await Promise.all(insertions);

      const { data, error } = await supabase
        .from('listings')
        .insert([
          { price: formData.monthlyRent, 
            description: formData.description,
            address: formData.address,
            userId,
            title: formData.title,
           },
          
        ])
        .select()
        .single();
      if (error) throw error;

      // const { data, error } = await supabase.storage.from("listing_images").upload()
    }
    catch (error) {
      console.error('Error inserting new listing:', error);
    }

  }

  const handlePreviewClick = () => {
    // Convert File objects to URLs for storage
    const photoURLs = formData.photos.map((photo: File) => URL.createObjectURL(photo));
    
    // Prepare data for storage
    const previewData = {
      ...formData,
      photos: photoURLs // Store URLs instead of File objects
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
      case 'contact':
        return <Contact formData={formData} setFormData={setFormData} />;
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
      completed: Boolean(formData.monthlyRent)
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
      id: 'contact', 
      name: 'Contact', 
      completed: Boolean(formData.name && formData.email && formData.phone)
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
      <nav className=" bg-white">
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
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Listing Editor</h1>
          <h1 className="text-2xl font-bold">
            {categories.find((category) => category.id === selectedCategory)?.name}
          </h1>
          <Button 
            variant="preview" 
            className="text-gray-500 flex flex-row items-center gap-2"
            onClick={handlePreviewClick}
            // Optionally disable preview if required fields aren't filled
            disabled={!formData.title || !formData.description || formData.photos.length === 0}
          >
            <FaEye />
            <span>PREVIEW LISTING</span>
          </Button>
        </div>

          <div className="flex gap-16">
            {/* Sidebar */}
            <div className="w-64">
              <div className="space-y-2">
              {categories.map((category) => (
                  <div
                    key={category.id}
                    className={`flex items-center p-3 rounded-xl cursor-pointer ${
                      selectedCategory === category.id
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

            {/* Form Content */}
            <div className="flex-1">
              {renderComponent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


export default PostListing;