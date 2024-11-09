// Pricing Component
const Pricing = ({ formData, setFormData }: { formData: any; setFormData: any }) => (
  <div className="space-y-8 w-full">
    <div>
      <h2 className="text-2xl font-medium mb-4">Monthly Rent</h2>
      <div className="relative">
        <Input
          type="number"
          placeholder="$ 1350"
          value={formData.monthlyRent}
          onChange={(e) => setFormData({...formData, monthlyRent: e.target.value})}
          className="w-full rounded-xl border border-gray-200"
        />
      </div>
    </div>
    
    <div>
      <h2 className="text-2xl font-medium mb-4">Utilities</h2>
      <div className="relative">
        <Textarea
          placeholder="Ex: Utilities not included in rent/month."
          value={formData.utilities}
          onChange={(e) => setFormData({...formData, utilities: e.target.value})}
          className="min-h-[150px] rounded-xl border border-gray-200 resize-none"
        />
      </div>
    </div>

    <div>
      <h2 className="text-2xl font-medium mb-4">Special Notes</h2>
      <div className="relative">
        <Textarea
          placeholder="Ex: Parking spot prices."
          value={formData.specialNotes}
          onChange={(e) => setFormData({...formData, specialNotes: e.target.value})}
          className="min-h-[150px] rounded-xl border border-gray-200 resize-none"
        />
      </div>
    </div>

    <div className="flex justify-end">
      <Button onClick={() => console.log(formData)} className="bg-[#FF7439] hover:bg-[#FF7439]/90 rounded-lg px-6">
        Next
      </Button>
    </div>
  </div>
);

export default Pricing