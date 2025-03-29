"use client";

import { useState } from "react";
import FAQItem from "./FAQItem";

interface FAQData {
  question: string;
  answer?: string;
  videoSrc?: string;
}

const faqs: FAQData[] = [
  {
    question: "How do I use Bunkmate?",
    answer:
      "If you're looking for subletters or co-leasers, post your listing and let people reach out! If you're looking for a place to stay, browse listings and reach out to posters.",
  },
  {
    question: "How can I filter through what I want?",
    answer:
      "On our search bar, you can filter by price, date, and distance from Rice. For more options, use the advanced filter icon.",
    videoSrc: "/putvidhere.mp4",
  },
  {
    question: "Do I need to have signed a lease before posting?",
    answer:
      "No! As long as you're planning to sublet or co-lease, you can post a listing.",
  },
];

export default function FAQGroup() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="max-w-3xl mx-auto px-6 w-full">
      {faqs.map((faq, index) => (
        <FAQItem
          key={index}
          {...faq}
          isOpen={openIndex === index}
          onToggle={() =>
            setOpenIndex(openIndex === index ? null : index)
          }
        />
      ))}
    </div>
  );
}
