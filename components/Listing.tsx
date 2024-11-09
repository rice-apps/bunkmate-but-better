'use client'
import React, { useState } from 'react';
import Image from 'next/image';
import { FaHeart } from 'react-icons/fa6';

const images = [
  { src: "/house1.jpeg", span: "col-span-4 row-span-4" },
  { src: "/modern_house.jpeg", span: "col-span-2 row-span-2" },
  { src: "/cherry_house.jpeg", span: "col-span-2 row-span-2" },
  { src: "/hobbit_house.jpeg", span: "col-span-2 row-span-2" },
  { src: "/modern_house.jpeg", span: "col-span-2 row-span-2" },
];

const Listing = () => {
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorited, setIsFavorited] = useState(false);

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
  };

  return (
    <div className='w-full px-10'>
      {/* Header Section */}
      <div className="mb-6 w-full">
        <div className="flex items-center mb-2">
          <h1 className="text-4xl font-semibold">Life Tower</h1>
          <FaHeart 
            className="ml-3 cursor-pointer w-6 h-6 hover:scale-105 duration-300" 
            fill={isFavorited ? "#FF7439" : "gray"}
            onClick={toggleFavorite} 
          />
        </div>
        <p className="text-gray-600">1.2 miles away • August - May • $1,300 / month</p>
      </div>

      {/* Image Gallery */}
      <div className="relative w-full h-[500px] grid grid-cols-1 lg:grid-cols-8 gap-2 mb-8">
        {images.map((image, index) => (
          <div
            key={index}
            className={`relative overflow-hidden rounded-lg cursor-pointer ${image.span} ${index === 0 ? '' : 'hidden lg:block sm:hidden md:hidden'}`}
            onClick={() => openDialog(index)}
          >
            <Image 
              src={image.src} 
              fill={true} 
              alt="house" 
              className="object-cover hover:scale-105 transition-transform duration-300" 
            />
          </div>
        ))}

        {/* View All Button */}
          <button 
            onClick={() => openDialog(0)}
            className="absolute bottom-4 right-4 py-2 px-4 bg-transparent text-white border border-white rounded-lg hover:bg-white hover:text-black transition-colors"
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
          >
            <span className="text-4xl">×</span>
          </button>
          <button 
            onClick={handlePrev} 
            className="absolute left-12 text-white hover:text-gray-300 transition-colors"
          >
            <span className="text-5xl">&lt;</span>
          </button>

          <div className="w-1/2 h-3/4 relative mb-17.5">
            <Image 
              src={images[currentImageIndex].src} 
              fill={true} 
              alt="house" 
              className="object-cover rounded-lg" 
            />
          </div>

          <div className='text-white absolute bottom-8'>
            <p className="text-center font-semibold">Life Tower</p>
            <p className="text-center">1.2 miles away • August - May • $1,300 / month</p>
          </div>

          <button 
            onClick={handleNext} 
            className="absolute right-12 text-white hover:text-gray-300 transition-colors"
          >
            <span className="text-5xl">&gt;</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default Listing;
