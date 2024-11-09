import React from 'react';
import { Check } from 'lucide-react';

const CategoryStatusIndicator = ({ completed, selected }: { completed: boolean, selected: boolean}) => {
  if (completed) {
    return (
      <div className="relative w-4 h-4 mr-2">
        <div className="absolute inset-0 bg-green-500 rounded-full" />
        <Check 
          className="absolute inset-0 text-white w-full h-full p-1" 
          strokeWidth={3}
        />
      </div>
    );
  }
  
  return <div className={`w-2 h-2 mr-2 rounded-full ${selected ? 'bg-[#FF7439]': 'bg-gray-500'}`}/>;
};

export default CategoryStatusIndicator;