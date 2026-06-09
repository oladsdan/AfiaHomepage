import type { Metadata } from "next";
import { Footer } from "@/app/sections/Footer";

export const metadata: Metadata = {
  title: "Terms of Service – Afia",
  description:
    "Read the Afia Terms of Service to understand the rules for using Afia, operated by Zoku Labs LLC.",
};

export default function TermsOfService() {
  return (
    <main className="bg-white">
      <div className="max-w-3xl mx-auto px-6 py-16 md:py-24">
        {/* Header */}
        <h1 className="font-helvetica text-4xl md:text-5xl font-bold text-[#232323] mb-4">
          Terms of Service for Afia
        </h1>
        <p className="text-sm text-gray-400 mb-2">
          <span className="font-medium text-gray-500">Effective date:</span> June 2, 2026
        </p>
        <p className="text-sm text-gray-400 mb-10">
          <span className="font-medium text-gray-500">Last updated:</span> June 2, 2026
        </p>

        <div className="prose-content space-y-10 text-[#444] leading-relaxed text-[15px]">

          {/* Intro */}
          <p>
            Welcome to Afia. These Terms of Service ("Terms") are a legal agreement between you and <strong>Zoku Labs LLC</strong> ("Afia", "we", "us", or "our"), the company that operates the Afia application and website. Afia is available on the web and as a mobile app for iOS and Android, and helps content creators analyze short-form videos, track social media metrics, and generate scripts, captions, and ideas with the help of AI (together, the "Service").
          </p>
          <p>
            Please read these Terms carefully. By creating an account or using the Service, you agree to them. If you do not agree, please do not use Afia. If you have questions, contact us at{" "}
            <a href="mailto:hello@joinafia.com" className="text-[#0FA37F] hover:underline font-medium">
              hello@joinafia.com
            </a>.
          </p>

          <hr className="border-gray-100" />

          {/* Section 1 */}
          <section>
            <h2 className="font-helvetica text-2xl font-bold text-[#232323] mb-6">
              1. Acceptance of Terms
            </h2>
            <p className="mb-4">
              By accessing or using Afia — whether on the web, on iOS, or on Android — you confirm that you have read, understood, and agree to be bound by these Terms and by our{" "}
              <a href="/privacy-policy" className="text-[#0FA37F] hover:underline font-medium">
                Privacy Policy
              </a>
              , which is incorporated here by reference.
            </p>
            <p>
              If you are using Afia on behalf of a business or organization, you confirm that you have the authority to accept these Terms on its behalf. If you do not agree with any part of these Terms, you must stop using the Service.
            </p>
          </section>

          <hr className="border-gray-100" />

          {/* Section 2 */}
          <section>
            <h2 className="font-helvetica text-2xl font-bold text-[#232323] mb-6">
              2. Eligibility and Age Requirement
            </h2>
            <p className="mb-4">
              You must be at least <strong>13 years old</strong> to use Afia. If the minimum digital-consent age in your country or region is higher than 13, you must meet that higher age. If you are under the age of majority where you live, you may only use Afia with the involvement and consent of a parent or legal guardian who agrees to these Terms.
            </p>
            <p>
              By using Afia, you represent that you meet these age requirements and that the information you provide about yourself is accurate.
            </p>
          </section>

          <hr className="border-gray-100" />

          {/* Section 3 */}
          <section>
            <h2 className="font-helvetica text-2xl font-bold text-[#232323] mb-6">
              3. User Accounts and Responsibilities
            </h2>
            <p className="mb-3">
              To use most features of Afia, you need to create an account. When you do, you agree to:
            </p>
            <ul className="list-disc list-outside pl-5 space-y-2">
              <li>Provide accurate and complete information, and keep it up to date.</li>
              <li>Keep your password secure and confidential.</li>
              <li>Take responsibility for all activity that happens under your account.</li>
              <li>
                Notify us promptly at{" "}
                <a href="mailto:hello@joinafia.com" className="text-[#0FA37F] hover:underline font-medium">
                  hello@joinafia.com
                </a>{" "}
                if you believe your account has been accessed without your permission.
              </li>
            </ul>
            <p className="mt-4">
              You are responsible for any content you upload and any actions taken through your account. We are not liable for any loss resulting from someone else using your account because you failed to keep your login details secure.
            </p>
          </section>

          <hr className="border-gray-100" />

          {/* Section 4 */}
          <section>
            <h2 className="font-helvetica text-2xl font-bold text-[#232323] mb-6">
              4. Acceptable Use
            </h2>
            <p className="mb-3">
              Afia is meant to help you create better content. When using the Service, you agree <strong>not</strong> to:
            </p>
            <ul className="list-disc list-outside pl-5 space-y-2">
              <li>Break any law, or use Afia for any unlawful, fraudulent, or harmful purpose.</li>
              <li>Upload or generate content that is illegal, infringing, defamatory, harassing, hateful, sexually exploitative, or that violates someone else's rights.</li>
              <li>Upload videos or other content that you do not have the right to use.</li>
              <li>Attempt to access accounts, data, or systems that do not belong to you.</li>
              <li>Interfere with, disrupt, overload, or attempt to gain unauthorized access to the Service or its infrastructure.</li>
              <li>Reverse-engineer, copy, scrape, or resell any part of the Service except as allowed by law.</li>
              <li>Use bots, automated scripts, or other methods to abuse usage limits or our AI features.</li>
              <li>Misuse connected third-party accounts (such as TikTok or Instagram) or violate those platforms' rules.</li>
            </ul>
            <p className="mt-4">
              We may investigate and take appropriate action — including removing content or suspending accounts — if we believe these rules have been broken.
            </p>
          </section>

          <hr className="border-gray-100" />

          {/* Section 5 */}
          <section>
            <h2 className="font-helvetica text-2xl font-bold text-[#232323] mb-6">
              5. User-Generated Content and Licenses
            </h2>
            <p className="mb-4">
              Afia lets you upload videos and create content such as scripts, captions, and ideas ("Your Content").
            </p>
            <p className="mb-4">
              <strong>You own Your Content.</strong> We do not claim ownership of the videos you upload or the content you create with Afia.
            </p>
            <p className="mb-4">
              To run the Service, you grant us a limited, non-exclusive, worldwide, royalty-free license to host, store, process, display, and transmit Your Content <strong>only</strong> as needed to operate and provide Afia to you — for example, to analyze a video you upload, generate captions from it, or sync metrics. This license ends when you delete Your Content or your account, except for copies that may remain temporarily in routine backups or where retention is required by law.
            </p>
            <p className="mb-4">
              You are solely responsible for Your Content and confirm that you have all the rights needed to upload and use it with Afia.
            </p>
            <p>
              Some Afia features use AI to generate text such as scripts, captions, and ideas. AI output can be inaccurate or unoriginal, so you are responsible for reviewing and editing anything you publish. You are responsible for how you use AI-generated content.
            </p>
          </section>

          <hr className="border-gray-100" />

          {/* Section 6 */}
          <section>
            <h2 className="font-helvetica text-2xl font-bold text-[#232323] mb-6">
              6. Third-Party Services
            </h2>
            <p className="mb-3">
              Afia connects with third-party platforms and services to provide its features, including:
            </p>
            <ul className="list-disc list-outside pl-5 space-y-2">
              <li><strong>TikTok and Instagram</strong> — to connect your account, retrieve metrics, and analyze your content through their official APIs.</li>
              <li><strong>Apple App Store, Google Play, and RevenueCat</strong> — to manage subscriptions.</li>
              <li><strong>OpenAI</strong> — to power AI-generated scripts, captions, and ideas.</li>
              <li>Other providers described in our{" "}
                <a href="/privacy-policy" className="text-[#0FA37F] hover:underline font-medium">
                  Privacy Policy
                </a>.
              </li>
            </ul>
            <p className="mt-4">
              When you connect or use these services through Afia, <strong>their own terms and privacy policies also apply to you.</strong> In particular, your use of TikTok is governed by TikTok's Terms of Service and policies, and you agree to comply with them in addition to these Terms. We do not control these third parties and are not responsible for their services, availability, or actions.
            </p>
          </section>

          <hr className="border-gray-100" />

          {/* Section 7 */}
          <section>
            <h2 className="font-helvetica text-2xl font-bold text-[#232323] mb-6">
              7. Intellectual Property
            </h2>
            <p className="mb-4">
              The Afia name, logo, software, design, text, and all other materials we provide (excluding Your Content) are owned by Zoku Labs LLC or our licensors and are protected by intellectual property laws.
            </p>
            <p>
              We grant you a limited, personal, non-exclusive, non-transferable, revocable license to use Afia for its intended purpose, subject to these Terms. You may not copy, modify, distribute, sell, or create derivative works from any part of the Service without our written permission.
            </p>
          </section>

          <hr className="border-gray-100" />

          {/* Section 8 */}
          <section>
            <h2 className="font-helvetica text-2xl font-bold text-[#232323] mb-6">
              8. Subscriptions and Payments
            </h2>
            <p className="mb-4">
              Afia offers paid subscription plans (for example, <strong>$9.99 per month</strong> or <strong>$49.99 per year</strong>). Subscriptions are purchased and billed through the Apple App Store or Google Play and are managed using RevenueCat. We do not receive or store your full payment card or bank details — those are handled by Apple, Google, and their payment processors.
            </p>
            <p>
              Subscriptions renew automatically unless you cancel before the renewal date. You can manage or cancel your subscription through your Apple or Google account settings. Except where required by law or by the app store's policies, payments are non-refundable. We may change our prices or plans, and we will give reasonable notice of any changes that affect you.
            </p>
          </section>

          <hr className="border-gray-100" />

          {/* Section 9 */}
          <section>
            <h2 className="font-helvetica text-2xl font-bold text-[#232323] mb-6">
              9. Disclaimers
            </h2>
            <p className="mb-3">
              Afia is provided on an <strong>"as is" and "as available"</strong> basis, without warranties of any kind, whether express or implied. To the fullest extent allowed by law, we disclaim all warranties, including any implied warranties of merchantability, fitness for a particular purpose, and non-infringement.
            </p>
            <p className="mb-3">We do not guarantee that:</p>
            <ul className="list-disc list-outside pl-5 space-y-2">
              <li>The Service will always be available, uninterrupted, secure, or error-free.</li>
              <li>AI-generated content, analytics, or recommendations will be accurate, complete, or produce any particular result.</li>
              <li>Any content you publish using Afia will perform in a specific way or gain any audience.</li>
            </ul>
            <p className="mt-4">You use Afia at your own discretion and risk.</p>
          </section>

          <hr className="border-gray-100" />

          {/* Section 10 */}
          <section>
            <h2 className="font-helvetica text-2xl font-bold text-[#232323] mb-6">
              10. Limitation of Liability
            </h2>
            <p className="mb-4">
              To the fullest extent permitted by law, Zoku Labs LLC and its owners, employees, and partners will not be liable for any indirect, incidental, special, consequential, or punitive damages, or for any loss of profits, revenue, data, or goodwill, arising from or related to your use of (or inability to use) the Service.
            </p>
            <p className="mb-4">
              To the extent any liability cannot be excluded, our total liability to you for all claims relating to the Service will not exceed the greater of (a) the amount you paid us for the Service in the 12 months before the claim, or (b) USD 100.
            </p>
            <p>Some jurisdictions do not allow certain limitations, so some of the above may not apply to you.</p>
          </section>

          <hr className="border-gray-100" />

          {/* Section 11 */}
          <section>
            <h2 className="font-helvetica text-2xl font-bold text-[#232323] mb-6">
              11. Termination and Suspension
            </h2>
            <p className="mb-4">
              You may stop using Afia at any time and may delete your account directly in the app, or by emailing{" "}
              <a href="mailto:support@joinafia.com" className="text-[#0FA37F] hover:underline font-medium">
                support@joinafia.com
              </a>{" "}
              from the email address on your Afia account with the subject line <strong>"Delete my account"</strong>.
            </p>
            <p className="mb-3">
              We may suspend or terminate your access to the Service, with or without notice, if:
            </p>
            <ul className="list-disc list-outside pl-5 space-y-2">
              <li>You breach these Terms or our Acceptable Use rules.</li>
              <li>We are required to do so by law or by a third-party platform.</li>
              <li>Your use creates risk or legal exposure for us or other users.</li>
            </ul>
            <p className="mt-4">
              When your account is terminated, your right to use the Service ends immediately. Sections that by their nature should survive termination — such as content licenses already granted, intellectual property, disclaimers, limitation of liability, and governing law — will continue to apply.
            </p>
          </section>

          <hr className="border-gray-100" />

          {/* Section 12 */}
          <section>
            <h2 className="font-helvetica text-2xl font-bold text-[#232323] mb-6">
              12. Changes to These Terms
            </h2>
            <p>
              We may update these Terms from time to time, for example to reflect new features or changes in the law. When we make material changes, we will update the "Last updated" date above and, where appropriate, notify you in the app or by email. Your continued use of Afia after changes take effect means you accept the updated Terms. If you do not agree, please stop using the Service.
            </p>
          </section>

          <hr className="border-gray-100" />

          {/* Section 13 */}
          <section>
            <h2 className="font-helvetica text-2xl font-bold text-[#232323] mb-6">
              13. Governing Law and Dispute Resolution
            </h2>
            <p className="mb-4">
              These Terms are governed by the laws of the <strong>United States of America</strong>, without regard to conflict-of-law principles.
            </p>
            <p>
              Before taking any formal action, you agree to first contact us at{" "}
              <a href="mailto:hello@joinafia.com" className="text-[#0FA37F] hover:underline font-medium">
                hello@joinafia.com
              </a>{" "}
              so we can try to resolve the issue informally. If a dispute cannot be resolved that way, it will be handled by the courts located in the United States, and you agree to their jurisdiction. Nothing in this section prevents either party from seeking urgent relief (such as an injunction) where appropriate.
            </p>
          </section>

          <hr className="border-gray-100" />

          {/* Section 14 */}
          <section>
            <h2 className="font-helvetica text-2xl font-bold text-[#232323] mb-6">
              14. Contact Information
            </h2>
            <p className="mb-2">If you have any questions about these Terms, you can reach us at:</p>
            <div className="mt-4 p-5 rounded-2xl bg-gray-50 border border-gray-100">
              <p className="font-semibold text-[#232323]">Zoku Labs LLC</p>
              <p className="mt-1 text-gray-500">
                Email:{" "}
                <a href="mailto:hello@joinafia.com" className="text-[#0FA37F] hover:underline font-medium">
                  hello@joinafia.com
                </a>
              </p>
              <p className="mt-1 text-gray-500">
                Support:{" "}
                <a href="mailto:support@joinafia.com" className="text-[#0FA37F] hover:underline font-medium">
                  support@joinafia.com
                </a>
              </p>
              <p className="mt-1 text-gray-500">
                Website:{" "}
                <a href="https://joinafia.com" target="_blank" rel="noopener noreferrer" className="text-[#0FA37F] hover:underline font-medium">
                  https://joinafia.com
                </a>
              </p>
            </div>
          </section>

        </div>
      </div>

      <Footer />
    </main>
  );
}
