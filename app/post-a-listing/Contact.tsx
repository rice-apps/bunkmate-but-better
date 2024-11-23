import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Contact Component
const Contact = ({ formData, setFormData, handleSubmit }: { formData: any; setFormData: any, handleSubmit: any }) => (
  <div className="space-y-8 w-full">
    <div>
      <h2 className="text-2xl font-medium mb-4">Affiliation</h2>
      <div className="space-y-2">
        <label className="flex items-center space-x-2">
          <input
            type="radio"
            value="rice"
            checked={formData.affiliation === 'rice'}
            onChange={(e) => setFormData({...formData, affiliation: e.target.value})}
            className="rounded-full"
          />
          <span>Rice Student</span>
        </label>
        <label className="flex items-center space-x-2">
          <input
            type="radio"
            value="alum"
            checked={formData.affiliation === 'alum'}
            onChange={(e) => setFormData({...formData, affiliation: e.target.value})}
            className="rounded-full"
          />
          <span>Rice Alum</span>
        </label>
        <label className="flex items-center space-x-2">
          <input
            type="radio"
            value="none"
            checked={formData.affiliation === 'none'}
            onChange={(e) => setFormData({...formData, affiliation: e.target.value})}
            className="rounded-full"
          />
          <span>Not Rice Affiliated</span>
        </label>
      </div>
    </div>
    
    <div>
      <h2 className="text-2xl font-medium mb-4">Contact Information</h2>
      <div className="space-y-4">
        <Input
          placeholder="Name (First & Last)"
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
          className="w-full rounded-xl border border-gray-200"
        />
        <Input
          type="email"
          placeholder="Email address"
          value={formData.email}
          onChange={(e) => setFormData({...formData, email: e.target.value})}
          className="w-full rounded-xl border border-gray-200"
        />
        <Input
          type="tel"
          placeholder="Phone number"
          value={formData.phone}
          onChange={(e) => setFormData({...formData, phone: e.target.value})}
          className="w-full rounded-xl border border-gray-200"
        />
      </div>
    </div>

    <div className="flex justify-end">
      <Button onClick={handleSubmit} className="bg-[#FF7439] hover:bg-[#FF7439]/90 rounded-lg px-6">
        Post
      </Button>
    </div>
  </div>
);

export default Contact;