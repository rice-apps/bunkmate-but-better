import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import PreviewButton from "./PreviewButton";

// Pricing Component
const Pricing = ({ formData, setFormData, onNext }: {
  formData: any;
  setFormData: any;
  onNext: () => void;
}) => {
  const isComplete = Boolean(formData.price);

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Ensure the rent is a positive number
    if (Number(value) >= 0 || value === '') {
      setFormData({ ...formData, price: value });
    }
  };

  const handlePriceNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData({ ...formData, priceNotes: e.target.value });
  };

  return (
    <div className="space-y-8 w-full">
      <div className="flex flex-row justify-between mb-12">
        <div>
          <h1 className="text-2xl font-semibold mb-3">
            Pricing
          </h1>
          <h2 className="text-sm font-[500] text-gray-500">Add details about all things money here. </h2>
        </div>

        <PreviewButton formData={formData} />
      </div>
      
      <div>
        <h2 className="text-2xl font-medium mb-2">Monthly Rent</h2>
        <span className="text-sm text-gray-400 mb-5 block">
          Required: Please enter the monthly rent
        </span>
        <div className="relative">
          <span className="absolute left-3 top-[13px]">$</span>
          <Input
            type="number"
            placeholder="$ 1350"
            value={formData.price}
            onChange={handlePriceChange}
            className={`w-full rounded-xl border border-gray-200`}
          />
          {!formData.price && (
            <span className="text-sm text-gray-400 mt-1 block">
              Required: Please enter the monthly rent
            </span>
          )}
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-medium mb-2">Special Notes</h2>
        <p className="text-sm text-gray-400 mb-5"><span className="font-semibold text-gray-500">This is optional!</span> You can include information such as any breaks in your lease, or variable payment per month. </p>
        <div className="relative">
          <Textarea
            placeholder="Ex: Parking spot prices, willing to negotiate rent..."
            value={formData.specialNotes}
            onChange={handlePriceNotesChange}
            maxLength={500}
            className="min-h-[150px] rounded-xl border border-gray-200 resize-none placeholder:text-gray-400 py-3"
          />
          <div className="flex justify-end mt-2 text-sm text-gray-400">
            <span>{formData.priceNotes.length}/500 characters</span>
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

      {/* Optional: Show completion status */}
      {!isComplete && (
        <div className="text-sm text-gray-500 text-right mt-2">
          To continue, please fill in:
          <ul>
            {!formData.price && <li>• Monthly rent</li>}
          </ul>
        </div>
      )}

        {/* Optional: Show completion status */}
        {!isComplete && (
          <div className="text-sm text-gray-500 text-right mt-2">
            To continue, please fill in:
            {!formData.monthlyRent && <div>• Monthly rent</div>}
          </div>
        )}
      </div>
    </div>
  );
};

export default Pricing