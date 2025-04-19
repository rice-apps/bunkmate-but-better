"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { useRouter } from "@bprogress/next";
import { IconContext } from "react-icons";
import { MdEdit, MdOutlineArchive } from "react-icons/md";
import { RiDeleteBinLine } from "react-icons/ri";
import { FiEye } from "react-icons/fi";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { createClient, getBlurImage, getShimmerData } from "@/utils/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";

interface CardProps {
  postId: string;
  name: string;
  imagePath: string;
  distance: number;
  duration: string;
  price: string;
  isRiceStudent: boolean;
  isFavorited: boolean;
  ownListing: boolean;
  imagePaths: string[];
  isArchived: boolean;
  onDelete?: () => void;
  onArchive?: () => void;
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
  imagePaths,
  isArchived,
  onDelete,
  onArchive,
}) => {
  const [favorite, setFavorite] = useState(isFavorited);
  const [viewCount, setViewCount] = useState<number>(0);
  const router = useRouter();

  const [archived, setArchived] = useState<boolean>(false);
  const [isArchiveModalOpen, setIsArchiveModalOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);

  useEffect(() => {
    // Fetch archived status
    const fetchArchivedStatus = async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("listings")
        .select("archived")
        .eq("id", postId)
        .single();
  
      if (!error && data) {
        setArchived(data.archived);
      }
    };
  
    fetchArchivedStatus();

    // Simplified view count handling
    const fetchViewCount = async () => {
      try {
        const supabase = createClient();
        const numericId = parseInt(postId);
        
        console.log("Fetching view count for listing ID:", numericId);

        const { data, error } = await supabase
          .from("listings_views")
          .select("views")
          .eq("listing_id", numericId)
          .maybeSingle();
          
        console.log("View count data:", data, "Error:", error);

        // Set view count, make sure it defaults to 0 only if data is null
        if (data && data.views !== undefined) {
          console.log("Setting view count to:", data.views);
          setViewCount(data.views);
        } else {
          console.log("No view data found, defaulting to 0");
          setViewCount(0);
        }
      } catch (err) {
        console.error("Error fetching view count:", err);
      }
    };

    fetchViewCount();

    // Simplified real-time listener
    const supabase = createClient();
    const channel = supabase
      .channel(`card_views`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'listings_views',
        filter: `listing_id=eq.${parseInt(postId) || 0}`
      }, (payload) => {
        // @ts-ignore - Ignore type checking here
        if (payload.new?.views) {
          // @ts-ignore - Ignore type checking here
          setViewCount(payload.new.views);
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [postId]);
  

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
    // Passing the favorites.
    const url = `/listing/${postId}?isFavorited=${favorite.toString()}`;
    router.push(url);
  };
  
  const handleDelete = async () => {
    setIsDeleteModalOpen(false);

    const supabase = createClient();

    try {
      let response = await supabase.from('images_captions').delete().in('image_path', imagePaths);

      if (response.status != 204) {
        if (response.status == 403) {
          throw new Error("Unauthorized access");
        }
        else if (response.status == 400) {
          throw new Error("Unable to process request");
        }
      }

      const { error } = await supabase.storage.from('listing_images').remove(imagePaths);

      if (error != null) {
        throw new Error(error.message);
      }

      response = await supabase.from('listings').delete().eq('id', postId);

      if (response.status != 204) {
        if (response.status == 403) {
          throw new Error("Unauthorized access");
        }
        else if (response.status == 400) {
          throw new Error("Unable to process request");
        }
      }

      onDelete && onDelete();

    } catch (error) {
      console.error(error);
    }

  }

  const handleArchive = async () => {
    setIsArchiveModalOpen(false);

    const supabase = createClient();

    try {      
      let response = await supabase.from('listings')
        .update({ archived: true })
        .eq('id', postId);
  
      if (response.error) {
        throw new Error(response.error.message);
      }
  
      setArchived(true);
      onArchive && onArchive();
  
    } catch (error) {
      console.error("Failed to archive listing:", error);
    }
  };

  const handleUnarchive = async () => {
    setIsArchiveModalOpen(false);
  
    const supabase = createClient();
  
    try {      
      let response = await supabase.from('listings')
        .update({ archived: false })
        .eq('id', postId);
  
      if (response.error) {
        throw new Error(response.error.message);
      }
  
      setArchived(false);
      onArchive && onArchive();
  
    } catch (error) {
      console.error("Failed to unarchive listing:", error);
    }
  };
    return (
      <>
      <div className="w-full cursor-pointer" onClick={handleCardClick}>
      <div className="relative overflow-hidden bg-white">
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
                      onClick={() => router.push(`/post-a-listing/edit/${postId}`)}
                    >
                      <MdEdit className="group-hover:text-[#FF7439]" />
                      <p className="group-hover:text-[#FF7439] text-left">
                        Edit
                      </p>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      key={"archive"}
                      className="flex justify-left group"
                      onSelect={archived ? handleUnarchive : () => setIsArchiveModalOpen(true)}
                    >
                      <MdOutlineArchive className="group-hover:text-[#FF7439]" />
                      <p className="group-hover:text-[#FF7439] text-left">
                        {archived ? "Unarchive" : "Archive"}
                      </p>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      key={"delete"}
                      className="flex justify-left group"
                      onSelect={() => setIsDeleteModalOpen(true)}
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
          
          {/* View count indicator */}
          <div className="absolute bottom-4 right-4 bg-black bg-opacity-50 text-white px-2 py-1 rounded-full flex items-center space-x-1">
            <FiEye className="w-4 h-4" />
            <span className="text-sm">{viewCount}</span>
          </div>
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
            <p>{distance} miles away from Rice</p>
            <p>{duration}</p>
            <p className="font-medium">{price}</p>
          </div>
        </div>
      </div>
    </div>
    <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
      <DialogContent className="max-w-md p-8">
        <DialogHeader>
          <DialogTitle>You're about to delete your listing: {name}</DialogTitle>
        </DialogHeader>
        <div>
          <p className="text-sm text-gray-500 mb-8">
            Are you sure? <strong>{name}</strong> will be lost forever!
          </p>

          <div className="flex justify-end gap-4">
            <Button
              variant="outline"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
            >
              Delete
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
    <Dialog open={isArchiveModalOpen} onOpenChange={setIsArchiveModalOpen}>
      <DialogContent className="max-w-md p-8">
        <DialogHeader>
          <DialogTitle>You're about to archive your listing: {name}</DialogTitle>
        </DialogHeader>
        <div>
          <p className="text-sm text-gray-500 mb-8">
            Are you sure you want to archive <strong>{name}</strong>? You can still access this listing in your Archived Listings below.
          </p>

          <div className="flex justify-end gap-4">
            <Button
              variant="outline"
              onClick={() => setIsArchiveModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleArchive}
            >
              Archive
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
    </>
  );
};

export default ListingCard;