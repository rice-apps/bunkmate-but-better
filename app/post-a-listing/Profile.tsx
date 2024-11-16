import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { FiUpload } from "react-icons/fi";
import { useState } from "react";
import ProfilePictureModal from "./ProfilePictureModal";

// Profile Component

function UploadButton({ formData, setFormData }: { formData: any; setFormData: any }) {
  const handleFileChange = (event: any) => {
    const file = event.target.files[0];
    if (file) {
      setFormData({ ...formData, profilePicture: file.name });
    }
  };

  const handleButtonClick = () => {
    const fileInput = document.getElementById("fileInput");
    if (fileInput) {
      (fileInput as HTMLInputElement).click();
    }
  };

  return (
    <div>
      <button
        type="button"
        className="flex flex-col items-center justify-center w-32 h-32 bg-gray-100 border border-gray-300 rounded-full text-gray-600 hover:bg-gray-200"
        onClick={handleButtonClick}
      >
        <FiUpload className="text-5xl text-gray-500 mb-2 align-center" />
        <span className="text-sm text-gray-500 text-center">Upload File</span>
      </button>
      <input
        id="fileInput"
        type="file"
        className="hidden"
        onChange={handleFileChange}
      />
      {formData.profilePicture && (
        <p className="mt-2 text-sm text-gray-500">
          Selected file: <span className="font-medium">{formData.profilePicture}</span>
        </p>
      )}
    </div>
  );
}

const Profile = ({ formData, setFormData }: { formData: any; setFormData: any }) => (
  <div className="space-y-8 w-full">
    <div className="space-y-8">
      <h1 className="text-3xl font-medium mb-4 text-[#222222]">Profile</h1>
      <p className="mb-4 text-sm text-[#222222] font-bold">Add your profile information!</p>
      <p className="mb-4 text-sm text-[#222222] font-bold">The information you share here will be used to help people interested in your listing to connect with you.</p>
    </div>
    <div className="space-y-8">
      <h2 className="text-2xl font-medium mb-4">Rice Affiliation</h2>
      <p className="mb-2 text-sm text-gray-400">Below, select the option that applies to you:</p>
      <div className="space-y-8">
      <RadioGroup
        value={formData.affiliation}
        onValueChange={(value) => setFormData({ ...formData, affiliation: value })}
      >
        <div
          className={`flex items-center w-[26rem] h-[3.75rem] space-x-2 p-4 rounded-xl border 
          ${
            formData.affiliation === 'rice'
              ? 'border-[#FF7439] bg-[#FF7439]/10'
              : 'border-[#B5B5B5] bg-gray-50'
          }`}
        >
          <RadioGroupItem
            value="rice"
            className={`content-none border-2 rounded-full w-4 h-4 ${
              formData.affiliation === 'rice'
                ? 'border-[#777777] bg-[#FF7439]'
                : 'border-[#777777] bg-white'
            }`}
          />
          <label className="text-sm text-[#777777] font-medium">I am a Rice student</label>
        </div>
        <div
          className={`flex items-center w-[26rem] h-[3.75rem] space-x-2 p-4 rounded-xl border 
          ${
            formData.affiliation === 'alum'
              ? 'border-[#FF7439] bg-[#FF7439]/10'
              : 'border-[#B5B5B5] bg-gray-50'
          }`}
        >
          <RadioGroupItem
            value="alum"
            className={`content-none border-2 rounded-full w-4 h-4 ${
              formData.affiliation === 'alum'
                ? 'border-[#777777] bg-[#FF7439]'
                : 'border-[#777777] bg-white'
            }`}
          />
          <label className="text-sm text-[#777777] font-medium">I am a Rice alum</label>
        </div>
      </RadioGroup>
      </div>
    </div>
    
    <div className="space-y-8">
      <h2 className="text-2xl font-medium mb-4">Name</h2>
      <p className="mb-2 text-sm text-gray-400">If Rice student: Make sure this matches the name on your Rice Student ID.<br/>If not Rice-affiliated: Make sure this matches the name on your government ID.</p>
      <div className="flex space-x-4 mb-6">
        <Input
          placeholder="First name on ID"
          value={formData.firstName}
          onChange={(e) => setFormData({...formData, firstName: e.target.value})}
          className="w-[26rem] h-[3.75rem] p-4 rounded-xl border border-[#B5B5B5]"
        />
        <Input
          placeholder="Last name on ID"
          value={formData.lastName}
          onChange={(e) => setFormData({...formData, lastName: e.target.value})}
          className="w-[26rem] h-[3.75rem] p-4 rounded-xl border border-[#B5B5B5]"
        />
      </div>
      
      {/* <h2 className="text-2xl font-medium mb-2">Profile Picture</h2>
      <p className="mb-4 text-sm text-gray-400">
        Upload your profile picture. Please make sure your face is recognizable!
      </p>
      <div className="mb-6">
        <UploadButton formData={formData} setFormData={setFormData} />
      </div> */}
      
      <h2 className="text-2xl font-medium mb-2">Profile Picture</h2>
      <p className="mb-4 text-sm text-gray-400">
        Upload your profile picture. Please make sure your face is recognizable!
      </p>
      <div className="mb-6">
        <ProfilePictureModal>
          <button
            type="button"
            className="flex flex-col items-center justify-center w-32 h-32 bg-gray-100 border border-gray-300 rounded-full text-gray-600 hover:bg-gray-200"
          >
            <FiUpload className="mr-1 align-center text-gray-500 text-4xl" />
            <span className="text-sm font-medium text-gray-500">Upload File</span>
          </button>
        </ProfilePictureModal>
      </div>
      
      <div className="space-y-8">
        <h2 className="text-2xl font-medium mb-4">Email Address</h2>
        <p className="mb-4 text-sm text-gray-400">
          Use the address that you’d like to be contacted with.
        </p>
        <div className="mb-6">
        <Input
            type="email"
            placeholder="Email address"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            className="w-[53.125rem] h-[3.75rem] p-4 rounded-xl border border-[#B5B5B5]"
          />
        </div>
      </div>
      
      <div className="space-y-8">
        <h2 className="text-2xl font-medium mb-4">Phone Number</h2>
        <p className="mb-4 text-sm text-gray-400">
          Use the number you’d like to be contacted with.
        </p>
        <div>
          <Input
            type="tel"
            placeholder="+1 (XXX) XXX-XXX"
            value={formData.phone}
            onChange={(e) => {
              const value = e.target.value;
              if (/^\+?[0-9\s()-]*$/.test(value)) {
                setFormData({ ...formData, phone: value });
              }
            }}
            maxLength={15}
            className="w-[53.125rem] h-[3.75rem] p-4 rounded-xl border border-[#B5B5B5]"
          />
        </div>
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