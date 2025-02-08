import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import PreviewButton from "./PreviewButton";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";

const Photos = ({
  formData,
  setFormData,
  onNext,
  onBack,
}: {
  formData: any;
  setFormData: any;
  onNext: () => void;
  onBack: () => void;
}) => {
  // Check if we have at least 5 photos
  const isComplete = Boolean(
    formData.photos.length >= 5 && formData.photos.length <= 20
  );

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newPhotos = Array.from(e.target.files);
      
      // Check if the total number of images would exceed 20
      if (formData.photos.length + newPhotos.length > 20) {
        alert("You can only upload up to 20 images.");
        return;
      }

      const parsedPhotos = newPhotos.map((photo: File) =>
        URL.createObjectURL(photo)
      );
      setFormData({
        ...formData,
        photos: [...formData.photos, ...parsedPhotos],
      });
    }
  };

  const handleRemovePhoto = (indexToRemove: number) => {
    const newPhotos = formData.photos.filter(
      (_: any, index: number) => index !== indexToRemove
    );
    const newLabels = { ...formData.photoLabels };
    delete newLabels[indexToRemove];
    // Reindex the remaining labels
    const reindexedLabels: { [key: number]: string } = {};
    Object.values(newLabels).forEach((label, index) => {
      reindexedLabels[index] = label as string;
    });
    setFormData({
      ...formData,
      photos: newPhotos,
      photoLabels: reindexedLabels,
    });
  };

  return (
    <div>
      <div className="flex flex-row justify-between">
        <div>
          <h1 className="text-2xl font-semibold mb-3">Photos</h1>
        </div>
        <PreviewButton formData={formData} />
      </div>
      <h2 className="text-sm font-bold">
        Add photos and optional descriptions to your lease!{" "}
      </h2>
      <h2 className="text-sm font-bold mt-5">
        You are required to upload at least 5 (and at most 20) relevant photos to post your
        listing. Captions are optional but highly encouraged!
      </h2>

      <div>
        <p
          className={`mb-10 mt-10 text-sm font-bold ${formData.photos.length ? "text-green-500" : "text-red-500"}`}
        >
          {formData.photos.length >= 5
            ? "✓ Required photos uploaded"
            : `You still need to upload at least ${5 - formData.photos.length} more photo${formData.photos.length === 4 ? "" : "s"}!`}
        </p>

        <div className="grid grid-cols-3 gap-4">
          {formData.photos.map((photo: string, index: number) => (
            <div key={index} className="relative group">
              <div className="aspect-square rounded-xl overflow-hidden border border-gray-200">
                <div className="relative w-full h-full">
                  <Image
                    src={photo}
                    alt={`Upload ${index + 1}`}
                    fill
                    className="object-cover"
                  />
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
                onChange={(e) => {
                  const newLabels = {
                    ...formData.photoLabels,
                    [index]: e.target.value,
                  };
                  setFormData({ ...formData, photoLabels: newLabels });
                }}
              />
            </div>
          ))}

          {formData.photos.length >= 0 && formData.photos.length < 20 && (
            <label className="cursor-pointer">
              <div
                className={`aspect-square rounded-xl border-2 border-dashed flex items-center justify-center ${
                  isComplete
                    ? "border-green-500"
                    : "border-gray-300 hover:border-gray-400"
                }`}
              >
                <div className="flex flex-col items-center text-center">
                  <span className="flex items-center justify-center w-8 h-8 bg-gray-300 rounded-full text-white text-[35px] font-[200]">
                    +
                  </span>
                  {formData.photos.length < 5 && (
                    <p className="text-sm text-gray-500 mt-2">
                      {5 - formData.photos.length} more required
                    </p>
                  )}
                </div>
                <div>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    className="hidden"
                    onChange={handlePhotoUpload}
                  />
                </div>
              </div>
            </label>
          )}
        </div>
      </div>

      <div className="flex flex-col space-y-2">
        <div className="flex justify-between mt-10 mb-10">
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
