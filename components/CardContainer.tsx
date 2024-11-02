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
    <Card className="w-full max-w-[362px] h-[475px] relative border-none m-2 hover:scale-105 transition-transform duration:100">
      <Button
        className="w-[36px] h-[36px] absolute top-5 right-1 hover:bg-transparent ml-3 cursor-pointer hover:scale-110 duration-300"
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
        <IconContext.Provider value={{ color: "white", size: "10em" }}>
          <div className="w-[30.03px] h-[26.66px]">
            {isFavorited ? <FaHeart fill={"#FF7439"}/> : <FaRegHeart fill={"white"}/>}
          </div>
        </IconContext.Provider>
      </Button>
      <div className="rounded-lg overflow-hidden w-[362px] h-[362px] mx-auto border border-[#D9D9D9D1] border-[2.41px]">
        <Image
          src={imagePath || "/house1.jpeg"}
          alt="boujee house"
          width={362}
          height={362}
          className="object-cover w-full h-full"
        />
      </div>
      <CardHeader className="-mt-2 p-0 mt-[20px] space-y-[2px] w-[362px]">
        <div className="flex justify-between items-center">
          <CardTitle>{name}</CardTitle>
          {isRiceStudent && (
            <div className="flex items-center space-x-2 ml-2 text-[#FF7439]">
              <Image src="/owl.png" width={24} height={24} alt="owl"></Image>
              <span className="h-[21px] w-[100px]">Rice Student</span>
            </div>
          )}
        </div>
        <CardDescription>{distance}</CardDescription>
        <CardDescription>{duration}</CardDescription>
        <CardDescription>{price}</CardDescription>
      </CardHeader>
    </Card>
  );
};

export default CardContainer;
