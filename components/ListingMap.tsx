import { APIProvider, Map, AdvancedMarker, Pin, MapMouseEvent } from "@vis.gl/react-google-maps";
import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { MdOutlineOpenInNew } from "react-icons/md";
import { FaHouseUser, FaMapMarker, FaRegUserCircle } from "react-icons/fa";
import { FaHouse } from "react-icons/fa6";

interface ListingMapProps {
  name: string;
  coords: { lat: number, lng: number };
}

const calculateStraightLineDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const toRadians = (degree: number) => degree * (Math.PI / 180);
  const lat1Rad = toRadians(lat1);
  const lon1Rad = toRadians(lon1);
  const lat2Rad = toRadians(lat2);
  const lon2Rad = toRadians(lon2);

  const dLat = lat2Rad - lat1Rad;
  const dLon = lon2Rad - lon1Rad;

  const a =
    Math.pow(Math.sin(dLat / 2), 2) +
    Math.cos(lat1Rad) * Math.cos(lat2Rad) * Math.pow(Math.sin(dLon / 2), 2);
  const rad = 6371; // earths radius in km
  const c = 2 * Math.asin(Math.sqrt(a));
  const miles = rad * c * 0.621371;
  return parseFloat(miles.toFixed(1));
};

const ListingMap: React.FC<ListingMapProps> = ({ name, coords }) => {
  const initialCoords = { lat: 29.717081272326745, lng: -95.40363313442711 };
  const [destination, setDestination] = useState<{ lat: number, lng: number }>(initialCoords);
  const [distance, setDistance] = useState<number | null>(calculateStraightLineDistance(coords.lat, coords.lng, initialCoords.lat, initialCoords.lng));

  const handleMapClick = async (event: MapMouseEvent) => {
    const position = event.detail.latLng;
    if (!position) return;

    const lat = position.lat;
    const lng = position.lng;
    const dest = { lat, lng };
    setDestination(dest);
    const distance = calculateStraightLineDistance(coords.lat, coords.lng, lat, lng);
    setDistance(distance);
  }

  return (
    <APIProvider
      apiKey={process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY || ""}
    >
      <motion.div
        className="w-full h-[450px] relative"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Map
          style={{ width: '100%', height: '100%' }}
          defaultCenter={coords}
          defaultZoom={14}
          gestureHandling={'greedy'}
          disableDefaultUI={true}
          mapId={name}
          onClick={handleMapClick}
        >
          <AdvancedMarker position={coords}>
            <Pin
              scale={1.25}
              background={'#000'}
              borderColor={'#000000'}
            >
              <div>
                <FaHouseUser className="text-lg text-white" />
              </div>
            </Pin>
          </AdvancedMarker>

          <AdvancedMarker
            position={destination}
          >
            <motion.div
              initial={{ y: -10, scale: 0.9 }}
              animate={{ y: 0, scale: 1.2 }}
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 20,
                duration: 0.6
              }}
            >

              <Pin
                scale={1.25}
                background={'#ffffff'}
                borderColor={'#000000'}

              >
                <div className="p-[2px] bg-white rounded-full">
                  <FaRegUserCircle className="text-lg" />
                </div>
              </Pin>
            </motion.div>
          </AdvancedMarker>
        </Map>

        {/* Key */}
        <div className='flex flex-col items-start absolute top-4 left-4 bg-gray-800 bg-opacity-60 px-3 py-2 rounded-lg shadow-xl '>
          {/* <p className='text-sm text-gray-600'>Click on the map to set a destination</p> */}

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mb-4 text-white text-xs space-y-2">
            <div className='flex flex-row items-center space-x-2'>
              <div className="relative">
                <FaMapMarker className="text-3xl text-[#000]"/>
                <FaHouseUser className="absolute top-[5px] right-[9px] text-md text-white"/>
              </div>
              <p className=''>Listing</p>
            </div>

            <div className='flex flex-row items-center space-x-2'>
            <div className="relative">
                <FaMapMarker className="text-3xl text-white"/>
                <FaRegUserCircle className="absolute top-[5px] right-[9px] text-md text-black"/>
              </div>
              <p className=''>Drop Location</p>
            </div>
          </motion.div>

          {distance && (<p className='text-sm text-white font-bold'>Distance: ({distance} mi)</p>)}
        </div>

        {/* Open in Google Maps */}
        <div className='absolute top-4 right-4'>
          <button className='flex flew-row items-center bg-gray-800 bg-opacity-60 py-2 px-3 shadow-xl rounded-lg hover:bg-opacity-80 transition duration-200'
            onClick={() => {
              if (destination) {
                window.open(`https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(name)}&destination=${destination.lat},${destination.lng}&travelmode=walking`, "_blank");
              }
            }}>
            <p className='mr-2 text-sm hidden md:block text-white text-bold'>Open in Google Maps</p>
            <MdOutlineOpenInNew className='text-xl text-white' />
          </button>
        </div>

      </motion.div>
    </APIProvider >
  );
};

export default ListingMap;