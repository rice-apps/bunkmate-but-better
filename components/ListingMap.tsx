import { APIProvider, Map, AdvancedMarker, Pin } from "@vis.gl/react-google-maps";
import { motion } from "framer-motion";
import React from "react";

interface ListingMapProps {
  name: string;
  coords: { lat: number, lng: number };
}

const ListingMap: React.FC<ListingMapProps> = ({ name, coords }) => {
  return (
    <APIProvider
      apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""}
      libraries={["places"]}
    >
      <motion.div
        className="w-full h-[600px] my-12 rounded-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}>
          Location on the Map
        </motion.h2>
        <Map
          style={{ width: '100%', height: '100%' }}
          defaultCenter={coords}
          defaultZoom={15}
          gestureHandling={'greedy'}
          disableDefaultUI={true}
          mapId={name}
        >
          <AdvancedMarker
            position={coords}
          >
            <Pin />
          </AdvancedMarker>

          <AdvancedMarker
            position={{ lat: 29.717081272326745, lng: -95.40363313442711 }}
          >
            
            <Pin
              background={'#0f9d58'}
              borderColor={'#006425'}
              glyphColor={'#60d98f'}
            />
          </AdvancedMarker>

        </Map>

      </motion.div>
    </APIProvider >
  );
};

export default ListingMap;