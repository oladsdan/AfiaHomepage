import Image from "next/image";

const appScreenshots = [
  { src: "/images/screen-hooks.png", label: "Hooks" },
  { src: "/images/screen-cta.png", label: "Call to action" },
  { src: "/images/screen-story.png", label: "Story telling" },
];

const featureCards = [
  {
    icon: "/images/icon-hashtag.png",
    title: "Hashtag\nGenerator",
    description:
      "Afia analyzes trend momentum to generate hashtag sets that increase discoverability without burying your content in oversaturated feeds.",
  },
  {
    icon: "/images/icon-ai.png",
    title: "Afia AI",
    description:
      "The AI Video Coach analyzes your style to give personalized guidance. Think of it as having a growth mentor that never sleeps.",
  },
  {
    icon: "/images/icon-caption.png",
    title: "Caption\nGenerator",
    description:
      "Get captions that feel natural, persuasive, and tailored to your niche. Whether you're educational, inspirational, or direct, your voice stays intact.",
  },
  {
    icon: "/images/icon-script.png",
    title: "Script\nGenerator",
    description:
      "Afia generates scripts optimized for watch time and clarity. Choose your format, tone and length.. let Afia handle the flow.",
  },
];

export function FeatureText() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="relative rounded-3xl overflow-hidden min-h-[400px]">
          <Image
            src="/images/gradient-bg.png"
            alt=""
            fill
            className="object-cover"
          />
          <div className="absolute inset-0">
            <Image
              src="/images/phone-hand.png"
              alt="Afia app on phone"
              fill
              className="object-contain object-bottom"
            />
          </div>
        </div>

        <div className="rounded-3xl bg-white border border-gray-100 p-8 flex flex-col justify-between min-h-[400px]">
          <div>
            <div className="w-10 h-10 bg-[#0FA37F] rounded-xl flex items-center justify-center mb-5">
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
            <h3 className="text-2xl font-semibold text-gray-900 mb-3">
              AI Video Analyzer
            </h3>
            <p className="text-gray-500 text-sm leading-relaxed max-w-sm">
              Upload your video and get instant AI feedback on how to make it
              stronger before you post.
            </p>
          </div>

          <div className="mt-6">
            <div className="flex gap-3">
              {appScreenshots.map((shot) => (
                <div key={shot.label} className="flex-1 flex flex-col items-center gap-2">
                  <div className="relative w-full aspect-[9/16] rounded-2xl overflow-hidden shadow-md">
                    <Image
                      src={shot.src}
                      alt={shot.label}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <span className="text-xs text-gray-500 font-medium text-center">
                    {shot.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {featureCards.map((card) => (
          <div
            key={card.title}
            className="rounded-3xl bg-white border border-gray-100 p-6 flex flex-col gap-4"
          >
            <div className="relative w-10 h-10 flex-shrink-0">
              <Image src={card.icon} alt={card.title} fill className="object-contain" />
            </div>
            <h4 className="text-xl font-semibold text-gray-900 leading-snug whitespace-pre-line">
              {card.title}
            </h4>
            <p className="text-gray-500 text-sm leading-relaxed">
              {card.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
