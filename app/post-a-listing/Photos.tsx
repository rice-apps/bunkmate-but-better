import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from 'next/image';

const Photos = ({ formData, setFormData }: { formData: any; setFormData: any }) => {
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newPhotos = Array.from(e.target.files);
      setFormData({...formData, photos: [...formData.photos, ...newPhotos]});
    }
  };

  return (
    <div className="space-y-8 w-full">
      <div>
        <h2 className="text-2xl font-medium mb-4">Photos</h2>
        <p className="text-gray-500 mb-2">Manage photos and add details (optional).</p>
        <p className="text-gray-500 mb-6">You are required to upload at least 5 relevant photos to post your listing.</p>

        <div className="grid grid-cols-3 gap-4">
          {formData.photos.map((photo: any, index: number) => (
            <div key={index} className="relative">
              <div className="aspect-square rounded-xl overflow-hidden border border-gray-200">
                <Image
                  src={URL.createObjectURL(photo)}
                  alt={`Upload ${index + 1}`}
                  fill
                  className="object-cover"
                />
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
              <div className="aspect-square rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center">
                <span className="text-4xl text-gray-400">+</span>
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

      <div className="flex justify-end">
        <Button className="bg-[#FF7439] hover:bg-[#FF7439]/90 rounded-lg px-6">
          Next
        </Button>
      </div>
    </div>
  );
};

export default Photos;