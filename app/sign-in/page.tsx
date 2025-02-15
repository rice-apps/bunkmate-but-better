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
    <div className="min-h-screen bg-white w-full flex">
      {/* Left Side - Showcase */}
      <div className="hidden lg:flex w-[55.5%] relative overflow-hidden bg-[#FF7439]">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="w-full h-full" 
            style={{
              backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Cg fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M0 38.59l2.83-2.83 1.41 1.41L1.41 40H0v-1.41zM0 1.4l2.83 2.83 1.41-1.41L1.41 0H0v1.41zM38.59 40l-2.83-2.83 1.41-1.41L40 38.59V40h-1.41zM40 1.41l-2.83 2.83-1.41-1.41L38.59 0H40v1.41zM20 18.6l2.83-2.83 1.41 1.41L21.41 20l2.83 2.83-1.41 1.41L20 21.41l-2.83 2.83-1.41-1.41L18.59 20l-2.83-2.83 1.41-1.41L20 18.59z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
            }}
          />
        </div>
        
        {/* Content */}
        <div className="relative z-20 p-12 flex flex-col h-full">
          {/* Logo Section */}
          <div className="flex items-center space-x-2 mb-16">
            <div className="relative w-[25px] h-[25px]">
              <Image 
                src="/bunkmate_logo.png"
                alt="Bunkmate" 
                fill
                className="brightness-0 invert object-contain"
              />
            </div>
            <span className="ml-4 text-2xl text-white font-semibold">bunkmate</span>
          </div>
          
          {/* Main Content */}
          <div className="mt-5 flex-1 flex flex-col gap-8">
            {/* Text Section */}
            <div className="max-w-3xl text-center">
              <h3 className="text-4xl font-bold text-white mb-3">
                Find your perfect housing match at Rice.
              </h3>
              <p className="text-xl text-white/90">
                Connect with Rice students & find your ideal living space!
              </p>
            </div>

            {/* Screenshot Container */}
            <div className="w-full mt-4">
              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 shadow-2xl transform -rotate-2">
                <div className="relative w-full aspect-[16/9] rounded-lg overflow-hidden">
                  <Image
                    src="/homepage.png"
                    alt="Bunkmate Platform Preview"
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Sign In */}
      <div className="flex-1 flex flex-col">
        {/* Mobile Nav */}
        <nav className="lg:hidden bg-white border-b">
          <div className="container mx-auto px-4 py-4">
            <Link href="/">
              <div className="flex items-center space-x-2">
                <div className="relative w-[32px] h-[32px]">
                  <Image 
                    src="/bunkmate_logo_white.png" 
                    alt="Bunkmate" 
                    fill
                    className="object-contain"
                  />
                </div>
                <span className="text-xl text-[#FF7439] font-semibold">bunkmate</span>
              </div>
            </Link>
          </div>
        </nav>

        {/* Sign In Content */}
        <div className="flex-1 flex items-center justify-center p-12">
          <div className="w-full max-w-lg space-y-8">
            <div className="text-center space-y-2">
              <h1 className="text-3xl font-bold tracking-tight">
                Welcome to <span className="text-[#FF7439]">bunkmate</span>
              </h1>
              <p className="text-gray-500">
                Please sign in through Google to access your account!
              </p>
            </div>

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
    </div>
  );
}