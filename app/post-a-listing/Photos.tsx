import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from 'next/image';

const Photos = ({ formData, setFormData, onNext }: { 
  formData: any; 
  setFormData: any;
  onNext: () => void;
}) => {
  // Check if we have at least 5 photos
  const isComplete = formData.photos.length >= 5;

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newPhotos = Array.from(e.target.files);
      setFormData({...formData, photos: [...formData.photos, ...newPhotos]});
    }
  };

  const handleRemovePhoto = (indexToRemove: number) => {
    const newPhotos = formData.photos.filter((_: any, index: number) => index !== indexToRemove);
    const newLabels = { ...formData.photoLabels };
    delete newLabels[indexToRemove];
    // Reindex the remaining labels
    const reindexedLabels: { [key: number]: string } = {};
    Object.values(newLabels).forEach((label: string, index: number) => {
      reindexedLabels[index] = label;
    });
    setFormData({
      ...formData,
      photos: newPhotos,
      photoLabels: reindexedLabels
    });
  };

  return (
    <div className="space-y-8 w-full">
      <div>
        <h2 className="text-2xl font-medium mb-4">Photos</h2>
        <p className="text-gray-500 mb-2">Manage photos and add details (optional).</p>
        <p className={`mb-6 ${isComplete ? 'text-green-500' : 'text-gray-500'}`}>
          {isComplete 
            ? '✓ Required photos uploaded'
            : `You are required to upload ${5 - formData.photos.length} more photo${formData.photos.length === 4 ? '' : 's'} to post your listing.`
          }
        </p>

        <div className="grid grid-cols-3 gap-4">
          {formData.photos.map((photo: any, index: number) => (
            <div key={index} className="relative group">
              <div className="aspect-square rounded-xl overflow-hidden border border-gray-200">
                <div className="relative w-full h-full">
                  <Image
                    src={URL.createObjectURL(photo)}
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
                value={formData.photoLabels[index] || ''}
                onChange={(e) => {
                  const newLabels = { ...formData.photoLabels, [index]: e.target.value };
                  setFormData({...formData, photoLabels: newLabels});
                }}
              />
            </div>
          ))}

          {formData.photos.length < 5 && (
            <label className="cursor-pointer">
              <div className={`aspect-square rounded-xl border-2 border-dashed flex items-center justify-center ${
                isComplete ? 'border-green-500' : 'border-gray-300 hover:border-gray-400'
              }`}>
                <div className="text-center">
                  <span className="text-4xl text-gray-400">+</span>
                  <p className="text-sm text-gray-500 mt-2">
                    {5 - formData.photos.length} more required
                  </p>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handlePhotoUpload}
                />
              </div>
            </label>
          )}
        </div>
      </div>

      <div className="flex flex-col space-y-2">
        <div className="flex justify-end">
          <Button 
            onClick={onNext}
            disabled={!isComplete}
            className={`rounded-lg px-6 ${
              isComplete 
                ? 'bg-[#FF7439] hover:bg-[#FF7439]/90' 
                : 'bg-gray-300'
            }`}
          >
            Next
          </Button>
        </div>

        {/* Completion status */}
        {!isComplete && (
          <div className="text-sm text-gray-500 text-right">
            To continue, please:
            <div>• Upload {5 - formData.photos.length} more photo{formData.photos.length === 4 ? '' : 's'}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Photos;