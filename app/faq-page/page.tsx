"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FAQItem from "@/components/FAQItem";
import Image from "next/image";
import FAQGroup from "@/components/FAQGroup";

export default function Faq() {
  return (
    <div className="flex flex-col min-h-screen items-center w-[90%] sm:w-[90%] mx-auto">
        <Navbar includeFilter={false} />
      <div className="flex flex-col flex-grow items-center w-full max-w-3xl px-4 sm:px-6 mx-auto">
        <div className="flex flex-col items-center text-center relative mt-8 mb-12">
          <div className="flex flex-col sm:flex-row items-center gap-3 text-center sm:text-left">
            <Image
              src="/faq.png"
              alt="confused face"
              width={35}
              height={30}
            />
            <h1 className="text-5xl font-extrabold text-black relative">
              Frequently Asked Questions
            </h1>
          </div>
          <p className="text-[16px]  text-gray-600 mt-2">
            You have questions? We have answers!!
          </p>
        </div>

        <FAQGroup />
      </div>
      <Footer />
    </div>
  );
}
