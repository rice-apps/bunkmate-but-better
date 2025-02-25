"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { useRouter } from "@bprogress/next";
import { IconContext } from "react-icons";
import { getShimmerData } from "@/utils/supabase/client";

interface CardProps {
  postId: string;
  name: string;
  imagePath: string;
  distance: string;
  duration: string;
  price: string;
  isRiceStudent: boolean;
  isFavorited: boolean;
}

const YourListingCard: React.FC<CardProps> = ({
  postId,
  name,
  imagePath,
  distance,
  duration,
  price,
  isRiceStudent,
  isFavorited,
}) => {
  const [favorite, setFavorite] = useState(isFavorited);
  const router = useRouter();

  const handleAddOrRemoveFavorite = (e: React.MouseEvent, card: CardProps) => {
    e.stopPropagation(); // Prevent navigation when clicking the heart
    setFavorite(!favorite);
    // Add API call to modify isFavorited
  };

  const handleCardClick = () => {
    router.push(`/listing/${postId}`);
  };

  return (
    <div className="w-full cursor-pointer" onClick={handleCardClick}>
      <div className="relative rounded-2xl overflow-hidden bg-white">
        {/* Image Container */}
        <div className="relative w-full aspect-square">
          <Image
            src={imagePath || "/house1.jpeg"}
            placeholder={`data:image/svg+xml;base64,${getShimmerData()}`}
            alt={name}
            fill
            className="object-cover rounded-2xl"
          />
          <Button
            className="absolute top-4 right-4 w-10 h-10 p-0 border-none hover:bg-transparent hover:text-white"
            variant="ghost"
            onClick={(e) => {
              handleAddOrRemoveFavorite(e, {
                postId,
                name,
                imagePath,
                distance,
                duration,
                price,
                isRiceStudent,
                isFavorited,
              });
            }}
          >
            {/* <IconContext.Provider value={{}}>
              {favorite ? (
                <Heart
                  className="fill-[#FF7439] text-white"
                  style={{
                    width: "30.03px",
                    height: "26.66px",
                    stroke: "white",
                    strokeWidth: "1.5px",
                  }}
                />
              ) : (
                <Heart
                  style={{
                    fill: "rgba(0, 0, 0, 0.5)",
                    width: "30.03px",
                    height: "26.66px",
                    stroke: "white",
                    strokeWidth: "1.5px",
                  }}
                  className="text-white"
                />
              )}
            </IconContext.Provider> */}





            
          </Button>
        </div>

        {/* Content */}
        <div className="mt-4 space-y-1">
          <div className="flex justify-between items-center">
            {isRiceStudent ? (
              <h3 className="font-semibold text-lg max-w-[60%] truncate">
                {name}
              </h3>
            ) : (
              <h3 className="font-semibold text-lg truncate">{name}</h3>
            )}
            {isRiceStudent && (
              <div className="flex items-center gap-1 text-[#FF7439] text-m flex-shrink-0">
                <Image src="/owl.png" width={16} height={16} alt="owl" />
                <span>Rice Student</span>
              </div>
            )}
          </div>
          <div className="space-y-1 text-gray-500 text-sm">
            <p>{distance}</p>
            <p>{duration}</p>
            <p className="font-medium">{price}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default YourListingCard;