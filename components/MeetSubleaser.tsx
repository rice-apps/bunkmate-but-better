import Image from "next/image";
import React, { useState } from "react";
import { FaPhoneAlt } from "react-icons/fa";
import { IoMail } from "react-icons/io5";
import { getImagePublicUrl, getShimmerData } from "@/utils/supabase/client";
import { motion } from "framer-motion";
import { formatPhoneNumber } from "./ui/input";

interface MeetSubleaserProps {
  data: {
    phone_number: string;
    user?: {
      full_name?: string;
      email?: string;
      avatar_url?: string;
      is_rice_student?: boolean;
      profile_image_path?: string;
    };
  };
}

const MeetSubleaser: React.FC<MeetSubleaserProps> = ({ data }) => {
  const [copyStatus, setCopyStatus] = useState<'phone' | 'email' | null>(null);

  const handleCopy = async (type: 'phone' | 'email') => {
    const textToCopy = type === 'phone' ? data.phone_number : data.user?.email || '';
    
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopyStatus(type);
      setTimeout(() => setCopyStatus(null), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const getProfileImage = () => {
    if (data.user?.profile_image_path) {
      return getImagePublicUrl('profiles', data.user.profile_image_path);
    }
    return data.user?.avatar_url || '/profile_pic.jpeg';
  };

  return (
    <motion.main 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className='flex flex-col gap-[20px] w-full h-full justify-center items-center'
    >
      <motion.h1 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className='text-xl sm:text-2xl font-semibold'
      >
        Meet the subleaser.
      </motion.h1>
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
        className='rounded-lg p-5 py-6 pb-14 flex flex-col gap-[19px] border shadow-lg'
      >
        <div className='p-5 flex flex-col sm:flex-row gap-[42.7px]'>
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className='relative w-32 h-32 flex-shrink-0 overflow-hidden mx-auto sm:mx-0 rounded-full'
          >
            <Image 
              src={getProfileImage()} 
              placeholder={`data:image/svg+xml;base64,${getShimmerData()}`}
              fill={true}
              alt='profile pic' 
              className='object-cover'
            /> 
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className='flex flex-col'
          >
            <div className='flex flex-col pb-4 border-b mb-4'>
              <h1 className='text-[22px] font-semibold mb-[2.27px] w-full sm:mr-20'>
                {data.user?.full_name || 'Anonymous'}
              </h1>
              {data.user?.is_rice_student && (
                <div className='flex flex-row gap-[5.1px]'>
                  <Image 
                    src={'/owl.png'} 
                    width={20}  
                    height={5}
                    alt='owl'
                    className='w-5 h-5 scale-75'
                  />
                  <p className='text-[#FF7439] text-sm'>Rice Student</p>
                </div>
              )}
            </div>
            <div className="flex flex-col gap-[5.69px]">
              <div className="flex flex-row gap-[18.7px] items-center">
                <FaPhoneAlt className="w-4 h-4" fill="#777777" />
                <p className="text-base text-gray-500">{formatPhoneNumber(data.phone_number)}</p>
              </div>
              {data.user?.email && (
                <div className='flex flex-row gap-[18.7px] items-center'>
                  <IoMail className='w-4 h-4' fill='#777777'/>
                  <p className='text-base text-gray-500'>{data.user.email}</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className='flex flex-row justify-center items-center gap-[20px] ml-5'
        >
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleCopy('phone')}
            className='rounded-lg px-3 py-2 bg-[#FF7439] flex flex-row items-center gap-2 hover:cursor-pointer duration-300'
          >
            <FaPhoneAlt className='w-4 h-4' fill='white'/>
            <p className='text-[14px] font-medium text-white'>
              {copyStatus === 'phone' ? 'Copied!' : 'Copy Phone'}
            </p>
          </motion.button>

          {data.user?.email && (
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleCopy('email')}
              className='rounded-lg px-3 py-2 bg-[#FF7439] flex flex-row items-center gap-2 hover:cursor-pointer duration-300'
            >
              <IoMail className='w-4 h-4' fill='white'/>
              <p className='text-[14px] font-medium text-white'>
                {copyStatus === 'email' ? 'Copied!' : 'Copy Email'}
              </p>
            </motion.button>
          )}
        </motion.div>
      </motion.div>
    </motion.main>
  )
}

export default MeetSubleaser;