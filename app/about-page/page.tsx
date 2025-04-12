"use client"

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TeamCard from "@/components/TeamCard";
import Image from "next/image";
import { motion } from "framer-motion";


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
    <div className="flex flex-col items-center w-[90%] sm:w-[90%] mx-auto">
      <Navbar includeFilter={false} />

      <div className="flex flex-col items-center text-center relative mt-8 mb-12">
        <div className="flex items-center gap-3">
          <Image src="/about-1.png" alt="silly face" width={24} height={24} />
          <h1 className="text-5xl font-extrabold text-black relative">
            Meet the <span className="relative inline-block">
              Bunk!
              <span className="absolute left-0 bottom-0 w-full h-[6px] bg-[#FF7439] -z-10 rounded-sm translate-y-1" />
            </span>
          </h1>
          <Image src="/about-1.png" alt="silly face" width={24} height={24} />
        </div>

        <p className="text-[16px] text-gray-600 mt-2">
          Our incredible team of designers, devs, and leaders who care a lot about making housing easier for you.
        </p>
      </div>

      <motion.div
        className="mb-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10 justify-items-center"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: {
            transition: {
              staggerChildren: 0.20, 
            },
          },
        }}
      >
        {teamMembers.map((member, index) => (
          <motion.div
            key={member.name}
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.6 }}
          >
            <TeamCard {...member} />
          </motion.div>
        ))}
      </motion.div>

      <Footer />
    </div>
  );
}