import React from 'react';
import { motion } from 'framer-motion';

type DescriptionItemProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay?: number;
}

const DescriptionItem = ({ icon, title, description, delay = 0 }: DescriptionItemProps) => {
  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay }}
      className="flex items-center gap-4"
    >
      <div className="p-2 rounded-full bg-gray-50">
        {icon}
      </div>
      <div>
        <h3 className="font-medium text-gray-900">{title}</h3>
        <p className="text-gray-600 text-sm">{description}</p>
      </div>
    </motion.div>
  )
}

interface ListingDescriptionProps {
  data: {
    location: string;
    description: string;
    price: number;
    priceNotes: string;
    start_date: string;
    end_date: string;
    durationNotes: string;
    distance?: string;
    bed_num: number;
    bath_num: number;
  };
}

const ListingDescription: React.FC<ListingDescriptionProps> = ({ data }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className=""
    >
      <motion.h1 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className='text-xl sm:text-xl font-semibold'
      >
        {data.location}
      </motion.h1>
      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="text-gray-700 text-sm leading-relaxed mb-6 mt-4"
      >
        {data.description}
      </motion.p>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="border-t pt-6"
      >
        <div className="space-y-6">
          <DescriptionItem 
            icon={<img src="/bed.svg" alt="Duration Icon" className="w-[40px] h-[40px]" />}
            title="# of Beds and Bathrooms"
            description={`${data.bed_num} beds, ${data.bath_num} bathrooms`}
            delay={0.5}
          />

          <DescriptionItem 
            icon={<img src="/solar_dollar-linear.svg" alt="Duration Icon" className="w-[40px] h-[40px]" />}
            title="Cost per month"
            description={`$${data.price.toLocaleString()} / month${data.priceNotes ? ` — ${data.priceNotes}` : ''}`}
            delay={0.5}
          />

          <DescriptionItem 
            icon={<img src="/bx_time-five.svg" alt="Duration Icon" className="w-[40px] h-[40px]" />}
            title="Duration being leased"
            description={`${formatDate(data.start_date)} to ${formatDate(data.end_date)}${data.durationNotes ? ` — ${data.durationNotes}` : ''}`}
            delay={0.6}
          />

          <DescriptionItem 
            icon={<img src="/mdi_location.svg" alt="Duration Icon" className="w-[40px] h-[40px]" />}
            title="Distance from Rice"
            description={data.distance || "Distance information not available"}
            delay={0.7}
          />
        </div>
      </motion.div>
    </motion.div>
  )
}

export default ListingDescription