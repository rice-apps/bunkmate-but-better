"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getImagePublicUrl, getShimmerData } from "@/utils/supabase/client";
import Image from "next/image";
import { Dispatch, SetStateAction, useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";
import { FormDataType } from "./page";
import PreviewButton from "./PreviewButton";
import { useProgress } from "@bprogress/next";

const Photos = ({
  formData,
  setFormData,
  onNext,
  onBack,
}: {
  formData: FormDataType;
  setFormData: Dispatch<SetStateAction<FormDataType>>;
  onNext: () => void;
  onBack: () => void;
}) => {
  const [isUploading, setIsUploading] = useState(false);
  // Check total number of photos (existing + new)
  const isComplete = formData.photos.length + formData.imagePaths.length >= 5;

  const getImageUrl = (path: string) => {
    return getImagePublicUrl("listing_images", path);
  };

  const { start, stop, set } = useProgress();

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    // Start progress tracking
    start();
    set(5); // Initial progress
    setIsUploading(true);

    // Track the current file being processed
    let currentFileIndex = 0;
    const totalFiles = e.target.files.length;
    const progressPerFile = 90 / totalFiles; // Reserve 90% of progress for all files

    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
      preserveExif: false,
      maxResolution: 72,
      onprogress: (progressEvent: ProgressEvent) => {
        // Calculate file-specific progress (0-100%)
        const fileProgress = Math.round(
          (progressEvent.loaded / progressEvent.total) * 100
        );

        // Calculate overall progress:
        // 5% starting + (current file index * progress per file) + (current file progress * progress per file / 100)
        const overallProgress =
          5 +
          currentFileIndex * progressPerFile +
          (fileProgress * progressPerFile) / 100;

        set(Math.min(95, overallProgress)); // Cap at 95% to leave room for final processing
        console.log(
          `File ${
            currentFileIndex + 1
          }/${totalFiles}: ${fileProgress}%, Overall: ${Math.round(
            overallProgress
          )}%`
        );
      },
    };

    const [heicToModule, imageCompressionModule] = await Promise.all([
      import('heic-to'),
      import('browser-image-compression')
    ]);
    
    const heicTo = heicToModule.heicTo;
    const imageCompression = imageCompressionModule.default;

    const newPhotos = Array.from(e.target.files);
    if (newPhotos) {
      // use a runtime import to avoid issues with SSR
      for (let i = 0; i < newPhotos.length; i++) {
        const file = newPhotos[i];
        if (file.type === "image/heic" || file.type === "image/heif") {
          const blob = await heicTo({
            blob: file,
            type: "image/jpeg",
            quality: 0.8,
          });
          newPhotos[i] = new File(
            [blob as Blob],
            file.name.replace(/\.[^/.]+$/, ".jpg"),
            {
              type: "image/jpeg",
            }
          );
        }
      }

      setIsUploading(true);

            const compressedPhotos = [];
      for (let i = 0; i < newPhotos.length; i++) {
        currentFileIndex = i;
                const compressed = await imageCompression(newPhotos[i], options);
        compressedPhotos.push(compressed);
      }

      set(95); // Almost done

      const parsedPhotos = compressedPhotos.map((photo: File) =>
URL.createObjectURL(photo)
    );
      setFormData({
        ...formData,
        photos: [...formData.photos, ...parsedPhotos],
        rawPhotos: [...formData.rawPhotos, ...compressedPhotos],
      });

      set(100); // Complete
      setTimeout(() => {
        stop();
      setIsUploading(false);
      }, 500); // Small delay so the user can see 100%
    }
  };

  const handleRemoveExistingPhoto = (indexToRemove: number) => {
    const newImagePaths = formData.imagePaths.filter((_: string, index: number) => index !== indexToRemove);
    setFormData({
      ...formData,
      imagePaths: newImagePaths,
      removedImagePaths: [...formData.removedImagePaths, formData.imagePaths[indexToRemove]],
    });
  };

  const handleRemovePhoto = (indexToRemove: number) => {
    const newPhotos = formData.photos.filter((_: any, index: number) => index !== indexToRemove);
    const newRawPhotos = formData.rawPhotos.filter((_: any, index: number) => index !== indexToRemove);
    const newLabels = {...formData.photoLabels};
    delete newLabels[indexToRemove];
    // Reindex the remaining labels
    const reindexedLabels: {[key: number]: string} = {};
    Object.values(newLabels).forEach((label, index) => {
      reindexedLabels[index] = label as string;
    });
    setFormData({
      ...formData,
      photos: newPhotos,
      rawPhotos: newRawPhotos,
      photoLabels: reindexedLabels,
    });
  };

  return (
    <div>
      <div className="flex flex-row justify-between flex-wrap-reverse gap-4 pb-2 items-center">
        <div>
          <h1 className="text-2xl font-semibold mb-3">Photos</h1>
        </div>
        <PreviewButton formData={formData} />
      </div>
      <h2 className="text-sm font-bold text-gray-800">Add photos and optional descriptions to your lease! </h2>
      <p className="mb-6 text-gray-500 text-sm">
        You are required to upload at least 5 relevant photos to post your listing. Captions are optional but highly
        encouraged!
      </p>

      <div>
        <p className={`mb-6 text-sm ${isComplete ? "text-green-500" : "text-red-500"}`}>
          {isComplete
            ? "✓ Required photos uploaded"
            : `You are required to upload ${5 - (formData.photos.length + formData.imagePaths.length)} more photo${
                formData.photos.length + formData.imagePaths.length === 4 ? "" : "s"
              } to post your listing.`}
        </p>

        <div className="grid grid-cols-3 gap-4">
          {/* Display existing images first */}
          {formData.imagePaths.map((path, index: number) => (
            <div key={`existing-${index}`} className="relative group">
              <div className="aspect-square rounded-xl overflow-hidden border border-gray-200">
                <div className="relative w-full h-full">
                  <Image
                    src={getImageUrl(path)}
                    placeholder={`data:image/svg+xml;base64,${getShimmerData()}`}
                    alt={`Existing Upload ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                  <button
                    onClick={() => handleRemoveExistingPhoto(index)}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    ×
                  </button>
                </div>
              </div>
              <Input
                placeholder="Label (e.g., Bedroom)"
                className="mt-2 rounded-xl"
                value={formData.photoLabels[index + 100] || ""}
                onChange={e => {
                  const newLabels = {
                    ...formData.photoLabels,
                    [index + 100]: e.target.value,
                  };
                  setFormData({...formData, photoLabels: newLabels});
                }}
              />
            </div>
          ))}

          {/* Display newly uploaded images */}
          {formData.photos.map((photo: string, index: number) => (
            <div key={`new-${index}`} className="relative group">
              <div className="aspect-square rounded-xl overflow-hidden border border-gray-200">
                <div className="relative w-full h-full">
                  <Image src={photo} alt={`Upload ${index + 1}`} fill className="object-cover" />
                  <button
                    onClick={() => handleRemovePhoto(index)}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    ×
                  </button>
                </div>
              </div>
              <Input
                placeholder="Label (e.g., Bedroom)"
                className="mt-2 rounded-xl"
                value={formData.photoLabels[index] || ""}
                onChange={e => {
                  const newLabels = {
                    ...formData.photoLabels,
                    [index]: e.target.value,
                  };
                  setFormData({...formData, photoLabels: newLabels});
                }}
              />
            </div>
          ))}

          {formData.photos.length + formData.imagePaths.length >= 0 && (
            <label className="cursor-pointer">
              <div
                className={`aspect-square rounded-xl border-2 border-dashed flex items-center justify-center ${
                  isComplete ? "border-green-500" : "border-gray-300 hover:border-gray-400"
                }`}
              >
                <div className="flex flex-col items-center text-center">
                  <span className="flex items-center justify-center w-8 h-8 bg-gray-300 rounded-full text-white text-[35px] font-[200]">
                    +
                  </span>
                  {formData.photos.length + formData.imagePaths.length < 5 && (
                    <p className="text-sm text-gray-500 mt-2">
                      {5 - (formData.photos.length + formData.imagePaths.length)} more required
                    </p>
                  )}
                </div>
                <input type="file" multiple accept="image/*" className="hidden" onChange={handlePhotoUpload} />
              </div>
            </label>
          )}
        </div>
        {isUploading && <div className="italic text-sm text-gray-500 pt-5">Uploading image(s)...</div>}
      </div>

      <div className="flex flex-col pt-10">
        <div className="flex justify-between">
          <Button
            className="w-[5.3rem] rounded-lg px-6 flex items-center bg-[#FF7439] hover:bg-[#FF7439]/90"
            onClick={onBack}
          >
            <FaChevronLeft />
            <p>Back</p>
          </Button>
          <Button
            className={`w-[5.3rem] rounded-lg px-6 flex items-center ${
              isComplete ? "bg-[#FF7439] hover:bg-[#FF7439]/90" : "bg-gray-300"
            }`}
            onClick={onNext}
            disabled={!isComplete}
          >
            <p>Next</p>
            <FaChevronRight />
          </Button>
        </div>

        {/* Completion status */}
      </div>
    </div>
  );
};

export default Photos;
