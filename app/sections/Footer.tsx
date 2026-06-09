import { FaInstagram, FaLinkedinIn, FaTwitter } from "react-icons/fa";
import { MapPin, Mail } from "lucide-react";

export function Footer() {
  return (
    <div id="contact" style={{ background: "#0083B8" }}>
      <footer className="relative overflow-hidden text-white" style={{ background: "linear-gradient(0.38deg, #0083B8 19.81%, rgba(0, 131, 184, 0) 99.69%)" }}>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
          <span
            className="text-[180px] md:text-[500.16px] font-helvetica font-bold text-white/20 leading-none tracking-tighter"
            aria-hidden="true"
          >
            Afia
          </span>
        </div>

        {/* Main centered content */}
        <div className="relative z-10 max-w-4xl mx-auto text-center pt-16 px-4 pb-10">
          <p className="text-xl md:text-2xl font-semibold text-white/90 mb-8">
            Tools designed to help creators grow smarter.
          </p>

          <div className="flex items-center justify-center gap-4 mb-8">
            <a
              href="https://instagram.com/joinAfia"
              className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors duration-200"
              aria-label="Instagram"
            >
              <FaInstagram className="w-4 h-4" />
            </a>
            <a
              href="#"
              className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors duration-200"
              aria-label="LinkedIn"
            >
              <FaLinkedinIn className="w-4 h-4" />
            </a>
            <a
              href="https://twitter.com/joinAfia"
              className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors duration-200"
              aria-label="Twitter"
            >
              <FaTwitter className="w-4 h-4" />
            </a>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-white/60 text-sm">
            <a
              href="mailto:hello@joinafia.com"
              className="flex items-center gap-2 hover:text-white transition-colors duration-200"
            >
              <Mail className="w-4 h-4" />
              hello@joinafia.com
            </a>
            <a
              href="/privacy-policy"
              className="hover:text-white transition-colors duration-200"
            >
              Privacy Policy
            </a>
            <a
              href="/terms"
              className="hover:text-white transition-colors duration-200"
            >
              Terms of Service
            </a>
          </div>
        </div>

        {/* Full-width subscribe band */}
        <div className="relative z-10 w-full" style={{ background: "linear-gradient(0.38deg, #0083B8 19.81%, rgba(0, 131, 184, 0) 99.69%)" }}>
          <div className="max-w-sm mx-auto text-center">
            <p className="text-white font-semibold text-lg mb-1">Subscribe</p>
            <p className="text-white/60 text-xs mb-6">
              Enter your email to get notification<br />about our updates.
            </p>
            <div className="flex bg-white rounded-[16px] p-2 gap-2">
              <input
                type="email"
                placeholder="Email"
                className="flex-1 px-4 py-3 rounded-full bg-white border-0 text-gray-400 placeholder-gray-400 text-sm focus:outline-none"
              />
              <button
                className="px-6 py-3 rounded-[12px] text-sm font-semibold flex-shrink-0 text-white"
                style={{
                  background: "linear-gradient(90deg, #01BDAB 0%, #0083B8 56.79%)",
                  border: "1px solid #2CC2FF",
                }}
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
