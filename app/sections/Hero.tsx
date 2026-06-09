'use client';
import Image from "next/image";
import { MediaReel } from "@/components/MediaReel";
import { AnimatedGroup } from "@/components/ui/animated-group";

const ctaGradient = {
  background: "radial-gradient(50% 50% at 50% 50%, #00BFAC 0%, #0083B8 100%)",
};

const transitionVariants = {
  container: {
    visible: {
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  },
  item: {
    hidden: {
      opacity: 0,
      filter: "blur(12px)",
      y: 12,
    },
    visible: {
      opacity: 1,
      filter: "blur(0px)",
      y: 0,
      transition: {
        type: "spring",
        bounce: 0.3,
        duration: 1.5,
      },
    },
  },
};

const buttonVariants = {
  container: {
    visible: {
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.75,
      },
    },
  },
  item: {
    hidden: {
      opacity: 0,
      filter: "blur(12px)",
      y: 12,
    },
    visible: {
      opacity: 1,
      filter: "blur(0px)",
      y: 0,
      transition: {
        type: "spring",
        bounce: 0.3,
        duration: 1.5,
      },
    },
  },
};

export function Hero() {
  return (
    <div>
    <section id="home" className="relative overflow-hidden text-center">
      <Image
        src="/assets/background/spiral.png"
        alt=""
        fill
        className="object-contain object-center opacity-50"
        priority
      />

      <div className="relative z-10 pt-20 md:pt-28 px-4 pb-0">
        <div className="max-w-4xl mx-auto font-helvetica">
          <AnimatedGroup variants={transitionVariants}>
            <p className="text-[#8B8B8B] text-4xl md:text-6xl lg:text-[64px] font-semibold mb-2">
              Stop Guessing.
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#232323] leading-tight mb-6">
              Start Creating Content That Performs.
            </h1>
            <p className="text-[#666565] font-geist text-base md:text-[16px] max-w-xl mx-auto mb-10 leading-relaxed">
              Upload a video and Afia analyzes your hook, storytelling, captions,
              and hashtags so you know exactly what to improve.
            </p>
          </AnimatedGroup>

          <AnimatedGroup
            variants={buttonVariants}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pb-16 md:pb-20"
          >
            <a
                href="https://apps.apple.com/us/app/afia-creator-tool/id6761689679"
              style={ctaGradient}
              className="flex items-center gap-3 text-white px-6 py-3 rounded-[5px] hover:opacity-90 transition-opacity duration-200"
            >
              <Image
                src="/icon/apple.png"
                alt="Apple"
                width={20}
                height={20}
                className="flex-shrink-0"
              />
              <div className="text-left">
                <p className="text-[10px] leading-none text-white/70">
                  Download on the
                </p>
                <p className="text-sm font-semibold leading-tight">App Store</p>
              </div>
            </a>

            <a
              href="https://play.google.com/store/apps/details?id=com.zokulabs.afia&pcampaignid=web_share"
              style={ctaGradient}
              className="flex items-center gap-3 text-white px-6 py-3 rounded-[5px] hover:opacity-90 transition-opacity duration-200"
            >
              <Image
                src="/icon/playstore.png"
                alt="Google Play"
                width={20}
                height={20}
                className="flex-shrink-0"
              />
              <div className="text-left">
                <p className="text-[10px] leading-none text-white/70">
                  Get it on
                </p>
                <p className="text-sm font-semibold leading-tight">Google Play</p>
              </div>
            </a>
          </AnimatedGroup>
        </div>
      </div>

    </section>
    <MediaReel />
    </div>
  );
}
