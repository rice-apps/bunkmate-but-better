"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Link from 'next/link';
import { FaHeart, FaEye } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";

// Updated TitleDescription component to match the design
const TitleDescription = ({ formData, setFormData }: { formData: any; setFormData: any }) => (
  <div className="space-y-8 w-full">
    <div>
      <h2 className="text-2xl font-medium mb-4">Title</h2>
      <div className="relative">
        <Input
          placeholder="Life Tower"
          value={formData.title}
          onChange={(e) => setFormData({...formData, title: e.target.value})}
          maxLength={50}
          className="w-full rounded-xl border border-gray-200"
        />
        <span className="absolute right-2 top-2 text-sm text-gray-400">
          {formData.title.length}/50 characters
        </span>
      </div>
    </div>
    
    <div>
      <h2 className="text-2xl font-medium mb-4">Description</h2>
      <div className="relative">
        <Textarea
          placeholder="Share a general description of the property so potential subleasers/roommates know what to expect."
          value={formData.description}
          onChange={(e) => setFormData({...formData, description: e.target.value})}
          className="min-h-[200px] rounded-xl border border-gray-200 resize-none"
          maxLength={500}
        />
        <div className="flex justify-between mt-2 text-sm text-gray-400">
          <span>Minimum 100 characters</span>
          <span>{formData.description.length}/500 characters</span>
        </div>
      </div>
    </div>

    <div className="flex justify-end">
      <Button 
        className="bg-[#FF7439] hover:bg-[#FF7439]/90 rounded-lg px-6"
      >
        Next
      </Button>
    </div>
  </div>
);

// Main PostListing component
const PostListing = () => {
    const [selectedCategory, setSelectedCategory] = useState('title');
    const [formData, setFormData] = useState({
      title: '',
      description: '',
      monthlyRent: '',
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
                    className={`flex items-center p-3 rounded-xl cursor-pointer ${
                      selectedCategory === category.id
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

// Pricing Component
const Pricing = ({ formData, setFormData }: { formData: any; setFormData: any }) => (
    <div className="space-y-8 w-full">
      <div>
        <h2 className="text-2xl font-medium mb-4">Monthly Rent</h2>
        <div className="relative">
          <Input
            type="number"
            placeholder="$ 1350"
            value={formData.monthlyRent}
            onChange={(e) => setFormData({...formData, monthlyRent: e.target.value})}
            className="w-full rounded-xl border border-gray-200"
          />
        </div>
      </div>
      
      <div>
        <h2 className="text-2xl font-medium mb-4">Utilities</h2>
        <div className="relative">
          <Textarea
            placeholder="Ex: Utilities not included in rent/month."
            value={formData.utilities}
            onChange={(e) => setFormData({...formData, utilities: e.target.value})}
            className="min-h-[150px] rounded-xl border border-gray-200 resize-none"
          />
        </div>
      </div>
  
      <div>
        <h2 className="text-2xl font-medium mb-4">Special Notes</h2>
        <div className="relative">
          <Textarea
            placeholder="Ex: Parking spot prices."
            value={formData.specialNotes}
            onChange={(e) => setFormData({...formData, specialNotes: e.target.value})}
            className="min-h-[150px] rounded-xl border border-gray-200 resize-none"
          />
        </div>
      </div>
  
      <div className="flex justify-end">
        <Button onClick={() => console.log(formData)} className="bg-[#FF7439] hover:bg-[#FF7439]/90 rounded-lg px-6">
          Next
        </Button>
      </div>
    </div>
  );
  
  // Location Component
  const Location = ({ formData, setFormData }: { formData: any; setFormData: any }) => (
    <div className="space-y-8 w-full">
      <div>
        <h2 className="text-2xl font-medium mb-4">Address</h2>
        <div className="relative">
          <Input
            placeholder="Ex: 123 Sammy Blvd, Houston, TX 77005"
            value={formData.address}
            onChange={(e) => setFormData({...formData, address: e.target.value})}
            className="w-full rounded-xl border border-gray-200"
          />
        </div>
      </div>
      
      <div>
        <h2 className="text-2xl font-medium mb-4">Special Notes</h2>
        <div className="relative">
          <Textarea
            placeholder="Ex: Distance from Rice. Distance from Fondren Library. Estimated bike ride duration."
            value={formData.locationNotes}
            onChange={(e) => setFormData({...formData, locationNotes: e.target.value})}
            className="min-h-[150px] rounded-xl border border-gray-200 resize-none"
          />
        </div>
      </div>
  
      <div className="flex justify-end">
        <Button className="bg-[#FF7439] hover:bg-[#FF7439]/90 rounded-lg px-6">
          Next
        </Button>
      </div>
    </div>
  );
  
  // Photos Component
  const Photos = ({ formData, setFormData }: { formData: any; setFormData: any }) => {
    const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        const newPhotos = Array.from(e.target.files);
        setFormData({...formData, photos: [...formData.photos, ...newPhotos]});
      }
    };
  
    return (
      <div className="space-y-8 w-full">
        <div>
          <h2 className="text-2xl font-medium mb-4">Photos</h2>
          <p className="text-gray-500 mb-2">Manage photos and add details (optional).</p>
          <p className="text-gray-500 mb-6">You are required to upload at least 5 relevant photos to post your listing.</p>
  
          <div className="grid grid-cols-3 gap-4">
            {formData.photos.map((photo: any, index: number) => (
              <div key={index} className="relative">
                <div className="aspect-square rounded-xl overflow-hidden border border-gray-200">
                  <Image
                    src={URL.createObjectURL(photo)}
                    alt={`Upload ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
                <Input
                  placeholder="Label (e.g., Bedroom)"
                  className="mt-2 rounded-xl"
                  value={formData.photoLabels[index] || ''}
                  onChange={(e) => {
                    const newLabels = { ...formData.photoLabels, [index]: e.target.value };
                    setFormData({...formData, photoLabels: newLabels});
                  }}
                />
              </div>
            ))}
  
            {formData.photos.length < 5 && (
              <label className="cursor-pointer">
                <div className="aspect-square rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center">
                  <span className="text-4xl text-gray-400">+</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handlePhotoUpload}
                  />
                </div>
              </label>
            )}
          </div>
        </div>
  
        <div className="flex justify-end">
          <Button className="bg-[#FF7439] hover:bg-[#FF7439]/90 rounded-lg px-6">
            Next
          </Button>
        </div>
      </div>
    );
  };
  
  // Contact Component
  const Contact = ({ formData, setFormData }: { formData: any; setFormData: any }) => (
    <div className="space-y-8 w-full">
      <div>
        <h2 className="text-2xl font-medium mb-4">Affiliation</h2>
        <div className="space-y-2">
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              value="rice"
              checked={formData.affiliation === 'rice'}
              onChange={(e) => setFormData({...formData, affiliation: e.target.value})}
              className="rounded-full"
            />
            <span>Rice Student</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              value="alum"
              checked={formData.affiliation === 'alum'}
              onChange={(e) => setFormData({...formData, affiliation: e.target.value})}
              className="rounded-full"
            />
            <span>Rice Alum</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              value="none"
              checked={formData.affiliation === 'none'}
              onChange={(e) => setFormData({...formData, affiliation: e.target.value})}
              className="rounded-full"
            />
            <span>Not Rice Affiliated</span>
          </label>
        </div>
      </div>
      
      <div>
        <h2 className="text-2xl font-medium mb-4">Contact Information</h2>
        <div className="space-y-4">
          <Input
            placeholder="Name (First & Last)"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            className="w-full rounded-xl border border-gray-200"
          />
          <Input
            type="email"
            placeholder="Email address"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            className="w-full rounded-xl border border-gray-200"
          />
          <Input
            type="tel"
            placeholder="Phone number"
            value={formData.phone}
            onChange={(e) => setFormData({...formData, phone: e.target.value})}
            className="w-full rounded-xl border border-gray-200"
          />
        </div>
      </div>
  
      <div className="flex justify-end">
        <Button className="bg-[#FF7439] hover:bg-[#FF7439]/90 rounded-lg px-6">
          Post
        </Button>
      </div>
    </div>
  );
  

export default PostListing;