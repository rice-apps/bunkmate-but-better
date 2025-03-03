"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { 
  FaFilter, 
  FaBed, 
  FaBath, 
  FaDollarSign, 
  FaTimes 
} from "react-icons/fa";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogClose
} from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

const Categories = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isScrolled, setIsScrolled] = useState(false);
  
  // Filter states
  const [minPrice, setMinPrice] = useState<number>(500);
  const [maxPrice, setMaxPrice] = useState<number>(3000);
  const [bedrooms, setBedrooms] = useState<number | null>(null);
  const [bathrooms, setBathrooms] = useState<number | null>(null);

  useEffect(() => {
    // Initialize from URL params
    const minPriceParam = searchParams.get("minPrice");
    if (minPriceParam) setMinPrice(parseInt(minPriceParam));
    
    const maxPriceParam = searchParams.get("maxPrice");
    if (maxPriceParam) setMaxPrice(parseInt(maxPriceParam));
    
    const bedroomsParam = searchParams.get("bedrooms");
    if (bedroomsParam) setBedrooms(parseInt(bedroomsParam));
    
    const bathroomsParam = searchParams.get("bathrooms");
    if (bathroomsParam) setBathrooms(parseInt(bathroomsParam));
    
    // Add scroll event listener
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [searchParams]);

  const updateUrlParams = (param: string, value: string | number | null) => {
    const queryParams = new URLSearchParams(window.location.search);
    
    if (value === null) {
      queryParams.delete(param);
    } else {
      queryParams.set(param, value.toString());
    }
    
    const queryString = queryParams.toString();
    router.push(`/?${queryString}`);
  };

  const applyFilters = () => {
    const queryParams = new URLSearchParams(window.location.search);
    
    queryParams.set("minPrice", minPrice.toString());
    queryParams.set("maxPrice", maxPrice.toString());
    
    if (bedrooms !== null) {
      queryParams.set("bedrooms", bedrooms.toString());
    } else {
      queryParams.delete("bedrooms");
    }
    
    if (bathrooms !== null) {
      queryParams.set("bathrooms", bathrooms.toString());
    } else {
      queryParams.delete("bathrooms");
    }
    
    const queryString = queryParams.toString();
    router.push(`/?${queryString}`);
  };

  const resetFilters = () => {
    setMinPrice(500);
    setMaxPrice(3000);
    setBedrooms(null);
    setBathrooms(null);
    
    const queryParams = new URLSearchParams(window.location.search);
    queryParams.delete("minPrice");
    queryParams.delete("maxPrice");
    queryParams.delete("bedrooms");
    queryParams.delete("bathrooms");
    
    const queryString = queryParams.toString();
    router.push(`/?${queryString}`);
  };

  return (
    <div className={`sticky top-[60px] z-30 bg-white shadow-sm transition-shadow duration-300 ${isScrolled ? 'shadow-md' : ''}`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-2">
          <div className="flex-1"></div>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="ml-4 flex items-center gap-2 rounded-full border border-gray-300 px-4 py-2 hover:shadow-md">
                <FaFilter className="h-4 w-4" />
                <span className="font-medium">Filters</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold">Filters</DialogTitle>
              </DialogHeader>
              
              <div className="space-y-6 py-4">
                {/* Price Range */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <FaDollarSign className="mr-2 text-[#FF7439]" />
                    Price Range
                  </h3>
                  <div className="px-2">
                    <div className="mb-6">
                      <p className="text-sm font-medium mb-2">Minimum Price</p>
                      <Slider
                        defaultValue={[minPrice]}
                        min={0}
                        max={5000}
                        step={100}
                        onValueChange={(values) => {
                          setMinPrice(values[0]);
                        }}
                        className="my-4"
                      />
                      <div className="border rounded-md p-2 w-24 text-center">
                        ${minPrice}
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <p className="text-sm font-medium mb-2">Maximum Price</p>
                      <Slider
                        defaultValue={[maxPrice]}
                        min={0}
                        max={5000}
                        step={100}
                        onValueChange={(values) => {
                          setMaxPrice(values[0]);
                        }}
                        className="my-4"
                      />
                      <div className="border rounded-md p-2 w-24 text-center">
                        ${maxPrice}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Bedrooms */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <FaBed className="mr-2 text-[#FF7439]" />
                    Bedrooms
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {[null, 1, 2, 3, 4, 5].map((num, index) => (
                      <Button
                        key={index}
                        variant={bedrooms === num ? "default" : "outline"}
                        className={bedrooms === num ? "bg-[#FF7439] hover:bg-[#FF7439]/90" : ""}
                        onClick={() => setBedrooms(num)}
                      >
                        {num === null ? "Any" : num === 5 ? "5+" : num}
                      </Button>
                    ))}
                  </div>
                </div>
                
                {/* Bathrooms */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <FaBath className="mr-2 text-[#FF7439]" />
                    Bathrooms
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {[null, 1, 2, 3, 4].map((num, index) => (
                      <Button
                        key={index}
                        variant={bathrooms === num ? "default" : "outline"}
                        className={bathrooms === num ? "bg-[#FF7439] hover:bg-[#FF7439]/90" : ""}
                        onClick={() => setBathrooms(num)}
                      >
                        {num === null ? "Any" : num === 4 ? "4+" : num}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between mt-6">
                <Button variant="outline" onClick={resetFilters}>
                  Clear All
                </Button>
                <DialogClose asChild>
                  <Button className="bg-[#FF7439] hover:bg-[#FF7439]/90" onClick={applyFilters}>
                    Apply Filters
                  </Button>
                </DialogClose>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default Categories;
