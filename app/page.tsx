import { Navbar } from "./sections/Navbar";
import { Hero } from "./sections/Hero";
import { Features } from "./sections/Features";
import { Pricing } from "./sections/Pricing";
import { FAQ } from "./sections/FAQ";
import { Footer } from "./sections/Footer";

export default function Home() {
  return (
    <main className="bg-[#F3F3F3]">
      <Navbar />
      <Hero />
      <Features />
      <Pricing />
      <FAQ />
      <Footer />
    </main>
  );
}
