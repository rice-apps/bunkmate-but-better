"use client"

import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

export default function SignIn() {
  const supabase = createClient();
  const router = useRouter();
  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
    })
  }
  
  return <Button onClick={handleLogin}>Login</Button>;
}