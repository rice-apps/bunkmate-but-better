"use client";

import Listing from "@/components/Listing";
import ListingDescription from "@/components/ListingDescription";
import MeetSubleaser from "@/components/MeetSubleaser";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { defaultPostFormData, PostListingFormContext } from "@/providers/PostListingFormProvider";
import { createClient, getImagePublicUrl } from "@/utils/supabase/client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useRouter } from "@bprogress/next";
import { useContext, useEffect, useState } from "react";
import { FormDataType } from "../PostForm";

interface UserData {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  profile_image_path: string | null;
  affiliation: string | null;
}

const PreviewPage = () => {
  const supabase = createClient();
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState<FormDataType>(defaultPostFormData);
  const { postFormData, editFormData } = useContext(PostListingFormContext);
  const [user, setUser] = useState<UserData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const loadUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        setUser({
          id: user.id,
          name: user.user_metadata.name,
          email: user.email!,
          phone: user.phone || "",
          profile_image_path: user.user_metadata.avatar_url,
          affiliation: "rice",
        });
      }
    };

    if (searchParams.get("editing") === "true") {
      setFormData({...editFormData, photos: editFormData.imagePaths.map(path => getImagePublicUrl("listing_images", path)).concat(editFormData.photos)});
    }
    else {
      setFormData(postFormData);
    }

    loadUser();
  }, []);

  return (
    <>
      <Listing
        data={{
          id: "0",
          title: formData.title,
          distance: "",
          start_date: formData.startDate,
          end_date: formData.endDate, // Use the new format
          price: formData.price,
          location: formData.address.label,
          imagePaths: formData.photos,
          captions: formData.photoLabels,
          loadImages: false,
          description: formData.description,
          phoneNumber: formData.phone,
          durationNotes: formData.durationNotes,
          priceNotes: formData.priceNotes,
          user: user
            ? {
                fullName: user.name,
                avatarUrl: user.profile_image_path,
                email: user.email,
                isRiceStudent: true,
              }
            : null,
          isFavorited: false,
        }}
        isPreview
      />
      <div className="flex flex-col lg:flex-row w-full mt-4 justify-between mb-10 gap-10">
        <div className="lg:w-1/2 xl:w-2/3">
          <ListingDescription
            data={{
              description: formData.description,
              price: formData.price,
              priceNotes: formData.priceNotes,
              start_date: formData.startDate,
              end_date: formData.endDate,
              durationNotes: formData.durationNotes,
              distance: 2,
              location: formData.address.label,
              bed_num: formData.bed_num,
              bath_num: formData.bath_num,
            }}
          />
        </div>
        <div className="lg:w-1/2 xl:w-1/3">
          <MeetSubleaser
            data={{
              phone_number: formData.phone,
              user: user
                ? {
                    full_name: user.name,
                    email: user.email,
                    avatar_url: user.profile_image_path || undefined,
                    is_rice_student: user.affiliation === "Rice Student",
                  }
                : undefined,
            }}
          />
        </div>

        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="w-fit">
            <div className="px-10 py-6 flex flex-col gap-6">
              <DialogTitle className="font-normal text-xl flex text-center items-center">
                You're entering <p className="font-bold">&nbsp;Preview Mode</p>
              </DialogTitle>

              <p>
                Take a look at what your listing will look like once it’s
                posted.
              </p>
              <p className="flex items-end whitespace-nowrap">
                Click on the top right to go{" "}
                <span className="text-[#777777] font-semibold">
                  &nbsp;back to listing editor
                </span>
                .
              </p>

              <div className="flex justify-end space-x-4">
                <Button
                  variant="outline"
                  className="rounded-lg px-6 flex items-center bg-white border border-[#777777] hover:bg-white/90 text-[#777777]"
                  onClick={() => router.back()}
                >
                  Back to Editor
                </Button>
                <Button
                  className="rounded-lg px-6 flex items-center bg-[#777777] hover:bg-[#777777]/90"
                  onClick={() => setIsModalOpen(false)}
                >
                  Go to Preview
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};

export default PreviewPage;
