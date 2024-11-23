'use client'
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { FaHeart } from 'react-icons/fa6';
import { getImagePublicUrl } from "@/utils/supabase/client";

interface ListingData {
  id: number;
  title: string;
  address: string;
  description: string;
  duration_notes: string;
  end_date: string;
  start_date: string;
  image_paths: string[];
  phone_number: string;
  price: number;
  price_notes: string;
  created_at: string;
  user_id: string;
}

interface ImageData {
  src: string;
  span: string;
}

interface ListingProps {
  data: {
    id: string;
    title: string;
    distance: string;
    end_date: string;
    start_date: string;
    price: number;
    location: string;
    imagePaths: string[];
    description: string;
    phoneNumber: string;
    durationNotes: string;
    priceNotes: string;
    user: {
      fullName: string;
      avatarUrl: string | null;
      email: string;
      isRiceStudent: boolean;
    } | null;
  };
}

const Listing: React.FC<ListingProps> = ({ data }: ListingProps) => {
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorited, setIsFavorited] = useState(false);
  const [images, setImages] = useState<ImageData[]>([]);

  useEffect(() => {
    if (data?.imagePaths) {
      // Transform the image paths into our gallery format
      const transformedImages = data.imagePaths.map((path, index) => ({
        src: getImagePublicUrl("listing_images", path),
        span: index === 0 ? "col-span-4 row-span-4" : "col-span-2 row-span-2"
      }));

      // If we have less than 5 images, pad with default images
      const defaultImages = [
        "/house1.jpeg",
        "/modern_house.jpeg",
        "/cherry_house.jpeg",
        "/hobbit_house.jpeg",
        "/modern_house.jpeg"
      ];

      const paddedImages = [...transformedImages];
      for (let i = transformedImages.length; i < 5; i++) {
        paddedImages.push({
          src: defaultImages[i],
          span: i === 0 ? "col-span-4 row-span-4" : "col-span-2 row-span-2"
        });
      }

      setImages(paddedImages);
    }
  }, [data?.imagePaths]);

  const openDialog = (index: number = 0) => {
    setCurrentImageIndex(index);
    setDialogOpen(true);
  };

  const closeDialog = () => setDialogOpen(false);

  const handleNext = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const handlePrev = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const toggleFavorite = () => {
    setIsFavorited(!isFavorited);
    // TODO: Add API call to update favorite status in Supabase
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric'
    });
  };

  const formatDateRange = (startDate: string, endDate: string) => {
    const formatDate = (dateString: string) => {
      return new Date(dateString).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      });
    };
  
    return `${formatDate(startDate)} - ${formatDate(endDate)}`;
  };

  return (
    <div className='w-full px-10'>
      {/* Header Section */}
      <div className="mb-6 w-full">
        <div className="flex items-center mb-2">
          <h1 className="text-4xl font-semibold">{data.title}</h1>
          <FaHeart 
            className="ml-3 cursor-pointer w-6 h-6 hover:scale-105 duration-300" 
            fill={isFavorited ? "#FF7439" : "gray"}
            onClick={toggleFavorite} 
          />
        </div>
        <p className="text-gray-600">
          {`${data.location}  • ${formatDateRange(data.start_date, data.end_date)}  • $${data.price.toLocaleString()} / month`}
          {data.priceNotes && ` - ${data.priceNotes}`}
        </p>
      </div>

      {/* Image Gallery */}
      <div className="relative w-full h-[500px] grid grid-cols-1 lg:grid-cols-8 gap-2 mb-8">
        {images.map((image, index) => (
          <div
            key={index}
            className={`relative overflow-hidden rounded-lg cursor-pointer ${image.span} ${
              index === 0 ? '' : 'hidden lg:block sm:hidden md:hidden'
            }`}
            onClick={() => openDialog(index)}
          >
            <Image 
              src={image.src} 
              fill={true} 
              alt={`${data.title} - Image ${index + 1}`}
              className="object-cover hover:scale-105 transition-transform duration-300" 
              priority={index === 0} // Prioritize loading the main image
            />
          </div>
        ))}

        {/* View All Button */}
        <button 
          onClick={() => openDialog(0)}
          className="absolute bottom-4 right-4 py-2 px-4 bg-white text-black border border-white rounded-lg hover:bg-transparent hover:text-white transition-colors"
        >
          View All
        </button>
      </div>

      {/* Image Dialog */}
      {isDialogOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50">
          <button 
            onClick={closeDialog} 
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
            aria-label="Close gallery"
          >
            <span className="text-4xl">×</span>
          </button>
          <button 
            onClick={handlePrev} 
            className="absolute left-12 text-white hover:text-gray-300 transition-colors"
            aria-label="Previous image"
          >
            <span className="text-5xl">&lt;</span>
          </button>

          <div className="w-3/4 md:w-3/4 lg:w-1/2 h-3/4 relative mb-17.5">
            <Image 
              src={images[currentImageIndex].src} 
              fill={true} 
              alt={`${data.title} - Image ${currentImageIndex + 1}`}
              className="object-cover rounded-lg" 
            />
          </div>

          <div className='text-white absolute bottom-8'>
            <p className="text-center font-semibold">{data.title}</p>
            <p className="text-center">
              {`${data.location} • ${formatDateRange(data.start_date, data.end_date)} • $${data.price.toLocaleString()} / month`}
              {data.priceNotes && ` - ${data.priceNotes}`}
            </p>
          </div>

          <button 
            onClick={handleNext} 
            className="absolute right-12 text-white hover:text-gray-300 transition-colors"
            aria-label="Next image"
          >
            <span className="text-5xl">&gt;</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default Listing;