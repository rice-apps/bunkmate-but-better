"use client";

import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { FcGoogle } from "react-icons/fc";

export default function SignIn() {
  const supabase = createClient();
  const router = useRouter();

  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
    });
  };

  return (
    <div className="min-h-screen bg-white w-full">
      {/* Navbar */}
      <nav className="bg-white">
        <div className="container mx-auto px-4 py-4">
          <Link href="/">
            <div className="flex items-center space-x-2">
              <Image src="/bunkmate_logo.png" alt="Bunkmate" width={32} height={32} />
              <span className="text-xl text-[#FF7439] font-semibold">bunkmate</span>
            </div>
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-4 flex flex-col items-center justify-center min-h-[calc(100vh-88px)]">
        <div className="w-full max-w-lg space-y-8">
          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">
              Welcome to <span className="text-[#FF7439]">bunkmate</span>
            </h1>
            <p className="text-gray-500">
              Find your perfect housing match at Rice University
            </p>
          </div>

          {/* Sign in options */}
          <div className="space-y-4">
            <Button
              onClick={handleLogin}
              variant="outline"
              className="w-full py-6 border-2 hover:bg-gray-50 space-x-4"
            >
              <FcGoogle className="w-6 h-6" />
              <span>Continue with Google</span>
            </Button>

          </div>

          {/* Footer */}
          <p className="text-center text-sm text-gray-500">
            By continuing, you agree to bunkmate's{' '}
            <Link href="/terms" className="text-[#FF7439] hover:underline">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="/privacy" className="text-[#FF7439] hover:underline">
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}