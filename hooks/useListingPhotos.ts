// hooks/useListingPhotos.ts
import { useState, useEffect } from 'react';

export const useListingPhotos = (photoUrls: string[]) => {
  const [photos, setPhotos] = useState<File[]>([]);

  useEffect(() => {
    const loadPhotos = async () => {
      try {
        const photoFiles = await Promise.all(
          photoUrls.map(async (url) => {
            const response = await fetch(url);
            const blob = await response.blob();
            return new File([blob], 'photo.jpg', { type: 'image/jpeg' });
          })
        );
        setPhotos(photoFiles);
      } catch (error) {
        console.error('Error loading photos:', error);
      }
    };

    if (photoUrls.length > 0) {
      loadPhotos();
    }
  }, [photoUrls]);

  return photos;
};