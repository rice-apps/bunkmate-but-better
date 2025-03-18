"use client";

import {FormDataType} from "@/app/post-a-listing/PostForm";
import React, {createContext, ReactNode, useState} from "react";

interface FormContextType {
  postFormData: FormDataType;
  setPostFormData: React.Dispatch<React.SetStateAction<FormDataType>>;
  resetPostFormData: () => void;
  editListingId: number,
  setEditListingId: React.Dispatch<React.SetStateAction<number>>;
  oldEditFormData: FormDataType;
  setOldEditFormData: React.Dispatch<React.SetStateAction<FormDataType>>;
  resetOldEditFormData: () => void;
  editFormData: FormDataType;
  setEditFormData: React.Dispatch<React.SetStateAction<FormDataType>>;
  resetEditFormData: () => void;
}

export const defaultPostFormData: FormDataType = {
  title: "",
  description: "",
  price: NaN,
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
  bed_num: NaN,
  bath_num: NaN,
};

const defaultEditFormData: FormDataType = {
  title: "",
  description: "",
  price: NaN,
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
  bed_num: NaN,
  bath_num: NaN,
}

const defaultOldEditFormData: FormDataType = {
  title: "",
  description: "",
  price: NaN,
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
  bed_num: NaN,
  bath_num: NaN,
}

export const PostListingFormContext = createContext<FormContextType>({
  postFormData: defaultPostFormData,
  setPostFormData: () => {},
  resetPostFormData: () => {},
  editListingId: 0,
  setEditListingId: () => {},
  oldEditFormData: defaultOldEditFormData,
  setOldEditFormData: () => {},
  resetOldEditFormData: () => {},
  editFormData: defaultEditFormData,
  setEditFormData: () => {},
  resetEditFormData: () => {}
});

const PostListingFormProvider: React.FC<{children: ReactNode}> = ({children}) => {
  const [postFormData, setPostFormData] = useState<FormDataType>(defaultPostFormData);
  const [editFormData, setEditFormData] = useState<FormDataType>(defaultEditFormData);
  const [oldEditFormData, setOldEditFormData] = useState<FormDataType>(defaultOldEditFormData);
  const [editListingId, setEditListingId] = useState<number>(0);
  const resetPostFormData = () => setPostFormData(defaultPostFormData);
  const resetEditFormData = () => setEditFormData(oldEditFormData);
  const resetOldEditFormData = () => setOldEditFormData(defaultOldEditFormData);

  return (
    <PostListingFormContext.Provider value={{postFormData, setPostFormData, resetPostFormData, editListingId, setEditListingId, oldEditFormData, setOldEditFormData, resetOldEditFormData, editFormData, setEditFormData, resetEditFormData}}>
      {children}
    </PostListingFormContext.Provider>
  );
};

export default PostListingFormProvider;
