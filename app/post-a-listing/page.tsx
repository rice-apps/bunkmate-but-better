"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FaHeart } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";
import { RxHamburgerMenu } from "react-icons/rx";
import { FaTimes, FaPlus } from "react-icons/fa";
import { MdHome } from "react-icons/md";
import TitleDescription from "./TitleDescription";
import Pricing from "./Pricing";
import Location from "./Location";
import Photos from "./Photos";
import Profile from "./Profile";
import { createClient } from "@/utils/supabase/client";
import { v4 } from "uuid";
import Duration from "./Duration";
import CategoryStatusIndicator from "./CategoryStatusIndicator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
};

type ImagePromiseType = Promise<ImageResponse>;

// Main PostListing component
const PostListing = () => {
  const router = useRouter();
  const params = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState("title");
  const [isOpen, setIsOpen] = useState(false);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    price: 0,
    priceNotes: "",
    startDate: "",
    endDate: "",
    durationNotes: "",
    address: "",
    locationNotes: "",
    photos: [],
    photoLabels: [],
    affiliation: "rice",
    phone: "",
  });

  useEffect(() => {
    const savedData = params.get("data");
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      setFormData(parsedData);
    }
  }, [params]);

  const isComplete = Boolean(
    formData.title.length >= 1 && 
    formData.description.length >= 100 && 
    formData.price && 
    formData.address &&
    formData.startDate && 
    formData.endDate && 
    formData.photos.length >= 5 && 
    formData.phone
  );

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const supabase = createClient();
    const userId = (await supabase.auth.getUser()).data.user?.id;
    const insertions: ImagePromiseType[] = [];
    
    // Cache the name of our file paths
    const filePaths: string[] = [];

    formData.photos.forEach((photo) => {
      const filePath = `${userId}/${v4()}`;
      const insertion = supabase.storage
        .from("listing_images")
        .upload(filePath, photo);
      insertions.push(insertion);
      filePaths.push(filePath);
    });

    try {
      const imageUploads = await Promise.all(insertions);
      const successfulUploads = imageUploads.filter(
        (imageUploads) => imageUploads.data
      );
      
      if (successfulUploads.length != filePaths.length) {
        const successfulFilePaths = successfulUploads.map(
          (imgResp: ImageResponse) => imgResp.data?.path
        );
        throw new Error("Some image(s) failed to upload", {
          cause: successfulFilePaths,
        });
      }

      // Calculate distance from address to Rice University
      const distance = await calculateDistance(formData.address);
      if (!distance) {
        throw new Error('Unable to validate address or calculate distance. Please check the address.');
      }

      const { data, error } = await supabase
        .from("listings")
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
            location_notes: formData.locationNotes,
            distance: distance,
            image_paths: filePaths,
          },
        ])
        .select()
        .single();

      if (error) {
        throw new Error(error.message, {
          cause: successfulUploads.map(
            (imgResp: ImageResponse) => imgResp.data?.path
          ),
        });
      }

      const imageCaptions = filePaths.map((path, index) => ({
        user_id: userId,
        image_path: path,
        caption: formData.photoLabels[index] || "",
      }));

      const filteredImageCaptions = imageCaptions.filter(
        (imageCaption) => imageCaption.caption !== ""
      );

      const { error: captionError } = await supabase
        .from("images_captions")
        .insert(filteredImageCaptions)
        .select();

      if (captionError) {
        throw new Error(captionError.message, { cause: filePaths });
      }

      router.push("/");
    } catch (error: any) {
      console.error(error.message);
      await cleanupUploads(error.cause);
    }
  };

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

  async function cleanupUploads(paths: string[]) {
    const supabase = createClient();
    await supabase.storage.from("listing_images").remove(paths);
    await supabase.from("images_captions").delete().in("image_path", paths);
  }

  const handlePreviewClick = () => {
    const previewData = {
      ...formData,
      photos: formData.photos
    };
    localStorage.setItem('listingFormData', JSON.stringify(previewData));
    router.push('/post-a-listing/preview');
  };

  const renderComponent = () => {
    switch (selectedCategory) {
      case "title":
        return (
          <TitleDescription
            formData={formData}
            setFormData={setFormData}
            onNext={handleNextCategory}
          />
        );
      case "pricing":
        return (
          <Pricing
            formData={formData}
            setFormData={setFormData}
            onNext={handleNextCategory}
            onBack={handlePreviousCategory}
          />
        );
      case "location":
        return (
          <Location
            formData={formData}
            setFormData={setFormData}
            onNext={handleNextCategory}
            onBack={handlePreviousCategory}
          />
        );
      case "duration":
        return (
          <Duration
            formData={formData}
            setFormData={setFormData}
            onNext={handleNextCategory}
            onBack={handlePreviousCategory}
          />
        );
      case "photos":
        return (
          <Photos
            formData={formData}
            setFormData={setFormData}
            onNext={handleNextCategory}
            onBack={handlePreviousCategory}
          />
        );
      case "profile":
        return (
          <Profile
            formData={formData}
            setFormData={setFormData}
            onBack={handlePreviousCategory}
          />
        );
      default:
        return (
          <TitleDescription
            formData={formData}
            setFormData={setFormData}
            onNext={handleNextCategory}
          />
        );
    }
  };

  const categories = useMemo(
    () => [
      {
        id: "title",
        name: "Title & Description",
        completed:
          formData.title.length >= 1 && formData.description.length >= 100,
      },
      {
        id: "pricing",
        name: "Pricing",
        completed: Boolean(formData.price),
      },
      {
        id: "location",
        name: "Location",
        completed: Boolean(formData.address),
      },
      {
        id: "duration",
        name: "Duration",
        completed: Boolean(formData.startDate && formData.endDate),
      },
      {
        id: "photos",
        name: "Photos",
        completed: Boolean(formData.photos.length >= 5 && formData.photos.length <= 20),
      },
      {
        id: "profile",
        name: "Profile",
        completed: Boolean(formData.phone),
      },
    ],
    [formData]
  );

  const handleNextCategory = () => {
    const currentIndex = categories.findIndex(
      (cat) => cat.id === selectedCategory
    );
    if (currentIndex < categories.length - 1) {
      setSelectedCategory(categories[currentIndex + 1].id);
    }
  };

  const handlePreviousCategory = () => {
    const currentIndex = categories.findIndex(
      (cat) => cat.id === selectedCategory
    );
    if (currentIndex > 0) {
      setSelectedCategory(categories[currentIndex - 1].id);
    }
  };

  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    // Redirect to Sign-in page
    router.push("/sign-in");
  };

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="min-h-screen w-full bg-white">
      <nav className="bg-white top-0 z-10 fixed w-full">
        <div className="my-10 md:px-8 items-center lg:px-20 xl:px-20 flex flex-row place-items-center w-screen justify-between">
          {/* Logo */}
          <button className='hidden hide-logo:flex justify-center'>
            <Link href='/' className='flex flex-row gap-[8.33] place-items-center'>
              <Image src="/bunkmate_logo.png" alt="Bunkmate Logo" width={35} height={35} />
              <p className="ml-4 text-[30px] text-[#FF7439] font-semibold">bunkmate</p>
            </Link>
          </button>

          {/* Right Section Icons */}
          <div className='flex justify-center items-center hidden hide-icons:flex hide-icons:flex-row gap-[25px] place-items-center'>
            <Link href='/favorites' className="py-0 flex items-center">
              <button>
                <FaHeart className="text-[24px] text-gray-300 hover:text-gray-500 hover:scale-105 transition-transform duration-150 w-[29px] h-[30px]" />
              </button>
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button>
                  <CgProfile className="text-[24px] text-gray-300 hover:text-gray-500 hover:scale-105 transition-transform duration-150 w-[30px] h-[30px]" />
                </button>
              </DropdownMenuTrigger>

              <DropdownMenuContent>
                <DropdownMenuItem className="flex justify-center">
                  <Link href='/profile-section'>
                    <p className='hover:text-[#FF7439] text-center'>Profile</p>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex justify-center">
                  <button onClick={handleLogout}>
                    <p className='hover:text-[#FF7439] text-center'>Logout</p>
                  </button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Mobile Menu Button */}
          <div className='flex hide-icons:hidden z-100 ml-auto mr-5'>
            <button onClick={() => setIsOpen(true)}>
              <RxHamburgerMenu className='w-[35px] h-[35px]' color={"#FF7439"} />
            </button>
          </div>

          {/* Mobile Menu */}
          {isOpen && (
            <div className="fixed top-0 right-0 h-full w-full bg-[#FF7439] z-[150] transition-transform duration-300 flex flex-row">
              <div className="p-4 pl-10 text-white space-y-6 flex flex-col text-[18px] mt-12 justify-left">
                <Link href='/' className="flex place-items-center">
                  <MdHome className='mr-5' />
                  <button>Home</button>
                </Link>
                <Link href='/post-a-listing' className="flex place-items-center">
                  <FaPlus className='mr-5' />
                  <button>Post a Listing</button>
                </Link>
                <Link href='/favorites' className="flex">
                  <FaHeart className='mr-5' />
                  <button>Favorite Listings</button>
                </Link>
                <Link href='/profile-section' className="flex place-items-center">
                  <CgProfile className='mr-5' />
                  <button>Your Profile</button>
                </Link>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-[55px] right-[35px] text-white text-2xl"
              >
                <FaTimes className='w-[28px] h-[28px]' />
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <div className={`container mx-auto px-4 py-8 mt-32 relative `}>
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row gap-8 md:gap-24">
            {/* Mobile Sidebar Toggle */}
            <button 
              className="md:hidden flex items-center w-fit mb-4 bg-[#FF7439] text-white py-2 px-4 rounded-full"
              onClick={toggleSidebar}
            >
              <span>{isSidebarOpen ? 'Close' : 'Expand'} Categories</span>
            </button>

            {/* Responsive Sidebar */}
            <div className={`${
              isSidebarOpen ? 'block' : 'hidden'
            } md:block md:fixed w-full md:w-80`}>
              <div className="w-full md:w-80 pr-0 md:pr-16 h-auto md:h-svh mb-8 md:mb-0">
                <h1 className="text-2xl font-semibold mb-8">Listing Editor</h1>
                <div className="space-y-3">
                  {categories.map((category) => (
                    <div
                      key={category.id}
                      className={`flex items-center p-3 rounded-xl cursor-pointer w-full ${
                        selectedCategory === category.id
                          ? "text-[#FF7439] border-[#FF7439] border bg-orange-50"
                          : "text-gray-500"
                      }`}
                      onClick={() => {
                        setSelectedCategory(category.id);
                        setSidebarOpen(false); // Close sidebar on mobile after selection
                      }}
                    >
                      <div className="mr-3">
                        <CategoryStatusIndicator
                          selected={selectedCategory === category.id}
                          completed={category.completed}
                        />
                      </div>
                      {category.name}
                    </div>
                  ))}
                  {/* Post Button */}
                  <div className="flex items-center justify-center pt-12">
                    <Button
                      className={`w-[5.3rem] rounded-lg px-6 flex items-center ${
                        isComplete ? "bg-[#FF7439] hover:bg-[#FF7439]/90" : "bg-gray-300"
                      }`}
                      disabled={!isComplete}
                      onClick={handleSubmit}
                    >
                      <p>Post</p>
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Form Content */}
            <div className="flex-1 md:ml-80 md:pl-16 md:border-l border-gray-500">
              {renderComponent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostListing;