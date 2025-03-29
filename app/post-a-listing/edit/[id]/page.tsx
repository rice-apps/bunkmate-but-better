"use client";

import React, { useEffect, useMemo, useState, useContext } from 'react';
import { useParams } from 'next/navigation';
import { useRouter } from '@bprogress/next';

import { createClient, getImagePublicUrl } from '@/utils/supabase/client';
import { v4 } from 'uuid';
import PostForm from '../../PostForm';
import { PostListingFormContext } from '@/providers/PostListingFormProvider';

type ImageResponse = {
  data: {
    id: string;
    path: string;
    fullPath: string;
  };
  error: null;
} | {
  data: null;
  error: any;
}

type ImagePromiseType = Promise<ImageResponse>


// Main PostListing component
const EditListing = () => {
  const router = useRouter();
  const params = useParams();
  const listingId = params.id as string;
  const {editListingId, setEditListingId, setOldEditFormData, editFormData, setEditFormData, resetEditFormData} = useContext(PostListingFormContext);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();
  const [isPosting, setIsPosting] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const fetchListingAndUser = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Get authenticated user first
        const { data: authData } = await supabase.auth.getUser();
        if (!authData.user) throw new Error('Not authenticated');

        if (!listingId) throw new Error('No listing ID provided');

        // Fetch listing data
        const { data: listingData, error: queryError } = await supabase
          .from('listings')
          .select(`
            *,
            user:users!user_id(
              id,
              name,
              email,
              created_at,
              phone,
              profile_image_path,
              affiliation
            )
          `)
          .eq('id', listingId)
          .single();

        if (queryError) throw queryError;
        if (!listingData) throw new Error('No listing found');

        const { data: captionData, error: captionError } = await supabase
          .from("images_captions")
          .select("*")
          .in("image_path", listingData.image_paths);

        if (captionError) throw captionError;

        // Adjust caption indexes to start at 100 for existing images
        const captions = captionData?.reduce((acc, cur) => {
          const index = listingData.image_paths.indexOf(cur.image_path);
          acc[index + 100] = cur.caption; // Add 100 to index to match Photos component
          return acc;
        }, {});

        // Verify user owns this listing
        if (listingData.user_id !== authData.user.id) {
          // If not, route to profile-section
          router.push('/profile-section');
          return;
        }

        // Fetch current user data
        const { data: userData, error: userError } = await supabase
          .from("users")
          .select()
          .eq("id", authData.user.id)
          .single();

        if (userError) throw userError;
        
        // Convert image paths to public URLs
        const publicUrls = await Promise.all(
          listingData.image_paths.map(async (path: string) => {
            const publicUrl = await getImagePublicUrl('listing_images', path);
            return publicUrl;
          })
        );

        if (isMounted) {
          setEditFormData({
            // Listing data
            title: listingData.title || '',
            description: listingData.description || '',
            price: listingData.price || NaN,
            priceNotes: listingData.price_notes || '',
            startDate: listingData.start_date || '',
            endDate: listingData.end_date || '',
            durationNotes: listingData.duration_notes || '',
            address: { label: listingData.address, value: { description: listingData.address } },
            locationNotes: listingData.location_notes || '',
            photos: [],
            rawPhotos: [],
            photoLabels: captions || {},
            imagePaths: listingData.image_paths || [],
            removedImagePaths: [],
            affiliation: userData.affiliation || '',
            phone: listingData.phone_number || listingData.user?.phone || '',
            bed_num: listingData.bed_num || NaN,
            bath_num: listingData.bath_num || NaN,
          });
          setOldEditFormData({
            title: listingData.title || '',
            description: listingData.description || '',
            price: listingData.price || NaN,
            priceNotes: listingData.price_notes || '',
            startDate: listingData.start_date || '',
            endDate: listingData.end_date || '',
            durationNotes: listingData.duration_notes || '',
            address: { label: listingData.address, value: { description: listingData.address } },
            locationNotes: listingData.location_notes || '',
            photos: [],
            rawPhotos: [],
            photoLabels: captions || {},
            imagePaths: listingData.image_paths || [],
            removedImagePaths: [],
            affiliation: userData.affiliation || '',
            phone: listingData.phone_number || listingData.user?.phone || '',
            bed_num: listingData.bed_num || NaN,
            bath_num: listingData.bath_num || NaN,
          })
          setEditListingId(Number.parseInt(listingId));
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load data';
        if (isMounted) setError(errorMessage);
        console.warn('Error fetching data:', err);
        router.push('/profile-section'); // Route back on any error
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    if (editListingId != Number.parseInt(listingId))
      fetchListingAndUser();
    else {
      setIsLoading(false)
    }

    return () => {
      isMounted = false;
    };
  }, [listingId]);

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    setIsPosting(true);
    e.preventDefault();

    const userId = (await supabase.auth.getUser()).data.user?.id;
    const insertions: ImagePromiseType[] = [];
    let newImagePaths: string[] = [...editFormData.imagePaths];

    try {
      // First, remove all existing captions for both current and removed images
      const allAffectedPaths = [...editFormData.imagePaths, ...editFormData.removedImagePaths];
      if (allAffectedPaths.length > 0) {
        const { error: deleteCaptionsError } = await supabase
          .from('images_captions')
          .delete()
          .in('image_path', allAffectedPaths);

        if (deleteCaptionsError) {
          throw new Error(`Error removing existing captions: ${deleteCaptionsError.message}`);
        }
      }

      // Upload new photos if any
      let uploadedPaths: string[] = [];
      if (editFormData.rawPhotos.length > 0) {
        editFormData.rawPhotos.forEach(photo => {
          const filePath = `${userId}/${v4()}`;
          const insertion = supabase.storage.from("listing_images").upload(filePath, photo);
          insertions.push(insertion);
        });

        const imageUploads = await Promise.all(insertions);
        const successfulUploads = imageUploads.filter(upload => upload.data);

        if (successfulUploads.length !== editFormData.rawPhotos.length) {
          throw new Error('Some image(s) failed to upload');
        }

        // Add new file paths to the existing ones
        uploadedPaths = successfulUploads.map(upload => upload.data!.path);
        newImagePaths = [...editFormData.imagePaths, ...uploadedPaths];
        
      }

      // Update the listing with all fields including new image paths
      const { error: updateError } = await supabase
        .from('listings')
        .update({
          phone_number: editFormData.phone,
          title: editFormData.title,
          description: editFormData.description,
          price: editFormData.price,
          price_notes: editFormData.priceNotes,
          start_date: editFormData.startDate,
          end_date: editFormData.endDate,
          duration_notes: editFormData.durationNotes,
          address: editFormData.address.label,
          location_notes: editFormData.locationNotes,
          image_paths: newImagePaths,
          bed_num: editFormData.bed_num,
          bath_num: editFormData.bath_num,
        })
        .eq('id', listingId);

      if (updateError) {
        throw new Error(`Failed to update listing: ${updateError.message}`);
      }

      // Handle image captions for both existing and new images
      if (editFormData.photoLabels && Object.keys(editFormData.photoLabels).length > 0) {
        // Handle existing image captions (indexes 100+)
        const existingImageCaptions = editFormData.imagePaths.map((path, index) => ({
          user_id: userId,
          image_path: path,
          caption: editFormData.photoLabels[index + 100] || '',
        })).filter(caption => caption.caption !== '');

        // Handle new image captions (regular indexes)
        const newImageCaptions = uploadedPaths.map((path, index) => ({
          user_id: userId,
          image_path: path,
          caption: editFormData.photoLabels[index] || '',  // Use regular index for new photos
        })).filter(caption => caption.caption !== '');

        const allCaptions = [...existingImageCaptions, ...newImageCaptions];

        if (allCaptions.length > 0) {
          // Delete any existing captions first to avoid conflicts
          await supabase
            .from('images_captions')
            .delete()
            .in('image_path', newImagePaths);

          // Insert all captions
          const { error: captionError } = await supabase
            .from('images_captions')
            .insert(allCaptions);

          if (captionError) {
            throw new Error(`Error inserting captions: ${captionError.message}`);
          }
        }
      }

      // Remove deleted images from storage
      if (editFormData.removedImagePaths.length > 0) {
        const { error: removingError } = await supabase
          .storage
          .from('listing_images')
          .remove(editFormData.removedImagePaths);

        if (removingError) {
          throw new Error(`Error removing images: ${removingError.message}`);
        }
      }

      // Update user affiliation
      const { error: userError } = await supabase
        .from('users')
        .update({ affiliation: editFormData.affiliation })
        .eq('id', userId);

      if (userError) {
        throw new Error(`Failed to update user: ${userError.message}`);
      }

      setEditListingId(0);

      router.push(`/listing/${listingId}`);
    } catch (error: any) {
      console.error('Error updating listing:', error.message);
      throw error;
    } finally {
      setIsPosting(false);
    }
  };

  return (<PostForm 
    handleSubmit={handleSubmit} 
    isLoading={isLoading}
    isPosting={isPosting} 
    formData={editFormData} 
    setFormData={setEditFormData} 
    resetFormData={resetEditFormData} 
    editing={true} 
  />)
};

export default EditListing;