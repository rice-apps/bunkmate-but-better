import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

// Pricing Component
const Pricing = ({ formData, setFormData, onNext }: { 
  formData: any; 
  setFormData: any;
  onNext: () => void;
}) => {
  const isComplete = Boolean(formData.monthlyRent && formData.utilities);

  const handleMonthlyRentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Ensure the rent is a positive number
    if (Number(value) >= 0 || value === '') {
      setFormData({...formData, monthlyRent: value});
    }
  };

  const handleUtilitiesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData({...formData, utilities: e.target.value});
  };

  const handleSpecialNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData({...formData, specialNotes: e.target.value});
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
        <h2 className="text-2xl font-medium mb-4">Utilities</h2>
        <div className="relative">
          <Textarea
            placeholder="Ex: Utilities not included in rent/month."
            value={formData.utilities}
            onChange={handleUtilitiesChange}
            className={`min-h-[150px] rounded-xl border resize-none border-gray-200`}
          />
          {!formData.utilities && (
            <span className="text-sm text-gray-400 mt-1 block">
              Required: Please provide utilities information
            </span>
          )}
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-medium mb-4">Special Notes</h2>
        <div className="relative">
          <Textarea
            placeholder="Ex: Parking spot prices."
            value={formData.specialNotes}
            onChange={handleSpecialNotesChange}
            className="min-h-[150px] rounded-xl border border-gray-200 resize-none"
          />
          <span className="text-sm text-gray-400 mt-1 block">
            Optional: Add any additional pricing information
          </span>
        </div>
      </div>

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

      {/* Optional: Show completion status */}
      {!isComplete && (
        <div className="text-sm text-gray-500 text-right mt-2">
          To continue, please fill in:
          <ul>
            {!formData.monthlyRent && <li>• Monthly rent</li>}
            {!formData.utilities && <li>• Utilities information</li>}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Pricing