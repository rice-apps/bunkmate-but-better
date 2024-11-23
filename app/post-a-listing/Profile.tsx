import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { FiUpload } from "react-icons/fi";
import { useState } from "react";
import ProfilePictureModal from "./ProfilePictureModal";
import Link from "next/link";

// Profile Component

// function UploadButton({
//   formData,
//   setFormData,
// }: {
//   formData: any;
//   setFormData: any;
// }) {
//   const handleFileChange = (event: any) => {
//     const file = event.target.files[0];
//     if (file) {
//       setFormData({ ...formData, profilePicture: file.name });
//     }
//   };

//   const handleButtonClick = () => {
//     const fileInput = document.getElementById("fileInput");
//     if (fileInput) {
//       (fileInput as HTMLInputElement).click();
//     }
//   };

//   return (
//     <div>
//       <button
//         type="button"
//         className="flex flex-col items-center justify-center w-32 h-32 bg-gray-100 border border-gray-300 rounded-full text-gray-600 hover:bg-gray-200"
//         onClick={handleButtonClick}
//       >
//         <FiUpload className="text-5xl text-gray-500 mb-2 align-center" />
//         <span className="text-sm text-gray-500 text-center">Upload File</span>
//       </button>
//       <input
//         id="fileInput"
//         type="file"
//         className="hidden"
//         onChange={handleFileChange}
//       />
//       {formData.profilePicture && (
//         <p className="mt-2 text-sm text-gray-500">
//           Selected file:{" "}
//           <span className="font-medium">{formData.profilePicture}</span>
//         </p>
//       )}
//     </div>
//   );
// }

const Profile = ({
  formData,
  setFormData,
}: {
  formData: any;
  setFormData: any;
}) => (
  <div className="space-y-8 w-full">
    <div>
      <h1 className="text-3xl font-medium mb-4 text-[#222222]">Profile</h1>
      <p className="mb-4 text-sm text-[#222222] font-bold">
        Below is your current profile information. If you want to change this
        information, go to the <Link href='/profile-section' className="font-bold text-[#FF7439]">Profiles Section</Link>.
      </p>
    </div>
    <div className="grid grid-cols-[1fr_2fr] items-start">
      <div>
        <h2 className="text-2xl font-medium mb-4">Profile Picture</h2>
        <div className="flex items-center justify-center w-28 h-28 bg-gray-100 border border-gray-300 rounded-full text-gray-500">
          profile pic
        </div>
      </div>
      <div>
        <h2 className="text-2xl font-medium mb-4">Name</h2>
        <p className="mb-6 text-sm text-gray-400">First Last</p>
        <h2 className="text-2xl font-medium mb-4">Email address</h2>
        <p className="mb-6 text-sm text-gray-400">netid@rice.edu</p>
      </div>
    </div>
    <hr></hr>
    <div>
      <p className="mb-4 text-sm text-[#222222] font-bold">
        Input your information below.
      </p>
      <p className="mb-4 text-sm text-[#222222] font-bold">
        These will be displayed and used to help people interested in your
        listing connect with you.
      </p>
    </div>
    <div>
      <h2 className="text-2xl font-medium mb-4">Rice Affiliation</h2>
      <p className="mb-2 text-sm text-gray-400">
        Below, select the option that applies to you:
      </p>
      <div className="space-y-8">
        <RadioGroup
          value={formData.affiliation}
          onValueChange={(value) =>
            setFormData({ ...formData, affiliation: value })
          }
        >
          <div
            className={`flex items-center w-[23rem] space-x-2 p-4 rounded-xl border-2 
          ${
            formData.affiliation === "rice"
              ? "border-[#FF7439] bg-[#FF7439]/10"
              : "border-[#B5B5B5] bg-gray-50"
          }`}
          >
            <RadioGroupItem
              value="rice"
              className={`content-none border-2 rounded-full w-4 h-4 ${
                formData.affiliation === "rice"
                  ? "border-none bg-[#FF7439]"
                  : "border-[#777777] bg-white"
              }`}
            />
            <label className="text-sm text-[#777777] font-medium">
              I am a Rice student
            </label>
          </div>
          <div
            className={`flex items-center w-[23rem] space-x-2 p-4 rounded-xl border-2 
          ${
            formData.affiliation === "alum"
              ? "border-[#FF7439] bg-[#FF7439]/10"
              : "border-[#B5B5B5] bg-gray-50"
          }`}
          >
            <RadioGroupItem
              value="alum"
              className={`content-none border-2 rounded-full w-4 h-4 ${
                formData.affiliation === "alum"
                  ? "border-none bg-[#FF7439]"
                  : "border-[#777777] bg-white"
              }`}
            />
            <label className="text-sm text-[#777777] font-medium">
              I am a Rice alum
            </label>
          </div>
        </RadioGroup>
      </div>
    </div>
    <div>
      <div>
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
            className="p-4 rounded-xl border border-[#B5B5B5]"
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
