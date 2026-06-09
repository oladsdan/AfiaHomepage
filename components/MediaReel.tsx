"use client";
import { motion } from "framer-motion";

const reels = [
  { src: "/images/reel1.webm", alt: "Creator filming selfie in city" },
  { src: "/images/reel2.webm", alt: "Fitness creator with resistance band" },
  { src: "/images/reel3.webm", alt: "Creators on a car" },
  { src: "/images/reel4.webm", alt: "Two women smiling with drinks" },
  { src: "/images/reel5.webm", alt: "Man recording video on phone rig" },
];

const CARD_WIDTH = 280;
const GAP = 3;
const CARD_STEP = CARD_WIDTH + GAP;
const TOTAL_SHIFT = reels.length * CARD_STEP;

export function MediaReel() {
  return (
    <div id="how-it-works" className="relative w-full overflow-hidden">
      {/* Left fade */}
      <div
        className="absolute left-0 top-0 bottom-0 z-10 pointer-events-none"
        style={{
          width: "120px",
          background: "linear-gradient(90deg, #F3F3F3 0%, rgba(243,243,243,0) 100%)",
        }}
      />
      {/* Right fade */}
      <div
        className="absolute right-0 top-0 bottom-0 z-10 pointer-events-none"
        style={{
          width: "120px",
          background: "linear-gradient(270deg, #F3F3F3 0%, rgba(243,243,243,0) 100%)",
        }}
      />

      {/* Ellipse curved-top mask — pushes up so only bottom arc is visible */}
      <img
        src="/images/ellipse.png"
        alt=""
        aria-hidden="true"
        className="absolute left-0 w-full pointer-events-none"
        style={{ top: 0, transform: "translateY(-58%)", zIndex: 20 }}
      />

      <motion.div
        className="flex"
        style={{ gap: `${GAP}px` }}
        animate={{ x: [0, -TOTAL_SHIFT] }}
        transition={{
          x: {
            repeat: Infinity,
            repeatType: "loop",
            duration: 35,
            ease: "linear",
          },
        }}
      >
        {[...reels, ...reels].map((reel, i) => (
          <div
            key={i}
            className="flex-shrink-0"
            style={{ width: `${CARD_WIDTH}px`, aspectRatio: "3/4" }}
          >
            <video
              src={reel.src}
              aria-label={reel.alt}
              className="w-full h-full object-cover"
              autoPlay
              loop
              muted
              playsInline
            />
          </div>
        ))}
      </motion.div>
    </div>
  );
}
