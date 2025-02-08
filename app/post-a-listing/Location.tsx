import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import PreviewButton from "./PreviewButton";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";

// Location Component
const Location = ({
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
  const isComplete = Boolean(formData.address);

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, address: e.target.value });
  };

  const handleLocationNotesChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, locationNotes: e.target.value });
  };


  return (
    <div>
      <div className="flex flex-row justify-between">
        <div>
          <h1 className="text-2xl font-semibold mb-3">Location</h1>
        </div>

        <PreviewButton formData={formData} />
      </div>
      <h2 className="text-sm font-bold">
        Add details about where your listing is.
      </h2>

      <div>
        <h2 className="text-2xl font-medium mb-2 mt-10">Address</h2>
        <p className="text-gray-400 text-sm mb-5">
          Use the following format:{" "}
          <span className="text-gray-600">
            123 Sammy Blvd, Houston, TX 77005
          </span>
        </p>
        <div className="relative">
          <Input
            placeholder="Ex: 123 Sammy Blvd, Houston, TX 77005"
            value={formData.address}
            onChange={handleAddressChange}
            className={`w-full rounded-xl border border-gray-200 px-3 placeholder:text-gray-400 py-6`}
          />
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-medium mb-2 mt-10">Special Notes</h2>
        <p className="text-gray-400 text-sm mb-5">
          <span className="text-gray-500 font-semibold">This is optional!</span>{" "}
          You can include information relevant to location.{" "}
        </p>
        <div className="relative">
          <Textarea
            placeholder="Ex: Distance from Rice. 
            Distance from Fondren Library. 
            Estimated bike ride duration."
            value={formData.locationNotes}
            onChange={handleLocationNotesChange}
            maxLength={500}
            className="min-h-[150px] rounded-xl border border-gray-200 resize-none placeholder:text-gray-400 py-3"
          />
          <div className="flex justify-between mt-5 text-sm text-gray-400 mb-10">
            <span
              className={
                formData.locationNotes.length >= 100
                  ? "text-green-500"
                  : "text-gray-400"
              }
            >
              {formData.locationNotes.length >= 100
                ? "✓ Minimum reached"
                : "Minimum 100 characters"}
            </span>
            <span>
              <span className="text-gray-500 font-semibold">
                {formData.locationNotes.length}
              </span>
              /500 characters
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-col space-y-2 mt-10">
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

export default Location;
