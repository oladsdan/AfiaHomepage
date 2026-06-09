"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "Home", href: "#home" },
  { label: "Features", href: "#features" },
  { label: "How it Works", href: "#how-it-works" },
  { label: "Pricing", href: "#pricing" },
];

export function Navbar() {
  const [active, setActive] = useState("Home");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleScroll = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string,
    label: string
  ) => {
    e.preventDefault();
    setActive(label);
    setMobileOpen(false);
    const id = href.replace("#", "");
    const target = document.getElementById(id);
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header className="sticky top-0 z-50">
      <div
        className={cn(
          "mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-300",
          isScrolled
            ? "max-w-4xl mt-3 rounded-2xl border border-gray-200 bg-white/80 backdrop-blur-lg shadow-sm lg:px-5"
            : "max-w-6xl  shadow-sm"
        )}
      >
        <div
          className={cn(
            "flex items-center justify-between transition-all duration-300",
            isScrolled ? "h-14" : "h-20"
          )}
        >
          <div className="flex items-center gap-2 flex-shrink-0">
            <Image
              src="/afia-icon.png"
              alt="Afia logo"
              width={32}
              height={32}
              className="rounded-md"
            />
            <span className="text-[35px] font-bold text-gray-900 font-geist tracking-tight">
              Afia
            </span>
          </div>

          <nav className="hidden md:flex bg-[#FFFFFF] rounded-[16px] p-2 items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => handleScroll(e, link.href, link.label)}
                className={`px-4 py-2 text-sm font-medium rounded-[12px] transition-colors duration-200 ${
                  active === link.label
                    ? "bg-[#121212] text-white"
                    : "text-gray-600 hover:text-[#0FA37F] hover:bg-gray-50"
                }`}
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "hidden md:flex font-helvetica border-none text-[20px] transition-all duration-300",
                isScrolled && "hidden"
              )}
              onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
            >
              Contact us
            </Button>
            <Link href="/login">
              <Button
                variant="primary"
                size="sm"
                className="hidden md:flex rounded-[12px] bg-[#121212]/90 hover:bg-[#121212]/90 focus:ring-[#121212]"
              >
                Sign in
              </Button>
            </Link>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="md:hidden border-t border-gray-100 py-3 space-y-1">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => handleScroll(e, link.href, link.label)}
                className={`block px-4 py-2.5 text-sm font-medium rounded-xl transition-colors duration-200 ${
                  active === link.label
                    ? "bg-gray-900 text-white"
                    : "text-gray-600 hover:text-[#0FA37F] hover:bg-gray-50"
                }`}
              >
                {link.label}
              </a>
            ))}
            <div className="pt-2 px-4">
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-center"
                onClick={() => { setMobileOpen(false); document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" }); }}
              >
                Contact us
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
