"use client"

import Image from "next/image";
import { FaLinkedin } from "react-icons/fa";

interface TeamCardProps {
    name: string;
    role: string;
    imagePath: string;
    linkedinURL?: string; 
}

const TeamCard = ({ name, role, imagePath, linkedinURL }: TeamCardProps) => {
    return (
    <div
      className="bg-white"
      style={{ width: "250px", height: "357px" }}
    >
      <div style={{ height: "7px" }} />

      <div
        className="relative mx-auto overflow-hidden"
        style={{
          width: "245px",
          height: "293px",
          borderRadius: "15px",
        }}
      >
        <Image
          src={imagePath}
          alt={name}
          fill
          className="object-cover"
        />
      </div>
      
      <div
        className="flex justify-between items-start pt-3"
        style={{ height: "57px" }}
      >
        <div className="text-left">
          <p className="text-xl text-black leading-tight">{name}</p>
          <p className="text-base text-gray-500">{role}</p>
        </div>

        {linkedinURL && (
          <a
            href={linkedinURL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#FF7439] hover:text-[#bb5529] ml-2"
          >
            <FaLinkedin size={24} />
          </a>
        )}
      </div>
    </div>
    );
}

export default TeamCard;