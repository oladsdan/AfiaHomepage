import { SectionHeader } from "@/components/ui/SectionHeader";
import { AccordionItem } from "@/components/ui/AccordionItem";
import { faqData } from "@/lib/faq-data";
import { AnimatedGroup } from "@/components/ui/animated-group";

const sectionVariants = {
  container: {
    visible: {
      transition: {
        staggerChildren: 0.1,
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

export function FAQ() {
  return (
    <section className="py-20 px-4">
      <div className="max-w-2xl mx-auto">
        <AnimatedGroup variants={sectionVariants} useInView>
          <SectionHeader
            title="Frequently Asked Questions"
            className="mb-10 font-helvetica"
          />
          <div className="flex flex-col gap-[10px]">
            {faqData.map((item, i) => (
              <div key={i} className="bg-[#EFF0F4] p-5">
                <AccordionItem
                  question={item.question}
                  answer={item.answer}
                  defaultOpen={i === 0}
                />
              </div>
            ))}
          </div>
        </AnimatedGroup>
      </div>
    </section>
  );
}
