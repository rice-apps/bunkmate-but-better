const LoadingCard = () => (
	<div className="w-full">
	  <div className="relative rounded-2xl overflow-hidden bg-gray-200 animate-pulse">
		{/* Image placeholder - using aspect ratio to match your images */}
		<div className="relative w-full aspect-square bg-gray-300" />
  
		{/* Content placeholders */}
		<div className="mt-4 space-y-3 p-4">
		  <div className="flex justify-between items-center">
			{/* Title placeholder */}
			<div className="h-6 bg-gray-300 rounded w-3/5" />
			{/* Rice Student badge placeholder */}
			<div className="flex items-center gap-1 bg-gray-300 rounded h-6 w-1/4" />
		  </div>
		  {/* Details placeholders */}
		  <div className="space-y-2.5">
			<div className="h-4 bg-gray-300 rounded w-4/5" />
			<div className="h-4 bg-gray-300 rounded w-3/4" />
			<div className="h-4 bg-gray-300 rounded w-2/4" />
		  </div>
		</div>
	  </div>
	</div>
);

export default LoadingCard;