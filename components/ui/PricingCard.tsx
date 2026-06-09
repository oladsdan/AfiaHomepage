import Image from "next/image";
import { cn } from "@/lib/utils";
import { Badge } from "./Badge";
import { Button } from "./Button";

interface PricingFeature {
  label: string;
  sublabel?: string;
}

interface PricingCardProps {
  name: string;
  price: string;
  period: string;
  badge?: string;
  features: PricingFeature[];
  ctaLabel: string;
  isHighlighted: boolean;
  className?: string;
}

export function PricingCard({
  name,
  price,
  period,
  badge,
  features,
  ctaLabel,
  isHighlighted,
  className,
}: PricingCardProps) {
  return (
    <div
      className={cn(
        "relative rounded-[12px] p-8 font-geist flex flex-col gap-6",
        isHighlighted
          ? "bg-[#0083B8] text-white"
          : "bg-white border border-gray-200 text-gray-900",
        className
      )}
    >
      {badge && (
        isHighlighted ? (
          <div className="absolute top-4 left-4">
            <span
              className="inline-flex items-center px-4 py-1.5 text-xs font-semibold text-white"
              style={{ background: "#242424", borderRadius: "25.89px" }}
            >
              {badge}
            </span>
          </div>
        ) : (
          <div className="absolute -top-3 left-8">
            <Badge variant="teal">{badge}</Badge>
          </div>
        )
      )}

      <div className={cn(isHighlighted && badge ? "mt-6" : "")}>
        <p
          className={cn(
            "text-sm font-semibold mb-1",
            isHighlighted ? "text-white/70" : "text-gray-500"
          )}
        >
          {name}
        </p>
        <p className="text-4xl font-helvetica">
          {price}
          <span
            className={cn(
              "text-base font-normal ml-1",
              isHighlighted ? "text-white/70" : "text-gray-400"
            )}
          >
            {period}
          </span>
        </p>
      </div>

      <div>
        <p
          className={cn(
            "text-xs font-semibold uppercase tracking-wider mb-3",
            isHighlighted ? "text-white/60" : "text-gray-400"
          )}
        >
          Features
        </p>
        <ul className="space-y-3">
          {features.map((feature, i) => (
            <li key={i} className="flex items-start gap-3">
              <div className="relative flex-shrink-0 mt-0.5 w-4 h-4">
                <Image
                  src={isHighlighted ? "/icon/checkmark2.png" : "/icon/checkmark.png"}
                  alt="check"
                  fill
                  className="object-contain"
                />
              </div>
              <div>
                <span
                  className={cn(
                    "text-sm font-medium",
                    isHighlighted ? "text-white" : "text-gray-800"
                  )}
                >
                  {feature.label}
                </span>
                {feature.sublabel && (
                  <p
                    className={cn(
                      "text-xs mt-0.5",
                      isHighlighted ? "text-white/60" : "text-gray-400"
                    )}
                  >
                    {feature.sublabel}
                  </p>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>

      <Button
        variant="primary"
        className="w-full rounded-[12px] mt-auto"
        style={
          isHighlighted
            ? { background: "#FFFFFF", color: "#000000" }
            : {
                background: "linear-gradient(90deg, #01BDAB 0%, #0083B8 56.79%)",
                color: "#FFFFFF",
              }
        }
      >
        {ctaLabel}
      </Button>
    </div>
  );
}
