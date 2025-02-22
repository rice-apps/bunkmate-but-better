"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { formatPhoneNumber, Input } from "@/components/ui/input";
import { Upload, PencilIcon } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { createClient, getImagePublicUrl } from "@/utils/supabase/client";
import { v4 as uuidv4 } from 'uuid';
import { useRouter } from '@bprogress/next';
import { motion } from 'framer-motion';

const EditProfile = () => {
  const router = useRouter();
  const supabase = createClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [profileImageUrl, setProfileImageUrl] = useState('');
  const [isHovered, setIsHovered] = useState(false);
  const [currentProfileImagePath, setCurrentProfileImagePath] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    riceAffiliation: null as 'student' | 'alum' | null,
    profileImage: ''
  });

  useEffect(() => {
    const fetchUser = async () => {
      const user = await supabase.auth.getUser();
      if (user.data.user) {
        const { data, error } = await supabase
          .from("users")
          .select()
          .eq("id", user.data.user.id)
          .single();

        if (error) {
          console.error("Error fetching user:", error);
          return;
        }

        if (data) {
          // Split name into first and last name
          const [firstName = '', lastName = ''] = data.name ? data.name.split(' ') : ['', ''];

          setFormData(prev => ({
            ...prev,
            firstName,
            lastName,
            email: data.email,
            phone: data.phone || '',
            riceAffiliation: data.affiliation
          }));

          // Set profile image and store current path
          if (data.profile_image_path) {
            setCurrentProfileImagePath(data.profile_image_path);
            const imageUrl = getImagePublicUrl(
              "profiles",
              data.profile_image_path
            );
            setProfileImageUrl(imageUrl);
          } else if (user.data.user?.user_metadata.avatar_url) {
            setProfileImageUrl(user.data.user.user_metadata.avatar_url);
          }
        }
      }
    };

    fetchUser();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      const user = await supabase.auth.getUser();
      
      if (!user.data.user) {
        console.error('No authenticated user found');
        return;
      }

      // Combine first and last name
      const fullName = `${formData.firstName} ${formData.lastName}`.trim();

      const { error } = await supabase
        .from('users')
        .update({ 
          name: fullName,
          phone: formData.phone,
          affiliation: formData.riceAffiliation,
        })
        .eq('id', user.data.user.id);

      if (error) {
        console.error('Error updating profile:', error);
        return;
      }

      router.push('/profile-section');
    } catch (error) {
      console.error('Error saving profile:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    router.push('/profile-section');
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!e.target.files || e.target.files.length === 0) return;
      
      setIsUploading(true);
  
      const file = e.target.files[0];
      const user = await supabase.auth.getUser();
      if (!user.data.user) {
        console.error('No authenticated user found');
        return;
      }
  
      // Delete previous profile image if it exists
      if (currentProfileImagePath) {
        const { error: deleteError } = await supabase.storage
          .from('profiles')
          .remove([currentProfileImagePath]);
        
        if (deleteError) {
          console.error('Error deleting previous image:', deleteError);
        }
      }

      // Upload new image to Supabase Storage
      const fileName = `${user.data.user.id}/${uuidv4()}.${file.name.split('.').pop()}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('profiles')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true
        });
  
      if (uploadError) {
        console.error('Error uploading image:', uploadError);
        return;
      }
  
      // Update user profile with new image path
      const { error: updateError } = await supabase
        .from('users')
        .update({ profile_image_path: fileName })
        .eq('id', user.data.user.id);

      if (updateError) {
        console.error('Error updating profile:', updateError);
        return;
      }

      // Get the updated user data to get the new profile image
      const { data: updatedUser, error: fetchError } = await supabase
        .from('users')
        .select('profile_image_path')
        .eq('id', user.data.user.id)
        .single();

      if (fetchError) {
        console.error('Error fetching updated user:', fetchError);
        return;
      }

      // Update UI with new image URL and store new path
      if (updatedUser.profile_image_path) {
        setCurrentProfileImagePath(updatedUser.profile_image_path);
        const imageUrl = getImagePublicUrl('profiles', updatedUser.profile_image_path);
        setProfileImageUrl(imageUrl);
      }

      setIsModalOpen(false);

    } catch (error) {
      console.error('Error processing image:', error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Suspense>
    <motion.main 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className='h-full w-full'
    >
      <motion.h1 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className='text-3xl font-semibold'
      >
        Profile Editor
      </motion.h1>
      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className='mt-4 text-gray-600'
      >
        Welcome to your profile editor! Here, you can edit your personal information.
      </motion.p>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className='w-full flex justify-between items-center mt-14 flex-wrap-reverse gap-y-4'
      >
        <h2 className='text-2xl font-medium'>Your Profile Information</h2>
        <div className='flex space-x-6'>
          <button 
            onClick={handleCancel}
            className='px-6 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 hover:cursor-pointer hover:scale-105 transition duration-300'
          >
            <p className='font-medium'>Cancel</p>
          </button>
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className='px-6 py-2 rounded-lg bg-[#FF7439] hover:bg-[#FF7439]/80 hover:cursor-pointer hover:scale-105 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed'
          >
            <p className='text-white font-medium'>{isSaving ? 'Saving...' : 'Save'}</p>
          </button>
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className='flex flex-row w-full h-full gap-x-5 gap-y-6 mt-14 mb-20 flex-wrap'
      >
        <div className='flex-1 h-full'>
          <motion.h2 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className='text-2xl font-medium'
          >
            Profile Picture
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
          >
            <p className='mt-2 text-gray-400 text-sm'>Upload your profile picture.</p>
            <p className='text-gray-400 text-sm'>Please make sure your face is recognizable! </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8 }}
            className='mt-8 w-40 h-40 relative'
          >
            <div
              onClick={() => setIsModalOpen(true)}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              className="w-full h-full rounded-full relative cursor-pointer group"
            >
              {profileImageUrl ? (
                <>
                  <img
                    src={profileImageUrl}
                    alt="Profile"
                    className="w-full h-full rounded-full object-cover"
                  />
                  <div className={`absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center transition-opacity duration-200 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
                    <PencilIcon className="w-8 h-8 text-white" />
                  </div>
                </>
              ) : (
                <div className="w-full h-full rounded-full border-2 border-dashed border-gray-300 flex flex-col items-center justify-center bg-gray-50 hover:border-gray-400 transition-colors">
                  <Upload className="w-8 h-8 text-gray-400" />
                  <span className="mt-2 text-sm text-gray-500">Upload File</span>
                </div>
              )}
            </div>
          </motion.div>

          {/* Rice Affiliation */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className='mt-20'
          >
            <h2 className='text-2xl font-medium'>Rice Affiliation</h2>
            <p className='mt-2 text-gray-400 text-sm'>Below, select the option that applies to you:</p>
            
            <RadioGroup 
              className="mt-8 space-y-1 max-w-[500px]"
              value={formData.riceAffiliation || undefined}
              onValueChange={(value) => setFormData(prev => ({ ...prev, riceAffiliation: value as 'student' | 'alum' }))}
            >
              <label className="block cursor-pointer">
              <div className="flex items-center space-x-2 border rounded-lg justify-center py-3">
                <RadioGroupItem 
                  value="student" 
                  id="student"
                  className="text-[#FF7439] border-[#FF7439] data-[state=checked]:bg-[#FF7439] data-[state=checked]:text-white"
                />
                <Label htmlFor="student" className="text-sm">I am a Rice Student</Label>
              </div>
              </label>
              <label className="block cursor-pointer">
              <div className="flex items-center space-x-2 border rounded-lg justify-center py-3">
                <RadioGroupItem 
                  value="alum" 
                  id="alum"
                  className="text-[#FF7439] border-[#FF7439] data-[state=checked]:bg-[#FF7439] data-[state=checked]:text-white"
                />
                <Label htmlFor="alum" className="text-sm">I am a Rice alumni</Label>
              </div>
              </label>
            </RadioGroup>
          </motion.div>
        </div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1 }}
          className='flex-2 h-full mb-20'
        >
          {/* Name Fields */}
          <h2 className='text-2xl font-medium'>Name</h2>
          <p className='mt-2 text-gray-400 text-sm'>If Rice Student: Make sure this matches the name on your Rice Student ID.</p>
          <p className='text-gray-400 text-sm'>If not Rice-affiliated: Make sure this matches the name on your government ID.</p>
          <div className='mt-8 flex items-center justify-between space-x-8'>
            <Input 
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              placeholder="First Name on ID" 
              className='w-1/2 rounded-xl border border-gray-200' 
            />
            <Input 
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              placeholder="Last Name on ID" 
              className='w-1/2 rounded-xl border border-gray-200' 
            />
          </div>

          {/* Email Field */}
          <h2 className='text-2xl font-medium mt-20'>Email Address</h2>
          <p className='mt-2 text-gray-400 text-sm'>This is the email address you signed up with. <br /> If you would like to use a new email address, please create a new account!</p>
          <Input 
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Email Address" 
            className='w-full rounded-xl mt-8 border border-gray-200' 
            disabled
          />

          {/* Phone Number Field */}
          <h2 className='text-2xl font-medium mt-20'>Phone Number</h2>
          <p className='mt-2 text-gray-400 text-sm'>Use the number you'd like to be contacted with.</p>
          <Input 
            type="tel"
            name="phone"
            value={formatPhoneNumber(formData.phone)}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, '');
              if (value.length <= 10) {
                setFormData(prev => ({ ...prev, phone: value }));
              }
            }}
            placeholder="(123) 456-7890"
            maxLength={14}
            className='w-full rounded-xl mt-8 border border-gray-200' 
          />
        </motion.div>
      </motion.div>

      {/* Image Upload Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Profile Picture</DialogTitle>
          </DialogHeader>
          <div className="p-6">
            <p className="text-sm text-gray-500 text-center mb-8">
              Upload your profile picture. Please make sure your face is recognizable!
            </p>
            
            <div className="w-32 h-32 mx-auto mb-6">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                id="profile-upload"
                onChange={handleFileUpload}
                disabled={isUploading}
              />
              <label
                htmlFor="profile-upload"
                className={`w-full h-full rounded-full border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:border-gray-400 transition-colors bg-gray-50 ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isUploading ? (
                  <div className="flex flex-col items-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-400"></div>
                    <span className="mt-2 text-sm text-gray-500">Uploading...</span>
                  </div>
                ) : (
                  <>
                    <Upload className="w-8 h-8 text-gray-400" />
                    <span className="mt-2 text-sm text-gray-500">Upload File</span>
                  </>
                )}
              </label>
            </div>

            <div className="flex justify-center space-x-4">
              <Button
                variant="outline"
                onClick={() => setIsModalOpen(false)}
                disabled={isUploading}
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </motion.main>
    </Suspense>
  );
};

export default EditProfile;