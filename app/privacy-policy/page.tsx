import type { Metadata } from "next";
import { Footer } from "@/app/sections/Footer";

export const metadata: Metadata = {
  title: "Privacy Policy – Afia",
  description:
    "Read the Afia Privacy Policy to understand how Zoku Labs LLC collects, uses, and protects your information.",
};

export default function PrivacyPolicy() {
  return (
    <main className="bg-white">
      <div className="max-w-3xl mx-auto px-6 py-16 md:py-24">
        {/* Header */}
        <h1 className="font-helvetica text-4xl md:text-5xl font-bold text-[#232323] mb-4">
          Privacy Policy for AFIA
        </h1>
        <p className="text-sm text-gray-400 mb-2">
          <span className="font-medium text-gray-500">Effective date:</span> April 19, 2026
        </p>
        <p className="text-sm text-gray-400 mb-10">
          <span className="font-medium text-gray-500">Last updated:</span> April 19, 2026
        </p>

        <div className="prose-content space-y-10 text-[#444] leading-relaxed text-[15px]">

          {/* Intro */}
          <p>
            AFIA ("AFIA", "we", "us", or "our"), operated by Zoku Labs LLC, provides a mobile application that helps content creators analyze short-form videos, track social media metrics, and generate scripts, captions, and ideas with the help of AI ("the App"). This Privacy Policy explains what information we collect, how we use it, who we share it with, and the choices you have.
          </p>
          <p>
            If you have questions, contact us at{" "}
            <a href="mailto:hello@joinafia.com" className="text-[#0FA37F] hover:underline font-medium">
              hello@joinafia.com
            </a>.
          </p>

          <hr className="border-gray-100" />

          {/* Section 1 */}
          <section>
            <h2 className="font-helvetica text-2xl font-bold text-[#232323] mb-6">
              1. Information We Collect
            </h2>

            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-[#232323] mb-3">1.1 Information you provide</h3>
                <ul className="list-disc list-outside pl-5 space-y-2">
                  <li><strong>Account information.</strong> Email address, password (stored only as a salted bcrypt hash), and optional full name and profile picture (avatar).</li>
                  <li><strong>Onboarding responses.</strong> Your audience description, content goals, content topics, experience level, and how you heard about us.</li>
                  <li><strong>User-generated content.</strong> Videos you upload for analysis, generated or saved scripts, captions, and ideas, and messages you send to the in-app AI coach.</li>
                  <li><strong>Support correspondence.</strong> Any messages you send us by email.</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-[#232323] mb-3">1.2 Information collected automatically</h3>
                <ul className="list-disc list-outside pl-5 space-y-2">
                  <li><strong>Device and signup metadata.</strong> IP address and a device identifier captured at signup, used for fraud prevention and abuse detection.</li>
                  <li><strong>Usage counters.</strong> Counts of video analyses, caption generations, script generations, idea generations, and coach messages, used for subscription quota enforcement.</li>
                  <li><strong>Authentication tokens.</strong> Refresh tokens we issue to keep you signed in.</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-[#232323] mb-3">1.3 Information from connected social accounts</h3>
                <p className="mb-3">If you connect TikTok or Instagram, we receive and store information from those platforms based on the permissions you grant:</p>
                <ul className="list-disc list-outside pl-5 space-y-2">
                  <li><strong>TikTok.</strong> Scopes: <code className="bg-gray-100 px-1 py-0.5 rounded text-sm">user.info.basic</code>, <code className="bg-gray-100 px-1 py-0.5 rounded text-sm">user.info.profile</code>, <code className="bg-gray-100 px-1 py-0.5 rounded text-sm">user.info.stats</code>, <code className="bg-gray-100 px-1 py-0.5 rounded text-sm">video.list</code>. We store your TikTok user ID, username, OAuth access and refresh tokens, follower counts, engagement metrics, and a list of your videos and their public metrics.</li>
                  <li><strong>Instagram (Business / Creator accounts).</strong> Scopes: <code className="bg-gray-100 px-1 py-0.5 rounded text-sm">instagram_business_basic</code>, <code className="bg-gray-100 px-1 py-0.5 rounded text-sm">instagram_business_manage_insights</code>. We store your Instagram user ID, username, OAuth access token, follower counts, engagement metrics, post and reel performance (views, likes, comments, shares, saves, reach, impressions, profile views, total interactions), and aggregated follower demographics provided by Instagram.</li>
                </ul>
                <p className="mt-3">We never request your TikTok or Instagram password. You can disconnect either account at any time inside the App.</p>
              </div>

              <div>
                <h3 className="font-semibold text-[#232323] mb-3">1.4 Subscription and purchase information</h3>
                <p>We use <strong>RevenueCat</strong> and the <strong>Apple App Store</strong> / <strong>Google Play Store</strong> to manage in-app subscriptions ($9.99/month or $49.99/year). We receive your subscription status, plan, renewal date, and a non-financial purchase history. <strong>We never receive or store your full payment card or bank details</strong> — those are handled by Apple, Google, and their payment processors.</p>
              </div>

              <div>
                <h3 className="font-semibold text-[#232323] mb-3">1.5 Device permissions we request</h3>
                <ul className="list-disc list-outside pl-5 space-y-2">
                  <li><strong>Camera.</strong> Used only when you choose to take a profile picture in the App. Photos are not captured in the background.</li>
                  <li><strong>Photo library / media.</strong> Used when you select a profile picture or choose a video to upload for analysis.</li>
                  <li><strong>Microphone (<code className="bg-gray-100 px-1 py-0.5 rounded text-sm">RECORD_AUDIO</code>).</strong> Used as part of video selection and processing on Android.</li>
                </ul>
                <p className="mt-3">You can revoke any of these permissions at any time in your device settings.</p>
              </div>

              <div>
                <h3 className="font-semibold text-[#232323] mb-3">1.6 Permissions and data we do NOT collect</h3>
                <p className="mb-3">For clarity, AFIA does <strong>not</strong> collect:</p>
                <ul className="list-disc list-outside pl-5 space-y-2">
                  <li>Precise or approximate location, GPS, or background-location data</li>
                  <li>Contacts, calendar, SMS, or call logs</li>
                  <li>Health, fitness, or biometric data</li>
                  <li>Browsing history outside the App</li>
                  <li>Push-notification tokens (the App uses in-app notifications only)</li>
                  <li>Third-party advertising identifiers (the App contains no ads and no advertising SDKs)</li>
                </ul>
                <p className="mt-3">We also do not currently use third-party analytics or crash-reporting SDKs (e.g., Mixpanel, Firebase Analytics, Sentry).</p>
              </div>
            </div>
          </section>

          <hr className="border-gray-100" />

          {/* Section 2 */}
          <section>
            <h2 className="font-helvetica text-2xl font-bold text-[#232323] mb-6">
              2. How We Use Your Information
            </h2>
            <p className="mb-3">We use the information described above to:</p>
            <ul className="list-disc list-outside pl-5 space-y-2">
              <li>Create and secure your account and authenticate your sessions.</li>
              <li>Provide the core features of the App: video analysis, metrics dashboards, AI-generated scripts, captions, ideas, and the AI coach.</li>
              <li>Sync and refresh metrics from your connected TikTok and Instagram accounts.</li>
              <li>Process and verify your subscription, and enforce free-tier usage limits.</li>
              <li>Send transactional emails (account verification, password reset, important account notices).</li>
              <li>Detect, prevent, and respond to fraud, abuse, and Terms of Service violations.</li>
              <li>Improve the quality of the App, debug issues, and develop new features.</li>
            </ul>
            <p className="mt-4">We do <strong>not</strong> use your data for advertising, and we do <strong>not</strong> sell your personal information.</p>
          </section>

          <hr className="border-gray-100" />

          {/* Section 3 */}
          <section>
            <h2 className="font-helvetica text-2xl font-bold text-[#232323] mb-6">
              3. AI Processing of Your Content
            </h2>
            <p className="mb-3">AFIA uses <strong>OpenAI</strong> to power its AI features:</p>
            <ul className="list-disc list-outside pl-5 space-y-2">
              <li>Videos you upload are transcribed using OpenAI's Whisper API to enable analysis and feedback.</li>
              <li>Scripts, captions, ideas, and AI coach responses are generated using OpenAI's GPT models. The prompts include relevant context such as your video transcript, niche, and the message you sent.</li>
            </ul>
            <p className="mt-4">OpenAI processes this content as our subprocessor under their API data-handling commitments. As of the effective date of this policy, OpenAI states that data submitted via its API is <strong>not</strong> used to train its models. See OpenAI's API Data Usage Policy for details.</p>
          </section>

          <hr className="border-gray-100" />

          {/* Section 4 */}
          <section>
            <h2 className="font-helvetica text-2xl font-bold text-[#232323] mb-6">
              4. How We Share Your Information
            </h2>
            <p className="mb-6">We share information only with the following categories of recipients, and only as needed to operate the App:</p>

            <div className="overflow-x-auto rounded-2xl border border-gray-100">
              <table className="w-full text-sm text-left">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="px-4 py-3 font-semibold text-[#232323]">Recipient</th>
                    <th className="px-4 py-3 font-semibold text-[#232323]">Purpose</th>
                    <th className="px-4 py-3 font-semibold text-[#232323]">Data shared</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {[
                    ["OpenAI", "AI transcription and generation", "Video transcripts, prompt context, your generation request"],
                    ["RevenueCat", "Subscription management", "Your AFIA user ID, subscription events"],
                    ["Apple App Store / Google Play", "Payment processing for IAP", "Handled directly by the store; we receive only the resulting subscription status"],
                    ["Resend", "Transactional email delivery", "Your email address and the message we send"],
                    ["Google Cloud Storage", "Hosting your uploaded videos, thumbnails, and avatars in a private bucket", "The uploaded files"],
                    ["TikTok and Meta / Instagram", "OAuth and metrics retrieval", "API requests authenticated with the tokens you authorized"],
                    ["Hosting and infrastructure providers", "Running the AFIA backend and database", "All data described in Section 1, as needed to serve requests"],
                  ].map(([recipient, purpose, data]) => (
                    <tr key={recipient} className="bg-white">
                      <td className="px-4 py-3 font-medium text-[#232323] align-top">{recipient}</td>
                      <td className="px-4 py-3 text-gray-500 align-top">{purpose}</td>
                      <td className="px-4 py-3 text-gray-500 align-top">{data}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="mt-6">We may also disclose information when required by law, valid legal process, or to protect the rights, property, or safety of AFIA, our users, or others.</p>
            <p className="mt-3">We do not sell or rent your personal information to third parties, and we do not share it with advertisers or data brokers.</p>
          </section>

          <hr className="border-gray-100" />

          {/* Section 5 */}
          <section>
            <h2 className="font-helvetica text-2xl font-bold text-[#232323] mb-6">
              5. Data Retention
            </h2>
            <ul className="list-disc list-outside pl-5 space-y-2">
              <li><strong>Account data</strong> is retained while your account is active.</li>
              <li><strong>Uploaded videos</strong> are not stored in our server, they are discarded after analysis.</li>
              <li><strong>Generated content</strong> (scripts, captions, ideas, coach messages) is retained until you delete it or your account.</li>
              <li><strong>Social-platform tokens and synced metrics</strong> are retained while the connection is active. If you disconnect a platform, the corresponding tokens and metrics are removed within a reasonable period.</li>
              <li><strong>Refresh tokens</strong> expire automatically and are rotated on use.</li>
              <li><strong>Backups and logs</strong> may persist for a limited period after deletion for security and reliability purposes, after which they are overwritten.</li>
            </ul>
            <p className="mt-4">When you delete your account (see Section 7), we delete or anonymize your personal information, except where retention is required by law (for example, for tax or fraud-prevention records).</p>
          </section>

          <hr className="border-gray-100" />

          {/* Section 6 */}
          <section>
            <h2 className="font-helvetica text-2xl font-bold text-[#232323] mb-6">
              6. Security
            </h2>
            <p className="mb-3">We use industry-standard safeguards to protect your information, including:</p>
            <ul className="list-disc list-outside pl-5 space-y-2">
              <li>Passwords hashed with bcrypt (we never store plaintext passwords).</li>
              <li>HTTPS / TLS for all network traffic between the App and our servers.</li>
              <li>OAuth tokens stored server-side, never exposed to the client.</li>
              <li>Private object storage for uploaded media, accessed only via short-lived signed requests.</li>
              <li>Access controls and least-privilege principles for our infrastructure.</li>
            </ul>
            <p className="mt-4">No system is perfectly secure. If we become aware of a security incident affecting your data, we will notify you and applicable regulators where required by law.</p>
          </section>

          <hr className="border-gray-100" />

          {/* Section 7 */}
          <section>
            <h2 className="font-helvetica text-2xl font-bold text-[#232323] mb-6">
              7. Your Rights and Choices
            </h2>
            <p className="mb-3">Depending on where you live, you may have the right to:</p>
            <ul className="list-disc list-outside pl-5 space-y-2">
              <li>Access the personal information we hold about you.</li>
              <li>Correct inaccurate information.</li>
              <li>Delete your account and associated personal information.</li>
              <li>Export a copy of your data.</li>
              <li>Object to or restrict certain processing.</li>
              <li>Withdraw consent for optional processing.</li>
            </ul>
            <p className="mt-4">
              You can exercise these rights by emailing{" "}
              <a href="mailto:hello@joinafia.com" className="text-[#0FA37F] hover:underline font-medium">
                hello@joinafia.com
              </a>. We will respond within the timeframe required by applicable law (typically 30 days). You can also delete your account directly inside the App, which removes your stored content as described in Section 5.
            </p>
            <p className="mt-4">If you are in the European Economic Area, the United Kingdom, or Switzerland, our legal bases for processing are: (a) performance of our contract with you (providing the App), (b) our legitimate interests in operating, securing, and improving the App, (c) your consent (for example, when you connect a social platform or grant a device permission), and (d) compliance with legal obligations.</p>
            <p className="mt-4">If you are a California resident, you have additional rights under the CCPA/CPRA, including the right to know, the right to delete, the right to correct, and the right to opt out of the "sale" or "sharing" of personal information. AFIA does not sell or share personal information as those terms are defined under California law.</p>
          </section>

          <hr className="border-gray-100" />

          {/* Section 8 */}
          <section>
            <h2 className="font-helvetica text-2xl font-bold text-[#232323] mb-6">
              8. Children's Privacy
            </h2>
            <p>
              AFIA is not directed to children under 13 (or the equivalent minimum age in your jurisdiction). We do not knowingly collect personal information from children under that age. If you believe a child has provided us personal information, contact us at{" "}
              <a href="mailto:hello@joinafia.com" className="text-[#0FA37F] hover:underline font-medium">
                hello@joinafia.com
              </a>{" "}
              and we will delete it.
            </p>
          </section>

          <hr className="border-gray-100" />

          {/* Section 9 */}
          <section>
            <h2 className="font-helvetica text-2xl font-bold text-[#232323] mb-6">
              9. International Data Transfers
            </h2>
            <p>AFIA is operated from the United States and uses cloud infrastructure that may be located in the United States and other countries. By using the App, you understand that your information may be transferred to and processed in countries other than your own. Where required, we rely on appropriate safeguards such as Standard Contractual Clauses.</p>
          </section>

          <hr className="border-gray-100" />

          {/* Section 10 */}
          <section>
            <h2 className="font-helvetica text-2xl font-bold text-[#232323] mb-6">
              10. Third-Party Services and Links
            </h2>
            <p className="mb-4">The App connects with TikTok and Instagram via their official APIs. Your use of those platforms is governed by their own privacy policies. We encourage you to review them:</p>
            <ul className="list-disc list-outside pl-5 space-y-2">
              {[
                ["TikTok Privacy Policy", "https://www.tiktok.com/legal/privacy-policy"],
                ["Meta / Instagram Privacy Policy", "https://privacycenter.instagram.com/policy"],
                ["OpenAI Privacy Policy", "https://openai.com/policies/privacy-policy"],
                ["RevenueCat Privacy Policy", "https://www.revenuecat.com/privacy"],
                ["Apple App Store Privacy", "https://www.apple.com/legal/privacy/"],
                ["Google Play Privacy", "https://policies.google.com/privacy"],
              ].map(([label, href]) => (
                <li key={href}>
                  {label}:{" "}
                  <a href={href} target="_blank" rel="noopener noreferrer" className="text-[#0FA37F] hover:underline break-all">
                    {href}
                  </a>
                </li>
              ))}
            </ul>
          </section>

          <hr className="border-gray-100" />

          {/* Section 11 */}
          <section>
            <h2 className="font-helvetica text-2xl font-bold text-[#232323] mb-6">
              11. Changes to This Policy
            </h2>
            <p>We may update this Privacy Policy from time to time. When we make material changes, we will update the "Last updated" date at the top and, where appropriate, notify you in the App or by email. Your continued use of the App after the changes take effect constitutes your acceptance of the updated policy.</p>
          </section>

          <hr className="border-gray-100" />

          {/* Section 12 */}
          <section>
            <h2 className="font-helvetica text-2xl font-bold text-[#232323] mb-6">
              12. Contact Us
            </h2>
            <p className="mb-2">If you have any questions, requests, or complaints about this Privacy Policy or our data practices, contact us at:</p>
            <div className="mt-4 p-5 rounded-2xl bg-gray-50 border border-gray-100">
              <p className="font-semibold text-[#232323]"></p>Zoku Labs LLC
              <p className="mt-1 text-gray-500">
                Email:{" "}
                <a href="mailto:hello@joinafia.com" className="text-[#0FA37F] hover:underline font-medium">
                  hello@joinafia.com
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
