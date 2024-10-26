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
 

import { useState } from 'react';


//dm sans, 30px , FF7439, font weight is 600
//      <i class="fa-solid fa-magnifying-glass"></i>
// 158px by 43px, 10.2px rounded radius
// <FaMagnifyingGlass />
// 

const Navbar = () => {

  const [selectedOption, setSelectedOption] = useState("Search Properties");
  const [startDate, setStartDate] = useState("Select Date");
  const [endDate, setEndDate] = useState("Select Date");


  return (
    <div className='my-10 mx-10 flex flex-row place-items-center gap-[100px]'>
      <button className='hover:scale-110 transition-transform duration:100'>
        <div className='flex flex-row gap-[8.33] place-items-center'>
          <Image src="/bunkmate_logo.png" alt="Bunkmate Logo" width={35.48} height={35.48} className='h-[35.48px] w-[35.48px]' />
          <p className="ml-4 text-[30px] text-[#FF7439] font-semibold">bunkmate</p>
        </div>
      </button>

      <div className="w-[700px] h-[78px] border-[2px] border-[#D9D9D9] rounded-[50px] shadow-lg flex place-items-center justify-center">
        <div className='w-[657px] h-[41px] justify-center place-items-center flex flex-row whitespace-nowrap gap-5'>
          <div className='grid grid-rows-2 gap-[2px] border-r pr-10'>
            <p className='text-[14px] font-semibold text-[#777777]'>Distance from Rice</p>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className='text-left'>
                  <p className={`text-[14px] font-light ${selectedOption !== "Search Properties" ? "text-[#FF7439] font-bold" : "text-[#777777]"}`}>
                    {selectedOption}
                  </p>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className=''>
                <DropdownMenuItem onClick={() => setSelectedOption("< 1 mile")} className="flex justify-center">
                  <p className='hover:text-[#FF7439] text-center'>&lt; 1 mile</p>
                  </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedOption("< 3 miles")} className="flex justify-center">
                  <p className='hover:text-[#FF7439] text-center'>&lt; 3 miles</p>
                  </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedOption("< 5 miles")} className="flex justify-center">
                  <p className='hover:text-[#FF7439] text-center'>&lt; 5 miles</p>
                  </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedOption("> 5 miles")} className="flex justify-center">
                  <p className='hover:text-[#FF7439] text-center'>&gt; 5 miles</p>
                  </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className='grid grid-rows-2 gap-[2px] border-r px-10 text-left'>
            <p className='text-[14px] font-semibold text-[#777777]'>Start Date</p>
            <button className='text-left'>
              <p className='text-[14px] font-light text-[#777777]'>{ startDate }</p>
            </button>
          </div>
          <div className='grid grid-rows-2 gap-[2px] px-10'>
            <p className='text-[14px] font-semibold text-[#777777]'>End Date</p>
            <button className='text-left'>
              <p className='text-[14px] font-light text-[#777777]'>{ endDate }</p>
            </button>
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