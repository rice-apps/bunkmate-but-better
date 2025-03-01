import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FaChevronRight } from "react-icons/fa";
import PreviewButton from "./PreviewButton";
import { FormDataType } from "./page";

const BedBath = ({formData, setFormData}: {formData: FormDataType; setFormData: any}) => {
  const handleBedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFormData = {...formData, bed_num: e.target.valueAsNumber};
    setFormData(newFormData);
  };

  const handleBathChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFormData = {...formData, bath_num: e.target.valueAsNumber};
    setFormData(newFormData);
  };

  return (
    <div className="flex gap-10">
      <div>
        <h2 className="text-2xl font-medium mb-2 mt-10">Beds</h2>
        <p className="text-gray-400 text-sm mb-5">Please indicate the number of beds available for your listing.</p>
        <div className="relative">
          <Input
            placeholder="Ex: 2"
            value={formData.bed_num}
            onChange={handleBedChange}
            type="number"
            min={0}
            step={1}
            pattern="[0-9]"
            className="w-full rounded-xl border-[1px] border-gray-300 placeholder:text-gray-400 py-6"
          />
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-medium mb-2 mt-10">Baths</h2>
        <p className="text-gray-400 text-sm mb-5">Please indicate the number of baths available for your listing.</p>
        <div className="relative">
          <Input
            placeholder="Ex: 5"
            value={formData.bath_num}
            onChange={handleBathChange}
            type="number"
            min={0}
            step={1}
            pattern="[0-9]"
            className="w-full rounded-xl border-[1px] border-gray-300 placeholder:text-gray-400 py-6"
          />
        </div>
      </div>
    </div>
  );
};

const TitleDescription = ({formData, setFormData, onNext}: {formData: any; setFormData: any; onNext: () => void}) => {
  console.log("TitleDescription", formData);
  const isComplete = formData.title.length >= 1 && 
    formData.description.length >= 100 && 
    !isNaN(formData.bath_num) && 
    !isNaN(formData.bed_num) && 
    Number.isInteger(Number(formData.bath_num)) && 
    Number.isInteger(Number(formData.bed_num)) && 
    Number(formData.bath_num) >= 0 && 
    Number(formData.bed_num) >= 0;

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFormData = {...formData, title: e.target.value};
    setFormData(newFormData);
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newFormData = {...formData, description: e.target.value};
    setFormData(newFormData);
  };

  return (
    <div>
      <div className="flex flex-row justify-between flex-wrap-reverse gap-4 pb-2 items-center">
        <div>
          <h1 className="text-2xl font-semibold mb-3">Title & Description</h1>
        </div>
        <PreviewButton formData={formData} />
      </div>
      <h2 className="text-sm font-bold mt-0 leading-tight">Add details about what your listing is like here.</h2>

      <div>
        <h2 className="text-2xl font-medium mb-2 mt-10">Title</h2>
        <p className="text-gray-400 text-sm mb-5">
          Please write a short descriptive title for your listing. Do not include the address here.
        </p>
        <div className="relative">
          <Input
            placeholder="Ex: Life Tower"
            value={formData.title}
            onChange={handleTitleChange}
            maxLength={50}
            className="w-full rounded-xl border-[1px] border-gray-300 placeholder:text-gray-400 py-6"
          />
          <div className="flex mt-3 justify-end">
            <span className="text-sm text-gray-400">
              <span className="text-gray-500 font-semibold">{formData.title.length}</span>
              /50 characters
            </span>
          </div>
        </div>
      </div>

      <BedBath formData={formData} setFormData={setFormData} />

      <div>
        <h2 className="text-2xl font-medium mb-2 mt-10">Description</h2>
        <p className="text-gray-400 text-sm mb-5">
          Share a general description of the property so potential subleasers/roommates know what to expect.
        </p>
        <div className="relative">
          <Textarea
            placeholder="Ex: Life Tower is a modern high-rise apartment complex near Rice University, offering student-friendly housing with various amenities like a fitness center, study lounges, and a rooftop pool. It provides convenient access to campus and nearby attractions, making it a popular choice for Rice students seeking off-campus living with a community vibe."
            value={formData.description}
            onChange={handleDescriptionChange}
            className="min-h-[200px] rounded-xl border border-gray-200 resize-none placeholder:text-gray-400"
            maxLength={500}
          />
          <div className="flex justify-between mt-5 text-sm text-gray-400 mb-10">
            <span className={formData.description.length >= 100 ? "text-green-500" : "text-gray-400"}>
              {formData.description.length >= 100 ? "✓ Minimum reached" : "Minimum 100 characters"}
            </span>
            <span>
              <span className="text-gray-500 font-semibold">{formData.description.length}</span>
              /500 characters
            </span>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
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
  );
};

export default TitleDescription;
