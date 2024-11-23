import Image from 'next/image'
import React, { useState } from 'react'
import { FaPhoneAlt } from 'react-icons/fa'
import { IoMail } from 'react-icons/io5'

interface MeetSubleaserProps {
  data: {
    phone_number: string;
    user?: {
      full_name?: string;
      email?: string;
      avatar_url?: string;
      is_rice_student?: boolean;
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

  return (
    <main className='flex flex-col gap-[20px] w-full h-full justify-center items-center'>
      <h1 className='text-xl sm:text-2xl font-semibold'>Meet the subleaser.</h1>
      <div className='rounded-lg p-5 py-6 pb-14 flex flex-col gap-[19px] border shadow-lg'>
        <div className='p-5 flex flex-col sm:flex-row gap-[42.7px]'>
          <div className='relative w-32 h-32 overflow-hidden mx-auto sm:mx-0 rounded-full'>
            <Image 
              src={data.user?.avatar_url || '/profile_pic.jpeg'} 
              fill={true}
              alt='profile pic' 
              className='object-cover'
            /> 
          </div>
          <div className='flex flex-col'>
            <div className='flex flex-col pb-4 border-b mb-4'>
              <h1 className='text-lg font-semibold mb-[2.27px] mr-14 sm:mr-20'>
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
            <div className='flex flex-col gap-[5.69px]'>
              <div className='flex flex-row gap-[18.7px] items-center'>
                <FaPhoneAlt className='w-4 h-4' fill='#777777'/>
                <p className='text-xs text-gray-400'>{data.phone_number}</p>
              </div>
              {data.user?.email && (
                <div className='flex flex-row gap-[18.7px] items-center'>
                  <IoMail className='w-4 h-4' fill='#777777'/>
                  <p className='text-xs text-gray-400'>{data.user.email}</p>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className='flex flex-row items-center gap-[20px] ml-5'>
          <button 
            onClick={() => handleCopy('phone')}
            className='rounded-lg px-3 py-2 bg-[#FF7439] flex flex-row items-center gap-2 hover:scale-105 hover:cursor-pointer duration-300'
          >
            <FaPhoneAlt className='w-4 h-4' fill='white'/>
            <p className='text-xs font-medium text-white'>
              {copyStatus === 'phone' ? 'Copied!' : 'Copy Phone'}
            </p>
          </button>

          {data.user?.email && (
            <button 
              onClick={() => handleCopy('email')}
              className='rounded-lg px-3 py-2 bg-[#FF7439] flex flex-row items-center gap-2 hover:scale-105 hover:cursor-pointer duration-300'
            >
              <IoMail className='w-4 h-4' fill='white'/>
              <p className='text-xs font-medium text-white'>
                {copyStatus === 'email' ? 'Copied!' : 'Copy Email'}
              </p>
            </button>
          )}
        </div>
      </div>
    </main>
  )
}

export default MeetSubleaser;