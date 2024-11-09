"use client";

import React from 'react';
import Image from 'next/image';
import { format } from 'date-fns';
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, MapPin, Calendar, Phone, Mail } from 'lucide-react';
import { useRouter } from 'next/navigation';

const PreviewPage = () => {
  const router = useRouter();
  const [currentPhotoIndex, setCurrentPhotoIndex] = React.useState(0);
  const [formData, setFormData] = React.useState<any>(null);

  React.useEffect(() => {
    const savedData = localStorage.getItem('listingFormData');
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      if (parsedData.photos) {
        // Convert photo URLs back to File objects
        Promise.all(
          parsedData.photos.map(async (photoUrl: string) => {
            const response = await fetch(photoUrl);
            const blob = await response.blob();
            return new File([blob], 'photo.jpg', { type: 'image/jpeg' });
          })
        ).then((photoFiles) => {
          setFormData({ ...parsedData, photos: photoFiles });
        });
      } else {
        setFormData(parsedData);
      }
    }
  }, []);

  const handleNextPhoto = () => {
    if (!formData?.photos) return;
    setCurrentPhotoIndex((prev) => 
      prev === formData.photos.length - 1 ? 0 : prev + 1
    );
  };

  const handlePrevPhoto = () => {
    if (!formData?.photos) return;
    setCurrentPhotoIndex((prev) => 
      prev === 0 ? formData.photos.length - 1 : prev - 1
    );
  };

  const handleClose = () => {
    router.push('/post-a-listing');
  };

  if (!formData) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#FF7439]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <Button
            variant="outline"
            onClick={handleClose}
            className="text-gray-600"
          >
            Back to Editor
          </Button>
          <h1 className="text-2xl font-bold">Listing Preview</h1>
          <div className="w-[100px]" />
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Photo Gallery */}
          <div className="relative aspect-video bg-gray-100">
            {formData.photos && formData.photos.length > 0 ? (
              <>
                <Image
                  src={URL.createObjectURL(formData.photos[currentPhotoIndex])}
                  alt={formData.photoLabels[currentPhotoIndex] || 'Property photo'}
                  fill
                  className="object-cover"
                />
                {/* Photo Navigation */}
                {formData.photos.length > 1 && (
                  <div className="absolute inset-0 flex items-center justify-between p-4">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={handlePrevPhoto}
                      className="rounded-full bg-white/80 hover:bg-white"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={handleNextPhoto}
                      className="rounded-full bg-white/80 hover:bg-white"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                )}
                {/* Photo Counter */}
                <div className="absolute bottom-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
                  {currentPhotoIndex + 1} / {formData.photos.length}
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-400">No photos uploaded</p>
              </div>
            )}
          </div>

          {/* Listing Details */}
          <div className="p-8 space-y-6">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">{formData.title || 'Untitled Listing'}</h2>
              <div className="mt-2 flex items-center text-gray-500">
                <MapPin className="h-4 w-4 mr-2" />
                <span>{formData.address || 'No address provided'}</span>
              </div>
            </div>

            <div className="flex items-center justify-between py-4 border-y border-gray-200">
              <div>
                <p className="text-2xl font-bold text-[#FF7439]">
                  ${formData.monthlyRent || '0'}/month
                </p>
                {formData.utilities && (
                  <p className="text-sm text-gray-500 mt-1">
                    Utilities: {formData.utilities}
                  </p>
                )}
              </div>
              <div className="flex items-center text-gray-500">
                <Calendar className="h-4 w-4 mr-2" />
                <span>
                  {formData.startDate && formData.endDate ? (
                    `${format(new Date(formData.startDate), 'MMM d, yyyy')} - ${format(new Date(formData.endDate), 'MMM d, yyyy')}`
                  ) : (
                    'Dates not specified'
                  )}
                </span>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2">Description</h3>
              <p className="text-gray-600 whitespace-pre-wrap">
                {formData.description || 'No description provided'}
              </p>
            </div>

            {formData.specialNotes && (
              <div>
                <h3 className="text-xl font-semibold mb-2">Special Notes</h3>
                <p className="text-gray-600 whitespace-pre-wrap">{formData.specialNotes}</p>
              </div>
            )}

            {formData.locationNotes && (
              <div>
                <h3 className="text-xl font-semibold mb-2">Location Details</h3>
                <p className="text-gray-600 whitespace-pre-wrap">{formData.locationNotes}</p>
              </div>
            )}

            <div className="pt-6 border-t border-gray-200">
              <h3 className="text-xl font-semibold mb-4">Contact Information</h3>
              <div className="space-y-2">
                <p className="flex items-center text-gray-600">
                  <Mail className="h-4 w-4 mr-2" />
                  {formData.email || 'No email provided'}
                </p>
                <p className="flex items-center text-gray-600">
                  <Phone className="h-4 w-4 mr-2" />
                  {formData.phone || 'No phone provided'}
                </p>
                <p className="text-gray-600">
                  {formData.name || 'No name provided'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Navigation */}
        <div className="max-w-4xl mx-auto mt-6 flex justify-end">
          <Button
            onClick={handleClose}
            variant="outline"
            className="mr-4"
          >
            Edit Listing
          </Button>
          <Button
            className="bg-[#FF7439] hover:bg-[#FF7439]/90"
          >
            Submit Listing
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PreviewPage;