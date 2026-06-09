import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Afia – Stop Guessing. Start Creating Content That Performs.",
  description:
    "Upload a video and Afia analyzes your hook, storytelling, captions, and hashtags so you know exactly what to improve.",
  icons: {
    icon: "/afia-icon.png",
    apple: "/afia-icon.png",
  },
  openGraph: {
    title: "Afia – Stop Guessing. Start Creating Content That Performs.",
    description:
      "Upload a video and Afia analyzes your hook, storytelling, captions, and hashtags so you know exactly what to improve.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable} ${GeistMono.variable}`}
    >
      <body className={inter.className}>{children}</body>
    </html>
  );
}
