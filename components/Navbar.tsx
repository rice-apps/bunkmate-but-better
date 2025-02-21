"use client"

import React, { Suspense, useEffect } from 'react'
import Image from 'next/image';
import { FaMagnifyingGlass } from "react-icons/fa6";
import { FaHeart, FaTimes } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";
import { RxHamburgerMenu } from "react-icons/rx";
import { MdHome } from "react-icons/md";
import { FaPlus } from "react-icons/fa";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@radix-ui/react-popover";
import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { createClient } from "@/utils/supabase/client";

interface ModularDropDownProps {
  allOptions: string[];
  title: string;
  value: string;
  setValue: (value: string) => void;
}

const ModularDropDown: React.FC<ModularDropDownProps> = ({ allOptions, title, value, setValue }) => {
  const MenuItem: React.FC<{ option: string }> = ({ option }) => (
    <DropdownMenuItem 
      key={option} 
      onClick={() => setValue(option === value ? title : option)} 
      className="flex justify-center"
    >
      <p className={`${value === option ? "text-[#FF7439] font-bold" : ""} hover:text-[#FF7439] text-[16px] text-center cursor-pointer`}>
        {option}
      </p>
    </DropdownMenuItem>
  );

  return (
    <DropdownMenu key={title}>
      <DropdownMenuTrigger asChild>
        <button className='text-left w-full'>
          <p className={`text-[16px] ${value !== title ? "text-[#FF7439] font-semibold" : "text-[#777777] font-light"}`}>
            {value}
          </p>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-full'>
        {allOptions.map((option) => (
          <MenuItem option={option} key={option} />
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

interface NavbarProps {
  includeFilter?: boolean;
  includePostBtn?: boolean;
}

const Navbar = ({includeFilter=true, includePostBtn=true}: NavbarProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showMobileFilter, setShowMobileFilter] = useState(false);
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const supabase = createClient();
  const router = useRouter();
  const distanceTitle = "Search Properties";
  const [distance, setDistance] = useState(distanceTitle);
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/sign-in");
  };

  const [searchParamsLoaded, setSearchParamsLoaded] = useState(false);

  useEffect(() => {
    setSearchParamsLoaded(true);
  }, []);

  useEffect(() => {
    if (!searchParamsLoaded) return;
    
    const startDateParam = searchParams?.get('startDate');
    const endDateParam = searchParams?.get('endDate');
    const distanceParam = searchParams?.get('distance');

    if (startDateParam) {
      const date = new Date(startDateParam);
      if (!isNaN(date.getTime())) setStartDate(date);
    }
    if (endDateParam) {
      const date = new Date(endDateParam);
      if (!isNaN(date.getTime())) setEndDate(date);
    }
    if (distanceParam) setDistance(distanceParam);
  }, [searchParams, searchParamsLoaded]);

  const handleFilterChange = () => {
    const queryParams = new URLSearchParams(window.location.search);
    if (distance !== distanceTitle) queryParams.set('distance', distance);
    if (distance === distanceTitle) queryParams.delete('distance');
    if (startDate) queryParams.set('startDate', startDate.toISOString());
    if (endDate) queryParams.set('endDate', endDate.toISOString());
    router.push(`/?${queryParams.toString()}`);
  };

  useEffect(() => {
    if (pathname === "/" || startDate || endDate || distance !== "Search Properties") {
      handleFilterChange();
    }
  }, [startDate, endDate, distance, pathname]);

  const FilterContent = () => (
    <div className={`max-w-[780px] flex h-[78px] border-[2px] border-[#D9D9D9] rounded-[50px] shadow-lg flex-col lg:flex-row place-items-center justify-between whitespace-nowrap mx-3`}>
      {/* Distance from Rice */}
      <div className='lg:ml-[10px] flex justify-center items-center flex-col lg:border-r w-full lg:w-[212px] mb-4 lg:mb-0' >
        <div className="text-left w-full lg:w-auto">
          <p className='text-[14px] font-semibold text-[#777777]'>Distance from Rice</p>
          <ModularDropDown 
            allOptions={["< 1 mile", "< 3 miles", "< 5 miles", "> 5 miles"]} 
            title={distanceTitle} 
            value={distance} 
            setValue={setDistance} 
          />
        </div>
      </div>

      {/* Start Date */}
      <div className="flex justify-center items-center flex-col w-full lg:w-[212px] lg:border-r mb-4 lg:mb-0">
        <div className="text-left w-full lg:w-auto">
          <p className="text-[14px] font-bold text-[#777777]">Start Date</p>
          <Popover>
            <PopoverTrigger asChild>
              <button className="text-left w-full">
                <p className={`text-base ${startDate ? "text-[#FF7439] font-semibold" : "text-[#777777] font-light"}`}>
                  {startDate ? startDate.toDateString() : "Select date"}
                </p>
              </button>
            </PopoverTrigger>
            <PopoverContent className="p-2 bg-white rounded-lg shadow-lg" style={{ zIndex: 1000 }}>
              <Calendar
                mode="single"
                selected={startDate}
                onSelect={setStartDate}
                disabled={(date) => {
                  if (!searchParamsLoaded) return true;
                  const today = new Date();
                  today.setHours(0, 0, 0, 0);
                  return date < today || (endDate !== undefined && date > endDate);
                }}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* End Date */}
      <div className="flex justify-center items-center flex-col w-full lg:w-[212px] mb-4 lg:mb-0">
        <div className="text-left w-full lg:w-auto">
          <p className='text-[14px] font-semibold text-[#777777]'>End Date</p>
          <Popover>
            <PopoverTrigger asChild>
              <button className='text-left w-full'>
                <p className={`text-[16px] ${endDate ? "text-[#FF7439] font-semibold" : "text-[#777777] font-light"}`}>
                  {endDate ? endDate.toDateString() : "Select date"}
                </p>
              </button>
            </PopoverTrigger>
            <PopoverContent className="p-2 bg-white rounded-lg shadow-lg" style={{ zIndex: 1000 }}>
              <Calendar
                mode="single"
                selected={endDate}
                onSelect={setEndDate}
                disabled={(date) => {
                  const today = new Date();
                  today.setHours(0, 0, 0, 0);
                  return date < today || (startDate !== undefined && date < startDate);
                }}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <button className='lg:pr-8 w-full lg:w-auto flex justify-center lg:block mb-4 lg:mb-0'>
        <FaMagnifyingGlass className='h-[29px] w-[25px] transition-transform duration-100 text-[#FF7439] hover:text-[#BB5529] hover:scale-105' />
      </button>
    </div>
  );

  return (
    <div className='w-full'>
      {/* Mobile Search Button */}
      <button 
        onClick={() => setShowMobileFilter(!showMobileFilter)}
        className='lg:hidden fixed bottom-20 right-4 z-40 bg-[#FF7439] p-4 rounded-full shadow-lg'
      >
        <FaMagnifyingGlass className='h-6 w-6 text-white' />
      </button>

      {/* Mobile Filter Overlay */}
      {showMobileFilter && (
        <div className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center">
          <div className="w-full max-w-md mx-4 bg-white rounded-3xl p-6 relative">
            <button 
              onClick={() => setShowMobileFilter(false)} 
              className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
            >
              <FaTimes className='w-6 h-6' />
            </button>
            <div className="pt-4">
              <FilterContent />
            </div>
          </div>
        </div>
      )}

      <div className='items-center flex flex-row place-items-center justify-between w-full' style={{height: "15vh"}}>
        {/* Logo */}
        <Link href='/' className='flex flex-row gap-[8.33] place-items-center'>
          <Image 
            src="/bunkmate_logo.png" 
            alt="Bunkmate Logo" 
            width={35} 
            height={35}
            style={{ width: 'auto', height: 'auto' }}
          />
          <p className="ml-4 text-[30px] text-[#FF7439] font-semibold hidden md:block">bunkmate</p>
        </Link>

        {/* Desktop Filter */}
        {includeFilter && (
          <div className="hidden lg:block">
            <FilterContent />
          </div>
        )}

        {/* Desktop Navigation */}
        <div className='hidden lg:flex flex-row gap-[25px] place-items-center'>
          {includePostBtn && (
            <Link href='/post-a-listing'>
              <button className="py-2 px-7 bg-[#FF7439] hover:bg-[#BB5529] rounded-[10.2px] transform transition-all duration-150 hover:scale-105 active:scale-105">
                <p className="text-[15px] text-white font-semibold">Post a Listing</p>
              </button>
            </Link>
          )}
          <Link href='/favorites'>
            <button className="flex items-center">
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
              <DropdownMenuItem>
                <Link href='/profile-section' className="w-full text-center">
                  <p className='hover:text-[#FF7439]'>Profile</p>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <button onClick={handleLogout} className="w-full text-center">
                  <p className='hover:text-[#FF7439]'>Logout</p>
                </button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Mobile Menu Button */}
        <button onClick={() => setIsOpen(true)} className='lg:hidden'>
          <RxHamburgerMenu className='w-[35px] h-[35px]' color="#FF7439" />
        </button>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="fixed inset-y-0 right-0 w-64 bg-[#FF7439] z-50 transform transition-transform duration-300">
            <div className="p-4 pl-10 text-white space-y-6 flex flex-col text-[18px] mt-12">
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 text-white"
              >
                <FaTimes className='w-6 h-6' />
              </button>
              
              <Link href='/' className="flex items-center space-x-3" onClick={() => setIsOpen(false)}>
                <MdHome className='w-6 h-6' />
                <span>Home</span>
              </Link>
              
              <Link href='/post-a-listing' className="flex items-center space-x-3" onClick={() => setIsOpen(false)}>
                <FaPlus className='w-6 h-6' />
                <span>Post a Listing</span>
              </Link>
              
              <Link href='/favorites' className="flex items-center space-x-3" onClick={() => setIsOpen(false)}>
                <FaHeart className='w-6 h-6' />
                <span>Favorite Listings</span>
              </Link>
              
              <Link href='/profile-section' className="flex items-center space-x-3" onClick={() => setIsOpen(false)}>
                <CgProfile className='w-6 h-6' />
                <span>Your Profile</span>
              </Link>
              
              <button onClick={() => { handleLogout(); setIsOpen(false); }} className="flex items-center space-x-3">
                <FaTimes className='w-6 h-6' />
                <span>Logout</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
