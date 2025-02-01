import { Button } from '@/components/ui/button'
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React from 'react'
import { FaEye } from 'react-icons/fa';

interface FormData {
    [key: string]: any;
    title: string;
    description: string;
    price: number;
    priceNotes: string;
    startDate: string;
    endDate: string;
    durationNotes: string;
    address: string;
    locationNotes: string;
    photos: string[];
    photoLabels: string[];
    affiliation: string;
    phone: string;
  }

const PreviewButton = ({ formData }: {
    formData: FormData;
}) => {
    const router = useRouter();

    const handlePreviewClick = () => {
        let params = new URLSearchParams();

        params.set('data', JSON.stringify(formData));

        // Neat trick to save state
        window.history.pushState({},'','/post-a-listing?' + params.toString());

        router.push('/post-a-listing/preview?' + params.toString());
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
