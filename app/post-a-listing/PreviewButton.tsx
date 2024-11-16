import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation';
import React from 'react'
import { FaEye } from 'react-icons/fa';

const PreviewButton = ({ formData }: {
    formData: any;
}) => {
    const router = useRouter();

    const handlePreviewClick = () => {
        // Convert File objects to URLs for storage
        const photoURLs = formData.photos.map((photo: File) => URL.createObjectURL(photo));

        // Prepare data for storage
        const previewData = {
            ...formData,
            photos: photoURLs // Store URLs instead of File objects
        };

        // Save to localStorage
        localStorage.setItem('listingFormData', JSON.stringify(previewData));

        // Navigate to preview
        router.push('/post-a-listing/preview');
    };

    return (

            <Button
                variant="preview"
                className="text-gray-500 flex flex-row items-center gap-2"
                onClick={handlePreviewClick}
                // Optionally disable preview if required fields aren't filled
                disabled={!formData.title || !formData.description || formData.photos.length === 0}
            >
                <FaEye />
                <span>PREVIEW LISTING</span>
            </Button>
    )
}

export default PreviewButton
