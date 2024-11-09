import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

// Location Component
const Location = ({ formData, setFormData }: { formData: any; setFormData: any }) => (
  <div className="space-y-8 w-full">
    <div>
      <h2 className="text-2xl font-medium mb-4">Address</h2>
      <div className="relative">
        <Input
          placeholder="Ex: 123 Sammy Blvd, Houston, TX 77005"
          value={formData.address}
          onChange={(e) => setFormData({...formData, address: e.target.value})}
          className="w-full rounded-xl border border-gray-200"
        />
      </div>
    </div>
    
    <div>
      <h2 className="text-2xl font-medium mb-4">Special Notes</h2>
      <div className="relative">
        <Textarea
          placeholder="Ex: Distance from Rice. Distance from Fondren Library. Estimated bike ride duration."
          value={formData.locationNotes}
          onChange={(e) => setFormData({...formData, locationNotes: e.target.value})}
          className="min-h-[150px] rounded-xl border border-gray-200 resize-none"
        />
      </div>
    </div>

    <div className="flex justify-end">
      <Button className="bg-[#FF7439] hover:bg-[#FF7439]/90 rounded-lg px-6">
        Next
      </Button>
    </div>
  </div>
);

export default Location;