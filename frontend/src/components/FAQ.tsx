import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SectionHeading from "./SectionHeading";
import Reveal from "./Reveal";
import { useContent } from "../store/content";
import { DEFAULT_FAQS, type FaqItem } from "../data";
import { FormattedText } from "./FormattedText";

type FAQItemProps = {
  item: FaqItem;
  index: number;
  isOpen: boolean;
  onToggle: () => void;
};

function FAQItem({ item, index, isOpen, onToggle }: FAQItemProps) {
  return (
    <Reveal direction="up" distance={28} delay={index * 50}>
      <div
        className={`group overflow-hidden rounded-2xl border transition-all duration-300 ${
          isOpen
            ? "border-accent/40 bg-accent/[0.04] shadow-[0_0_30px_rgba(255,193,7,0.07)]"
            : "border-white/[0.07] bg-white/[0.02] hover:border-white/[0.12] hover:bg-white/[0.04]"
        }`}
      >
        <button
          type="button"
          onClick={onToggle}
          className="flex w-full items-start gap-4 p-5 sm:p-6 text-left"
          aria-expanded={isOpen}
        >
          <span
            className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[11px] font-black transition-colors duration-300 ${
              isOpen ? "bg-accent text-black" : "bg-white/[0.06] text-gray-500 group-hover:bg-white/10"
            }`}
          >
            {String(index + 1).padStart(2, "0")}
          </span>

          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`font-display text-sm sm:text-base font-bold leading-snug transition-colors duration-300 ${
                  isOpen ? "text-white" : "text-gray-300 group-hover:text-white"
                }`}
              >
                <FormattedText text={item.q} />
              </span>
              {item.category && (
                <span className="rounded border border-accent/20 bg-accent/5 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-accent/80">
                  {item.category}
                </span>
              )}
            </div>
          </div>

          <motion.span
            animate={{ rotate: isOpen ? 45 : 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className={`ml-2 mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border transition-colors duration-300 ${
              isOpen
                ? "border-accent/40 bg-accent/10 text-accent"
                : "border-white/10 text-gray-500 group-hover:border-white/20 group-hover:text-gray-300"
            }`}
            aria-hidden="true"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="h-3.5 w-3.5">
              <path d="M12 5v14M5 12h14" />
            </svg>
          </motion.span>
        </button>

        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.div
              key="answer"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden"
            >
              <div className="px-5 pb-5 pl-[4.25rem] text-sm leading-relaxed text-gray-400 sm:px-6 sm:pb-6 sm:pl-[4.5rem]">
                <FormattedText text={item.a} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Reveal>
  );
}

export default function FAQ() {
  const { content } = useContent();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const rawList = content.faqs && content.faqs.length > 0 ? content.faqs : DEFAULT_FAQS;
  const faqs = rawList.filter((f) => f.active !== false);

  if (faqs.length === 0) return null;

  const toggle = (i: number) => setOpenIndex(openIndex === i ? null : i);

  return (
    <section id="faq" className="relative overflow-hidden py-24 sm:py-32">
      <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-0 h-[600px] w-[700px] -translate-x-1/2 rounded-full bg-accent/[0.03] blur-[130px]" />

      <div className="relative mx-auto w-full max-w-3xl px-6 md:px-10">
        <SectionHeading
          watermark="FAQ"
          title="Frequently Asked"
          subtitle="Everything you might want to know before we start working together."
          direction="down"
          sectionId="faq"
        />

        <div className="mt-4 flex flex-col gap-3">
          {faqs.map((item, i) => (
            <FAQItem
              key={item.id || i}
              item={item}
              index={i}
              isOpen={openIndex === i}
              onToggle={() => toggle(i)}
            />
          ))}
        </div>

        <Reveal direction="up" distance={30} delay={400}>
          <div className="mt-14 flex flex-col items-center gap-2 rounded-2xl border border-white/[0.07] bg-white/[0.02] p-6 text-center sm:p-8">
            <p className="text-sm text-gray-400">
              Still have a question?{" "}
              <a
                href="#contact"
                className="font-bold text-accent underline underline-offset-4 decoration-accent/30 transition-colors hover:text-yellow-300"
              >
                Drop me a message
              </a>{" "}
              and I will get back to you within 24 hours.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
