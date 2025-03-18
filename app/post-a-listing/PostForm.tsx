"use client";

import Navbar from "@/components/Navbar";
import {Button} from "@/components/ui/button";
import {Dispatch, SetStateAction, useMemo, useState} from "react";
import {z} from "zod";
import CategoryStatusIndicator from "./CategoryStatusIndicator";
import Duration from "./Duration";
import Location from "./Location";
import Photos from "./Photos";
import Pricing from "./Pricing";
import Profile from "./Profile";
import TitleDescription from "./TitleDescription";
import LoadingCircle from "@/components/LoadingCircle";

/**
 * Schema for the TitleDescription section.
 */
const titleDescriptionSchema = z.object({
  title: z.string().min(1, "Title is required").max(50, "Title is required"),
  bed_num: z.number().min(0, "Bed number is required"),
  bath_num: z.number().min(0, "Bath number is required"),
  description: z.string().min(100, "Description must be at least 100 characters").max(500, "Description must be less than 500 characters")
});

/**
 * Schema for the Pricing section.
 */
const pricingSchema = z.object({
  price: z.number().min(1, "Monthly rent is required"),
  priceNotes: z.string()
});

/**
 * Schema for the Location section.
 */
const locationSchema = z.object({
  address: z.object({
    label: z.string().min(1, "Address is required"),
    value: z.object({
      description: z.string()
    })
  }),
  locationNotes: z.string()
});

/**
 * Schema for the Duration section.
 */
const durationSchema = z.object({
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  durationNotes: z.string()
});

/**
 * Schema for the Photos section.
 * 
 * This is funky. See Gabriel for questions.
 */
const photosSchema = z.object({
  photos: z.array(z.string()),
  rawPhotos: z.array(z.instanceof(File).or(z.instanceof(Blob))),
  photoLabels: z.record(z.string().regex(new RegExp(/[0-9]+/)), z.string()),
  imagePaths: z.array(z.string()),
  removedImagePaths: z.array(z.string())
})
.refine((input) => {
  return input.photos.length + input.imagePaths.length >= 5
}, {
  message: "At least 5 photos are required"
});

/**
 * Schema for the Profile section.
 */
const profileSchema = z.object({
  affiliation: z.string().min(1, "Rice Affiliation is required"),
  phone: z.string().min(10, "Phone number must be at least 10 characters")
});

/**
 * Schema for the whole listing form.
 */
export const listingFormSchema = z.object({
  ...titleDescriptionSchema.shape,
  ...pricingSchema.shape,
  ...locationSchema.shape,
  ...durationSchema.shape,
  ...photosSchema._def.schema.shape, // need _def.schema because of refine
  ...profileSchema.shape
});

/**
 * A type for form data derived from the listingFormSchema zod schema.
 */
export type FormDataType = z.infer<typeof listingFormSchema>;

type ImageResponse =
  | {
      data: {
        id: string;
        path: string;
        fullPath: string;
      };
      error: null;
    }
  | {
      data: null;
      error: any;
    };

type ImagePromiseType = Promise<ImageResponse>;

interface PostFormProps {
  handleSubmit: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  isLoading: boolean;
  isPosting: boolean;
  formData: FormDataType;
  setFormData: Dispatch<SetStateAction<FormDataType>>;
  resetFormData: () => void;
  editing: boolean;
}

// Main PostListing component
const PostForm = ({handleSubmit, isLoading, isPosting, formData, setFormData, resetFormData, editing}: PostFormProps) => {
  const [selectedCategory, setSelectedCategory] = useState("title");
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const renderComponent = () => {
    switch (selectedCategory) {
      case "title":
        return <TitleDescription 
          formData={formData} 
          setFormData={setFormData} 
          onNext={handleNextCategory}
          // Use zod validation to indicate that a section is complete.
          complete={categories.filter(category => category.id === "title")[0].completed}
          editing={editing}
        />;
      case "pricing":
        return (
          <Pricing
            formData={formData}
            setFormData={setFormData}
            onNext={handleNextCategory}
            onBack={handlePreviousCategory}
            complete={categories.filter(category => category.id === "pricing")[0].completed}
            editing={editing}
          />
        );
      case "location":
        return (
          <Location
            formData={formData}
            setFormData={setFormData}
            onNext={handleNextCategory}
            onBack={handlePreviousCategory}
            complete={categories.filter(category => category.id === "location")[0].completed}
            editing={editing}
          />
        );
      case "duration":
        return (
          <Duration
            formData={formData}
            setFormData={setFormData}
            onNext={handleNextCategory}
            onBack={handlePreviousCategory}
            complete={categories.filter(category => category.id === "duration")[0].completed}
            editing={editing}
          />
        );
      case "photos":
        return (
          <Photos
            formData={formData}
            setFormData={setFormData}
            onNext={handleNextCategory}
            onBack={handlePreviousCategory}
            complete={categories.filter(category => category.id === "photos")[0].completed}
            editing={editing}
          />
        );
      case "profile":
        return (
          <Profile
            formData={formData}
            setFormData={setFormData}
            onBack={handlePreviousCategory}
            isPosting={isPosting}
            handleSubmit={handleSubmit}
            editingMode={false}
            complete={categories.filter(category => category.id === "profile")[0].completed}
            editing={editing}
          />
        );
      default:
        return <TitleDescription 
          formData={formData} 
          setFormData={setFormData} 
          onNext={handleNextCategory} 
          complete={categories.filter(category => category.id === "title")[0].completed}
          editing={editing}
        />;
    }
  };

  const categories = useMemo(
    () => [
      {
        id: "title",
        name: "Title & Description",
        // Use zod validation to indicate that a section is complete.
        completed: titleDescriptionSchema.safeParse({
          title: formData.title,
          bed_num: formData.bed_num,
          bath_num: formData.bath_num,
          description: formData.description
        }).success
      },
      {
        id: "pricing",
        name: "Pricing",
        completed: pricingSchema.safeParse({
          price: formData.price,
          priceNotes: formData.priceNotes
        }).success,
      },
      {
        id: "location",
        name: "Location",
        completed: locationSchema.safeParse({
          address: formData.address,
          locationNotes: formData.locationNotes
        }).success,
      },
      {
        id: "duration",
        name: "Duration",
        completed: durationSchema.safeParse({
          startDate: formData.startDate, 
          endDate: formData.endDate,
          durationNotes: formData.durationNotes
        }).success,
      },
      {
        id: "photos",
        name: "Photos",
        completed: photosSchema.safeParse({
          photos: formData.photos,
          rawPhotos: formData.rawPhotos,
          photoLabels: formData.photoLabels,
          imagePaths: formData.imagePaths,
          removedImagePaths: formData.removedImagePaths
        }).success,
      },
      {
        id: "profile",
        name: "Profile",
        completed: profileSchema.safeParse({
          affiliation: formData.affiliation,
          phone: formData.phone
        }).success,
      },
    ],
    [formData],
  );

  const handleNextCategory = () => {
    const currentIndex = categories.findIndex(cat => cat.id === selectedCategory);
    if (currentIndex < categories.length - 1) {
      setSelectedCategory(categories[currentIndex + 1].id);
    }
  };

  const handlePreviousCategory = () => {
    const currentIndex = categories.findIndex(cat => cat.id === selectedCategory);
    if (currentIndex > 0) {
      setSelectedCategory(categories[currentIndex - 1].id);
    }
  };

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="min-h-screen w-[90%] mx-auto bg-white">
      <Navbar includeFilter={false} includePostBtn={false} />

      {/* Main Content */}
      <div className={`mx-auto relative `}>
        <div className="mx-auto">
          <div className="flex flex-col md:flex-row gap-8 md:gap-24">
            {/* Mobile Sidebar Toggle */}
            <button
              className="md:hidden flex items-center w-fit mb-4 bg-[#FF7439] text-white py-2 px-4 rounded-full"
              onClick={toggleSidebar}
            >
              <span>{isSidebarOpen ? "Close" : "Expand"} Categories</span>
            </button>

            {/* Responsive Sidebar */}
            <div className={`${isSidebarOpen ? "block" : "hidden"} md:block w-full md:w-80`}>
              <div className="w-full md:w-80 pr-0 h-auto mb-8 md:mb-0">
                <h1 className="text-2xl font-semibold mb-8">Listing Editor</h1>
                <div className="space-y-3">
                  {categories.map((category) => (
                    <div
                      key={category.id}
                      className={`flex items-center p-3 rounded-xl cursor-pointer w-full ${
                        selectedCategory === category.id
                          ? "text-[#FF7439] border-[#FF7439] border bg-orange-50"
                          : "text-gray-500"
                      }`}
                      onClick={() => {
                        setSelectedCategory(category.id);
                        setSidebarOpen(false); // Close sidebar on mobile after selection
                      }}
                    >
                      <div className="mr-3">
                        <CategoryStatusIndicator
                          selected={selectedCategory === category.id}
                          completed={category.completed}
                        />
                      </div>
                      {category.name}
                    </div>
                  ))}

                  {/* Bottom Buttons */}
                  <div className="flex items-center justify-center pt-12 gap-4">
                    <Button
                      className={
                        "w-[5.3rem] rounded-lg px-6 flex items-center border border-red-500 bg-white text-red-500 hover:bg-red-500 hover:text-white"
                      }
                      onClick={() => resetFormData()}
                    >
                      <p>{editing ? "Reset Changes" : "Clear All"}</p>
                    </Button>
                    <Button
                      className={`w-[5.3rem] rounded-lg px-6 flex items-center ${
                        categories.every(category => category.completed) ? "bg-[#FF7439] hover:bg-[#FF7439]/90" : "bg-gray-300"
                      }`}
                      disabled={!categories.every(category => category.completed) || isPosting}
                      onClick={e => handleSubmit(e)}
                    >
                      <p>{editing ? "Save" : "Post"}</p>
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Form Content */}
            {isLoading ?
              <>
                <div className='flex ml-64 pl-16 justify-center place-items-center w-full'>
                  <LoadingCircle />
                </div>
              </> :
              <>
                <div className="flex-1 md:pl-16 md:border-l border-gray-500 pb-8 md:pr-8" style={{height: "85vh", overflowY: "auto"}}>
                  {renderComponent()}
                </div>
              </>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostForm;
