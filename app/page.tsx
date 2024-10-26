import ListingCard from "@/components/ListingCard";
import Navbar from "@/components/Navbar";
import { hasEnvVars } from "@/utils/supabase/check-env-vars";

export default async function Index() {
  return (
    <>
    <Navbar />
    <ListingCard />
    </>
  );
}
