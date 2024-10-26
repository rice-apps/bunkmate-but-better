type DescriptionItemProps = {
    icon: React.ReactNode;
    title: string;
    description: string;
  }
  
  const DescriptionItem = ({ icon, title, description }: DescriptionItemProps) => {
    return (
      <div className="flex items-start gap-4">
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
  
  const ListingDescription = () => {
    return (
      <div className="">
        <p className="text-gray-700 text-sm leading-relaxed mb-6">
          Lifetower is a modern high-rise apartment complex near Rice University, offering student-friendly housing
          with various amenities like a fitness center, study lounges, and a rooftop pool. It provides convenient
          access to campus and nearby attractions, making it a popular choice for Rice students seeking off-
          campus living with a community vibe.
        </p>
  
        <div className="border-t pt-6">
          <div className="space-y-6">
            <DescriptionItem 
              icon={<span className="text-xl">$</span>}
              title="Cost per month"
              description="$1,300 / month — willing to negotiate"
            />
  
            <DescriptionItem 
              icon={<span className="text-xl">⏰</span>}
              title="Duration being leased"
              description="August 18th to May 28th"
            />
  
            <DescriptionItem 
              icon={<span className="text-xl">📍</span>}
              title="Distance from Rice"
              description="1.2 miles away — a 5 minute drive or 10 minute walk"
            />
          </div>
        </div>
      </div>
    )
  }
  
  export default ListingDescription;