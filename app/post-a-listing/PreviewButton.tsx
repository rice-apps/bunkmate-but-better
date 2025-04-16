import {Button} from "@/components/ui/button";
import Link from "next/link";
import {useRouter} from "@bprogress/next";
import React from "react";
import {FaEye} from "react-icons/fa";
import {FormDataType, listingFormSchema} from "./PostForm";

const PreviewButton = ({formData, editing}: {formData: FormDataType, editing: boolean}) => {
  const router = useRouter();

  const handlePreviewClick = () => {
    router.push(`/post-a-listing/preview?editing=${editing}`);
  };

  return (
    <Button
      variant="preview"
      className="text-gray-500 flex flex-row items-center gap-2"
      onClick={handlePreviewClick}
      disabled={!listingFormSchema.safeParse(formData).success}
    >
      <FaEye />
      <span>PREVIEW LISTING</span>
    </Button>
  );
};

export default PreviewButton;
