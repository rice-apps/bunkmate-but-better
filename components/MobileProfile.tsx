"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";
import { createClient, getImagePublicUrl, getShimmerData } from "@/utils/supabase/client";
import { formatPhoneNumber } from "@/components/ui/input";
import LoadingCircle from "@/components/LoadingCircle";
import { RiPencilFill } from "react-icons/ri";

type ProfileType = {
  username: string;
  email: string;
  phone: string;
  image: string;
  affiliation: "student" | "alum";
} | null;

export default function MobileProfileSection() {
  const supabase = createClient();
  const [profile, setProfile] = useState<ProfileType>(null);
  const [modalField, setModalField] = useState<"name" | "email" | "phone" | null>(null);
  const [tempValue, setTempValue] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      const user = await supabase.auth.getUser();
      if (user.data.user) {
        supabase
          .from("users")
          .select()
          .eq("id", user.data.user.id)
          .then((data) => {
            if (data.error) {
              console.error("Error fetching user");
              return;
            }
            if (data.data.length === 0) {
              console.error("No user");
              return;
            }
            let profileImageUrl = user.data.user?.user_metadata.avatar_url;
            if (data.data[0].profile_image_path) {
              profileImageUrl = getImagePublicUrl("profiles", data.data[0].profile_image_path);
            }
            setProfile({
              username: data.data[0].name,
              email: data.data[0].email,
              phone: data.data[0].phone,
              image: profileImageUrl,
              affiliation: data.data[0].affiliation,
            });
          });
      } else {
        console.error("No user");
      }
    };
    fetchUser();
  }, [supabase]);

  const handleSave = async () => {
    const user = await supabase.auth.getUser();
    if (modalField && user.data.user?.id) {
      const fieldToUpdate =
        modalField === "name"
          ? { name: tempValue }
          : modalField === "email"
          ? { email: tempValue }
          : { phone: tempValue };

      const { error } = await supabase
        .from("users")
        .update(fieldToUpdate)
        .eq("id", user.data.user.id);

      if (!error) {
        setProfile((prev) => ({
          ...prev!,
          username: modalField === "name" ? tempValue : prev!.username,
          email: modalField === "email" ? tempValue : prev!.email,
          phone: modalField === "phone" ? tempValue : prev!.phone,
        }));
        setModalField(null);
      }
    }
  };

  if (!profile) return <LoadingCircle />;

  return (
    <div className="mx-auto max-w-4xl">
      {/* Modal */}
      {modalField && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 w-[90%] max-w-md shadow-lg">
            <h1 className="text-xl font-semibold mb-4 text-center text-orange-500">
              {modalField === "name" && "Update Name"}
              {modalField === "email" && "Update Email"}
              {modalField === "phone" && "Update Phone Number"}
            </h1>
            <input
              type="text"
              value={tempValue}
              onChange={(e) => setTempValue(e.target.value)}
              className="bg-white w-full border border-gray-300 rounded-md p-2 mb-4"
              placeholder={
                modalField === "phone"
                  ? "+1 (XXX) XXX-XXXX"
                  : modalField === "email"
                  ? "you@example.com"
                  : "Your full name"
              }
            />
            <div className="flex justify-between">
              <button
                onClick={handleSave}
                className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
              >
                Save
              </button>
              <button
                onClick={() => setModalField(null)}
                className="text-gray-500 hover:text-gray-800"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-semibold text-left">Profile</h1>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="flex flex-col sm:flex-row sm:gap-24 py-5"
      >
        {/* Profile Picture */}
        <div className="flex flex-col items-center sm:items-start gap-8">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="relative w-[18vh] h-[18vh] overflow-hidden rounded-full"
          >
            <Image
              src={profile?.image || "/profile_pic.jpeg"}
              placeholder={`data:image/svg+xml;base64,${getShimmerData()}`}
              fill
              alt="Profile Picture"
              className="object-cover"
            />
          </motion.div>
        </div>

        {/* Profile Info */}
        <div className="flex flex-col gap-4 mt-8 sm:mt-0 w-full">
        {/* Name */}
        <div className="flex items-center justify-between">
            <h1 className="text-lg font-medium">Named:</h1>
            <div className="flex items-center gap-2">
            <p className="text-lg text-gray-400">{profile?.username}</p>
            <RiPencilFill
                className="text-[#777777] cursor-pointer"
                onClick={() => {
                setModalField("name");
                setTempValue(profile.username);
                }}
            />
            </div>
        </div>

        {/* Email */}
        <div className="flex items-center justify-between">
            <h1 className="text-lg font-medium">Email Address:</h1>
            <div className="flex items-center gap-2">
            <p className="text-lg text-gray-400">{profile?.email}</p>
            <RiPencilFill
                className="text-[#777777] cursor-pointer"
                onClick={() => {
                setModalField("email");
                setTempValue(profile.email);
                }}
            />
            </div>
        </div>

        {/* Phone */}
        <div className="flex items-center justify-between">
        <h1 className="text-lg font-medium">Phone Number:</h1>
        <div className="flex items-center gap-2">
            <p className="text-lg text-gray-400">
            {profile?.phone ? formatPhoneNumber(profile?.phone) : "+1 (XXX) XXX-XXXX"}
            </p>
            <RiPencilFill
            className="text-[#777777] cursor-pointer"
            onClick={() => {
                setModalField("phone");
                setTempValue(profile.phone);
            }}
            />
        </div>
        </div>
          {/* Affiliation */}
            <div className="flex justify-between items-center">
            <h1 className="text-lg font-medium mr-4">Rice Affiliation:</h1>
            <div className="flex items-center gap-2">
                <Image src="/owl.png" width={20} height={20} alt="Owl" className="w-5 h-5" />
                <p className="text-sm text-[#FF7439]">
                Rice {profile.affiliation === "student" ? "Student" : "Alumni"}
                </p>
            </div>
            </div>
        </div>
      </motion.div>
    </div>
  );
}
