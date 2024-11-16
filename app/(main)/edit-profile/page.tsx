"use client";

import React, {useState, useCallback} from 'react'
import { Input } from "@/components/ui/input";
import { Upload, X } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Cropper from 'react-easy-crop';

const EditProfile = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [isCropping, setIsCropping] = useState(false);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedFile(reader.result);
        setIsCropping(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const onCropComplete = useCallback((croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const createCroppedImage = async () => {
    try {
      const image = new Image();
      image.src = selectedFile;
      await new Promise((resolve) => {
        image.onload = resolve;
      });

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      canvas.width = croppedAreaPixels.width;
      canvas.height = croppedAreaPixels.height;

      ctx.drawImage(
        image,
        croppedAreaPixels.x,
        croppedAreaPixels.y,
        croppedAreaPixels.width,
        croppedAreaPixels.height,
        0,
        0,
        croppedAreaPixels.width,
        croppedAreaPixels.height
      );

      const croppedImageUrl = canvas.toDataURL('image/jpeg');
      setSelectedFile(croppedImageUrl);
      setIsCropping(false);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <main className='w-full h-full max-w-[1200px]'>
      {/* Heading */}
      <h1 className='text-3xl font-semibold'>Profile Editor</h1>
      <p className='mt-4 text-gray-600'>Welcome to your profile editor! Here, you can edit your personal information. </p>

      <div className='w-full flex justify-between items-center mt-14'>
        <h2 className='text-2xl font-medium'>Your Profile Information</h2>
        <div className='px-6 py-2 rounded-lg bg-[#FF7439] hover:bg-[#FF7439]/80 hover:cursor-pointer hover:scale-105 transition duration-300'>
          <p className='text-white font-medium'>Save</p>
        </div>
      </div>

      <div className='flex flex-row w-full h-full space-x-5 mt-14 mb-20'>
        {/* Right Hand Side */}
        <div className='w-1/3 h-full'>
          {/* Description */}
          <h2 className='text-2xl font-medium'>Profile Picture</h2>
          <p className='mt-2 text-gray-400 text-sm'>Upload your profile picture.</p>
          <p className='text-gray-400 text-sm'>Please make sure your face is recognizable! </p>

          {/* Upload Photo */}
          <div className='mt-8 w-40 h-40 relative'>
            <div
              onClick={() => setIsModalOpen(true)}
              className={`w-full h-full rounded-full border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:border-gray-400 transition-colors ${
                selectedFile ? 'bg-gray-100' : 'bg-gray-50'
              }`}
            >
              {selectedFile ? (
                <img
                  src={selectedFile}
                  alt="Profile preview"
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <>
                  <Upload className="w-8 h-8 text-gray-400" />
                  <span className="mt-2 text-sm text-gray-500">Upload File</span>
                </>
              )}
            </div>
          </div>

          {/* Upload Modal */}
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogContent className={`max-w-md ${isCropping ? 'max-h-[700px]' : ''}`}>
              <DialogHeader>
                <DialogTitle>Profile Picture</DialogTitle>
              </DialogHeader>
              <div className="p-6">
                <p className="text-sm text-gray-500 text-center mb-8">
                  Upload your profile picture. Please make sure your face is recognizable!
                </p>
                
                {isCropping ? (
                  <div className="relative h-80 mb-6">
                    <Cropper
                      image={selectedFile}
                      crop={crop}
                      zoom={zoom}
                      aspect={1}
                      onCropChange={setCrop}
                      onZoomChange={setZoom}
                      onCropComplete={onCropComplete}
                      cropShape="round"
                      showGrid={false}
                    />
                  </div>
                ) : (
                  <div className="w-32 h-32 mx-auto mb-6">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="profile-upload"
                    />
                    <label
                      htmlFor="profile-upload"
                      className={`w-full h-full rounded-full border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:border-gray-400 transition-colors ${
                        selectedFile ? 'bg-gray-100' : 'bg-gray-50'
                      }`}
                    >
                      {selectedFile ? (
                        <img
                          src={selectedFile}
                          alt="Profile preview"
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <>
                          <Upload className="w-8 h-8 text-gray-400" />
                          <span className="mt-2 text-sm text-gray-500">Upload File</span>
                        </>
                      )}
                    </label>
                  </div>
                )}

                <div className="flex justify-center space-x-4">
                  {isCropping ? (
                    <>
                      <Button
                        variant="outline"
                        onClick={() => setIsCropping(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={createCroppedImage}
                        className="bg-gray-600 hover:bg-gray-700 text-white"
                      >
                        Crop Image
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        variant="outline"
                        onClick={() => {
                          document.getElementById('profile-upload').click();
                        }}
                      >
                        Change
                      </Button>
                      <Button
                        onClick={() => setIsModalOpen(false)}
                        className="bg-gray-600 hover:bg-gray-700 text-white"
                      >
                        Done
                      </Button>
                    </>
                  )}
                </div>

                {isCropping && (
                  <div className="mt-4">
                    <label className="text-sm text-gray-500 block mb-2">Zoom</label>
                    <input
                      type="range"
                      value={zoom}
                      min={1}
                      max={3}
                      step={0.1}
                      aria-labelledby="Zoom"
                      onChange={(e) => setZoom(parseFloat(e.target.value))}
                      className="w-full"
                    />
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>

          {/* Rice Affiliation */}
          <div className='mt-20'>
            <h2 className='text-2xl font-medium'>Rice Affiliation</h2>
            <p className='mt-2 text-gray-400 text-sm'>Below, select the option that applies to you:</p>
            
            <RadioGroup className="mt-8 space-y-4 w-3/5">
              <div className="flex items-center space-x-2 border rounded-lg justify-center py-3">
                <RadioGroupItem value="student" id="student" />
                <Label htmlFor="student" className="text-sm">I am a Rice Student</Label>
              </div>
              <div className="flex items-center space-x-2 border rounded-lg justify-center py-3">
                <RadioGroupItem value="alumni" id="alumni" />
                <Label htmlFor="alumni" className="text-sm">I am a Rice alumni</Label>
              </div>
            </RadioGroup>
          </div>
        </div>

        {/* Left Hand Side */}
        <div className='w-2/3 h-full mb-20'>
          {/* Name */}
          <h2 className='text-2xl font-medium'>Name</h2>
          <p className='mt-2 text-gray-400 text-sm'>If Rice Student: Make sure this matches the name on your Rice Student ID.</p>
          <p className='text-gray-400 text-sm'>If not Rice-affiliated: Make sure this matches the name on your government ID.</p>
          <div className='mt-8 flex items-center justify-between space-x-8'>
            <Input placeholder="First Name on ID" className='w-1/2 rounded-xl border border-gray-200' />
            <Input placeholder="Last Name on ID" className='w-1/2 rounded-xl border border-gray-200' />
          </div>

          {/* Email */}
          <h2 className='text-2xl font-medium mt-20'>Email Address</h2>
          <p className='mt-2 text-gray-400 text-sm'>Use the address you'd like to be contacted with.</p>
          <Input placeholder="Email Address" className='w-full rounded-xl mt-8 border border-gray-200' />

          {/* Phone Number */}
          <h2 className='text-2xl font-medium mt-20'>Phone Number</h2>
          <p className='mt-2 text-gray-400 text-sm'>Use the number you'd like to be contacted with.</p>
          <Input placeholder="+1 (xxx) xxx-xxxx" className='w-full rounded-xl mt-8 border border-gray-200' />
        </div>
      </div>
    </main>
  )
}

export default EditProfile