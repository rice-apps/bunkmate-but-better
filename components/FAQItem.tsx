"use client";

import { useEffect, useRef } from "react";
import { FaPlus, FaMinus } from "react-icons/fa";

interface FAQItemProps {
  question: string;
  answer?: string;
  videoSrc?: string;
  isOpen: boolean;
  onToggle: () => void;
}

const FAQItem = ({
  question,
  answer,
  videoSrc,
  isOpen,
  onToggle,
}: FAQItemProps) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (videoRef.current) {
      if (isOpen) {
        videoRef.current.play();
      } else {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      }
    }
  }, [isOpen]);

  return (
    <div className="max-w-3xl mb-6 border-b border-gray-200 pb-4 w-full">
      <button
        onClick={onToggle}
        className="flex items-center gap-3 text-left"
      >
        <span className="text-[#FF7439] mt-[2px]">
          {isOpen ? <FaMinus /> : <FaPlus />}
        </span>
        <span className="text-[16px] font-semibold text-black">
          {question}
        </span>
      </button>

      {isOpen && (
        <div className="mt-3 ml-7 text-sm text-[#5E6366] space-y-4">
          {answer && <p>{answer}</p>}
          {videoSrc && (
            <video
              ref={videoRef}
              src={videoSrc}
              controls
              autoPlay
              muted
              playsInline
              className="w-full max-w-lg rounded-xl border border-[#FF7439] bg-[#FFF4F0] p-4"
            />
          )}
        </div>
      )}
    </div>
  );
};

export default FAQItem;
