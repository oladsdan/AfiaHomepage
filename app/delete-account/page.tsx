import type { Metadata } from "next";
import { Footer } from "@/app/sections/Footer";

export const metadata: Metadata = {
  title: "Delete Your Afia Account – Afia",
  description:
    "Learn how to permanently delete your Afia account and what happens to your data.",
};

export default function DeleteAccount() {
  return (
    <main className="bg-white">
      <div className="max-w-3xl mx-auto px-6 py-16 md:py-24">

        <h1 className="font-helvetica text-4xl md:text-5xl font-bold text-[#232323] mb-6">
          Delete Your Afia Account
        </h1>

        <div className="p-5 rounded-2xl bg-gray-50 border border-gray-100 mb-10">
          <p className="text-[15px] text-[#444] leading-relaxed">
            <strong>Afia</strong> is a video feedback app for creators, made by <strong>Zoku Labs</strong>.
            This page explains how to permanently delete your Afia account and what happens to your data when you do.
          </p>
        </div>

        <div className="space-y-10 text-[#444] leading-relaxed text-[15px]">

          {/* How to delete */}
          <section>
            <h2 className="font-helvetica text-2xl font-bold text-[#232323] mb-6">
              How to delete your account
            </h2>

            <div className="space-y-8">
              <div>
                <h3 className="font-semibold text-[#232323] text-lg mb-3">
                  Option 1 — Delete it yourself from the app <span className="text-[#0FA37F] font-normal text-sm">(recommended)</span>
                </h3>
                <p className="mb-4">This is the fastest way and works whether you signed up with email, Google, or Apple.</p>
                <ol className="list-decimal list-outside pl-5 space-y-2">
                  <li>Open the <strong>Afia</strong> app on your phone.</li>
                  <li>Sign in if you're signed out.</li>
                  <li>Tap the <strong>Profile</strong> tab.</li>
                  <li>Tap <strong>Settings</strong> → <strong>Delete account</strong>.</li>
                  <li>Type <strong>DELETE</strong> in the confirmation box and tap <strong>Delete account</strong>.</li>
                  <li>Confirm again on the system prompt.</li>
                </ol>
                <p className="mt-4 text-gray-500 italic">Your account is removed immediately and you're signed out.</p>
              </div>

              <div>
                <h3 className="font-semibold text-[#232323] text-lg mb-3">Option 2 — Email us</h3>
                <p>
                  If you can't sign in, or you'd rather we do it for you, email{" "}
                  <a href="mailto:support@joinafia.com" className="text-[#0FA37F] hover:underline font-medium">
                    support@joinafia.com
                  </a>{" "}
                  from the email address on your Afia account with the subject line <strong>"Delete my account"</strong>.
                </p>
                <p className="mt-3">
                  We'll confirm by reply, verify your identity, and complete the deletion within <strong>30 days</strong> (usually within 72 hours).
                </p>
              </div>
            </div>
          </section>

          <hr className="border-gray-100" />

          {/* What gets deleted */}
          <section>
            <h2 className="font-helvetica text-2xl font-bold text-[#232323] mb-4">
              What gets deleted
            </h2>
            <p className="mb-4">
              When your account is deleted, we permanently remove <strong>all</strong> of the following from our servers:
            </p>
            <ul className="list-disc list-outside pl-5 space-y-2">
              <li>Your profile and onboarding answers</li>
              <li>Connected TikTok and Instagram accounts and access tokens</li>
              <li>Uploaded videos, thumbnails, and AI video analyses</li>
              <li>Saved scripts, captions, content ideas, and AI chat history</li>
              <li>In-app notifications and notification history</li>
              <li>Account credentials (password hash, OAuth identifiers)</li>
              <li>Push notification tokens and device identifiers</li>
            </ul>
            <p className="mt-4 font-medium text-[#232323]">
              This is irreversible — once deleted, the data cannot be restored.
            </p>
          </section>

          <hr className="border-gray-100" />

          {/* What is kept */}
          <section>
            <h2 className="font-helvetica text-2xl font-bold text-[#232323] mb-4">
              What is kept, and for how long
            </h2>
            <p className="mb-6">
              A small amount of data may be retained for legal, tax, and fraud-prevention reasons:
            </p>

            <div className="overflow-x-auto rounded-2xl border border-gray-100">
              <table className="w-full text-sm text-left">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="px-4 py-3 font-semibold text-[#232323]">Data</th>
                    <th className="px-4 py-3 font-semibold text-[#232323]">Why it's kept</th>
                    <th className="px-4 py-3 font-semibold text-[#232323]">How long</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {[
                    ["Billing and subscription receipts", "Required for tax and accounting law", "Up to 7 years"],
                    ["Anonymized usage logs (no personal identifiers)", "Service reliability and abuse prevention", "Up to 12 months"],
                    ["Backups containing your data", "Standard backup rotation", "Purged within 30 days of deletion"],
                  ].map(([data, why, how]) => (
                    <tr key={data} className="bg-white">
                      <td className="px-4 py-3 font-medium text-[#232323] align-top">{data}</td>
                      <td className="px-4 py-3 text-gray-500 align-top">{why}</td>
                      <td className="px-4 py-3 text-gray-500 align-top">{how}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="mt-5">
              Anything kept is either fully anonymized or held only for the period required by law.
            </p>
          </section>

          <hr className="border-gray-100" />

          {/* Subscriptions */}
          <section>
            <h2 className="font-helvetica text-2xl font-bold text-[#232323] mb-4">
              Subscriptions
            </h2>
            <p className="mb-4">
              Deleting your Afia account <strong>does not automatically cancel</strong> any active subscription billed through the App Store or Google Play. To stop being charged, also cancel from your store subscription settings:
            </p>
            <ul className="list-disc list-outside pl-5 space-y-2">
              <li><strong>iOS / App Store:</strong> Settings → [your name] → Subscriptions → Afia → Cancel</li>
              <li><strong>Android / Google Play:</strong> Play Store → Profile → Payments &amp; subscriptions → Subscriptions → Afia → Cancel</li>
            </ul>
            <p className="mt-4">
              We recommend cancelling your subscription <strong>before</strong> deleting your account.
            </p>
          </section>

          <hr className="border-gray-100" />

          {/* Questions */}
          <section>
            <h2 className="font-helvetica text-2xl font-bold text-[#232323] mb-4">
              Questions?
            </h2>
            <p>
              Email{" "}
              <a href="mailto:support@joinafia.com" className="text-[#0FA37F] hover:underline font-medium">
                support@joinafia.com
              </a>{" "}
              and we'll get back to you within 2 business days.
            </p>
            <p className="mt-6 text-sm text-gray-400 italic">Last updated: April 28, 2026.</p>
          </section>

        </div>
      </div>

      <Footer />
    </main>
  );
}
