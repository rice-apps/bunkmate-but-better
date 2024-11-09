"use client";

import React, { useState } from 'react';
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
  const [selectedCategory, setSelectedCategory] = useState('title');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    monthlyRent: '',
    distance: '',
    utilities: '',
    specialNotes: '',
    address: '',
    locationNotes: '',
    photos: [],
    photoLabels: {},
    affiliation: 'rice',
    name: '',
    email: '',
    phone: ''
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

  const renderComponent = () => {
    switch (selectedCategory) {
      case 'title':
        return <TitleDescription formData={formData} setFormData={setFormData} />;
      case 'pricing':
        return <Pricing formData={formData} setFormData={setFormData} />;
      case 'location':
        return <Location formData={formData} setFormData={setFormData} />;
      case 'photos':
        return <Photos formData={formData} setFormData={setFormData} />;
      case 'contact':
        return <Contact formData={formData} setFormData={setFormData} />;
      default:
        return <TitleDescription formData={formData} setFormData={setFormData} />;
    }
  };

  const categories = [
    { id: 'title', name: 'Title & Description', completed: false },
    { id: 'pricing', name: 'Pricing', completed: false },
    { id: 'location', name: 'Location', completed: false },
    { id: 'photos', name: 'Photos', completed: false },
    { id: 'contact', name: 'Contact', completed: false }
  ];

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
            <Button variant="preview" className="text-gray-500 flex flex-row items-center">
                <FaEye />
              <p>PREVIEW LISTING</p>
            </Button>
          </div>

          <div className="flex gap-16">
            {/* Sidebar */}
            <div className="w-64">
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
                    <div className="w-2 h-2 rounded-full mr-2 bg-current" />
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