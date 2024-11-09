import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Contact Component
const Profile = ({ formData, setFormData }: { formData: any; setFormData: any }) => (
  <div className="space-y-8 w-full">
    <div>
      <h2 className="text-2xl font-medium mb-4">Rice Affiliation</h2>
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
      <h2 className="text-2xl font-medium mb-4">Name</h2>
      <div className="space-y-4">
        <Input
          placeholder="Name (First & Last)"
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
          className="w-full rounded-xl border border-gray-200"
        />
      </div>
      <h2 className="text-2xl font-medium mb-4">Email Address</h2>
      <h2 className="text-2xl font-medium mb-4">Phone Number</h2>
      <div className="space-y-4">
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
      <Button className="bg-[#FF7439] hover:bg-[#FF7439]/90 rounded-lg px-6">
        Post
      </Button>
    </div>
  </div>
);

export default Profile;