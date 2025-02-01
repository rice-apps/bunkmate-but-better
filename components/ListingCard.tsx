"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { useRouter } from "next/navigation";
import { IconContext } from "react-icons";
import { MdEdit } from "react-icons/md";
import { RiDeleteBinLine } from "react-icons/ri";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
  ownListing: boolean;
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
  ownListing,
}) => {
  const [favorite, setFavorite] = useState(isFavorited);
  const router = useRouter();

  const handleAddOrRemoveFavorite = async (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.stopPropagation();
    // Add API call to modify isFavorited (actual attribute in table)
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    try {
      if (favorite) {
        await supabase
          .from("users_favorites")
          .delete()
          .eq("user_id", user?.id)
          .eq("listing_id", postId);
      } else {
        await supabase.from("users_favorites").insert({
          user_id: user?.id,
          listing_id: postId,
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
      <div className="relative overflow-hidden bg-white">
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
              {favorite && !ownListing ? (
                <Heart
                  className="fill-[#FF7439] text-white"
                  style={{
                    width: "30.03px",
                    height: "26.66px",
                    stroke: "white",
                    strokeWidth: "1.5px",
                  }}
                />
              ) : !favorite && !ownListing ? (
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
              ) : (
                <DropdownMenu key={"editTrigger"}>
                  <DropdownMenuTrigger asChild>
                    <div className="flex rounded-full bg-white place-items-center justify-center w-[35px] h-[35px] hover:scale-110 transition-transform duration-100">
                      <MdEdit
                        className="text-[#FF7439]"
                        style={{ width: "18px", height: "18px" }}
                      />
                    </div>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent className="">
                    <DropdownMenuItem
                      key={"edit"}
                      className="flex justify-left group"
                    >
                      <MdEdit className="group-hover:text-[#FF7439]" />
                      <p className="group-hover:text-[#FF7439] text-left">
                        Edit
                      </p>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      key={"delete"}
                      className="flex justify-left group"
                    >
                      <RiDeleteBinLine className="group-hover:text-[#FF7439]" />
                      <p className="group-hover:text-[#FF7439] text-left">
                        Delete
                      </p>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
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
