"use client";

import Link from "next/link";
import { IoMdArrowRoundBack } from "react-icons/io";

export default function TermsOfService() {
  return (
    <div className="min-h-screen flex flex-col items-start  min-h-screen w-[80%] sm: w-[90%] mx-auto justify-center mt-6">
      <div className="flex items-center mb-6">
        <Link href="/">
          <IoMdArrowRoundBack className="text-4xl text-[#FF7439] mr-2" />
        </Link>
        <h1 className="text-4xl font-bold">Terms and Conditions</h1>
      </div>
      <p className="text-gray-600 text-sm mb-4">Last Updated: March 4, 2025</p>
    
      <div className="w-full text-gray-700 text-left space-y-6">
        <p>
          Welcome to Bunkmate! These Terms and Conditions ("Terms") govern your use of the Bunkmate website (the "Service").
          By using the Service, you agree to be bound by these <strong>Terms</strong> and our <strong>Privacy Policy</strong>.
          If you do not agree, please do not use the Service.
        </p>

        <h2 className="text-xl font-semibold">1. Eligibility</h2>
        <p>
          Bunkmate is available exclusively to students and individuals with a valid @rice.edu email address.
        </p>

        <h2 className="text-xl font-semibold">2. User Responsibilities</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li>You are solely responsible for the accuracy and truthfulness of any listings, messages, or content you post.</li>
          <li>You agree to use the Service in a lawful manner and not engage in fraudulent, misleading, or harmful activities.</li>
          <li>You understand that Bunkmate does not conduct background checks or verify the identity of users.</li>
        </ul>

        <h2 className="text-xl font-semibold">3. Privacy Policy and Data Use</h2>
        <p>
          Your privacy is important to us! Our{" "}
          <Link href="/sign-in/privacy" className="text-[#FF7439] hover:underline">
            Privacy Policy
          </Link>{" "}
          explains how we collect, use, and protect your personal data.
        </p>


        <h2 className="text-xl font-semibold">4. No Liability for Listings or Transactions</h2>
        <p>Bunkmate serves as a platform for users to list and find subleases.</p>
        <ul className="list-disc pl-5 space-y-2">
          <li>Bunkmate and its creators are <strong>not responsible</strong> for any scams, fraudulent listings, or misrepresentations.</li>
          <li>Bunkmate does not mediate disputes between users. Any agreements, payments, or transactions made between users are <strong>entirely at their own risk</strong>.</li>
        </ul>

        <h2 className="text-xl font-semibold">5. Prohibited Conduct</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li>Post false, misleading, or illegal listings.</li>
          <li>Use the Service for any unauthorized or illegal activities.</li>
          <li>Attempt to exploit or harm other users in any way.</li>
        </ul>

        <h2 className="text-xl font-semibold">6. Termination of Use</h2>
        <p>Bunkmate reserves the right to suspend or terminate access to the Service for users who violate these Terms.</p>

        <h2 className="text-xl font-semibold">7. Contact Information</h2>
        <p>
          For questions or concerns regarding these Terms, please contact us at:
        </p>
        <ul className="list-disc pl-5">
          <li><a href="mailto:go15@rice.edu" className="text-[#FF7439] hover:underline">go15@rice.edu</a> (Gabriel Ong)</li>
          <li><a href="mailto:lh53@rice.edu" className="text-[#FF7439] hover:underline">lh53@rice.edu</a> (Lucy Han)</li>
          <li><a href="mailto:sp180@rice.edu" className="text-[#FF7439] hover:underline">sp180@rice.edu</a> (Sathya Padmanabhan)</li>
        </ul>
      </div>
    </div>
  );
}
