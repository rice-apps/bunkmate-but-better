"use client";

import { JSX, useState } from "react";
import FAQItem from "./FAQItem";
import Link from "next/link";
import { MdArrowOutward } from "react-icons/md";

interface FAQData {
  question: string;
  answer?: string | JSX.Element;
  videoSrc?: string;
}

const faqs: FAQData[] = [
  {
    question: "How do I use Bunkmate?",
    answer: (
      <>
        If you are looking for <b>subletters, subleasers, or co-leasers,</b> you can {" "}
        {
          <Link
          href="/post-a-listing"
          className="inline-flex items-center underline font-bold"
          style={{ color: "#FF7439" }}
        >
          post your listing
          <MdArrowOutward className="h-[1rem] w-[1rem]" />
        </Link>
        
        }{" "}
        for people to reach out to you!
        
        <br></br>
        <br></br>

        If you are looking for a <b>place to stay,</b> browse the {" "}
        {
          <Link
          href="/"
          className="inline-flex items-center underline font-bold"
          style={{ color: "#FF7439" }}
        >
          home page
          <MdArrowOutward className="h-[1rem] w-[1rem]" />
        </Link>
        
        }{" "} to see what people have posted so far and reach out to posters to express your interest.
        
      </>
    ),
  },
  {
    question: "How can I filter through what I want?",
    answer: (
      <>
        On our default <b>search bar</b>, you can filter by price, date, and distance from Rice. 
        <br></br>
        <br></br>
        If you want more options, however, click on the <b>advanced filter icon </b> to access more options to filter through. Here, you can filter through rooms and beds, lease duration, and popular locations!
        {/* <br></br>
        <br></br>
        <em> Note that on mobile or smaller screens, the default and advanced filter options are in the same location. Video below is only for desktop!</em> */}
      </>
    ),
   
    // videoSrc: "/putvidhere.mp4",
  },
  {
    question: "Do I need to have signed a lease before posting?",
    answer: (
      <> 
        Nope! However, as best practice:
        <ul className="list-disc pl-6">
          <li>If you are looking for <b>subletters or subleasers,</b> we suggest that you already have a lease that you have at least verbally committed to. </li>
          <li>If you are looking for <b>co-leasers</b>, feel free to post listings that you are interested in and mention in the post description that you are looking for a co-leaser before committing!</li>
        </ul> 
      </>
    ),
  },
  {
    question: "What do I do if I’m interested in a listing?",
    answer: (
      <> 
        If you click on the listing you’re interested in, there is a section on the listing page listed as “Meet the Subleaser.” Copy and paste their contact information to start a conversation with them!
        <br></br>
        <br></br>
        <em>P.S.: New features will be coming out soon to track analytics in listing interest!</em>
      </>
    ),
  },
  {
    question: "Can people outside of Rice access Bunkmate?",
    answer: (
      <> 
        Nope — Bunkmate was built exclusively for Rice students and alumni to safely share housing information for student housing or summer leasing!
        For security reasons, only users with a valid rice.edu email can access the platform.
      </>
    ),
  },
  {
    question: "Who should I reach out to if there’s a problem with the site or if I want to give feedback?",
    answer: (
      <> 
        Thank you so much for catching the issue or giving feedback! We always appreciate it!   
        <br></br>  
        <br></br>
        Please reach out to the following with a clear description over what the issue/feedback is (with screenshots if applicable):
        <ul className="list-disc pl-6 leading-8">
          <li><b>Lucy Han </b> — lh53@rice.edu | 408-394-1280 </li>
          <li><b>Gabriel Ong</b> — go15@rice.edu | 360-890-9433</li>
          <li><b>Sathya Padmanabhan</b> — sp180@rice.edu | 480-925-5445</li>
        </ul> 
      </>
    ),
  },
];

export default function FAQGroup() {
  const [openIndices, setOpenIndices] = useState<number[]>([]);

  return (
    <div className="max-w-3xl mx-auto px-6 mb-20 w-full">
      {faqs.map((faq, index) => (
        <FAQItem
          key={index}
          {...faq}
          isOpen={openIndices.includes(index)}
          onToggle={() => {
            setOpenIndices((prev) =>
              prev.includes(index)
                ? prev.filter((i) => i !== index) // collapse
                : [...prev, index] // expand
            );
          }}
        />
      ))}
    </div>
  );  
}
