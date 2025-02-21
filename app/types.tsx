export interface FormDataType {
  title: string;
  description: string;
  price: number;
  priceNotes: string;
  startDate: string;
  endDate: string;
  durationNotes: string;
  address: { label: string; value: { description: string } };
  locationNotes: string;
  photos: string[];
  rawPhotos: File[];
  photoLabels: { [key: number]: string };
  imagePaths: string[];
  removedImagePaths: string[];
  affiliation: string;
  phone: string;
  bed_num: number;
  bath_num: number;
}
