"use client";

import React, { useState, useEffect } from "react";
import { FaTimes, FaMinus, FaPlus } from "react-icons/fa";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

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

  const handleLeaseDurationChange = (option: { value: string, startDate: Date | null, endDate: Date | null }) => {
    const newDuration = selectedLeaseDuration === option.value ? null : option.value;
    setSelectedLeaseDuration(newDuration);
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
    { label: "Circle at Hermann Park", value: "Circle at Hermann" },
    { label: "Bolsover", value: "Bolsover" },
  ];

  const clearAllFilters = () => {
    // Reset all state values
    setBedNum(0);
    setBathNum(0);
    setMinPrice(0);
    setMaxPrice(0);
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
        className="bg-white rounded-3xl p-6 w-full max-w-2xl mx-4 relative max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-6 top-6 text-gray-500 hover:text-gray-700"
        >
          <FaTimes className="w-6 h-6" />
        </button>

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-[#FF7439]">Advanced Filters</h2>
        </div>

        <button
          onClick={clearAllFilters}
          className="text-[#FF7439] hover:underline font-medium mb-2"
        >
          Clear all
        </button>

        {/* Price Range */}
        <div className="block lg:hidden space-y-6 mb-8">
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

        {/* Rooms and Beds */}
        <div className="space-y-6 mb-8">
          <h2 className="text-xl text-neutral-800 mb-3">Rooms and Beds</h2>
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

        {/* Lease Duration and Popular Locations in a responsive grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {/* Lease Duration */}
          <div className="space-y-6">
            <h2 className="text-xl text-neutral-800 mb-3">Lease Duration</h2>
            <div className="grid grid-cols-2 gap-2">
              {leaseDurationOptions.map((option) => (
                <button
                  key={option.value}
                  className={`p-3 text-sm rounded-lg border transition-colors ${
                    selectedLeaseDuration === option.value
                      ? "bg-[#FF7439] text-white border-[#FF7439]"
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
            <h2 className="text-xl text-neutral-800 mb-3">Popular Locations</h2>
            <div className="grid grid-cols-2 gap-2">
              {popularLocations.map((location) => (
                <button
                  key={location.value}
                  className={`p-3 text-sm rounded-lg border transition-colors ${
                    selectedLocation === location.value
                      ? "bg-[#FF7439] text-white border-[#FF7439]"
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

        {/* Add Search Bar */}
        <div className="mb-8 mt-8">
          <h2 className="text-xl text-neutral-800 mb-3">Search</h2>
          <div className="relative flex items-center">
            <FaMagnifyingGlass className="absolute left-3 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={localSearchQuery}
              onChange={handleSearchChange}
              onKeyDown={handleSearchKeyDown}
              placeholder="Search by name or location..."
              className="w-full pl-10 pr-10 py-3 border bg-white rounded-lg focus:outline-none focus:border-[#FF7439]"
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

        {/* Apply Button */}
        <button
          onClick={() => {
            handleSearchSubmit();
            applyFilters();
            onClose();
          }}
          className="w-full mt-8 py-3 bg-[#FF7439] text-white rounded-lg hover:bg-[#BB5529] transition-colors"
        >
          Apply Filters
        </button>
      </motion.div>
    </motion.div>
  );
};

export default FilterModal; 