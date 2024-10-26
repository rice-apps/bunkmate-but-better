"use client";
import React, { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { FaRegHeart } from "react-icons/fa";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { IconContext } from "react-icons";

interface CardProps {
  name: string;
  imagePath: string;
  distance: string;
  duration: string;
  price: string;
  isRiceStudent: boolean;
}

interface ListingCardProps extends CardProps {
  onAddFavorite: (card: CardProps) => void;
}

const CardContainer: React.FC = () => {
  const [favorites, setFavorites] = useState<CardProps[]>([]);

  const handleAddFavorite = (card: CardProps) => {
    setFavorites((prevFavorites) => [...prevFavorites, card]);
  };

  React.useEffect(() => {
    console.log("Updated favorites:", favorites);
  }, [favorites]);

  return (
    <ListingCard
      name="Life Tower"
      imagePath="/housepng.png"
      distance="1.2 miles away"
      duration="August - May"
      price="$1300 month"
      isRiceStudent={true}
      onAddFavorite={handleAddFavorite}
    />
  );
};

const ListingCard: React.FC<ListingCardProps> = ({
  name,
  imagePath,
  distance,
  duration,
  price,
  isRiceStudent,
  onAddFavorite,
}) => {
  return (
    <Card className="w-[362px] h-[475px] relative border-none">
      <Button
        className="w-[36px] h-[36px] absolute top-2 right-2 hover:bg-transparent"
        variant="ghost"
        onClick={() => {
          onAddFavorite({
            name,
            imagePath,
            distance,
            duration,
            price,
            isRiceStudent,
          });
        }}
      >
        <IconContext.Provider value={{ color: "white", size: "2em" }}>
          <div className="w-[30.03px] h-[26.66px]">
            <FaRegHeart />
          </div>
        </IconContext.Provider>
      </Button>
      <div className="rounded-lg overflow-hidden w-[362px] h-[362px] mx-auto border border-[#D9D9D9D1] border-[2.41px]">
        <Image
          src={imagePath}
          alt="boujee house"
          width={362}
          height={362}
          className="object-cover w-full h-full"
        />
      </div>
      <CardHeader className="-mt-2 p-4 space-y-[2px]">
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
