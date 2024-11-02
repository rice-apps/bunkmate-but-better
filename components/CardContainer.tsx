"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { IconContext } from "react-icons";

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

interface ListingCardProps extends CardProps {
  onAddFavorite: (card: CardProps) => void;
}

const CardContainer: React.FC<CardProps> = ({
  postId,
  name,
  imagePath,
  distance,
  duration,
  price,
  isRiceStudent,
  isFavorited
}) => {
  const [favorites, setFavorites] = useState<CardProps[]>([]);
  const [favorite, setFavorite] = useState(isFavorited)

  const handleAddOrRemoveFavorite = (card: CardProps) => {
    if (!favorite) {
      setFavorites((prevFavorites) => [...prevFavorites, card]);
    } else {
      // Remove from favorites
      setFavorites((prevFavorites) =>
        prevFavorites.filter((favorite) => favorite.postId !== card.postId)
      );
    }

    setFavorite(!favorite)
  };

  useEffect(() => {
    console.log("Updated favorites:", favorites);
  }, [favorites]);

  return (
    <ListingCard
      postId={postId}
      name={name}
      imagePath={imagePath}
      distance={distance}
      duration={duration}
      price={price}
      isRiceStudent={isRiceStudent}
      isFavorited={favorite}
      onAddFavorite={handleAddOrRemoveFavorite}
    />
  );
};

const ListingCard: React.FC<ListingCardProps> = ({
  postId,
  name,
  imagePath,
  distance,
  duration,
  price,
  isRiceStudent,
  isFavorited,
  onAddFavorite,
}) => {
  return (
    <div className="w-full">
      <div className="relative rounded-2xl overflow-hidden bg-white shadow-md">
        {/* Image Container */}
        <div className="relative w-full aspect-square">
          <Image
            src={imagePath || "/house1.jpeg"}
            alt={name}
            fill
            className="object-cover"
          />
          <Button
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/80 hover:bg-white p-0 border-none"
            variant="ghost"
            onClick={() => {
              onAddFavorite({
                postId,
                name,
                imagePath,
                distance,
                duration,
                price,
                isRiceStudent,
                isFavorited
              });
            }}
          >
            <IconContext.Provider value={{ size: "1.5em" }}>
              {isFavorited ? (
                <FaHeart className="text-[#FF7439]" />
              ) : (
                <FaRegHeart className="text-gray-600" />
              )}
            </IconContext.Provider>
          </Button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-2">
          <div className="flex justify-between items-start">
            <h3 className="font-semibold text-lg">{name}</h3>
            {isRiceStudent && (
              <div className="flex items-center gap-1 text-[#FF7439] text-sm">
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

export default CardContainer;
