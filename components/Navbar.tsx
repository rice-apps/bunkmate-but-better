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
import { set } from 'date-fns';


interface ModularDropDownProps {
  allOptions: string[];
  title: string;
  value: string;
  setValue: (value: string) => void;
}

const ModularDropDown: React.FC<ModularDropDownProps> = ({ allOptions, title, value, setValue }) => {

  const MenuItem: React.FC<{ option: string }> = ({ option }) => {
    return (
      <>
        <DropdownMenuItem key={option} onClick={() => {
          if (option === value) {
            setValue(title);
          } else {
            setValue(option);
          }
        }} className="flex justify-center">
          <p className={`${value === option && "text-[#FF7439] font-bold"} hover:text-[#FF7439] text-[16px] text-center cursor-pointer`}>{option}</p>
        </DropdownMenuItem>
      </>
    )
  }

  return (
    <>
      <DropdownMenu key={title}>
        <DropdownMenuTrigger asChild>
          <button className='text-left'>
            <p className={`text-[16px] ${value !== title ? "text-[#FF7439] font-semibold" : "text-[#777777] font-light"}`}>
              {value}
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

interface NavbarProps {
  includeFilter?: boolean;
  includePostBtn?: boolean;
}

const Navbar = ({includeFilter=true, includePostBtn=true}: NavbarProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const supabase = createClient();
  const router = useRouter();
  const distanceTitle = "Search Properties";
  const [distance, setDistance] = useState(distanceTitle);
  const searchParams = useSearchParams(); // Use useSearchParams

  const pathname = usePathname();
  

  const handleLogout = async () => {
    await supabase.auth.signOut();
    // Redirect to Sign-in page
    router.push("/sign-in");
  };

    // Make sure the navbar reflects the search parameters even if you search from a different section
    // like the profile section
    useEffect(() => {
      if (searchParams && searchParams.get('startDate')) {
        setStartDate(new Date(searchParams.get('startDate')!));
      }
      if (searchParams && searchParams.get('endDate')) {
        setEndDate(new Date(searchParams.get('endDate')!));
      }
      if (searchParams && searchParams.get('distance')) {
        setDistance(searchParams.get('distance')!);
      }
    }, []);
  
    const handleFilterChange = () => {
      const queryParams = new URLSearchParams(window.location.search);
      if (distance !== distanceTitle) queryParams.set('distance', distance);
      if (startDate) queryParams.set('startDate', startDate.toISOString());
      if (endDate) queryParams.set('endDate', endDate.toISOString());
  
      const queryString = queryParams.toString();
      router.push(`/?${queryString}`);
    };
  
    useEffect(() => {
      if (pathname === "/" || startDate != null || endDate != null || distance != "Search Properties") {
        console.log("HI")
        console.log(pathname, startDate, endDate, distance);
        handleFilterChange();
      }
     }, [startDate, endDate, distance])  

  return (
    <Suspense>
    <div className='items-center flex flex-row place-items-center justify-between w-full' style={{height: "15vh"}} >
      {/* Logo */}
      <button className='hidden hide-logo:flex justify-center'>
        <Link href='/' className='flex flex-row gap-[8.33] place-items-center'>
          <Image src="/bunkmate_logo.png" alt="Bunkmate Logo" width={35} height={35} />
          <p className="ml-4 text-[30px] text-[#FF7439] font-semibold">bunkmate</p>
        </Link>
      </button>

      {includeFilter && <div className="max-w-[780px] flex h-[78px] border-[2px] border-[#D9D9D9] rounded-[50px] shadow-lg flex flex-row place-items-center justify-between whitespace-nowrap mx-3">
        {/* Distance from Rice. */}
        <div className='ml-[10px] flex justify-center items-center flex-col border-r w-[212px]' >
          <div className = "text-left">
            <p className='text-[14px] font-semibold text-[#777777]'> Distance from Rice </p>
            <ModularDropDown allOptions={["< 1 mile", "< 3 miles", "< 5 miles", "> 5 miles"]} title={distanceTitle} value={distance} setValue={setDistance} />
          </div>
        </div>

        {/* Start Date. */}
        <div className="flex justify-center items-center flex-col w-[212px] border-r">
          <div className= "text-left ">
            <p className="text-[14px] font-bold text-[#777777] self-start">Start Date</p>
            <Popover>
              <PopoverTrigger asChild>
                <button className="text-left self-start">
                  <p
                    className={`text-base ${startDate && startDate.toDateString() !== "Select Start Date"
                      ? "text-[#FF7439] font-semibold"
                      : "text-[#777777] font-light"
                      }`}
                  >
                    {startDate ? startDate.toDateString() : "Select date"}
                  </p>
                </button>
              </PopoverTrigger>
              <PopoverContent
                className="p-2 bg-white rounded-lg shadow-lg"
                style={{ zIndex: 1000 }}
              >
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
        </div>

        {/* End Date */}
        <div className="flex justify-center items-center flex-col w-[212px]">
          <div className = "text-left">
            <p className='text-[14px] font-semibold text-[#777777]'>End Date</p>
            <Popover>
              <PopoverTrigger asChild>
                <button className='text-left'>
                  <p className={`text-[16px] ${endDate && endDate.toDateString() !== "Select date" ? "text-[#FF7439] font-semibold" : "text-[#777777] font-light"}`}>{endDate ? endDate.toDateString() : "Select date"}</p>
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
          </div>
        </div>
        <button className='pr-8'>
          <FaMagnifyingGlass
            className='hover:cursor-pointer h-[29px] w-[25px] transition-transform duration-100 text-[#FF7439] hover:text-[#BB5529] hover:scale-105'
          />
        </button>
      </div>}

      {/* ===== Right Section of Nav Bar */}
      {/* Post a Listing */}
      <div className='flex justify-center items-center hidden hide-icons:flex hide-icons:flex-row gap-[25px] place-items-center items-center'>
        {includePostBtn && <Link href='/post-a-listing'>
          <button className="py-2 px-7 bg-[#FF7439] hover:bg-[#BB5529] rounded-[10.2px] flex items-center justify-center transform transition-all duration-150 hover:scale-105 active:scale-105 whitespace-nowrap">
            <p className="text-[15px] text-white font-semibold">Post a Listing</p>
          </button>
        </Link>}
        <Link href='/favorites' className="py-0 flex items-center">
          <button>
            <FaHeart className="text-[24px] text-gray-300 hover:text-gray-500 hover:scale-105 transition-transform duration-150 w-[29px] h-[30px]" />
          </button>
        </Link>
        <DropdownMenu key={"profileTrigger"}>
          <DropdownMenuTrigger asChild>
            <button>
              <CgProfile className="text-[24px] text-gray-300 hover:text-gray-500 hover:scale-105 transition-transform duration-150 w-[30px] h-[30px]" />
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

      <div className='flex hide-icons:hidden z-100'>
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
            <Link href='/favorites' className="flex">
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
    </Suspense>
  )
}

export default Navbar