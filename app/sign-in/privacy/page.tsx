"use client";

import Footer from "@/components/Footer";
import Link from "next/link";

// Mini component for each term section.
const Term = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div>
    <h2 className="text-xl mt-[30px] font-semibold">{title}</h2>
    <div className="mt-5">{children}</div>
  </div>
);


export default function Privacy() {
  return (
    <div>
      <div className="min-h-screen text-[#FF7439] my-[60px] flex flex-col items-start min-h-screen w-[80%] sm:w-[50%] mx-auto justify-center mt-6">
        <div className="flex flex-col mt-[60px] w-full items-center">
          {/* <Link href="/">
            <IoMdArrowRoundBack className="text-4xl text-[#FF7439] mr-2" />
          </Link> */}
          <h1 className="text-4xl pb-[10px] font-bold">Bunkmate Privacy Policy</h1>
          <p className="text-gray-600 text-md">Legal Information & Notices. Last Updated: March 28th, 2025</p>
        </div>

        <hr className="h-px w-full my-[40px] bg-gray-200 border-1 dark:bg-gray-700"></hr>

        <div className="w-full text-gray-700 text-left space-y-6">
        <p>
            Welcome to Bunkmate! These Terms and Conditions ("Terms") govern your use of the Bunkmate website (the "Service").
            By using the Service, you agree to be bound by our <strong>Privacy Policy</strong> and our {" "}
            <Link href="/sign-in/terms" className="text-[#FF7439] hover:underline">
              Terms</Link>.
            If you do not agree, please do not use the Service.
          </p>

          {/* Start of Policy. */}

          <Term title="1. Information We Collect">
            <p className = "pb-[10px]">
              When using Bunkmate, you provide us with:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Account Information:</strong> Your @rice.edu email address is required to verify your eligibility.</li>
              <li><strong>Listing Information:</strong> Any details you submit about available subleases, including descriptions, pricing, and images.</li>
              <li><strong>Support Requests:</strong> If you contact us for assistance, we may collect relevant details (e.g. name, email) to help resolve your issue.</li>
            </ul>
          </Term>

          <Term title="2. How We Use Your Information">
            <p className = "pb-[10px]">We use collected data to:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Verify user eligibility and maintain platform security.</li>
              <li>Facilitate sublease listings and communications.</li>
              <li>Improve our services based on user behavior and feedback.</li>
              <li>Prevent fraud, spam, or other prohibited activities.</li>
              <li>Respond to user inquiries and support requests.</li>
            </ul>
            <p className = "pt-[10px]"> We <strong>DO NOT</strong> sell or share your personal information with third parties for marketing purposes. </p>
          </Term>


          <Term title="3. How We Share Your Information">
          <p className = "pb-[10px]">We may share information:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>With Other Users:</strong> When you post a listing or send a message, other users can see the content you share.</li>
              <li><strong>With Service Providers:</strong> We may use third-party tools for analytics, hosting, or security (e.g., Google Analytics)</li>
              <li><strong>When Required by Law:</strong> If legally required (e.g., subpoena, legal investigation), we may disclose necessary data.</li>
            </ul>
            <p className = "pt-[10px]"> We <strong>DO NOT</strong> sell or share your personal information with third parties for marketing purposes. </p>
          </Term>

          <Term title="4. Data Security">
          We implement reasonable security measures to protect user data. However, no online service is 100% secure, and we cannot guarantee absolute security. Users should take precautions, such as not sharing sensitive information in messages, as mentioned in the Terms and Conditions.
          </Term>

          <Term title="5. Your Choices & Rights">
          You can modify or delete your listing information at any time.
          </Term>

          <Term title="6. Third-Party Links">
            <p>Bunkmate may contain links to external websites (e.g., off-campus housing sites). We are not responsible for their privacy policies, and users should review third-party policies before engaging with them.</p>
          </Term>

          <Term title="7. Changes to This  Policy">
            <p>We may update this Privacy Policy periodically. Any changes will be posted on this page with an updated Last Updated date. Continued use of Bunkmate after updates signifies your acceptance of the new terms!</p>
          </Term>

          <Term title="8. Contact Information">
            <p>
              For questions or concerns regarding this Privacy Policy, please contact us at:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li><a href="mailto:go15@rice.edu" className="text-[#FF7439] hover:underline">go15@rice.edu</a> (Gabriel Ong)</li>
              <li><a href="mailto:lh53@rice.edu" className="text-[#FF7439] hover:underline">lh53@rice.edu</a> (Lucy Han)</li>
              <li><a href="mailto:sp180@rice.edu" className="text-[#FF7439] hover:underline">sp180@rice.edu</a> (Sathya Padmanabhan)</li>
            </ul>
          </Term>
        </div>
      </div>
      <Footer />
    </div>
  );
}
