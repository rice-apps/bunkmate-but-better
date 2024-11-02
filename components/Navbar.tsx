"use client"

import React from 'react'
import Image from 'next/image';
import { FaMagnifyingGlass } from "react-icons/fa6";
import { FaHeart } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";
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
          <button className='text-left max-w-full'>
            <p className={`text-[14px] font-light ${selectedOption !== title ? "text-[#FF7439] font-bold" : "text-[#777777]"}`}>
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
  const [startDate, setStartDate] = useState<Date | undefined>(new Date());
  const [endDate, setEndDate] = useState<Date | undefined>(new Date());

  return (
    <div className='my-10 mx-10 flex flex-row place-items-center xl:gap-[5%] lg:gap-[5%] md:gap-[3%] sm:gap-[1%]'>
      <button className='hover:scale-110 transition-transform duration:100'>
        <Link href='/' className='flex flex-row gap-[8.33] place-items-center'>
          <Image src="/bunkmate_logo.png" alt="Bunkmate Logo" width={35.48} height={35.48} className='h-[35.48px] w-[35.48px]' />
          <p className="ml-4 text-[30px] text-[#FF7439] font-semibold">bunkmate</p>
        </Link>
      </button>

      <div className="w-[50vw] h-[12.5vh] border-[2px] border-[#D9D9D9] rounded-[50px] shadow-lg flex place-items-center justify-center">
        <div className='max-w-full h-[41px] justify-center place-items-center flex flex-row whitespace-nowrap'>
          <div className='grid grid-rows-2 gap-[2px] border-r sm:px-1 md:px-3 lg:px-6 xl:px-8'>
            <p className='text-[14px] font-semibold text-[#777777]'>Distance from Rice</p>
            <ModularDropDown allOptions={["< 1 mile", "< 3 miles", "< 5 miles", "> 5 miles"]} title={"Search Properties"} />
          </div>
          <div className='grid grid-rows-2 gap-[2px] border-r sm:px-1 md:px-3 lg:px-6 xl:px-8 text-left'>
            <p className='text-[14px] font-semibold text-[#777777]'>Start Date</p>
            <Popover>
              <PopoverTrigger asChild>
                <button className='text-left'>
                  <p className={`text-[14px] font-light ${startDate && startDate.toDateString() !== "Select Date" ? "text-[#FF7439] font-bold" : "text-[#777777]"}`}>{startDate ? startDate.toDateString() : "Select Date"}</p>
                </button>
              </PopoverTrigger>
              <PopoverContent className="p-2 bg-white rounded-lg shadow-lg" style={{ zIndex: 1000 }}>
                <Calendar
                        mode="single"
                        selected={startDate}
                        onSelect={setStartDate}
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className='grid grid-rows-2 gap-[2px] sm:px-1 md:px-3 lg:px-6 xl:px-8'>
            <p className='text-[14px] font-semibold text-[#777777]'>End Date</p>
            <Popover>
              <PopoverTrigger asChild>
                <button className='text-left'>
                <p className={`text-[14px] font-light ${endDate && endDate.toDateString() !== "Select Date" ? "text-[#FF7439] font-bold" : "text-[#777777]"}`}>{endDate ? endDate.toDateString() : "Select Date"}</p>
                </button>
              </PopoverTrigger>
              <PopoverContent className="p-2 bg-white rounded-lg shadow-lg" style={{ zIndex: 1000 }}>
              <Calendar
                        mode="single"
                        selected={endDate}
                        onSelect={setEndDate}
                />
              </PopoverContent>
            </Popover>
          </div>
          <button>
            <FaMagnifyingGlass
              className='hover:cursor-pointer h-[29px] w-[25px] transition-transform duration-100 text-[#FF7439] hover:text-[#BB5529] hover:scale-105'
            />
          </button>
        </div>
      </div>

      <div className='flex flex-row gap-[20px]'>
        <button className="w-[158px] h-[43px] bg-[#FF7439] hover:bg-[#BB5529] rounded-[10.2px] flex items-center justify-center transform transition-all duration-150 hover:scale-105 active:scale-105">
          <p className="text-[15px] text-white font-semibold">Post a Listing</p>
        </button>
        <button>
          <FaHeart className="text-[24px] text-gray-300 hover:text-gray-500 hover:scale-105 transition-transform duration-150 w-[35px] h-[31px]" />
        </button>

        <button>
          <CgProfile className="text-[24px] text-gray-300 hover:text-gray-500 hover:scale-105 transition-transform duration-150 w-[35px] h-[31px]" />
        </button>
      </div>

    </div>
  )
}

export default Navbar