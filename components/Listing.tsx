'use client'
import React, { useState } from 'react';
import Image from 'next/image';
import { Heart } from 'lucide-react';

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

  const openDialog = (index: number) => {
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

  return (
    <div className="w-full h-screen">
      <div className="w-full h-screen psm:px-8 md:px-10 lg:px-24 py-6 bg-gray-50">
        <div className="flex items-center mb-3 ml-4">
          <h1 className="text-4xl text-left">Listing</h1>
          <Heart className="ml-2" fill="#808080" stroke="#808080" />
        </div>
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-left ml-4">Distance | Date | Rent</h2>
        </div>
        <div className="w-full h-4/6 grid grid-cols-8 gap-3 p-4">
          {images.map((image, index) => (
            <div
              key={index}
              className={`bg-gray-100 p-4 shadow relative ${image.span}`}
              onClick={() => openDialog(index)}
            >
              <Image src={image.src} fill={true} alt="house" className="object-cover" />
            </div>
          ))}
        </div>
      </div>

      {isDialogOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75">
          <button onClick={closeDialog} className="absolute top-4 right-4 text-white text-4xl mr-8">X</button>
          <button onClick={handlePrev} className="absolute left-12 text-white text-5xl">&lt;</button>
          <div className="w-1/2 h-3/4 relative">
            <Image src={images[currentImageIndex].src} fill={true} alt="house" className="object-cover" />
          </div>
          <button onClick={handleNext} className="absolute right-12 text-white text-5xl">&gt;</button>
        </div>
      )}
    </div>
  );
};

export default Listing;
