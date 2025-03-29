"use client";

import { PostListingFormContext } from "@/providers/PostListingFormProvider";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "@bprogress/next";
import { useContext, useState } from "react";
import { v4 } from "uuid";
import { z } from "zod";
import PostForm, { FormDataType, listingFormSchema } from "./PostForm";

type ImageResponse =
  | {
      data: {
        id: string;
        path: string;
        fullPath: string;
      };
      error: null;
    }
  | {
      data: null;
      error: any;
    };

type ImagePromiseType = Promise<ImageResponse>;

// Main PostListing component
const PostListing = () => {
  const router = useRouter();
  const {postFormData, setPostFormData, resetPostFormData} = useContext(PostListingFormContext);
  const [isPosting, setIsPosting] = useState(false);

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();

    setIsPosting(true);
    const supabase = createClient();
    const userId = (await supabase.auth.getUser()).data.user?.id;
    const insertions: ImagePromiseType[] = [];

    // Cache the name of our file paths
    const filePaths: string[] = [];

    postFormData.rawPhotos.forEach(photo => {
      const filePath = `${userId}/${v4()}`;
      const insertion = supabase.storage.from("listing_images").upload(filePath, photo);
      insertions.push(insertion);
      filePaths.push(filePath);
    });

    try {
      const imageUploads = await Promise.all(insertions);
      const successfulUploads = imageUploads.filter(imageUploads => imageUploads.data);

      if (successfulUploads.length != filePaths.length) {
        const successfulFilePaths = successfulUploads.map((imgResp: ImageResponse) => imgResp.data?.path);
        throw new Error("Some image(s) failed to upload", {
          cause: successfulFilePaths,
        });
      }

      // Calculate distance from address to Rice University
      const distance = await calculateDistance(postFormData.address.label);
      if (!distance) {
        throw new Error("Unable to validate address or calculate distance. Please check the address.");
      }

      const validateData: FormDataType = listingFormSchema.parse(postFormData)

      const {data, error} = await supabase
        .from("listings")
        .insert([
          {
            user_id: userId,
            phone_number: validateData.phone,
            title: validateData.title,
            description: validateData.description,
            price: validateData.price,
            price_notes: validateData.priceNotes,
            start_date: validateData.startDate,
            end_date: validateData.endDate,
            duration_notes: validateData.durationNotes,
            address: validateData.address.label,
            location_notes: validateData.locationNotes,
            distance: distance,
            image_paths: filePaths,
            bed_num: validateData.bed_num,
            bath_num: validateData.bath_num,
          },
        ])
        .select()
        .single();

      if (error) {
        throw new Error(error.message, {
          cause: successfulUploads.map((imgResp: ImageResponse) => imgResp.data?.path),
        });
      }

      const imageCaptions = filePaths.map((path, index) => ({
        user_id: userId,
        image_path: path,
        caption: postFormData.photoLabels[index] || "",
      }));

      const filteredImageCaptions = imageCaptions.filter(imageCaption => imageCaption.caption !== "");

      const {error: captionError} = await supabase.from("images_captions").insert(filteredImageCaptions).select();

      if (captionError) {
        throw new Error(captionError.message, {cause: filePaths});
      }
      resetPostFormData();
      router.push("/");
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        console.error("ZOD Issues", error.issues);
      }
      console.error(error.message);
      await cleanupUploads(error.cause);
      throw error;
    } finally {
      setIsPosting(false);
    }
  };

  const geocodeAddress = async (address: string) => {
    if (!address) {
      throw new Error("Valid address is required");
    }
    try {
      const API_KEY = process.env.NEXT_PUBLIC_GEOCODE_API_KEY;
      const response = await fetch(`https://geocode.maps.co/search?q=${address}&api_key=${API_KEY}`);
      if (!response.ok) {
        throw new Error("Failed to geocode address");
      }
      const data = await response.json();
      if (data && data.length > 0) {
        return {
          lat: data[0].lat,
          lon: data[0].lon,
        };
      } else {
        throw new Error("No geocode results found for " + address);
      }
    } catch (error) {
      console.error("Error geocoding address:", error);
      throw error;
    }
  };

  const calculateDistance = async (address: string) => {
    if (!address) {
      throw new Error("Valid address is required");
    }
    try {
      const riceCoords = {lat: 29.716791450000002, lon: -95.40478113393792};
      const listingCoords = await geocodeAddress(address);
      if (!riceCoords || !listingCoords) {
        throw new Error("Could not geocode addresses");
      }
      const osrmResponse = await fetch(
        `https://router.project-osrm.org/route/v1/driving/${riceCoords.lon},${riceCoords.lat};${listingCoords.lon},${listingCoords.lat}?overview=false`,
      );
      if (!osrmResponse.ok) {
        throw new Error("Failed to calculate distance");
      }
      const osrmData = await osrmResponse.json();
      if (!osrmData.routes || osrmData.routes.length === 0) {
        throw new Error("No distance results found");
      }
      const distanceMeters = osrmData.routes[0].distance;
      const distanceMiles = (distanceMeters * 0.000621371).toFixed(1);
      return distanceMiles;
    } catch (error) {
      console.error("Error calculating distance:", error);
      throw error;
    }
  };

  async function cleanupUploads(paths: string[]) {
    const supabase = createClient();
    await supabase.storage.from("listing_images").remove(paths);
    await supabase.from("images_captions").delete().in("image_path", paths);
  }

  return (<PostForm 
    handleSubmit={handleSubmit} 
    isLoading={false}
    isPosting={isPosting} 
    formData={postFormData} 
    setFormData={setPostFormData} 
    resetFormData={resetPostFormData} 
    editing={false}
  />)
};

export default PostListing;
