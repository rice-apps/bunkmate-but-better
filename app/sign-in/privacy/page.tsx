"use client";

import Link from "next/link";
import { IoMdArrowRoundBack } from "react-icons/io";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen flex flex-col items-start  min-h-screen w-[80%] sm: w-[90%] mx-auto justify-center mt-6">
        <div className="flex items-center mb-6">
            <Link href="/">
            <IoMdArrowRoundBack className="text-4xl text-[#FF7439] mr-2" />
            </Link>
            <h1 className="text-4xl font-bold">Privacy Policy</h1>
        </div>


      <p className="text-gray-600 text-sm mb-4">Last Updated: March 4, 2025</p>

      <div className="w-full text-gray-700 text-left space-y-6">
        <p>
          Welcome to Bunkmate! This Privacy Policy explains how we collect, use, and protect your information when you use our website and services (the "Service").
          By using Bunkmate, you agree to the collection and use of information in accordance with this policy.
        </p>

        <h2 className="text-xl font-semibold">1. Information We Collect</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Account Information</strong>: Your <strong>@rice.edu</strong> email address is required to verify your eligibility.</li>
          <li><strong>Listing Information</strong>: Any details you submit about available subleases, including descriptions, pricing, and images.</li>
          <li><strong>Support Requests</strong>: If you contact us for assistance, we may collect relevant details (e.g., name, email) to help resolve your issue.</li>
        </ul>

        <h2 className="text-xl font-semibold">2. How We Use Your Information</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li>Verify user eligibility and maintain platform security.</li>
          <li>Facilitate sublease listings and communications.</li>
          <li>Improve our services based on user behavior and feedback.</li>
          <li>Prevent fraud, spam, or other prohibited activities.</li>
          <li>Respond to user inquiries and support requests.</li>
        </ul>
        <p>We <strong>DO NOT</strong> sell or share your personal information with third parties for marketing purposes.</p>

        <h2 className="text-xl font-semibold">3. How We Share Your Information</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>With Other Users</strong>: When you post a listing or send a message, other users can see the content you share.</li>
          <li><strong>With Service Providers</strong>: We may use third-party tools for analytics, hosting, or security (e.g., Google Analytics).</li>
          <li><strong>When Required by Law</strong>: If legally required (e.g., subpoena, legal investigation), we may disclose necessary data.</li>
        </ul>

        <h2 className="text-xl font-semibold">4. Data Security</h2>
        <p>We implement reasonable security measures to protect user data. However, no online service is 100% secure, and we <strong>cannot guarantee absolute security</strong>. Users should take precautions, such as not sharing sensitive information in messages, as mentioned in the Terms and Conditions.</p>

        <h2 className="text-xl font-semibold">5. Your Choices & Rights</h2>
        <p>You can modify or delete your listing information at any time.</p>

        <h2 className="text-xl font-semibold">6. Third-Party Links</h2>
        <p>Bunkmate may contain links to external websites (e.g., off-campus housing sites). We are not responsible for their privacy policies, and users should review third-party policies before engaging with them.</p>

        <h2 className="text-xl font-semibold">7. Changes to This Policy</h2>
        <p>We may update this Privacy Policy periodically. Any changes will be posted on this page with an updated <strong>Last Updated</strong> date. Continued use of Bunkmate after updates signifies your acceptance of the new terms!</p>

        <h2 className="text-xl font-semibold">8. Contact Us</h2>
        <p>For questions or concerns about this Privacy Policy, contact us at:</p>
        <ul className="list-disc pl-5">
          <li><a href="mailto:lh53@rice.edu" className="text-[#FF7439] hover:underline">Lucy Han</a></li>
          <li><a href="mailto:go15@rice.edu" className="text-[#FF7439] hover:underline">Gabriel Ong</a></li>
          <li><a href="mailto:sp180@rice.edu" className="text-[#FF7439] hover:underline">Sathya Padmanabhan</a></li>
        </ul>
      </div>
    </div>
  );
}
