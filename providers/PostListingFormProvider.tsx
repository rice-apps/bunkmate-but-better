"use client";

import {FormDataType} from "@/app/post-a-listing/page";
import {createContext, ReactNode, useState} from "react";

interface FormContextType {
  formData: FormDataType;
  setFormData: React.Dispatch<React.SetStateAction<FormDataType>>;
  resetFormData: () => void;
}

export const defaultFormData = {
  title: "",
  description: "",
  price: "",
  priceNotes: "",
  startDate: "",
  endDate: "",
  durationNotes: "",
  address: {label: "", value: {description: ""}},
  locationNotes: "",
  photos: [],
  rawPhotos: [],
  photoLabels: {},
  imagePaths: [],
  removedImagePaths: [],
  affiliation: "rice",
  phone: "",
  bed_num: "",
  bath_num: "",
};

export const PostListingFormContext = createContext<FormContextType>({
  formData: defaultFormData,
  setFormData: () => {},
  resetFormData: () => {},
});

const PostListingFormProvider: React.FC<{children: ReactNode}> = ({children}) => {
  const [formData, setFormData] = useState<FormDataType>(defaultFormData);
  const resetFormData = () => setFormData(defaultFormData);

  return (
    <PostListingFormContext.Provider value={{formData, setFormData, resetFormData}}>
      {children}
    </PostListingFormContext.Provider>
  );
};

export default PostListingFormProvider;
