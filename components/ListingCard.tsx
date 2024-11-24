"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { useRouter } from "next/navigation";
import { IconContext } from "react-icons";
import { createClient } from "@/utils/supabase/client";

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

const ListingCard: React.FC<CardProps> = ({
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

  const handleAddOrRemoveFavorite = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    // Add API call to modify isFavorited (actual attribute in table)
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    try {
      if (favorite) {
        await supabase.from('users_favorites').delete().eq('user_id', user?.id).eq('listing_id', postId);
      } else {
        await supabase.from('users_favorites').insert({
          user_id: user?.id,
          listing_id: postId
        });
      }
  
      setFavorite(!favorite);
    } catch (error) {
      alert("Failed to favorite/unfavorite a listing");
    }
    
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
            alt={name}
            fill
            className="object-cover rounded-2xl"
          />
          <Button
            className="absolute top-4 right-4 w-10 h-10 p-0 border-none hover:bg-transparent hover:text-white"
            variant="ghost"
            onClick={handleAddOrRemoveFavorite}
          >
            <IconContext.Provider value={{}}>
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
            </IconContext.Provider>
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

export default ListingCard;