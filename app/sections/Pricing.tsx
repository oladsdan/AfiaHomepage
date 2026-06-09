import { SectionHeader } from "@/components/ui/SectionHeader";
import { PricingCard } from "@/components/ui/PricingCard";
import { pricingData } from "@/lib/pricing-data";
import { AnimatedGroup } from "@/components/ui/animated-group";

const sectionVariants = {
  container: {
    visible: {
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.05,
      },
    },
  },
  item: {
    hidden: { opacity: 0, filter: "blur(12px)", y: 16 },
    visible: {
      opacity: 1,
      filter: "blur(0px)",
      y: 0,
      transition: { type: "spring", bounce: 0.3, duration: 1.5 },
    },
  },
};

export function Pricing() {
  return (
    <section id="pricing" className="py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <AnimatedGroup variants={sectionVariants} useInView>
          <SectionHeader
            title="Better content in seconds"
            subtitle={<>Access advanced script structures, deep video analysis,<span className="block"> trending hashtags, and priority generation.</span></>}
            className="mb-14"
            titleClassName="font-helvetica font-normal text-[#232323] text-[36px] md:text-[36px] lg:text-[36px] leading-[40px] md:leading-[40px] lg:leading-[40px]"
            subtitleClassName="font-geist text-[#666565]"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            {pricingData.map((plan) => (
              <PricingCard
                key={plan.name}
                name={plan.name}
                price={plan.price}
                period={plan.period}
                badge={plan.badge}
                features={plan.features}
                ctaLabel={plan.ctaLabel}
                isHighlighted={plan.isHighlighted}
              />
            ))}
          </div>
        </AnimatedGroup>
      </div>
    </section>
  );
}
