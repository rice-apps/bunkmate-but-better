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


export default function TermsOfService() {
  return (
    <div>
      <div className="min-h-screen text-[#FF7439] my-[60px] flex flex-col items-start min-h-screen w-[80%] sm:w-[50%] mx-auto justify-center mt-6">
        <div className="flex flex-col mt-[60px] w-full items-center">
          {/* <Link href="/">
            <IoMdArrowRoundBack className="text-4xl text-[#FF7439] mr-2" />
          </Link> */}
          <h1 className="text-4xl pb-[10px] font-bold">Bunkmate Terms and Conditions</h1>
          <p className="text-gray-600 text-md">Legal Information & Notices. Last Updated: March 28th, 2025</p>
        </div>

        <hr className="h-px w-full my-[40px] bg-gray-200 border-1 dark:bg-gray-700"></hr>

        <div className="w-full text-gray-700 text-left space-y-6">
          <p>
            Welcome to Bunkmate! These Terms and Conditions ("Terms") govern your use of the Bunkmate website (the "Service").
            By using the Service, you agree to be bound by these <strong>Terms</strong> and our {" "}
            <Link href="/sign-in/privacy" className="text-[#FF7439] hover:underline">
              Privacy Policy</Link>.
            If you do not agree, please do not use the Service.
          </p>

          {/* Start of Terms. */}

          <Term title="1. Eligibility">
            <p>
              Bunkmate is available exclusively to students and individuals with a valid
              @rice.edu email address.
            </p>
          </Term>

          <Term title="2. User Responsibilities">
            <ul className="list-disc pl-5 space-y-2">
              <li>You are solely responsible for the accuracy and truthfulness of any listings, messages, or content you post.</li>
              <li>You agree to use the Service in a lawful manner and not engage in fraudulent, misleading, or harmful activities.</li>
              <li>You understand that Bunkmate does not conduct background checks or verify the identity of users.</li>
            </ul>
          </Term>


          <Term title="3. Privacy Policy and Data Use">
            <p>
              Your privacy is important to us! Our{" "}
              <Link href="/sign-in/privacy" className="text-[#FF7439] hover:underline">
                Privacy Policy
              </Link>{" "}
              explains how we collect, use, and protect your personal data.
            </p>
          </Term>

          <Term title="4. No Liability for Listings or Transactions">
            <p>Bunkmate serves as a platform for users to list and find subleases.</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Bunkmate and its creators are <strong>not responsible</strong> for any scams, fraudulent listings, or misrepresentations.</li>
              <li>Bunkmate does not mediate disputes between users. Any agreements, payments, or transactions made between users are <strong>entirely at their own risk</strong>.</li>
            </ul>
          </Term>

          <Term title="5. Prohibited Conduct">
            <p>You agree not to:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Post false, misleading, or illegal listings.</li>
              <li>Use the Service for any unauthorized or illegal activities.</li>
              <li>Attempt to exploit or harm other users in any way.</li>
            </ul>
          </Term>

          <Term title="6. Termination of Use">
            <p>Bunkmate reserves the right to suspend or terminate access to the Service for users who violate these Terms or engage in prohibited activities.</p>
          </Term>

          <Term title="7. No Guarantees or Endorsements">
            <p>Bunkmate does not guarantee the quality, safety, legality, or availability of any listing. Users should exercise caution and perform due diligence before entering any agreement.</p>
          </Term>

          <Term title="8. Limitation of Liability">
            <p>To the fullest extent permitted by law, Bunkmate and its creators shall not be liable for any direct, indirect, incidental, consequential, or special damages arising from or related to the use of the Service.</p>
          </Term>

          <Term title="9. Changes to Terms">
            <p>We may update these Terms from time to time. Any changes will be posted on this page, and continued use of the Service constitutes acceptance of the revised Terms.</p>
          </Term>

          <Term title="10. Contact Information">
            <p>
              For questions or concerns regarding these Terms, please contact us at:
            </p>
            <ul className="list-disc pl-5">
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
