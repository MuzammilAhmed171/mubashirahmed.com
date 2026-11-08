import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";

/* useInView: flips true the first time an element enters the viewport. */
export function useInView<T extends HTMLElement>(threshold = 0.15) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold, rootMargin: "0px 0px -8% 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, inView };
}

import { motion } from "framer-motion";
import Reveal, { type RevealDirection } from "./Reveal";
import { useContent } from "../store/content";
import { FormattedText } from "./FormattedText";
export { Reveal };
export type { RevealDirection };

/* SectionHeading: giant faint watermark behind a solid heading + subtitle + glow underline. */
export function SectionHeading({
  watermark,
  title,
  subtitle,
  direction = "down",
  sectionId,
}: {
  watermark: string;
  title: string;
  subtitle?: string;
  direction?: RevealDirection;
  sectionId?: string;
}) {
  const { content } = useContent();
  const effectiveTitle = (sectionId && content.settings.sectionNames?.[sectionId]) || title;
  const effectiveWatermark = (sectionId && content.settings.sectionWatermarks?.[sectionId]) || watermark;

  return (
    <Reveal direction={direction} distance={30} className="relative mb-16 select-none text-center md:mb-20">
      <motion.span
        aria-hidden="true"
        initial={{ opacity: 0, scale: 0.92 }}
        whileInView={{ opacity: 0.1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.9, ease: "easeOut" }}
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-[58%] whitespace-nowrap font-display text-[24vw] font-extrabold uppercase leading-none tracking-tight text-neutral-500 sm:text-[18vw] lg:text-[10rem]"
      >
        {effectiveWatermark}
      </motion.span>
      <h2 className="relative z-10 font-display text-4xl font-bold text-white sm:text-5xl">
        <FormattedText text={effectiveTitle} />
      </h2>
      <motion.div
        initial={{ width: 0, opacity: 0 }}
        whileInView={{ width: "4rem", opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="mx-auto mt-3 h-1 rounded-full bg-gradient-to-r from-transparent via-accent to-transparent shadow-[0_0_12px_rgba(255,193,7,0.7)]"
      />
      {subtitle ? (
        <p className="relative z-10 mt-4 text-sm text-gray-400 sm:text-base">
          <FormattedText text={subtitle} />
        </p>
      ) : null}
    </Reveal>
  );
}

/* SmartImage: image with a designed fallback when the asset fails. */
export function SmartImage({
  src,
  alt,
  className = "",
  imgClassName = "",
  label = "Preview",
}: {
  src: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  label?: string;
}) {
  const [failed, setFailed] = useState(false);

  return (
    <div className={`relative overflow-hidden bg-neutral-900 ${className}`}>
      {!failed ? (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          onError={() => setFailed(true)}
          className={`h-full w-full object-cover ${imgClassName}`}
        />
      ) : null}
      {failed ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[radial-gradient(circle_at_30%_20%,#232323,#0a0a0a_70%)]">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-10 w-10 text-accent/80"
            aria-hidden="true"
          >
            <path d="m8 7-5 5 5 5" />
            <path d="m16 7 5 5-5 5" />
            <path d="m13.5 4-3 16" />
          </svg>
          <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-gray-500">
            {label}
          </span>
        </div>
      ) : null}
    </div>
  );
}
