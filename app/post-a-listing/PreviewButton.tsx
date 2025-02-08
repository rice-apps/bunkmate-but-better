import {Button} from "@/components/ui/button";
import Link from "next/link";
import {useRouter} from "next/navigation";
import React from "react";
import {FaEye} from "react-icons/fa";
import {FormDataType} from "./page";

const PreviewButton = ({formData}: {formData: FormDataType}) => {
  const router = useRouter();

  const handlePreviewClick = () => {
    router.push("/post-a-listing/preview");
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
  );
};

export default PreviewButton;
