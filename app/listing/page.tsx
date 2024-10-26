import Listing from '@/components/Listing'
import ListingDescription from '@/components/ListingDescription'
import MeetSubleaser from '@/components/MeetSubleaser'
import Navbar from '@/components/Navbar'
import React from 'react'

const ListingPage = () => {
  return (
    <>
    <Navbar />
    <Listing />
    <div className='flex flex-row w-full mt-4 justify-between mb-10 px-14 gap-10'>
      <div className='w-2/3'>
        <ListingDescription />
      </div>
      <div className='w-1/3'>
        <MeetSubleaser />
      </div>
    </div>
    </>
  )
}

export default ListingPage