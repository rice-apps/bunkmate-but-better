"use client";

import React, { Suspense, useEffect } from "react";
import Image from "next/image";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { FaHeart, FaSignOutAlt, FaTimes } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";
import { RxHamburgerMenu } from "react-icons/rx";
import { MdHome } from "react-icons/md";
import { FaPlus } from "react-icons/fa";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@radix-ui/react-popover";
import { useState } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "@bprogress/next";
import { createClient } from "@/utils/supabase/client";
import { set } from "date-fns";
import { AnimatePresence, motion } from "framer-motion";

interface ModularDropDownProps {
  allOptions: string[];
  title: string;
  value: string;
  setValue: (value: string) => void;
  className?: string;
}

const ModularDropDown: React.FC<ModularDropDownProps> = ({
  allOptions,
  title,
  value,
  setValue,
}) => {
  const MenuItem: React.FC<{ option: string }> = ({ option }) => {
    return (
      <>
        <DropdownMenuItem
          key={option}
          onClick={() => {
            if (option === value) {
              setValue(title);
            } else {
              setValue(option);
            }
          }}
          className="flex justify-center"
        >
          <p
            className={`${value === option && "text-[#FF7439] font-bold"} hover:text-[#FF7439] text-[16px] text-center cursor-pointer`}
          >
            {option}
          </p>
        </DropdownMenuItem>
      </>
    );
  };

  return (
    <>
      <DropdownMenu key={title}>
        <DropdownMenuTrigger asChild>
          <button className="text-left">
            <p
              className={`text-[16px] ${value !== title ? "text-[#FF7439] font-semibold" : "text-[#777777] font-light"}`}
            >
              {value}
            </p>
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="">
          {allOptions.map((option) => {
            return <MenuItem option={option} key={option} />;
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

interface NavbarProps {
  includeFilter?: boolean;
  includePostBtn?: boolean;
}

const Navbar = ({
  includeFilter = true,
  includePostBtn = true,
}: NavbarProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [showMobileFilter, setShowMobileFilter] = useState(false);
  const supabase = createClient();
  const router = useRouter();
  const distanceTitle = "Search Properties";
  const [distance, setDistance] = useState(distanceTitle);
  const searchParams = useSearchParams(); // Use useSearchParams
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const pathname = usePathname();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    // Redirect to Sign-in page
    router.push("/sign-in");
  };

  // Make sure the navbar reflects the search parameters even if you search from a different section
  // like the profile section
  useEffect(() => {
    if (searchParams && searchParams.get("startDate")) {
      setStartDate(new Date(searchParams.get("startDate")!));
    }
    if (searchParams && searchParams.get("endDate")) {
      setEndDate(new Date(searchParams.get("endDate")!));
    }
    if (searchParams && searchParams.get("distance")) {
      setDistance(searchParams.get("distance")!);
    }
  }, []);

  const handleFilterChange = () => {
    const queryParams = new URLSearchParams(window.location.search);
    if (distance !== distanceTitle) queryParams.set("distance", distance);
    if (distance === distanceTitle) queryParams.delete("distance");
    if (startDate) queryParams.set("startDate", startDate.toISOString());
    if (!startDate) queryParams.delete("startDate");
    if (endDate) queryParams.set("endDate", endDate.toISOString());
    if (!endDate) queryParams.delete("endDate");

    const queryString = queryParams.toString();
    router.push(`/?${queryString}`);
  };

  useEffect(() => {
    if (
      pathname === "/" ||
      startDate != null ||
      endDate != null ||
      distance != "Search Properties"
    ) {
      handleFilterChange();
    }
  }, [startDate, endDate, distance]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  // Add this function to handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    const queryParams = new URLSearchParams(window.location.search);
    if (query) queryParams.set("search", query);
    if (!query) queryParams.delete("search");
    const queryString = queryParams.toString();
    router.push(`/?${queryString}`);
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      setShowSearch(false);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    handleSearch("");
    setShowSearch(false);
  };

  return (
    <div className="w-full">
      {/* Mobile Search Button */}

      {/* Mobile Filter Overlay */}
      {showMobileFilter && (
        <div className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center">
          <div className="w-full max-w-md mx-4 bg-white rounded-3xl p-6 relative">
            <button
              onClick={() => setShowMobileFilter(false)}
              className="absolute right-8 top-6 text-gray-500 hover:text-gray-700"
            >
              <FaTimes className="w-6 h-6" />
            </button>
            <div className="pt-8">
              {/* Mobile filter options */}
              <div className="space-y-6 ml-[20px] mr-[20px] mb-[20px] flex flex-col justify-center items-left text-left">
                {/* Search Input */}
                <div className="w-full">
                  <div className="relative flex items-center">
                    <FaMagnifyingGlass className="absolute left-3 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => handleSearch(e.target.value)}
                      onKeyDown={handleSearchKeyDown}
                      placeholder="Search by name or location..."
                      className="w-full pl-10 pr-4 py-2 border-2 bg-white border-gray-200 rounded-full focus:outline-none focus:border-[#FF7439]"
                    />
                    {searchQuery && (
                      <button
                        onClick={handleClearSearch}
                        className="absolute right-3 text-gray-400 hover:text-gray-600"
                      >
                        <FaTimes className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </div>
                {/* Distance from Rice */}
                <div>
                  <p className="text-[18px] font-semibold text-[#777777] mb-2">
                    Distance from Rice
                  </p>
                  <ModularDropDown
                    allOptions={[
                      "< 1 mile",
                      "< 3 miles",
                      "< 5 miles",
                      "> 5 miles",
                    ]}
                    title={distanceTitle}
                    value={distance}
                    setValue={setDistance}
                    className="w-full"
                  />
                </div>
                <hr></hr>

                {/* Start Date */}
                <div>
                  <p className="text-[18px] font-semibold text-[#777777] mb-2">
                    Start Date
                  </p>
                  <Popover>
                    <PopoverTrigger asChild>
                      <button className="text-left w-full">
                        <p
                          className={`text-[16px] ${startDate ? "text-[#FF7439] font-semibold" : "text-[#777777] font-light"}`}
                        >
                          {startDate ? startDate.toDateString() : "Select date"}
                        </p>
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="p-2 bg-white rounded-lg shadow-lg">
                      <Calendar
                        mode="single"
                        selected={startDate}
                        onSelect={setStartDate}
                        disabled={(date) =>
                          date < new Date() ||
                          (endDate !== undefined && date > endDate)
                        }
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <hr></hr>

                {/* End Date */}
                <div>
                  <p className="text-[18px] font-semibold text-[#777777] mb-2">
                    End Date
                  </p>
                  <Popover>
                    <PopoverTrigger asChild>
                      <button className="text-left w-full">
                        <p
                          className={`text-[16px] ${endDate ? "text-[#FF7439] font-semibold" : "text-[#777777] font-light"}`}
                        >
                          {endDate ? endDate.toDateString() : "Select date"}
                        </p>
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="p-2 bg-white rounded-lg shadow-lg">
                      <Calendar
                        mode="single"
                        selected={endDate}
                        onSelect={setEndDate}
                        disabled={(date) =>
                          date < new Date() ||
                          (startDate !== undefined && date < startDate)
                        }
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div
        className="flex items-center flex-row place-items-center justify-between w-full"
        style={{ height: "15vh" }}
      >
        {/* Logo */}
        <button className="flex lg:hidden hide-logo:flex justify-center">
          <Link
            href="/"
            className="flex flex-row gap-[8.33] place-items-center"
          >
            <Image
              src="/bunkmate_logo.png"
              alt="Bunkmate Logo"
              width={35}
              height={35}
            />
            <p className="ml-4 text-[30px] text-[#FF7439] font-semibold">
              bunkmate
            </p>
          </Link>
        </button>

        {/* Mobile Icons (grouped search & menu icons) */}
        {/* Again, note that these icons will only appear on mobile! */}
        <div className="flex ml-auto items-center justify-end gap-4 lg:hidden">
          {/* MOBILE-ONLY search icon. */}
          <button
            onClick={() => setShowMobileFilter(!showMobileFilter)}
            className="p-1"
          >
            <FaMagnifyingGlass className="h-6 w-6 text-[#FF7439]" />
          </button>

          <div className="flex-grow"></div>

          {/* MOBILE-ONLY hamburger icon. */}
          <button onClick={() => setIsOpen(true)}>
            <RxHamburgerMenu className="w-[35px] h-[35px] text-[#FF7439]" />
          </button>
        </div>
        {includeFilter && (
          <div className="hidden max-w-[780px] lg:flex h-[78px] border-[2px] border-[#D9D9D9] rounded-[50px] shadow-lg flex flex-row place-items-center justify-between whitespace-nowrap mx-3 relative">
            {/* Show search input when search is active */}
            <AnimatePresence>
              {showSearch ? (
                <motion.div
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "100%" }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0 bg-white rounded-[50px] flex items-center px-6 z-10"
                >
                  <FaMagnifyingGlass className="text-gray-400 w-5 h-5 mr-3" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    onKeyDown={handleSearchKeyDown}
                    placeholder="Search by name or location..."
                    className="w-full h-full bg-transparent outline-none text-gray-700"
                    autoFocus
                  />
                  <button
                    onClick={handleClearSearch}
                    className="ml-4 text-gray-400 hover:text-gray-600"
                  >
                    <FaTimes className="w-5 h-5" />
                  </button>
                </motion.div>
              ) : null}
            </AnimatePresence>

            {/* Existing filter options */}
            <div className={`${showSearch ? 'opacity-0' : 'opacity-100'} flex flex-row items-center w-full`}>
              {/* Distance from Rice. */}
              <div className="ml-[10px] flex justify-center items-center flex-col border-r w-[212px]">
                <div className="text-left">
                  <p className="text-[14px] font-semibold text-[#777777]">
                    {" "}
                    Distance from Rice{" "}
                  </p>
                  <ModularDropDown
                    allOptions={[
                      "< 1 mile",
                      "< 3 miles",
                      "< 5 miles",
                      "> 5 miles",
                    ]}
                    title={distanceTitle}
                    value={distance}
                    setValue={setDistance}
                  />
                </div>
              </div>
              {/* Start Date. */}
              <div className="flex justify-center items-center flex-col w-[212px] border-r">
                <div className="text-left ">
                  <p className="text-[14px] font-bold text-[#777777] self-start">
                    Start Date
                  </p>
                  <Popover>
                    <PopoverTrigger asChild>
                      <button className="text-left self-start">
                        <p
                          className={`text-base ${
                            startDate &&
                            startDate.toDateString() !== "Select Start Date"
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
                          date < new Date() ||
                          (endDate !== undefined && date > endDate)
                        }
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              {/* End Date */}
              <div className="flex justify-center items-center flex-col w-[212px]">
                <div className="text-left">
                  <p className="text-[14px] font-semibold text-[#777777]">
                    End Date
                  </p>
                  <Popover>
                    <PopoverTrigger asChild>
                      <button className="text-left">
                        <p
                          className={`text-[16px] ${endDate && endDate.toDateString() !== "Select date" ? "text-[#FF7439] font-semibold" : "text-[#777777] font-light"}`}
                        >
                          {endDate ? endDate.toDateString() : "Select date"}
                        </p>
                      </button>
                    </PopoverTrigger>
                    <PopoverContent
                      className="p-2 bg-white rounded-lg shadow-lg"
                      style={{ zIndex: 1000 }}
                    >
                      <Calendar
                        mode="single"
                        selected={endDate}
                        onSelect={setEndDate}
                        disabled={(date) =>
                          date < new Date() ||
                          (startDate !== undefined && date < startDate)
                        }
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </div>
            {/* Search button */}
            <button 
              className="pr-8"
              onClick={() => setShowSearch(true)}
            >
              <FaMagnifyingGlass className="hover:cursor-pointer h-[29px] w-[25px] transition-transform duration-100 text-[#FF7439] hover:text-[#BB5529] hover:scale-105" />
            </button>
          </div>
        )}

        {/* ===== Right Section of Nav Bar */}
        {/* Post a Listing */}
        <div className="flex justify-center items-center hidden hide-icons:flex hide-icons:flex-row gap-[25px] place-items-center items-center">
          {includePostBtn && (
            <Link href="/post-a-listing">
              <button className="py-2 px-7 bg-[#FF7439] hover:bg-[#BB5529] rounded-[10.2px] flex items-center justify-center transform transition-all duration-150 hover:scale-105 active:scale-105 whitespace-nowrap">
                <p className="text-[15px] text-white font-semibold">
                  Post a Listing
                </p>
              </button>
            </Link>
          )}
          <Link href="/favorites" className="py-0 flex items-center">
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

            <DropdownMenuContent className="">
              <DropdownMenuItem key={"profile"} className="flex justify-center">
                <Link href="/profile-section">
                  <p className="hover:text-[#FF7439] text-center">Profile</p>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem key={"logout"} className="flex justify-center">
                <button onClick={handleLogout}>
                  <p className="hover:text-[#FF7439] text-center">Logout</p>
                </button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed inset-y-0 right-0 w-64 bg-[#FF7439] z-50">
            <div className="p-4 pl-10 text-white space-y-6 flex flex-col text-[18px] mt-20">
              <hr className="mt-3"></hr>
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-8 right-7 text-white"
              >
                <FaTimes className="w-8 h-8" />
              </button>

              <Link
                href="/"
                className="flex items-center space-x-3"
                onClick={() => setIsOpen(false)}
              >
                <MdHome className="w-6 h-6" />
                <span>Home</span>
              </Link>

              <Link
                href="/post-a-listing"
                className="flex items-center space-x-3"
                onClick={() => setIsOpen(false)}
              >
                <FaPlus className="w-6 h-6" />
                <span>Post a Listing</span>
              </Link>

              <Link
                href="/favorites"
                className="flex items-center space-x-3"
                onClick={() => setIsOpen(false)}
              >
                <FaHeart className="w-6 h-6" />
                <span>Favorite Listings</span>
              </Link>

              <Link
                href="/profile-section"
                className="flex items-center space-x-3"
                onClick={() => setIsOpen(false)}
              >
                <CgProfile className="w-6 h-6" />
                <span>Your Profile</span>
              </Link>

              <button
                onClick={() => {
                  handleLogout();
                  setIsOpen(false);
                }}
                className="flex items-center space-x-3"
              >
                <FaSignOutAlt className="w-6 h-6" />
                <span>Logout</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Navbar;
