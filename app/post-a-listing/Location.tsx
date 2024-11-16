import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

// Location Component
const Location = ({ formData, setFormData, onNext }: {
  formData: any;
  setFormData: any;
  onNext: () => void;
}) => {
  const isComplete = Boolean(formData.address);

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, address: e.target.value });
  };

  const handleLocationNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData({ ...formData, locationNotes: e.target.value });
  };

  return (
    <div className="space-y-8 w-full">
      <div>
        <h2 className="text-2xl font-medium mb-1">Address</h2>
        <p className="text-gray-400 text-sm mb-4">Use the following format: <span className="text-gray-500">123 Sammy Blvd, Houston, TX 77005</span></p>
        <div className="relative">
          <Input
            placeholder="Ex: 123 Sammy Blvd, Houston, TX 77005"
            value={formData.address}
            onChange={handleAddressChange}
            className={`w-full rounded-xl border border-gray-200`}
          />
          {!formData.address && (
            <span className="text-sm text-gray-400 mt-1 block">
              Required: Please enter the property address
            </span>
          )}
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-medium mb-1">Special Notes</h2>
        <p className="text-gray-400 text-sm mb-4"><span className="text-gray-500 font-bold">This is optional!</span> You can include information such as any breaks in your lease, or variable payment per month. </p>
        <div className="relative">
          <Textarea
            placeholder="Ex: Distance from Rice. 
            Distance from Fondren Library. 
            Estimated bike ride duration."
            value={formData.locationNotes}
            onChange={handleLocationNotesChange}
            className="min-h-[150px] rounded-xl border border-gray-200 resize-none"
          />
          <div className="flex justify-between text-sm mt-2 text-gray-400">
            <span className="mt-1 block">
              Optional: Add any additional location information
            </span>
            <span>{formData.locationNotes.length}/500 characters</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col space-y-2">
        <div className="flex justify-end">
          <Button
            onClick={onNext}
            disabled={!isComplete}
            className={`rounded-lg px-6 ${isComplete
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
            To continue, please fill in:
            {!formData.address && <div>• Property address</div>}
          </div>
        )}
      </div>
    </div>
  );
};

export default Location;