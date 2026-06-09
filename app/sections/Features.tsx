import Image from "next/image";
import { Hash, Bot, Type, FileText } from "lucide-react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { FeatureCard } from "@/components/ui/FeatureCard";
import { FeatureText } from "@/components/FeatureText";
import { featuresData } from "@/lib/features-data";
import { AnimatedGroup } from "@/components/ui/animated-group";

const featureIcons = [
  <Hash className="w-5 h-5 text-yellow-500" key="hash" />,
  <Bot className="w-5 h-5 text-purple-500" key="bot" />,
  <Type className="w-5 h-5 text-teal-500" key="type" />,
  <FileText className="w-5 h-5 text-orange-500" key="file" />,
];

export function Features() {
  return (
    <section id="features" className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <AnimatedGroup preset="blur-slide" useInView>
          <SectionHeader
            title={<>Everything You Need to Create Viral <span className="block">Short-Form Videos</span></>}
            subtitle="From scroll-stopping hooks to high-converting captions, Afia gives you the tools to create content that performs consistently."
            className="mb-12"
            titleClassName="font-helvetica font-normal text-[#232323] text-[36px] md:text-[36px] lg:text-[36px] leading-[40px] md:leading-[40px] lg:leading-[40px]"
            subtitleClassName="font-geist text-[#666565]"
          />
        </AnimatedGroup>

        {/* <div className="rounded-3xl bg-gradient-to-br from-gray-50 to-white border border-gray-100 p-8 md:p-10 mb-8 flex flex-col md:flex-row items-center gap-8">
          <div className="flex-shrink-0 w-48 md:w-56 relative">
            <div className="relative w-full aspect-[9/16] rounded-3xl overflow-hidden shadow-2xl">
              <Image
                src="/phone-mockup.png"
                alt="Afia App Phone Mockup"
                fill
                className="object-cover"
              />
            </div>
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-[#0FA37F] rounded-xl flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 10l4.553-2.069A1 1 0 0121 8.882v6.236a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900">
                AI Video Analyzer
              </h3>
            </div>
            <p className="text-gray-500 text-base leading-relaxed max-w-lg">
              Upload your video and get instant AI feedback on how to make it
              stronger before you post. Afia breaks down every element — your
              hook, pacing, captions, and call-to-action — so you know exactly
              what to fix.
            </p>
            <div className="mt-6 flex items-center gap-6 text-sm text-gray-400">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#0FA37F]" />
                Hook analysis
              </span>
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#0FA37F]" />
                Caption review
              </span>
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#0FA37F]" />
                Viral scoring
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
          {featuresData.map((featu
          re, i) => (
            <FeatureCard
              key={i}
              icon={featureIcons[i]}
              title={feature.title}
              description={feature.description}
              iconBgColor={feature.bgColor}
            />
          ))}
        </div>

        <FeatureText /> */}
      </div>

      {/* Desktop image — hidden on mobile */}
      <AnimatedGroup preset="blur-slide" useInView className="hidden md:block mt-16 px-4 max-w-7xl mx-auto">
        <Image
          src="/images/feature1.png"
          alt="Afia feature overview"
          width={1400}
          height={800}
          className="w-full h-auto rounded-3xl"
        />
      </AnimatedGroup>

      {/* Mobile stack — hidden on desktop */}
      <AnimatedGroup
        preset="blur-slide"
        useInView
        className="flex md:hidden flex-col mt-10 px-4"
      >
        <Image
          src="/images/feature1-mobile.png"
          alt="AI Video Analyzer"
          width={600}
          height={900}
          className="w-full h-auto"
        />
        <Image
          src="/images/feature2-mobile.png"
          alt="Phone mockup"
          width={600}
          height={700}
          className="w-full h-auto"
        />
        <Image
          src="/images/feature2-5-mobile.png"
          alt="Hashtag Generator"
          width={600}
          height={700}
          className="w-full h-auto"
        />
        <Image
          src="/images/feature3-mobile.png"
          alt="Afia AI"
          width={600}
          height={500}
          className="w-full h-auto"
        />
        <Image
          src="/images/feature4-mobile.png"
          alt="Caption Generator"
          width={600}
          height={500}
          className="w-full h-auto"
        />
        <Image
          src="/images/feature5-mobile.png"
          alt="Script Generator"
          width={600}
          height={500}
          className="w-full h-auto"
        />
      </AnimatedGroup>
    </section>
  );
}
