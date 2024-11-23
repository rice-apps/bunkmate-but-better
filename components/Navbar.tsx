"use client"

import React from 'react'
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
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@radix-ui/react-popover";


import { useState } from 'react';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from "@/utils/supabase/client";


//dm sans, 30px , FF7439, font weight is 600
//      <i class="fa-solid fa-magnifying-glass"></i>
// 158px by 43px, 10.2px rounded radius
// <FaMagnifyingGlass />
// 

interface ModularDropDownProps {
  allOptions: string[];
  title: string;
}

const ModularDropDown: React.FC<ModularDropDownProps> = ({ allOptions, title }) => {
  const [selectedOption, setSelectedOption] = useState(title);

  const MenuItem: React.FC<{ option: string }> = ({ option }) => {
    return (
      <>
        <DropdownMenuItem key={option} onClick={() => setSelectedOption(option)} className="flex justify-center">
          <p className='hover:text-[#FF7439] text-center'>{option}</p>
        </DropdownMenuItem>
      </>
    )
  }

  return (
    <>
      <DropdownMenu key={title}>
        <DropdownMenuTrigger asChild>
          <button className='text-left'>
            <p className={`text-[14px] ${selectedOption !== title ? "text-[#FF7439] font-semibold" : "text-[#777777] font-light"}`}>
              {selectedOption}
            </p>
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent className=''>
          {allOptions.map((option) => {
            return (
              <MenuItem option={option} key={option} />
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}



const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const supabase = createClient();
  const router = useRouter();
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    // Redirect to Sign-in page
    router.push("/sign-in");
  };

  return (
    <div className='my-10 px-6 md:px-8 lg:px-10 xl:px-16 flex flex-row place-items-center w-screen justify-between'>
      <button className='hidden rahul:flex justify-center'>
        <Link href='/' className='flex flex-row gap-[8.33] place-items-center'>
          <Image src="/bunkmate_logo.png" alt="Bunkmate Logo" width={35.48} height={35.48} className='h-[35.48px] w-[35.48px]' />
          <p className="ml-4 text-[30px] text-[#FF7439] font-semibold">bunkmate</p>
        </Link>
      </button>

      <div className="h-[10vh] border-[2px] border-[#D9D9D9] rounded-[50px] shadow-lg flex flex-row place-items-center justify-between whitespace-nowrap mx-3">
        <div className='grid grid-rows-2 gap-[2px] border-r pl-8 pr-10'>
          <p className='text-[14px] font-semibold text-[#777777]'>Distance from Rice</p>
          <ModularDropDown allOptions={["< 1 mile", "< 3 miles", "< 5 miles", "> 5 miles"]} title={"Search Properties"} />
        </div>
        <div className="grid grid-rows-2 gap-[2px] w-[180px] pl-10 pr-10 text-left border-r">
          <p className='text-[14px] font-semibold text-[#777777]'>Start Date</p>
          <Popover>
            <PopoverTrigger asChild>
              <button className='text-left'>
                <p className={`text-[14px] ${startDate && startDate.toDateString() !== "Select Start Date" ? "text-[#FF7439] font-semibold" : "text-[#777777] font-light"}`}>{startDate ? startDate.toDateString() : "Select Start Date"}</p>
              </button>
            </PopoverTrigger>
            <PopoverContent className="p-2 bg-white rounded-lg shadow-lg" style={{ zIndex: 1000 }}>
              <Calendar
                mode="single"
                selected={startDate}
                onSelect={setStartDate}
                disabled={(date) =>
                  date < new Date() || (endDate !== undefined && date > endDate)
                }
              />
            </PopoverContent>
          </Popover>
        </div>
        <div className="grid grid-rows-2 gap-[2px] w-[180px] pl-10 pr-10 text-left">
          <p className='text-[14px] font-semibold text-[#777777]'>End Date</p>
          <Popover>
            <PopoverTrigger asChild>
              <button className='text-left'>
                <p className={`text-[14px] ${endDate && endDate.toDateString() !== "Select Start Date" ? "text-[#FF7439] font-semibold" : "text-[#777777] font-light"}`}>{endDate ? endDate.toDateString() : "Select Start Date"}</p>
              </button>
            </PopoverTrigger>
            <PopoverContent className="p-2 bg-white rounded-lg shadow-lg" style={{ zIndex: 1000 }}>
              <Calendar
                mode="single"
                selected={endDate}
                onSelect={setEndDate}
                disabled={(date) =>
                  date < new Date() || (startDate !== undefined && date < startDate)
                }
              />
            </PopoverContent>
          </Popover>
        </div>        <button className='pr-8'>
          <FaMagnifyingGlass
            className='hover:cursor-pointer h-[29px] w-[25px] transition-transform duration-100 text-[#FF7439] hover:text-[#BB5529] hover:scale-105'
          />
        </button>
      </div>

      <div className='hidden eric:flex eric:flex-row gap-[25px] place-items-center items-center'>
        <Link href='/post-a-listing'>
          <button className="py-2 px-7 bg-[#FF7439] hover:bg-[#BB5529] rounded-[10.2px] flex items-center justify-center transform transition-all duration-150 hover:scale-105 active:scale-105 whitespace-nowrap">
            <p className="text-[15px] text-white font-semibold">Post a Listing</p>
          </button>
        </Link>
        <Link href='/favorites'>
          <button>
            <FaHeart className="text-[24px] text-gray-300 hover:text-gray-500 hover:scale-105 transition-transform duration-150 w-[35px] h-[31px]" />
          </button>
        </Link>
        <DropdownMenu key={"profileTrigger"}>
          <DropdownMenuTrigger asChild>
            <button>
              <CgProfile className="text-[24px] text-gray-300 hover:text-gray-500 hover:scale-105 transition-transform duration-150 w-[35px] h-[31px]" />
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent className=''>
            <DropdownMenuItem key={"profile"} className="flex justify-center">
              <Link href='/profile-section'>
                <p className='hover:text-[#FF7439] text-center'>Profile</p>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem key={"logout"} className="flex justify-center">
              <button onClick={handleLogout}>
                <p className='hover:text-[#FF7439] text-center'>Logout</p>
              </button>
            </DropdownMenuItem>
          </DropdownMenuContent>

        </DropdownMenu>
      </div>

      <div className='flex eric:hidden z-100'>
        <button onClick={() => setIsOpen(true)}>
          <RxHamburgerMenu className='w-[35px] h-[35px]'
            color={"#FF7439"}
          />
        </button>
      </div>

      {isOpen ?
        <div className="fixed top-0 right-0 h-full w-2/5 bg-[#FF7439] z-50 transition-transform duration-300 flex flex-row">
          <div className="p-4 pl-10 text-white space-y-6 flex flex-col text-[18px] mt-12 justify-left">
            <Link href='/' className="flex place-items-center">
              <MdHome className='mr-5' />
              <button className="">Home</button>
            </Link>
            <Link href='/post-a-listing' className="flex place-items-center">
              <FaPlus className='mr-5' />
              <button className="">Post a Listing</button>
            </Link>
            <Link href='/favorites' className="flex place-items-center">
              <FaHeart className='mr-5' />
              <button className="">Favorite Listings</button>
            </Link>
            <Link href='/profile-section' className="flex place-items-center">
              <CgProfile className='mr-5' />
              <button className="">Your Profile</button>
            </Link>
          </div>
          <div>
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-[55px] right-[35px] text-white text-2xl"
            >
              <FaTimes className='w-[28px] h-[28px]' />
            </button>
          </div>
        </div> : null
      }
    </div>
  )
}

export default Navbar