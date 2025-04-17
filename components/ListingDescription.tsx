import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import ListingMap from './ListingMap';
import { FaHouseUser, FaRegUser, FaRegUserCircle } from "react-icons/fa";
import { Pin } from '@vis.gl/react-google-maps';
import { FaLocationPin } from 'react-icons/fa6';

type DescriptionItemProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay?: number;
}

const DescriptionItem = ({ icon, title, description, delay = 0 }: DescriptionItemProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay }}
      className="flex items-center gap-4"
    >
      <div className="p-2 rounded-full bg-gray-50 shrink-0">
        {icon}
      </div>
      <div>
        <h3 className="font-semibold text-gray-900 mb-1">{title}</h3>
        <p className="text-gray-600 text-sm font-light">{description}</p>
      </div>
    </motion.div>
  )
}

const SectionNavigator = ({ section, onClick, isActive }: { section: string, onClick: () => void, isActive: boolean }) => {
  return (
    <button
      key={section}
      onClick={onClick}
      className={`
        flex space-x-4 w-full 
        text-sm font-normal 
        border-b pb-1 
        border-gray-300 hover:border-gray-500 
        text-gray-500 hover:text-gray-900 
        transition-all duration-200
      `} >
      {section}
    </button>
  )
}

interface ListingDescriptionProps {
  data: {
    location: string;
    description: string;
    price: number;
    priceNotes: string;
    start_date: string;
    end_date: string;
    durationNotes: string;
    distance?: number;
    bed_num: number;
    bath_num: number;
  };
}

const ListingDescription: React.FC<ListingDescriptionProps> = ({ data }) => {
  const [geocodeData, setGeocodeData] = useState<{ lat: number; lng: number } | null>(null);
  const [activeSection, setActiveSection] = useState<'description' | 'details' | 'map'>('description');

  const descriptionRef = useRef<HTMLDivElement>(null);
  const detailsRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
    });
  };

  const scrollToSection = (ref: React.RefObject<HTMLDivElement | null> ) => {
    ref.current?.scrollIntoView({ behavior: 'smooth' });
  };


  const geocodeAddress = async (address: string) => {
    if (!address) {
      throw new Error("Valid address is required");
    }
    try {
      const API_KEY = process.env.NEXT_PUBLIC_GEOCODE_API_KEY;
      const response = await fetch(`https://geocode.maps.co/search?q=${encodeURI(address)}&api_key=${API_KEY}`);
      if (!response.ok) {
        throw new Error("Failed to geocode address");
      }
      const data = await response.json();
      if (data && data.length > 0) {
        return {
          lat: data[0].lat,
          lon: data[0].lon,
        };
      } else {
        throw new Error("No results found");
      }
    } catch (error) {
      console.error("Error geocoding address:", error);
      throw error;
    }
  };

  const geocodeNominatimAddress = async (address: string) => {
    if (!address) {
      throw new Error("Valid address is required");
    }
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURI(address)}&format=json`);
      if (!response.ok) {
        throw new Error("Failed to geocode address");
      }
      const data = await response.json();
      if (data && data.length > 0) {
        return {
          lat: data[0].lat,
          lon: data[0].lon,
        };
      } else {
        throw new Error("No results found");
      }
    } catch (error) {
      console.error("Error geocoding address:", error);
      throw error;
    }
  };

  useEffect(() => {
    const fetchGeocodeData = async () => {
      try {
        const geoData = await geocodeNominatimAddress(data.location);
        // Convert from lon to lng for Google Maps
        setGeocodeData({
          lat: parseFloat(geoData.lat),
          lng: parseFloat(geoData.lon)
        });
      } catch (error) {
        console.error('Error fetching geocode data:', error);
      }
    };

    fetchGeocodeData();
  }, [])

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: '-50px 0px',
      threshold: 0.1
    };

    const callback: IntersectionObserverCallback = (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          if (entry.target === descriptionRef.current) {
            setActiveSection('description');
          } else if (entry.target === detailsRef.current) {
            setActiveSection('details');
          } else if (entry.target === mapRef.current) {
            setActiveSection('map');
          }
        }
      });
    };

    const observer = new IntersectionObserver(callback, options);
    
    if (descriptionRef.current) observer.observe(descriptionRef.current);
    if (detailsRef.current) observer.observe(detailsRef.current);
    if (mapRef.current) observer.observe(mapRef.current);

    return () => {
      observer.disconnect();
    };
  }, []);


  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className=""
    >
      {/* Section Navigator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className='flex flex-row items-center justify-between sticky top-0 pt-4 bg-white'
      >
        <SectionNavigator
          onClick={() => {
            if (typeof window !== 'undefined' && descriptionRef?.current) {
              scrollToSection(descriptionRef);
            }
          }}
          section={'Description'}
          isActive={activeSection === 'description'}
        />
        <SectionNavigator
          onClick={() => {
            if (typeof window !== 'undefined' && detailsRef?.current) {
              scrollToSection(detailsRef);
            }
          }}
          section={'Details'}
          isActive={activeSection === 'details'}
        />
        <SectionNavigator
          onClick={() => {
            if (typeof window !== 'undefined' && mapRef?.current) {
              scrollToSection(mapRef);
            }
          }}
          section={'Map'}
          isActive={activeSection === 'map'}
        />
      </motion.div>

      {/* Description */}
      <div
        ref={descriptionRef}>
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className='text-xl sm:text-xl font-bold mb-4 pt-12'
        >
          Description
        </motion.h1>
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className='text-md sm:text-md font-semibold'
        >
          {data.location}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-gray-700 text-sm leading-relaxed mt-6 mb-8 break-words whitespace-pre-wrap"
        >
          {data.description}
        </motion.p>
      </div>

      {/* Details */}
      <motion.div
        ref={detailsRef}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="border-t pt-10 mb-6"
      >
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-xl font-semibold mb-6"
        >
          Details
        </motion.h2>
        <div className="space-y-5">
          <DescriptionItem
            icon={<img src="/bed.svg" alt="Duration Icon" className="w-[40px] h-[40px]" />}
            title="# of Beds and Baths"
            description={`${data.bed_num} bed${data.bed_num != 1 ? "s" : ""}, ${data.bath_num} bath${data.bath_num != 1 ? "s" : ""}`}
            delay={0.5}
          />

          <DescriptionItem
            icon={<img src="/solar_dollar-linear.svg" alt="Duration Icon" className="w-[40px] h-[40px]" />}
            title="Cost per month"
            description={`$${data.price.toLocaleString()} / month${data.priceNotes ? ` — ${data.priceNotes}` : ''}`}
            delay={0.5}
          />

          <DescriptionItem
            icon={<img src="/bx_time-five.svg" alt="Duration Icon" className="w-[40px] h-[40px]" />}
            title="Duration being leased"
            description={`${formatDate(data.start_date)} to ${formatDate(data.end_date)}${data.durationNotes ? ` — ${data.durationNotes}` : ''}`}
            delay={0.6}
          />

          <DescriptionItem
            icon={<img src="/mdi_location.svg" alt="Distance Icon" className="w-[40px] h-[40px]" />}
            title="Distance from Rice"
            description={`${data.distance} mile${data.distance !== 1 ? "s" : ""} away`}
            delay={0.7}
          />
        </div>
      </motion.div>

      {/* Map Section */}
      <motion.div
        ref={mapRef}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="border-t pt-10 mb-6"
      >
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-xl font-semibold mb-4">
          Map
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-sm text-gray-600 mb-4">
          Use this map to help you locate the distance between this listing and Rice. <br /> <br />
          Click to adjust the location of the <b>white pin</b> to adjust the distance calculation! Note that it's defaulted to Rice University. 
        </motion.p>

        {geocodeData ? (
          <div className="overflow-hidden rounded-lg">
            <ListingMap name={data.location} coords={geocodeData} />
          </div>
        ) : (
          <div className="w-full h-[400px] flex items-center justify-center bg-gray-100 rounded-lg">
            <p className="text-gray-500">Location map unavailable</p>
          </div>
        )}
      </motion.div>
    </motion.div>
  )
}

export default ListingDescription