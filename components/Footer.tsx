import React from "react";
import Link from "next/link";
import { FaHeart } from "react-icons/fa6";

const Footer = () => {
  return (
    <footer className="bottom-0 w-full mt-auto p-4 text-center text-gray-600 z-50">
      Made with{" "}
      <FaHeart className="inline text-orange-500" />{" "}
      by{" "}
      <Link href="https://riceapps.org/" className="hover:underline text-orange-600">
        RiceApps.
      </Link>{" "}
      {process.env.LAST_UPDATED_AT ? (
        <a
          href="https://github.com/rice-apps/bunkmate-but-better"
          target="_blank"
          rel="noopener noreferrer"
          className="underline"
        >
          Last updated on {new Date(process.env.LAST_UPDATED_AT).toLocaleDateString()}
        </a>
      ) : (
        "Loading last updated date..."
      )}
    </footer>
  );
};

export default Footer;
