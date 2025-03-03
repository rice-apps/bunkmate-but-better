"use client";

import Navbar from "@/components/Navbar";
import {Button} from "@/components/ui/button";
import {PostListingFormContext} from "@/providers/PostListingFormProvider";
import {createClient} from "@/utils/supabase/client";
import {useRouter} from "@bprogress/next";
import {useContext, useMemo, useState} from "react";
import {v4} from "uuid";
import CategoryStatusIndicator from "./CategoryStatusIndicator";
import Duration from "./Duration";
import Location from "./Location";
import Photos from "./Photos";
import Pricing from "./Pricing";
import Profile from "./Profile";
import TitleDescription from "./TitleDescription";
import Footer from "@/components/Footer";
export interface FormDataType {
  title: string;
  description: string;
  price: number;
  priceNotes: string;
  startDate: string;
  endDate: string;
  durationNotes: string;
  address: {label: string; value: {description: string}};
  locationNotes: string;
  photos: string[];
  rawPhotos: File[];
  photoLabels: {[key: number]: string};
  imagePaths: string[];
  removedImagePaths: string[];
  affiliation: string;
  phone: string;
  bed_num: number;
  bath_num: number;
}

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

// Main PostListing component
const PostListing = () => {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState("title");
  const {formData, setFormData, resetFormData} = useContext(PostListingFormContext);
  const [isOpen, setIsOpen] = useState(false);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isPosting, setIsPosting] = useState(false);

  const isComplete = Boolean(
    formData.title.length >= 1 &&
      formData.description.length >= 100 &&
      formData.price &&
      formData.address.label.length > 0 &&
      formData.startDate &&
      formData.endDate &&
      formData.photos.length >= 5 &&
      formData.phone,
  );

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    setIsPosting(true);
    e.preventDefault();
    const supabase = createClient();
    const userId = (await supabase.auth.getUser()).data.user?.id;
    const insertions: ImagePromiseType[] = [];

    // Cache the name of our file paths
    const filePaths: string[] = [];

    formData.rawPhotos.forEach(photo => {
      const filePath = `${userId}/${v4()}`;
      const insertion = supabase.storage.from("listing_images").upload(filePath, photo);
      insertions.push(insertion);
      filePaths.push(filePath);
    });

    try {
      const imageUploads = await Promise.all(insertions);
      const successfulUploads = imageUploads.filter(imageUploads => imageUploads.data);

      if (successfulUploads.length != filePaths.length) {
        const successfulFilePaths = successfulUploads.map((imgResp: ImageResponse) => imgResp.data?.path);
        throw new Error("Some image(s) failed to upload", {
          cause: successfulFilePaths,
        });
      }

      // Calculate distance from address to Rice University
      const distance = await calculateDistance(formData.address.label);
      if (!distance) {
        throw new Error("Unable to validate address or calculate distance. Please check the address.");
      }

      const {data, error} = await supabase
        .from("listings")
        .insert([
          {
            user_id: userId,
            phone_number: formData.phone,
            title: formData.title,
            description: formData.description,
            price: formData.price,
            price_notes: formData.priceNotes,
            start_date: formData.startDate,
            end_date: formData.endDate,
            duration_notes: formData.durationNotes,
            address: formData.address.label,
            location_notes: formData.locationNotes,
            distance: distance,
            image_paths: filePaths,
            bed_num: formData.bed_num,
            bath_num: formData.bath_num,
          },
        ])
        .select()
        .single();

      if (error) {
        throw new Error(error.message, {
          cause: successfulUploads.map((imgResp: ImageResponse) => imgResp.data?.path),
        });
      }

      const imageCaptions = filePaths.map((path, index) => ({
        user_id: userId,
        image_path: path,
        caption: formData.photoLabels[index] || "",
      }));

      const filteredImageCaptions = imageCaptions.filter(imageCaption => imageCaption.caption !== "");

      const {error: captionError} = await supabase.from("images_captions").insert(filteredImageCaptions).select();

      if (captionError) {
        throw new Error(captionError.message, {cause: filePaths});
      }
      resetFormData();
      router.push("/");
    } catch (error: any) {
      console.error(error.message);
      await cleanupUploads(error.cause);
      throw error;
    } finally {
      setIsPosting(false);
    }
  };

  const geocodeAddress = async (address: string) => {
    if (!address) {
      throw new Error("Valid address is required");
    }
    try {
      const API_KEY = process.env.NEXT_PUBLIC_GEOCODE_API_KEY;
      const response = await fetch(`https://geocode.maps.co/search?q=${address}&api_key=${API_KEY}`);
      if (!response.ok) {
        throw new Error("Failed to geocode address");
      }
      const data = await response.json();
      if (data && data.length > 0) {
        return {
          lat: data[0].lat,
          lon: data[0].lon,
        };
      } else {
        throw new Error("No geocode results found for " + address);
      }
    } catch (error) {
      console.error("Error geocoding address:", error);
      throw error;
    }
  };

  const calculateDistance = async (address: string) => {
    if (!address) {
      throw new Error("Valid address is required");
    }
    try {
      //const RICE_ADDRESS = "6100 Main St, Houston, TX 77005";
      const riceCoords = {lat: 29.716791450000002, lon: -95.40478113393792};
      const listingCoords = await geocodeAddress(address);
      if (!riceCoords || !listingCoords) {
        throw new Error("Could not geocode addresses");
      }
      const osrmResponse = await fetch(
        `https://router.project-osrm.org/route/v1/driving/${riceCoords.lon},${riceCoords.lat};${listingCoords.lon},${listingCoords.lat}?overview=false`,
      );
      if (!osrmResponse.ok) {
        throw new Error("Failed to calculate distance");
      }
      const osrmData = await osrmResponse.json();
      if (!osrmData.routes || osrmData.routes.length === 0) {
        throw new Error("No distance results found");
      }
      const distanceMeters = osrmData.routes[0].distance;
      const distanceMiles = (distanceMeters * 0.000621371).toFixed(1);
      return distanceMiles;
    } catch (error) {
      console.error("Error calculating distance:", error);
      throw error;
    }
  };

  async function cleanupUploads(paths: string[]) {
    const supabase = createClient();
    await supabase.storage.from("listing_images").remove(paths);
    await supabase.from("images_captions").delete().in("image_path", paths);
  }

  const handlePreviewClick = () => {
    const previewData = {
      ...formData,
      photos: formData.photos,
    };
    localStorage.setItem("listingFormData", JSON.stringify(previewData));
    router.push("/post-a-listing/preview");
  };

  const renderComponent = () => {
    switch (selectedCategory) {
      case "title":
        return <TitleDescription formData={formData} setFormData={setFormData} onNext={handleNextCategory} />;
      case "pricing":
        return (
          <Pricing
            formData={formData}
            setFormData={setFormData}
            onNext={handleNextCategory}
            onBack={handlePreviousCategory}
          />
        );
      case "location":
        return (
          <Location
            formData={formData}
            setFormData={setFormData}
            onNext={handleNextCategory}
            onBack={handlePreviousCategory}
          />
        );
      case "duration":
        return (
          <Duration
            formData={formData}
            setFormData={setFormData}
            onNext={handleNextCategory}
            onBack={handlePreviousCategory}
          />
        );
      case "photos":
        return (
          <Photos
            formData={formData}
            setFormData={setFormData}
            onNext={handleNextCategory}
            onBack={handlePreviousCategory}
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
          />
        );
      default:
        return <TitleDescription formData={formData} setFormData={setFormData} onNext={handleNextCategory} />;
    }
  };

  const categories = useMemo(
    () => [
      {
        id: "title",
        name: "Title & Description",
        completed: formData.title.length >= 1 && formData.description.length >= 100 && !isNaN(formData.bed_num) && !isNaN(formData.bath_num)
      },
      {
        id: "pricing",
        name: "Pricing",
        completed: Boolean(formData.price),
      },
      {
        id: "location",
        name: "Location",
        completed: Boolean(formData.address.label),
      },
      {
        id: "duration",
        name: "Duration",
        completed: Boolean(formData.startDate && formData.endDate),
      },
      {
        id: "photos",
        name: "Photos",
        completed: formData.photos.length >= 5,
      },
      {
        id: "profile",
        name: "Profile",
        completed: Boolean(formData.phone),
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

  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    // Redirect to Sign-in page
    router.push("/sign-in");
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
                  {categories.map(category => (
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
                      <p>Clear All</p>
                    </Button>
                    <Button
                      className={`w-[5.3rem] rounded-lg px-6 flex items-center ${
                        isComplete ? "bg-[#FF7439] hover:bg-[#FF7439]/90" : "bg-gray-300"
                      }`}
                      disabled={!isComplete || isPosting}
                      onClick={e => handleSubmit(e)}
                    >
                      <p>Post</p>
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Form Content */}
            <div
              className="flex-1 md:pl-16 md:border-l border-gray-500 pb-8 md:pr-8"
              style={{height: "85vh", overflowY: "auto"}}
            >
              {renderComponent()}
            </div>
          </div>
        </div>
      </div>
      <Footer/>
    </div>
  );
};

export default PostListing;
