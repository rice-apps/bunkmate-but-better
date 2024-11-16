import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

// Pricing Component
const Pricing = ({ formData, setFormData, onNext }: {
  formData: any;
  setFormData: any;
  onNext: () => void;
}) => {
  const isComplete = Boolean(formData.monthlyRent);

  const handleMonthlyRentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Ensure the rent is a positive number
    if (Number(value) >= 0 || value === '') {
      setFormData({ ...formData, monthlyRent: value });
    }
  };

  const handleSpecialNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData({ ...formData, specialNotes: e.target.value });
  };

  return (
    <div className="space-y-8 w-full">
      <div>
        <h2 className="text-2xl font-medium mb-4">Monthly Rent</h2>
        <div className="relative">
          <Input
            type="number"
            placeholder="$ 1350"
            value={formData.monthlyRent}
            onChange={handleMonthlyRentChange}
            className={`w-full rounded-xl border border-gray-200`}
          />
          {!formData.monthlyRent && (
            <span className="text-sm text-gray-400 mt-1 block">
              Required: Please enter the monthly rent
            </span>
          )}
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-medium mb-1">Special Notes</h2>
        <p className="text-sm text-gray-400 mb-4"><span className="font-bold text-gray-600">This is optional!</span> You can include information such as any breaks in your lease, or variable payment per month. </p>
        <div className="relative">
          <Textarea
            placeholder="Ex: Parking spot prices, willing to negotiate rent..."
            value={formData.specialNotes}
            onChange={handleSpecialNotesChange}
            maxLength={500}
            className="min-h-[150px] rounded-xl border border-gray-200 resize-none"
          />
          <div className="flex justify-end mt-2 text-sm text-gray-400">
            <span>{formData.specialNotes.length}/500 characters</span>
          </div>
        </div>
      </div>

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
            {!formData.monthlyRent && <li>• Monthly rent</li>}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Pricing