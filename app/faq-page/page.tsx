"use client"

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FAQItem from "@/components/FAQItem";
import Image from "next/image";
import FAQGroup from "@/components/FAQGroup";


export default function Faq() {
  return (
    <div className="flex flex-col items-center w-[90%] sm:w-[90%] mx-auto">
      <Navbar includeFilter={false} />

      <div className="flex flex-col items-center text-center relative mt-8 mb-12">
        <div className="flex items-center gap-3">
          <Image
            src="/about-1.png"
            alt="silly face"
            width={24}
            height={24}
          />

          <h1 className="text-5xl font-extrabold text-black relative">
            Frequently Asked Questions
          </h1>

          <Image
            src="/about-1.png"
            alt="silly face"
            width={24}
            height={24}
          />
        </div>

        {/* Subheading */}
        <p className="text-[16px] text-gray-600 mt-2">
          You have questions? We have answers!!
        </p>
      </div>


      <FAQGroup />
      <Footer />
    </div>
  );
}