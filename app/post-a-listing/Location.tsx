import {Button} from "@/components/ui/button";
import {Textarea} from "@/components/ui/textarea";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";
import {FaChevronLeft, FaChevronRight} from "react-icons/fa6";
import PreviewButton from "./PreviewButton";
import { FormDataType } from "./page";

const Location = ({
  formData,
  setFormData,
  onNext,
  onBack,
}: {
  formData: FormDataType;
  setFormData: any;
  onNext: () => void;
  onBack: () => void;
}) => {
  const isComplete = Boolean(formData.address);

  const handleSelect = (value: any) => {
    if (value && value.label) {
      setFormData({...formData, address: value});
    }
  };

  const handleLocationNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData({...formData, locationNotes: e.target.value});
  };

  return (
    <div>
      <div className="flex flex-row justify-between flex-wrap-reverse gap-4 pb-2 items-center">
        <div>
          <h1 className="text-2xl font-semibold mb-3">Location</h1>
        </div>

        <PreviewButton formData={formData} />
      </div>
      <h2 className="text-sm font-bold">Add details about where your listing is.</h2>

      <div>
        <h2 className="text-2xl font-medium mb-2 mt-10">Address</h2>
        <p className="text-gray-400 text-sm mb-5">
          Use the following format: <span className="text-gray-600">123 Sammy Blvd, Houston, TX</span>
        </p>
        <div className="relative text-sm">
          <GooglePlacesAutocomplete
            apiKey={process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY}
            selectProps={{
              isClearable: true,
              value: formData.address.label ? formData.address : null,
              onChange: (value: any) => {
                if (value && value.label) {
                  handleSelect(value);
                } else {
                  setFormData({...formData, address: {label: ""}});
                }
              },
              placeholder: "Ex: 123 Sammy Blvd, Houston, TX",
              styles: {
                placeholder: (provided: any) => ({
                  ...provided,
                  color: "#aaa", 
                }),
              },
            }}
          />
        </div>
      </div>

      <div className="mt-10">
        <h2 className="text-2xl font-medium mb-2">Special Notes</h2>
        <p className="text-gray-400 text-sm mb-5">
          <span className="text-gray-500 font-semibold">This is optional!</span> You can include information relevant to
          location.
        </p>
        <div className="relative">
          <Textarea
            placeholder={`Ex: Distance from Rice. Distance from Fondren Library. Estimated bike ride duration.`}
            value={formData.locationNotes}
            onChange={handleLocationNotesChange}
            className="min-h-[150px] rounded-xl border border-gray-200 resize-none placeholder:text-gray-400 py-3"
          />
          <div className="flex justify-end text-sm mt-2 text-gray-400">
            <span>
              <span className="font-semibold text-gray-500">{formData.locationNotes.length}</span>
              /500 characters
            </span>
          </div>
        </div>
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
      </div>
    </div>
  );
};

export default Location;
