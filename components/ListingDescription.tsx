import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import ListingMap from './ListingMap';

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
        <h3 className="font-medium text-gray-900">{title}</h3>
        <p className="text-gray-600 text-sm">{description}</p>
      </div>
    </motion.div>
  )
}

const SectionNavigator = ({ section, onClick }: { section: string, onClick: () => void }) => {
  return (
    <button
      key={section}
      onClick={onClick}
      className={`
        flex space-x-4 w-full 
        text-sm font-medium 
        border-b-2 pb-1 
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

  const descriptionRef = useRef<HTMLDivElement>(null);
  const detailsRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
    });
  };

  const scrollToSection = (ref: React.RefObject<HTMLDivElement>) => {
    ref.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const geocodeAddress = async (address: string) => {
    if (!address) {
      throw new Error("Valid address is required");
    }
    try {
      const API_KEY = process.env.NEXT_PUBLIC_GEOCODE_API_KEY;
      const response = await fetch(`https://geocode.maps.co/search?q=${address}&api_key=${API_KEY}`);
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
        const geoData = await geocodeAddress(data.location);
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
  }, [data.location])

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
        className='flex flex-row items-center justify-between mb-4'
      >
        <SectionNavigator
          onClick={() => scrollToSection(descriptionRef)}
          section={'Description'}
        />
        <SectionNavigator
          onClick={() => scrollToSection(detailsRef)}
          section={'Details'}
        />
        <SectionNavigator
          onClick={() => scrollToSection(mapRef)}
          section={'Map'}
        />
      </motion.div>

      {/* Description */}
      <div
        ref={descriptionRef}>
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className='text-xl sm:text-xl font-bold mb-4'
        >
          Description
        </motion.h1>
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className='text-md sm:text-md font-medium'
        >
          {data.location}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-gray-700 text-sm leading-relaxed mt-4 mb-6 break-words whitespace-pre-wrap"
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
        className="border-t pt-6 mb-6"
      >
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-xl font-semibold"
        >
          Details
        </motion.h2>
        <div className="space-y-6">
          <DescriptionItem
            icon={<img src="/bed.svg" alt="Duration Icon" className="w-[40px] h-[40px]" />}
            title="# of Beds and Baths"
            description={`${data.bed_num} beds, ${data.bath_num} baths`}
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
            icon={<img src="/mdi_location.svg" alt="Duration Icon" className="w-[40px] h-[40px]" />}
            title="Distance from Rice"
            description={`${data.distance} miles away`}
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
        className="border-t pt-6 mb-6"
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
          Use this map to help you locate the distance between this listing and Rice. Adjust the location of the Green Pin to adjust the distance calculation!
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="text-sm text-gray-600 mb-4">
          <span className='font-semibold'>Red pin</span>: Listing
          <br />
          <span className='font-semibold'>Green pin</span>: Rice University
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