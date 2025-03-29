import React, { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import Cropper from "react-easy-crop";
import { FiUpload } from "react-icons/fi";

/**
 * THIS IS NOT USED ANYWHERE.
 */
interface ProfilePictureModalProps {
  formData: any;
  setFormData: (data: any) => void;
}

export default function ProfilePictureModal({
  formData,
  setFormData,
}: ProfilePictureModalProps) {
  const [isOpen, setIsOpen] = useState(false); // Modal open state
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  const [savedImage, setSavedImage] = useState<string | null>(formData.profilePicture || null); // Track saved image
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedImage(reader.result as string); // Set selected image for cropping
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCropComplete = async (_: any, croppedAreaPixels: any) => {
    // Use a canvas to create a cropped image
    const croppedData = await getCroppedImage(selectedImage!, croppedAreaPixels);
    setCroppedImage(croppedData); // Save cropped image
  };

  const handleDone = () => {
    setFormData({ ...formData, profilePicture: croppedImage });
    setSavedImage(croppedImage); // Save the cropped image permanently
    setIsOpen(false); // Close the modal
  };

  const handleClose = (isOpenState: boolean) => {
    if (!isOpenState) {
      // Reset only unsaved changes
      setSelectedImage(null);
      setCroppedImage(null);
    }
    setIsOpen(isOpenState);
  };

  const handleButtonClick = () => {
    const fileInput = document.getElementById("fileInput");
    if (fileInput) {
      (fileInput as HTMLInputElement).click();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogTrigger asChild>
        <button
          type="button"
          className="flex flex-col items-center justify-center w-32 h-32 bg-gray-100 border border-gray-300 rounded-full text-gray-600 hover:bg-gray-200"
          style={{
            backgroundImage: savedImage ? `url(${savedImage})` : undefined,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {!savedImage && (
            <>
              <FiUpload className="mr-1 align-center text-gray-500 text-4xl" />
              <span className="text-sm font-medium text-gray-500">Upload File</span>
            </>
          )}
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-md bg-white p-6 rounded-lg shadow-md">
        <DialogHeader className="text-center">
          <DialogTitle className="text-xl font-bold">Profile Picture</DialogTitle>
          <DialogDescription className="text-sm text-gray-600">
            Upload and crop your profile picture.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center justify-center py-6">
          {!selectedImage ? (
            <div
              onClick={handleButtonClick}
              className="flex flex-col items-center justify-center w-32 h-32 bg-gray-100 border border-gray-300 rounded-full text-gray-500 hover:bg-gray-200 cursor-pointer"
            >
              <FiUpload className="text-4xl mb-2" />
              <span className="text-sm font-medium">Upload File</span>
            </div>
          ) : (
            <div className="relative w-full h-64 bg-gray-200">
              <Cropper
                image={selectedImage}
                crop={crop}
                zoom={zoom}
                aspect={1}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={handleCropComplete}
              />
            </div>
          )}
          <input
            id="fileInput"
            type="file"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>
        <DialogFooter className="flex justify-center gap-4">
          <button
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-600 hover:bg-gray-100"
            onClick={() => setSelectedImage(null)}
          >
            Change
          </button>
          <button
            className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-900"
            onClick={handleDone}
          >
            Done
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Helper function to crop image
const getCroppedImage = (imageSrc: string, croppedAreaPixels: any) => {
  return new Promise<string>((resolve) => {
    const image = new Image();
    image.src = imageSrc;
    image.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      canvas.width = croppedAreaPixels.width;
      canvas.height = croppedAreaPixels.height;

      ctx!.drawImage(
        image,
        croppedAreaPixels.x,
        croppedAreaPixels.y,
        croppedAreaPixels.width,
        croppedAreaPixels.height,
        0,
        0,
        croppedAreaPixels.width,
        croppedAreaPixels.height
      );

      resolve(canvas.toDataURL("image/jpeg")); // Return cropped image as a data URL
    };
  });
};
