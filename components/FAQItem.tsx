"use client";

import { JSX, useEffect, useRef } from "react";
import { FaPlus, FaMinus } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

interface FAQItemProps {
  question: string;
  answer?: string | JSX.Element;
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

    <AnimatePresence>
      {isOpen && (
        <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: "auto", opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="overflow-hidden mt-3 ml-4 sm:ml-7 text-sm text-[#5E6366] space-y-4"
      >
          {answer && <p className="leading-[30px]">{answer}</p>}
          {videoSrc && (
            <video
              ref={videoRef}
              src={videoSrc}
              controls
              autoPlay
              muted
              playsInline
              className="w-full rounded-xl border border-[#FF7439] bg-[#FFF4F0] p-4"
            />
          )}
          </motion.div>
      )}
      </AnimatePresence>
    </div>
  );
};

export default FAQItem;
