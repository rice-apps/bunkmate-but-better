import { APIProvider, Map, AdvancedMarker, Pin, MapMouseEvent } from "@vis.gl/react-google-maps";
import { motion } from "framer-motion";
import React, {useState} from "react";

interface ListingMapProps {
  name: string;
  coords: { lat: number, lng: number };
}

const ListingMap: React.FC<ListingMapProps> = ({ name, coords }) => {
  const initialCoords = { lat: 29.717081272326745, lng: -95.40363313442711 };
  const [destination, setDestination] = useState<{ lat: number, lng: number} > (initialCoords);
  const [walkRoute, setWalkRoute] = useState<{ distance: number, duration: number } | null>(null);
  
  // calculate the route distance and time
  const calculateRouteDistanceAndTime = async (lat1: number, lon1: number, lat2: number, lon2: number, 
    mode: 'driving' | 'cycling' | 'foot') => {
    try {
      // select the appropriate routing service based on mode
      const routingService = {
        driving: 'routed-car/route/v1/driving',
        cycling: 'routed-bike/route/v1/cycling',
        foot: 'routed-foot/route/v1/foot'
      };
      
      const serviceUrl = `https://routing.openstreetmap.de/${routingService[mode]}/${lon1},${lat1};${lon2},${lat2}?overview=false`;
      
      const response = await fetch(serviceUrl);
      if (!response.ok) {
        throw new Error(`Failed to calculate ${mode} route`);
      }
      
      const data = await response.json();
      if (!data.routes || data.routes.length === 0) {
        throw new Error(`No ${mode} route found`);
      }
      
      const distanceMeters = data.routes[0].distance;
      const durationSeconds = data.routes[0].duration;
      
      // convert to miles and minutes
      const distanceMiles = parseFloat((distanceMeters * 0.000621371).toFixed(1));
      const durationMinutes = Math.ceil(durationSeconds / 60);

      return {
        distance: distanceMiles,
        duration: durationMinutes
      };
    } catch (error) {
      console.error(`Error calculating ${mode} route:`, error);
      throw error;
    }
  };

  const handleMapClick = async (event: MapMouseEvent) => {
    const position = event.detail.latLng;
    if (!position) return;
    
    const lat = position.lat;
    const lng = position.lng;
    const dest = { lat, lng };
    setDestination(dest);

    try {
      const walking = await calculateRouteDistanceAndTime(coords.lat, coords.lng, lat, lng, 'foot');
      setWalkRoute(walking);
    } 
    catch (error) {
      console.error('Error calculating walking route:', error);
    }
  }
    
  return (
    <APIProvider
      apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""}
      libraries={["places"]}
    >
      <motion.div
        className="w-full h-[450px]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Map
          style={{ width: '100%', height: '100%' }}
          defaultCenter={coords}
          defaultZoom={16}
          gestureHandling={'greedy'}
          disableDefaultUI={true}
          mapId={name}
          onClick={handleMapClick}
        >
          <AdvancedMarker
            position={coords}
          >
            <Pin />
          </AdvancedMarker>

          <AdvancedMarker
            position={destination}
          >
            <Pin
              background={'#0f9d58'}
              borderColor={'#006425'}
              glyphColor={'#60d98f'}
            />
          </AdvancedMarker>
        </Map>
        {walkRoute && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="bg-white p-4 rounded-lg mt-4"
          >
            <h3 className="text-lg font-semibold mb-2">Walking Route</h3>
            <p className="text-sm text-gray-600">
              Distance: {walkRoute.distance} miles
            </p>
            <p className="text-sm text-gray-600">
              Duration: {walkRoute.duration} minutes
            </p>
          </motion.div>
        )}
      </motion.div>
    </APIProvider >
  );
};

export default ListingMap;