import {Button} from "@/components/ui/button";
import {formatPhoneNumber, Input} from "@/components/ui/input";
import {RadioGroup, RadioGroupItem} from "@/components/ui/radio-group";
import {createClient, getImagePublicUrl} from "@/utils/supabase/client";
import Link from "next/link";
import {useEffect, useState} from "react";
import {FaChevronLeft} from "react-icons/fa6";
import PreviewButton from "./PreviewButton";
import Image from "next/image";
import { DialogHeader, Dialog, DialogContent, DialogTitle, DialogFooter  } from "@/components/ui/dialog";


const Profile = ({
  formData,
  setFormData,
  onBack,
  handleSubmit,
  isPosting,
  editingMode = false,
}: {
  formData: any;
  setFormData: any;
  onBack: () => void;
  handleSubmit: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  isPosting: boolean;
  editingMode: boolean;
}) => {
  const isComplete = Boolean(
    formData.title.length >= 1 &&
      formData.description.length >= 100 &&
      formData.price &&
      formData.address &&
      formData.startDate &&
      formData.endDate &&
      formData.photos.length >= 5 &&
      formData.phone,
  );

  const supabase = createClient();

  const [profile, setProfile] = useState({
    username: "",
    email: "",
    phone: "",
    image: "",
  });

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const user = await supabase.auth.getUser();
      if (user.data.user) {
        const {data, error} = await supabase.from("users").select().eq("id", user.data.user.id).single();

        if (error) {
          console.error("Error fetching user");
          return;
        }

        if (data) {
          setProfile({
            username: data.name,
            email: data.email,
            phone: data.phone,
            image: data.profile_image_path
              ? getImagePublicUrl("profiles", data.profile_image_path)
              : user.data.user?.user_metadata.avatar_url,
          });
        }
      } else {
        console.error("No user");
      }
    };
    fetchUser();
  }, []);

  return (
    <div>
      <Dialog open={!!error} onOpenChange={() => setError(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Error</DialogTitle>
          </DialogHeader>
          <p>{error}</p>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setError(null)}
              className="bg-[#FF7439] hover:bg-[#FF7439]/90 text-white"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <div className="flex flex-row justify-between flex-wrap-reverse gap-4 pb-2 items-center">
        <div>
          <h1 className="text-2xl font-semibold">Profile</h1>
        </div>
        <PreviewButton formData={formData} />
      </div>
      <h2 className="mb-2 text-sm text-[#222222] font-bold whitespace mt-2">
        Below is your current profile information. If you want to change this information, go to the{" "}
        <Link href="/profile-section" className="font-bold text-[#FF7439]">
          Profiles Section
        </Link>
        .
      </h2>
      <div className="flex flex-row flex-wrap items-start gap-4 pl-8 mt-10 mb-10">
        <div>
          <h2 className="text-[1.25rem] font-medium mb-4">Profile Picture</h2>
          {profile.image ? (
            <img
              src={profile.image}
              alt="profile pic"
              className="w-28 h-28 bg-gray-100 border border-gray-300 rounded-full text-gray-500 object-cover"
            />
          ) : (
            <div className="flex items-center justify-center w-28 h-28 bg-gray-100 border border-gray-300 rounded-full text-gray-500">
              profile pic
            </div>
          )}
        </div>
        <div>
          <h2 className="text-[1.25rem] font-medium mb-4">Name</h2>
          <p className="mb-6 text-sm text-gray-400">{profile ? profile.username : "First Last"}</p>
          <h2 className="text-[1.25rem] font-medium mb-4">Email address</h2>
          <p className="mb-6 text-sm text-gray-400">{profile ? profile.email : "netid@rice.edu"}</p>
        </div>
      </div>
      <hr></hr>

      <div className="mt-10">
        <p className="mb-4 text-sm text-[#222222] font-bold">Input your information below.</p>
        <p className="mb-4 text-sm text-[#222222] font-bold">
          These will be displayed and used to help people interested in your listing connect with you.
        </p>
      </div>
      <div className="mt-10">
        <h2 className="text-[1.25rem] font-medium mb-2">Rice Affiliation</h2>
        <p className="text-sm text-gray-400 mb-6">Below, select the option that applies to you:</p>
        <div className="space-y-8">
          <RadioGroup
            value={formData.affiliation}
            onValueChange={value => setFormData({...formData, affiliation: value})}
          >
            <label className="block cursor-pointer">
            <div
              className={`flex items-center space-x-2 p-4 rounded-xl border-2 
          ${
            formData.affiliation === "student"
              ? "border-[#FF7439] bg-[#FF7439]/30"
              : "border-[#B5B5B5] bg-gray-50"
          }`}
            >
              <RadioGroupItem
                value="student"
                className={`content-none border-2 rounded-full w-4 h-4 ${
                  formData.affiliation === "student"
                    ? "border-none bg-[#FF7439]"
                    : "border-[#777777] bg-white"
                }`}
              />
              <label className="text-sm text-[#777777] font-medium">I am a Rice student</label>
            </div>
            </label>
            <label className="block cursor-pointer">
            <div
              className={`flex items-center space-x-2 p-4 rounded-xl border-2 
          ${formData.affiliation === "alum" ? "border-[#FF7439] bg-[#FF7439]/30" : "border-[#B5B5B5] bg-gray-50"}`}
            >
              <RadioGroupItem
                value="alum"
                className={`content-none border-2 rounded-full w-4 h-4 ${
                  formData.affiliation === "alum" ? "border-none bg-[#FF7439]" : "border-[#777777] bg-white"
                }`}
              />
              <label className="text-sm text-[#777777] font-medium">I am a Rice alum</label>
            </div>
            </label>
          </RadioGroup>
        </div>
      </div>
      <div>
        <div className="mt-10">
          <h2 className="text-[1.25rem] font-medium mb-2 mt-4">Phone Number</h2>
          <p className="text-sm text-gray-400 mb-6">Use the number you&apos;d like to be contacted with.</p>
            <div>
            <Input
              type="tel"
              placeholder="(123) 456-7890"
              value={formatPhoneNumber(formData.phone)}
              onChange={e => {
              const value = e.target.value.replace(/\D/g, '');
              if (value.length <= 10) {
                setFormData({...formData, phone: value});
              }
              }}
              maxLength={14}
              className="h-15 p-4 rounded-xl border border-[#B5B5B5]"
            />
            </div>
        </div>
      </div>

      <div className="flex justify-between pt-10">
        <Button
          className="w-[5.3rem] rounded-lg px-6 flex items-center bg-[#FF7439] hover:bg-[#FF7439]/90"
          onClick={onBack}
        >
          <FaChevronLeft />
          <p>Back</p>
        </Button>
        <Button
          className={`w-[5.3rem] rounded-lg px-6 flex items-center shadow-lg ${
            isComplete ? "bg-[#FF7439] hover:bg-[#FF7439]/90" : "bg-gray-300"
          }`}
          disabled={!isComplete || isPosting}
          onClick={async e => {
            try {
              await handleSubmit(e);
            } catch (error) {
              console.log("found error", error);
              setError(error instanceof Error ? error.message : 'An unexpected error occurred');
            }
          }}
        >
          <p>{editingMode ? "Save" : "Post"}</p>
        </Button>
      </div>
    </div>
  );
};

export default Profile;
