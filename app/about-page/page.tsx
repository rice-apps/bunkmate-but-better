"use client"

import Navbar from "@/components/Navbar";
import TeamCard from "@/components/TeamCard";
import Image from "next/image";

const teamMembers = [
    {
      name: "Lucy Han",
      role: "product manager",
      imagePath: "/lucy-headshot.png",
      linkedinURL: "https://www.linkedin.com/in/lucyxhan/"
    },
    {
      name: "Sathya Padmanabhan",
      role: "tech lead",
      imagePath: "/sathya2.png",
      linkedinURL: "https://www.linkedin.com/in/sathya-padmanabhan/"
    },
    {
      name: "Gabriel Ong",
      role: "tech lead",
      imagePath: "/gabe-headshot.png",
      linkedinURL: "https://www.linkedin.com/in/onglg/"
    },
    {
      name: "Faith Chen",
      role: "lead designer",
      imagePath: "/faith-headshot.png",
      linkedinURL: "https://www.linkedin.com/in/faith-chen/"
    },
    {
      name: "Eric Grun",
      role: "developer",
      imagePath: "/eric-headshot.png",
      linkedinURL: "https://www.linkedin.com/in/ericg4/"
    },
    {
      name: "Ethan Wang",
      role: "developer",
      imagePath: "/ethan-headshot.png",
      linkedinURL: "https://www.linkedin.com/in/ethanwang432/"
    },
    {
      name: "Kelvin Phung",
      role: "developer",
      imagePath: "/kelvin-headshot.png",
      linkedinURL: "https://www.linkedin.com/in/kelvin-phung-3b49b3290/"
    },
    {
      name: "Mana Vale",
      role: "developer",
      imagePath: "/mana-headshot.png",
      linkedinURL: "https://www.linkedin.com/in/manavale/"
    },
    {
      name: "Moyin Orimoloye",
      role: "developer",
      imagePath: "/moyin-headshot.png",
      linkedinURL: "https://www.linkedin.com/in/moyinoluwa-orimoloye/"
    },
    {
      name: "Rahul Shah",
      role: "developer",
      imagePath: "/rahul-headshot.png",
      linkedinURL: "https://www.linkedin.com/in/rahul-shah-2ba727231/"
    },
    {
      name: "Roger Dai",
      role: "developer",
      imagePath: "/roger-headshot.png",
      linkedinURL: "https://www.linkedin.com/in/roger-dai-247083293/"
    },
    {
      name: "Tayten Bennetsen",
      role: "developer",
      imagePath: "/tayten-headshot.png",
      linkedinURL: "https://www.linkedin.com/in/taytenb/"
    },
]

export default function About() {
    return (
        <div className="flex flex-col items-center">
          <Navbar includeFilter={false}/>

        <div className="flex flex-col items-center text-center relative mt-8 mb-12">
        {/* Top row: Icon + Title + Arrow */}
        <div className="flex items-center gap-3">
          {/* Left icon */}
          <Image
            src="/about-1.png"
            alt="silly face"
            width={24}
            height={24}
            />
  
          {/* Heading */}
          <h1 className="text-5xl font-extrabold text-black relative">
            Meet the <span className="relative inline-block">
              Bunk!
              {/* Orange underline */}
              <span className="absolute left-0 bottom-0 w-full h-[6px] bg-[#FF7439] -z-10 rounded-sm translate-y-1" />
            </span>
          </h1>
  
          {/* Optional right arrow icon */}
          <Image
            src="/about-1.png"
            alt="silly face"
            width={24}
            height={24}
            />
        </div>
  
        {/* Subheading */}
        <p className="text-sm text-gray-600 mt-2">
          Here is our incredible team of blah blah blah
        </p>
      </div>

    {/* <div className="flex flex-col p-6 items-center">
    //    <h1 className="text-5xl font-bold">Meet the Bunk!</h1>
    //       <p className="mt-4">We are Bunkmate yippee</p>
    //     </div> */}
    <div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8 justify-items-center">
           {teamMembers.map((member) => (
             <TeamCard key={member.name} {...member} />
           ))}
      </div>
   </div>
   </div>
    );
}