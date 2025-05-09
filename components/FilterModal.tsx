"use client";

import React, { useState, useEffect } from "react";
import { FaTimes, FaMinus, FaPlus } from "react-icons/fa";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  minPrice: number;
  maxPrice: number;
  bedNum: number;
  bathNum: number;
  setMinPrice: (price: number) => void;
  setMaxPrice: (price: number) => void;
  setBedNum: (num: number) => void;
  setBathNum: (num: number) => void;
  applyFilters: () => void;
  distance: string;
  setDistance: (distance: string) => void;
  selectedLeaseDuration: string | null;
  setSelectedLeaseDuration: (duration: string | null) => void;
  selectedLocation: string | null;
  setSelectedLocation: (location: string | null) => void;
  startDate: Date | undefined;
  endDate: Date | undefined;
  setStartDate: (date: Date | undefined) => void;
  setEndDate: (date: Date | undefined) => void;
  leaseDurationOptions: Array<{
    label: string;
    value: string;
    startDate: Date;
    endDate: Date;
  }>;
  searchQuery?: string;
  setSearchQuery?: (query: string) => void;
}

const FilterModal: React.FC<FilterModalProps> = ({
  isOpen,
  onClose,
  minPrice,
  maxPrice,
  bedNum,
  bathNum,
  setMinPrice,
  setMaxPrice,
  setBedNum,
  setBathNum,
  distance,
  setDistance,
  applyFilters,
  selectedLeaseDuration,
  setSelectedLeaseDuration,
  selectedLocation,
  setSelectedLocation,
  startDate,
  endDate,
  setStartDate,
  setEndDate,
  leaseDurationOptions,
  searchQuery = "",
  setSearchQuery,
}) => {
  const router = useRouter();
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);
  // const [distance, setDistance] = useState("");
  const distanceTitle = "Search properties";
  
  // Update local state when prop changes
  useEffect(() => {
    setLocalSearchQuery(searchQuery);
  }, [searchQuery]);
  
  if (!isOpen) return null;

  const handleNumberChange = (
    setter: (num: number) => void,
    value: number,
    min: number,
    max: number
  ) => {
    if (value >= min && value <= max) {
      setter(value);
    }
  };

  const handleLeaseDurationChange = (option: { value: string, startDate: Date, endDate: Date }) => {
    const newDuration = selectedLeaseDuration === option.value ? null : option.value;
    setSelectedLeaseDuration(newDuration);
    
    // Update start and end dates when lease duration changes
    if (newDuration) {
      setStartDate(option.startDate);
      setEndDate(option.endDate);
    } else {
      setStartDate(undefined);
      setEndDate(undefined);
    }
  };

  const getCurrentYear = () => {
    const now = new Date();
    // If we're past July, use next year for academic year calculations
    return now.getMonth() >= 6 ? now.getFullYear() : now.getFullYear() - 1;
  };

  const popularLocations = [
    { label: "Life Tower", value: "Life Tower" },
    { label: "Latitude", value: "Latitude" },
    { label: "Nest", value: "Nest" },
    { label: "Bolsover", value: "Bolsover" },
    { label: "Circle at Hermann Park", value: "Circle at Hermann" },
  ];

  const clearAllFilters = () => {
    // Reset all state values
    setBedNum(0);
    setBathNum(0);
    setMinPrice(0);
    setMaxPrice(0);
    setDistance(distanceTitle);
    setSelectedLeaseDuration(null);
    setSelectedLocation(null);
    setStartDate(undefined);
    setEndDate(undefined);
    setLocalSearchQuery("");
    if (setSearchQuery) {
      setSearchQuery("");
    }
    
    // Clear URL parameters
    router.push("/");

  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalSearchQuery(e.target.value);
  };

  const handleSearchSubmit = () => {
    if (setSearchQuery) {
      setSearchQuery(localSearchQuery);
    }
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && setSearchQuery) {
      setSearchQuery(localSearchQuery);
      applyFilters();
      onClose();
    }
  };

  const clearSearch = () => {
    setLocalSearchQuery("");
    if (setSearchQuery) {
      setSearchQuery("");
    }
  };

  const handleApplyFilters = () => {
    // If a location is selected, use it as the search query
    // This takes precedence over any manual search query
    let finalSearchQuery = localSearchQuery;
    if (selectedLocation) {
      finalSearchQuery = selectedLocation;
    }
    
    if (setSearchQuery) {
      setSearchQuery(finalSearchQuery);
    }
    
    const queryParams = new URLSearchParams(window.location.search);
    
    if (finalSearchQuery.trim()) {
      queryParams.set('search', finalSearchQuery);
    } else {
      queryParams.delete('search');
    }
    
    if (minPrice > 0) queryParams.set("minPrice", minPrice.toString());
    if (maxPrice > 0) queryParams.set("maxPrice", maxPrice.toString());
    if (bedNum > 0) queryParams.set("bedNum", bedNum.toString());
    if (bathNum > 0) queryParams.set("bathNum", bathNum.toString());
    
    // Set lease duration parameter
    if (selectedLeaseDuration) {
      queryParams.set("leaseDuration", selectedLeaseDuration);
    } else {
      queryParams.delete("leaseDuration");
    }
    
    // Always set start and end dates based on current values
    if (startDate) {
      queryParams.set("startDate", startDate.toISOString());
    } else {
      queryParams.delete("startDate");
    }
    
    if (endDate) {
      queryParams.set("endDate", endDate.toISOString());
    } else {
      queryParams.delete("endDate");
    }
    
    // Add distance parameter if it's set and not the default title
    if (distance && distance !== distanceTitle) {
      queryParams.set("distance", distance);
    } else {
      queryParams.delete("distance");
    }
    
    // We don't need to set selectedLocation separately since we're using it as the search query
    // But we'll keep it for reference in case you want to filter by both search and location separately later
    if (selectedLocation) {
      queryParams.set("selectedLocation", selectedLocation);
    } else {
      queryParams.delete("selectedLocation");
    }
    
    const queryString = queryParams.toString();
    router.push(`/?${queryString}`);
    
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-2xl p-6 w-full max-w-2xl mx-4 relative max-h-[80vh] lg:max-h-[95vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-6 top-6 text-gray-500 hover:text-gray-700"
        >
          <FaTimes className="w-6 h-6" />
        </button>

        <div className="flex justify-center items-center mt-2">
          <h2 className="hidden lg:block text-2xl font-semibold text-center text-[#FF7439]">Advanced Filters</h2>
          <h2 className="block lg:hidden text-2xl font-semibold text-center text-[#FF7439]">Filters</h2>
        </div>

        {/* Add Search Bar */}
        <div className="mb-8 mt-6">
          <h2 className="text-xl text-neutral-800 mb-3">Search</h2>
          <div className="relative flex items-center">
            <FaMagnifyingGlass className="absolute left-3 text-gray-400 w-4 h-4" />
            <input
              type="text"
              value={localSearchQuery}
              onChange={handleSearchChange}
              onKeyDown={handleSearchKeyDown}
              placeholder="Search by name or location..."
              className="w-full pl-10 pr-10 py-2 border bg-white rounded-lg focus:outline-none focus:border-[#FF7439]"
            />
            {localSearchQuery && (
              <button
                onClick={clearSearch}
                className="absolute right-3 text-gray-400 hover:text-gray-600"
              >
                <FaTimes className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        <hr className="lg:hidden"></hr>

        {/* Distance from Rice - Only show on mobile */}
        <div className="space-y-6 mt-6 mb-8 lg:hidden">
          <h2 className="text-xl text-neutral-800 mb-3">Distance from Rice</h2>
          <div>
            <div className="text-left w-full">
              <p
                className={`text-[16px] ${distance !== distanceTitle ? "text-[#FF7439] font-semibold" : "text-[#777777] font-light"}`}
              >
                {distance}
              </p>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {["< 1 mile", "< 3 miles", "< 5 miles", "> 5 miles"].map((option) => (
                  <button
                    key={option}
                    className={`p-3 text-sm rounded-lg border transition-colors ${
                      distance === option
                        ? "bg-[#FFE3D7] text-[#FF7439] font-semibold border-[#FF7439]"
                        : "bg-white text-neutral-700 hover:bg-gray-200"
                    }`}
                    onClick={() => setDistance(distance === option ? distanceTitle : option)}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <hr className="lg:hidden"></hr>

        {/* Price Range - Only show on mobile */}
        <div className="space-y-6 mt-6 mb-8 lg:hidden">
          <h2 className="text-xl text-neutral-800 mb-3">Price Range</h2>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="text-neutral-500 text-sm mb-2 block">Min Price ($)</label>
              <input
                type="number"
                value={minPrice || ''}
                onChange={(e) => setMinPrice(Number(e.target.value))}
                className="w-full p-3 border bg-white rounded-lg focus:outline-none focus:border-[#FF7439]"
                placeholder="0"
              />
            </div>
            <div className="flex-1">
              <label className="text-neutral-500 text-sm mb-2 block">Max Price ($)</label>
              <input
                type="number"
                value={maxPrice || ''}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full p-3 border bg-white rounded-lg focus:outline-none focus:border-[#FF7439]"
                placeholder="No max"
              />
            </div>
          </div>
        </div>

        <hr className="lg:hidden"></hr>

        {/* Date Range - Only show on mobile */}
        <div className="space-y-6 mt-6 mb-8 lg:hidden">
          <h2 className="text-xl text-neutral-800 mb-3">Date Range</h2>
          
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

        <hr className="lg:hidden"></hr>

        {/* Beds and Baths */}
        <div className="space-y-6 mt-6 mb-8">
          <h2 className="text-xl text-neutral-800">Beds and Baths</h2>
          <div className="flex flex-col gap-6">
            {/* Beds */}
            <div className="flex items-center gap-2 justify-between">
              <label className="text-neutral-500">Bedrooms</label>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleNumberChange(setBedNum, bedNum - 1, 0, 10)}
                  className="p-2 rounded-full hover:bg-gray-100"
                >
                  <FaMinus className="text-[#FF7439]" />
                </button>
                <span className="font-medium w-8 text-center">
                  {bedNum}
                </span>
                <button
                  onClick={() => handleNumberChange(setBedNum, bedNum + 1, 0, 10)}
                  className="p-2 rounded-full hover:bg-gray-100"
                >
                  <FaPlus className="text-[#FF7439]" />
                </button>
              </div>
            </div>

            {/* Baths */}
            <div className="flex items-center gap-2 justify-between">
              <label className="text-neutral-500">Bathrooms</label>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleNumberChange(setBathNum, bathNum - 1, 0, 10)}
                  className="p-2 rounded-full hover:bg-gray-100"
                >
                  <FaMinus className="text-[#FF7439]" />
                </button>
                <span className="font-medium w-8 text-center">
                  {bathNum}
                </span>
                <button
                  onClick={() => handleNumberChange(setBathNum, bathNum + 1, 0, 10)}
                  className="p-2 rounded-full hover:bg-gray-100"
                >
                  <FaPlus className="text-[#FF7439]" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <hr></hr>

        {/* Lease Duration and Popular Locations in a responsive grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mt-6">
          {/* Lease Duration */}
          <div className="space-y-6">
            <h2 className="text-xl text-neutral-800">Lease Duration</h2>
            <div className="grid grid-cols-2 gap-2">
              {leaseDurationOptions.map((option) => (
                <button
                  key={option.value}
                  className={`p-3 text-sm rounded-lg border transition-colors ${
                    selectedLeaseDuration === option.value
                      ? "bg-[#FFE3D7] text-[#FF7439] font-semibold border-[#FF7439]"
                      : "bg-white text-neutral-700 hover:bg-gray-200"
                  }`}
                  onClick={() => handleLeaseDurationChange(option)}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Popular Locations */}
          <div className="space-y-6">
            <h2 className="text-xl text-neutral-800">Popular Locations</h2>
            <div className="grid grid-cols-2 gap-2">
              {popularLocations.map((location) => (
                <button
                  key={location.value}
                  className={`p-3 text-sm rounded-lg border transition-colors ${
                    selectedLocation === location.value
                      ? "bg-[#FFE3D7] text-[#FF7439] font-semibold border-[#FF7439]"
                      : "bg-white text-neutral-700 hover:bg-gray-200"
                  }`}
                  onClick={() => {
                    setSelectedLocation(
                      selectedLocation === location.value ? null : location.value
                    );
                  }}
                >
                  {location.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom two buttons! */}
        <div className="flex flex-row gap-5">
          {/* Clear All Button */}
          <button
            onClick={clearAllFilters}
            className="w-full mt-8 py-3 bg-[#CC3233] text-white rounded-md hover:bg-[#8E1F20] transition-colors"
          >
            Clear all
          </button>
          {/* Apply Button */}
          <button
            onClick={handleApplyFilters}
            className="w-full mt-8 py-3 bg-[#FF7439] text-white rounded-md hover:bg-[#BB5529] transition-colors"
          >
            Apply Filters
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default FilterModal; 