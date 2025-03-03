"use client";

import React, { Suspense, useEffect, useState, useRef } from "react";
import Image from "next/image";
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
} from "@/components/ui/dropdown-menu";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@radix-ui/react-popover";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "@bprogress/next";
import { createClient } from "@/utils/supabase/client";
import { set } from "date-fns";
import { AnimatePresence, motion } from "framer-motion";
import Categories from "@/components/Categories";

interface ModularDropDownProps {
  allOptions: string[];
  title: string;
  value: string;
  setValue: (value: string) => void;
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
          <button className="text-center w-full">
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

const AdvancedNavbar = ({
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
  const [searchQuery, setSearchQuery] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);
  const filterBarRef = useRef<HTMLDivElement>(null);
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const commonSearchQueries = ["Life Tower", "Nest", "Dryden", "Bolsover"];

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
    if (searchParams && searchParams.get("search")) {
      setSearchQuery(searchParams.get("search")!);
    }
    if (searchParams && searchParams.get("category")) {
      setSelectedCategory(searchParams.get("category"));
    }
  }, []);

  // Add scroll event listener to handle navbar transformation with smooth transition
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close search suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchInputRef.current && !searchInputRef.current.contains(event.target as Node)) {
        setShowSearchSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleFilterChange = () => {
    const queryParams = new URLSearchParams(window.location.search);
    if (distance !== distanceTitle) queryParams.set("distance", distance);
    if (distance === distanceTitle) queryParams.delete("distance");
    if (startDate) queryParams.set("startDate", startDate.toISOString());
    if (!startDate) queryParams.delete("startDate");
    if (endDate) queryParams.set("endDate", endDate.toISOString());
    if (!endDate) queryParams.delete("endDate");
    if (selectedCategory) queryParams.set("category", selectedCategory);
    if (!selectedCategory) queryParams.delete("category");

    const queryString = queryParams.toString();
    router.push(`/?${queryString}`);
  };

  useEffect(() => {
    if (
      pathname === "/" ||
      startDate != null ||
      endDate != null ||
      distance != "Search Properties" ||
      selectedCategory != null
    ) {
      console.log("HI");
      console.log(pathname, startDate, endDate, distance, selectedCategory);
      handleFilterChange();
    }
  }, [startDate, endDate, distance, selectedCategory]);

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
    setShowSearchSuggestions(false);
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      // Just submit the search, no need to hide anything
      handleSearch(searchQuery);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    handleSearch("");
  };

  const handleSearchSuggestionClick = (suggestion: string) => {
    setSearchQuery(suggestion);
    handleSearch(suggestion);
  };

  const handleCategorySelect = (category: string | null) => {
    setSelectedCategory(category);
  };

  return (
    <div className="w-full sticky top-0 pt-4 z-40 bg-white shadow-sm">
      {/* Mobile Search Button */}
      <button
        onClick={() => setShowMobileFilter(!showMobileFilter)}
        className="lg:hidden fixed bottom-20 right-4 z-40 bg-[#FF7439] p-4 rounded-full shadow-lg"
      >
        <FaMagnifyingGlass className="h-6 w-6 text-white" />
      </button>

      {/* Mobile Filter Overlay */}
      {showMobileFilter && (
        <div className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center">
          <div className="w-full max-w-md mx-4 bg-white rounded-3xl p-6 relative">
            <button
              onClick={() => setShowMobileFilter(false)}
              className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
            >
              <FaTimes className="w-6 h-6" />
            </button>
            <div className="pt-4">
              {/* Mobile filter options */}
              <div className="space-y-6 flex flex-col justify-center items-center text-center">
                {/* Search Input */}
                <div className="w-full">
                  <div className="relative flex items-center">
                    <FaMagnifyingGlass className="absolute left-3 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={handleSearchKeyDown}
                      onFocus={() => setShowSearchSuggestions(true)}
                      placeholder="Search by name or location..."
                      className="w-full pl-10 pr-4 py-2 border-2 bg-white border-gray-200 rounded-full focus:outline-none focus:border-[#FF7439]"
                      ref={searchInputRef}
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
                  {showSearchSuggestions && (
                    <div className="absolute mt-1 w-full bg-white rounded-lg shadow-lg z-50 border border-gray-200">
                      {commonSearchQueries.map((query) => (
                        <div
                          key={query}
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() => handleSearchSuggestionClick(query)}
                        >
                          {query}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Categories */}
                <div className="w-full">
                  <p className="text-[14px] font-semibold text-[#777777] mb-2">
                    Categories
                  </p>
                  <Categories onSelect={handleCategorySelect} selectedCategory={selectedCategory} />
                </div>

                {/* Distance from Rice */}
                <div>
                  <p className="text-[14px] font-semibold text-[#777777] mb-2">
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
                  />
                </div>

                {/* Start Date */}
                <div>
                  <p className="text-[14px] font-semibold text-[#777777] mb-2">
                    Start Date
                  </p>
                  <Popover>
                    <PopoverTrigger asChild>
                      <button className="text-center w-full">
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

                {/* End Date */}
                <div>
                  <p className="text-[14px] font-semibold text-[#777777] mb-2">
                    End Date
                  </p>
                  <Popover>
                    <PopoverTrigger asChild>
                      <button className="text-center w-full">
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

      {/* Main Navbar */}
      <div className="container mx-auto px-4">
        {/* Top section with logo and user controls */}
        <div className="flex items-center justify-between py-2">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src="/bunkmate_logo.png"
              alt="Bunkmate Logo"
              width={30}
              height={30}
            />
            <p className="ml-3 text-[24px] text-[#FF7439] font-semibold">
              bunkmate
            </p>
          </Link>

          {/* Compact Search Bar (visible when scrolled) */}
          {includeFilter && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ 
                opacity: isScrolled ? 1 : 0,
                y: isScrolled ? 0 : -20,
                display: isScrolled ? "flex" : "none"
              }}
              transition={{ duration: 0.3 }}
              className="hidden md:flex items-center bg-white rounded-full border border-gray-200 shadow-sm px-4 py-1 mx-4 flex-1 max-w-xl"
            >
              <div className="flex items-center justify-between w-full">
                {/* Search */}
                <div className="flex items-center">
                  <FaMagnifyingGlass className="text-gray-400 w-4 h-4 mr-2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={handleSearchKeyDown}
                    placeholder="Search..."
                    className="bg-transparent outline-none text-sm w-24"
                  />
                </div>
                
                {/* Divider */}
                <div className="h-5 w-px bg-gray-300 mx-2"></div>
                
                {/* Category */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="text-sm text-gray-700 flex items-center">
                      <span>Category</span>
                      <span className={selectedCategory ? "ml-1 text-[#FF7439]" : "ml-1"}>
                        {selectedCategory ? "•" : ""}
                      </span>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <div className="p-2">
                      <Categories onSelect={handleCategorySelect} selectedCategory={selectedCategory} />
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>
                
                {/* Divider */}
                <div className="h-5 w-px bg-gray-300 mx-2"></div>
                
                {/* When */}
                <Popover>
                  <PopoverTrigger asChild>
                    <button className="text-sm text-gray-700 flex items-center">
                      <span>When</span>
                      <span className={startDate ? "ml-1 text-[#FF7439]" : "ml-1"}>
                        {startDate ? "•" : ""}
                      </span>
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="p-2 bg-white rounded-lg shadow-lg z-50">
                    <div className="p-2">
                      <p className="text-sm font-medium mb-1">Start Date</p>
                      <Calendar
                        mode="single"
                        selected={startDate}
                        onSelect={setStartDate}
                        disabled={(date) =>
                          date < new Date() ||
                          (endDate !== undefined && date > endDate)
                        }
                      />
                      <p className="text-sm font-medium mt-3 mb-1">End Date</p>
                      <Calendar
                        mode="single"
                        selected={endDate}
                        onSelect={setEndDate}
                        disabled={(date) =>
                          date < new Date() ||
                          (startDate !== undefined && date < startDate)
                        }
                      />
                    </div>
                  </PopoverContent>
                </Popover>
                
                {/* Divider */}
                <div className="h-5 w-px bg-gray-300 mx-2"></div>
                
                {/* Distance */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="text-sm text-gray-700 flex items-center">
                      <span>Distance</span>
                      <span className={distance !== distanceTitle ? "ml-1 text-[#FF7439]" : "ml-1"}>
                        {distance !== distanceTitle ? "•" : ""}
                      </span>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    {["< 1 mile", "< 3 miles", "< 5 miles", "> 5 miles"].map((option) => (
                      <DropdownMenuItem 
                        key={option}
                        onClick={() => setDistance(option)}
                        className="flex justify-center"
                      >
                        <p className={`${distance === option ? "text-[#FF7439] font-bold" : ""} hover:text-[#FF7439] text-center`}>
                          {option}
                        </p>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </motion.div>
          )}

          {/* User Controls */}
          <div className="hidden md:flex items-center space-x-6">
            {includePostBtn && (
              <Link href="/post-a-listing">
                <button className="py-1.5 px-5 bg-[#FF7439] hover:bg-[#BB5529] rounded-[10.2px] flex items-center justify-center transform transition-all duration-150 hover:scale-105 active:scale-105 whitespace-nowrap">
                  <p className="text-[14px] text-white font-semibold">
                    Post a Listing
                  </p>
                </button>
              </Link>
            )}
            <Link href="/favorites" className="py-0 flex items-center">
              <button>
                <FaHeart className="text-[20px] text-gray-300 hover:text-gray-500 hover:scale-105 transition-transform duration-150 w-[24px] h-[24px]" />
              </button>
            </Link>
            <DropdownMenu key={"profileTrigger"}>
              <DropdownMenuTrigger asChild>
                <button>
                  <CgProfile className="text-[20px] text-gray-300 hover:text-gray-500 hover:scale-105 transition-transform duration-150 w-[24px] h-[24px]" />
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

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(true)}
            className="md:hidden"
          >
            <RxHamburgerMenu className="w-[30px] h-[30px]" color="#FF7439" />
          </button>
        </div>

        {/* Filter Bar - Transforms on scroll */}
        {includeFilter && (
          <motion.div 
            ref={filterBarRef}
            className="w-full py-3 mb-3"
            initial={false}
            animate={{
              height: isScrolled ? 0 : "auto",
              opacity: isScrolled ? 0 : 1,
              marginBottom: isScrolled ? 0 : 12,
              overflow: "hidden"
            }}
            transition={{ 
              duration: 0.3,
              ease: "easeInOut"
            }}
          >
            <div className="max-w-4xl mx-auto bg-white border-2 border-[#D9D9D9] rounded-[50px] shadow-lg">
              <div className="flex items-center justify-between">
                {/* Integrated search bar with other filters */}
                <div className="flex flex-row items-center w-full py-2">
                  {/* Search Input */}
                  <div className="flex-1 flex justify-center items-center flex-col border-r px-4">
                    <div className="text-center w-full">
                      <p className="text-[14px] font-semibold text-[#777777]">
                        Search
                      </p>
                      <div className="relative flex items-center justify-center">
                        <input
                          type="text"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          onKeyDown={handleSearchKeyDown}
                          onFocus={() => setShowSearchSuggestions(true)}
                          placeholder="Name or location..."
                          className="w-full py-1 bg-transparent outline-none text-[#FF7439] font-semibold text-[16px] text-center placeholder-[#777777] placeholder-opacity-70 transition-all duration-200"
                          ref={searchInputRef}
                        />
                        {searchQuery && (
                          <button
                            onClick={handleClearSearch}
                            className="absolute right-0 text-gray-400 hover:text-gray-600"
                          >
                            <FaTimes className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                      {showSearchSuggestions && (
                        <div className="absolute mt-1 w-64 bg-white rounded-lg shadow-lg z-50 border border-gray-200">
                          {commonSearchQueries.map((query) => (
                            <div
                              key={query}
                              className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-gray-700 hover:text-[#FF7439]"
                              onClick={() => handleSearchSuggestionClick(query)}
                            >
                              {query}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Category */}
                  <div className="flex-1 flex justify-center items-center flex-col border-r px-4">
                    <div className="text-center w-full">
                      <p className="text-[14px] font-semibold text-[#777777]">
                        Category
                      </p>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="text-center w-full">
                            <p
                              className={`text-[16px] ${selectedCategory ? "text-[#FF7439] font-semibold" : "text-[#777777] font-light"}`}
                            >
                              {selectedCategory || "All Categories"}
                            </p>
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="p-2">
                          <Categories onSelect={handleCategorySelect} selectedCategory={selectedCategory} />
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>

                  {/* Distance from Rice. */}
                  <div className="flex-1 flex justify-center items-center flex-col border-r px-4">
                    <div className="text-center w-full">
                      <p className="text-[14px] font-semibold text-[#777777]">
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
                      />
                    </div>
                  </div>

                  {/* Start Date. */}
                  <div className="flex-1 flex justify-center items-center flex-col border-r px-4">
                    <div className="text-center w-full">
                      <p className="text-[14px] font-semibold text-[#777777]">
                        Start Date
                      </p>
                      <Popover>
                        <PopoverTrigger asChild>
                          <button className="text-center w-full">
                            <p
                              className={`text-[16px] ${
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
                  <div className="flex-1 flex justify-center items-center flex-col px-4">
                    <div className="text-center w-full">
                      <p className="text-[14px] font-semibold text-[#777777]">
                        End Date
                      </p>
                      <Popover>
                        <PopoverTrigger asChild>
                          <button className="text-center w-full">
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

                {/* Search icon for visual indication */}
                <div className="pr-8">
                  <FaMagnifyingGlass className="h-[22px] w-[22px] text-[#FF7439]" />
                </div>
              </div>
            </div>
          </motion.div>
        )}
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
            <div className="p-4 pl-10 text-white space-y-6 flex flex-col text-[18px] mt-12">
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 text-white"
              >
                <FaTimes className="w-6 h-6" />
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
                <FaTimes className="w-6 h-6" />
                <span>Logout</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdvancedNavbar;
