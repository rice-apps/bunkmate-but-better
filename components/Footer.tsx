"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { FaHeart } from "react-icons/fa6";

const Footer = () => {
  const [lastUpdated, setLastUpdated] = useState("");

  useEffect(() => {
    const fetchLastCommitDate = async () => {
      try {
        // Using your GitHub repo details:
        const response = await fetch("https://api.github.com/repos/rice-apps/bunkmate-but-better/commits?per_page=1");
        const data = await response.json();
        if (data && data.length > 0) {
          const commitDate = data[0].commit.committer.date;
          const formattedDate = new Date(commitDate).toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          });
          setLastUpdated(formattedDate);
          console.log("Successfully updated commit date");
        }
      } catch (error) {
        console.error("Error fetching last commit date:", error);
      }
    };

    fetchLastCommitDate();
  }, []);

  return (
    <footer className="bottom-0 w-full p-4 text-center text-gray-600 z-50">
      Made with{" "}
      <FaHeart className="inline text-orange-500" />{" "}
      by{" "}
      <Link href="https://riceapps.org/" className="hover:underline text-orange-600">
        RiceApps.
      </Link>{" "}
      {lastUpdated ? (
        <a
          href="https://github.com/rice-apps/bunkmate-but-better"
          target="_blank"
          rel="noopener noreferrer"
          className="underline"
        >
          Last updated on {lastUpdated}.
        </a>
      ) : (
        "Loading last updated date..."
      )}
    </footer>
  );
};

export default Footer;
