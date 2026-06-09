export interface PricingFeature {
  label: string;
  sublabel?: string;
}

export interface PricingPlan {
  name: string;
  price: string;
  period: string;
  badge?: string;
  features: PricingFeature[];
  ctaLabel: string;
  isHighlighted: boolean;
}

export const pricingData: PricingPlan[] = [
  {
    name: "Monthly",
    price: "$9.99",
    period: "/mo",
    features: [
      { label: "Create with Confidence", sublabel: "Know how your video is likely to perform before you post — from views to likes and shares." },
      { label: "Actionable Video Insights", sublabel: "Get clear, practical feedback that helps your videos perform better and reach more people." },
      { label: "Create Without the Stress", sublabel: "Reach the right audience and grow your following with clarity and direction." },
    ],
    ctaLabel: "Join now",
    isHighlighted: false,
  },
  {
    name: "Yearly",
    price: "$49.99",
    period: "/yr",
    badge: "3 days free",
    features: [
      { label: "Today", sublabel: "Unlock powerful AI tools to predict performance, expand your reach, and create content that wins attention." },
      {
        label: "In 2 Days",
        sublabel: "We’ll send you a quick reminder so you can decide if Premium is right for you.",
      },
      {
        label: "In 3 Days",
        sublabel: "Your subscription begins on Jan 31, 2026, unless you cancel anytime before then — no stress, no surprises.",
      },
    ],
    ctaLabel: "Go premium",
    isHighlighted: true,
  },
];
