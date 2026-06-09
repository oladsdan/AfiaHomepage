export interface Feature {
  iconColor: string;
  bgColor: string;
  title: string;
  description: string;
}

export const featuresData: Feature[] = [
  {
    iconColor: "text-yellow-500",
    bgColor: "bg-yellow-50",
    title: "Hashtag Generator",
    description:
      "Afia analyzes trend momentum to generate hashtag sets that increase discoverability without burying your content in oversaturated feeds.",
  },
  {
    iconColor: "text-purple-500",
    bgColor: "bg-purple-50",
    title: "Afia AI",
    description:
      "The AI Video Coach analyzes your style to give personalized guidance, whether you're having a growth mindset or not – an AI mentor that never sleeps.",
  },
  {
    iconColor: "text-teal-500",
    bgColor: "bg-teal-50",
    title: "Caption Generator",
    description:
      "Get captions that feel native to your niche. Whether you're educational, inspirational, or direct, your voice stays intact.",
  },
  {
    iconColor: "text-orange-500",
    bgColor: "bg-orange-50",
    title: "Script Generator",
    description:
      "A pre-formatted script optimized for watch time and clarity. Choose your format, tone and length – let Afia handle the flow.",
  },
];
