import React from 'react';


type DescriptionItemProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const DescriptionItem = ({ icon, title, description }: DescriptionItemProps) => {
  return (
    <div className="flex items-center gap-4">
      <div className="p-2 rounded-full bg-gray-50">
        {icon}
      </div>
      <div>
        <h3 className="font-medium text-gray-900">{title}</h3>
        <p className="text-gray-600 text-sm">{description}</p>
      </div>
    </div>
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
    <div className="">
      <h1 className='text-xl sm:text-xl font-semibold'>{data.location}</h1>
      <p className="text-gray-700 text-sm leading-relaxed mb-6 mt-4">
        {data.description}
      </p>

      <div className="border-t pt-6">
        <div className="space-y-6">
          <DescriptionItem 
            icon={<img src="/solar_dollar-linear.svg" alt="Duration Icon" className="w-[40px] h-[40px]" />}
            title="Cost per month"
            description={`$${data.price.toLocaleString()} / month${data.priceNotes ? ` — ${data.priceNotes}` : ''}`}
          />

          <DescriptionItem 
            icon={<img src="/bx_time-five.svg" alt="Duration Icon" className="w-[40px] h-[40px]" />}
            title="Duration being leased"
            description={`${formatDate(data.start_date)} to ${formatDate(data.end_date)}${data.durationNotes ? ` — ${data.durationNotes}` : ''}`}
          />

          <DescriptionItem 
            icon={<img src="/mdi_location.svg" alt="Duration Icon" className="w-[40px] h-[40px]" />}
            title="Distance from Rice"
            description={data.distance || "Distance information not available"}
          />
        </div>
      </div>
    </div>
  )
}

export default ListingDescription