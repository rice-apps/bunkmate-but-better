"use client";

import {useContext, useEffect, useState} from "react";
import Image from "next/image";
import {format} from "date-fns";
import {Button} from "@/components/ui/button";
import {ChevronLeft, ChevronRight, MapPin, Calendar, Phone, Mail} from "lucide-react";
import {useRouter, useSearchParams} from "next/navigation";
import MeetSubleaser from "@/components/MeetSubleaser";
import ListingDescription from "@/components/ListingDescription";
import Listing from "@/components/Listing";
import {createClient} from "@/utils/supabase/client";
import {PostListingFormContext} from "@/providers/PostListingFormProvider";

interface UserData {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  profile_image_path: string | null;
  affiliation: string | null;
}

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

const PreviewPage = () => {
  const supabase = createClient();
  const {formData} = useContext(PostListingFormContext);
  const [user, setUser] = useState<UserData | null>(null);

  useEffect(() => {
    const loadUser = async () => {
      const {
        data: {user},
      } = await supabase.auth.getUser();

      if (user) {
        setUser({
          id: user.id,
          name: user.user_metadata.username,
          email: user.email!,
          phone: user.phone || "",
          profile_image_path: user.user_metadata.avatar_url,
          affiliation: "rice",
        });
      }
    };

    loadUser();
  }, []);

  return (
    <>
      <Listing
        data={{
          id: "0",
          title: formData.title,
          distance: "2 miles away",
          start_date: formData.startDate,
          end_date: formData.endDate, // Use the new format
          price: formData.price,
          location: formData.address,
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
        }}
      />
      <div className="flex flex-col lg:flex-row w-full mt-4 justify-between mb-10 px-14 gap-10">
        <div className="lg:w-1/2 xl:w-2/3">
          <ListingDescription
            data={{
              description: formData.description,
              price: formData.price,
              priceNotes: formData.priceNotes,
              start_date: formData.startDate,
              end_date: formData.endDate,
              durationNotes: formData.durationNotes,
              distance: "2 miles away",
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
      </div>
    </>
  );
};

export default PreviewPage;
