import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const TitleDescription = ({ formData, setFormData }: { formData: any; setFormData: any }) => (
  <div className="space-y-8 w-full">
    <div>
      <h2 className="text-2xl font-medium mb-4">Title</h2>
      <div className="relative">
        <Input
          placeholder="Life Tower"
          value={formData.title}
          onChange={(e) => setFormData({...formData, title: e.target.value})}
          maxLength={50}
          className="w-full rounded-xl border border-gray-200"
        />
        <span className="absolute right-2 top-2 text-sm text-gray-400">
          {formData.title.length}/50 characters
        </span>
      </div>
    </div>
    
    <div>
      <h2 className="text-2xl font-medium mb-4">Description</h2>
      <div className="relative">
        <Textarea
          placeholder="Share a general description of the property so potential subleasers/roommates know what to expect."
          value={formData.description}
          onChange={(e) => setFormData({...formData, description: e.target.value})}
          className="min-h-[200px] rounded-xl border border-gray-200 resize-none"
          maxLength={500}
        />
        <div className="flex justify-between mt-2 text-sm text-gray-400">
          <span>Minimum 100 characters</span>
          <span>{formData.description.length}/500 characters</span>
        </div>
      </div>
    </div>

    <div className="flex justify-end">
      <Button 
        className="bg-[#FF7439] hover:bg-[#FF7439]/90 rounded-lg px-6"
      >
        Next
      </Button>
    </div>
  </div>
);

export default TitleDescription;