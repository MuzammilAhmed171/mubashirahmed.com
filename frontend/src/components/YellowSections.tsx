import React from "react";
import { motion } from "framer-motion";
import Magnetic from "./Magnetic";
import { useContent } from "../store/content";
import { FormattedText } from "./FormattedText";
import type { CtaContent } from "../data";

/* SVG Icons */
const IconCode = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
    <polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" />
  </svg>
);
const IconBrain = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
    <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.46 2.5 2.5 0 0 1-1.98-3 2.5 2.5 0 0 1-.52-3.28A3 3 0 0 1 6 8a2.5 2.5 0 0 1 3.5-2.5Z" />
    <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.46 2.5 2.5 0 0 0 1.98-3 2.5 2.5 0 0 0 .52-3.28A3 3 0 0 0 18 8a2.5 2.5 0 0 0-3.5-2.5Z" />
  </svg>
);
const IconPenTool = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
    <path d="m12 19 7-7 3 3-7 7-3-3z" /><path d="m18 13-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
    <path d="m2 2 7.586 7.586" /><circle cx="11" cy="11" r="2" />
  </svg>
);
const IconCloud = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
    <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />
  </svg>
);
const IconMobile = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
    <rect width="14" height="20" x="5" y="2" rx="2" ry="2" />
    <path d="M12 18h.01" />
  </svg>
);
const IconChart = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
    <line x1="18" x2="18" y1="20" y2="10" /><line x1="12" x2="12" y1="20" y2="4" />
    <line x1="6" x2="6" y1="20" y2="14" /><line x1="2" x2="22" y1="20" y2="20" />
  </svg>
);

const ICON_MAP: Record<string, React.FC> = {
  code: IconCode,
  brain: IconBrain,
  penTool: IconPenTool,
  cloud: IconCloud,
  mobile: IconMobile,
  chart: IconChart,
};

/* 1. STATS BANNER */
export function StatsBanner() {
  const { content } = useContent();
  const stats = content.stats || [];

  if (stats.length === 0) return null;

  return (
    <section
      data-yellow-section="true"
      className="relative w-full overflow-hidden rounded-[2.5rem] bg-accent py-16 sm:rounded-[4.5rem]"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-[0.055] [background-image:repeating-linear-gradient(45deg,#000_0px,#000_1px,transparent_0px,transparent_50%)] [background-size:8px_8px]" />
      <div className="relative mx-auto max-w-7xl px-6 md:px-10 lg:px-16">
        <div className="grid grid-cols-2 gap-10 sm:grid-cols-4">
          {stats.map((s, i) => (
            <motion.div
              key={s.label || i}
              initial={{ opacity: 0, x: -70 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col items-center gap-2 text-center"
            >
              <span className="font-display text-5xl font-black text-black sm:text-6xl lg:text-7xl">{s.value}</span>
              <span className="text-[11px] font-bold uppercase tracking-[0.28em] text-black/60">{s.label}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* 2. SERVICES STRIP */
export function ServiceStrip() {
  const { content } = useContent();
  const services = content.services || [];

  if (services.length === 0) return null;

  return (
    <section
      data-yellow-section="true"
      className="relative w-full overflow-hidden rounded-[2.5rem] bg-accent sm:rounded-[4.5rem]"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-[0.04] [background-image:repeating-linear-gradient(-55deg,#000_0px,#000_2px,transparent_0,transparent_14px)]" />
      <div className="relative mx-auto max-w-7xl px-6 py-20 md:px-10 lg:px-16">
        <motion.div
          initial={{ opacity: 0, x: -75 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="mb-16 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between"
        >
          <div className="flex flex-col gap-3">
            <span className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.4em] text-black/60">
              <span className="h-px w-6 bg-black/40" />
              {content.settings.sectionWatermarks?.services || "What I Do"}
            </span>
            <h2 className="font-display text-4xl font-black text-black sm:text-5xl">
              {content.settings.sectionNames?.services || "Services I Offer"}
            </h2>
          </div>
          <p className="max-w-xs text-sm font-medium text-black/55 sm:text-right">Full product lifecycle — from wireframe to deployment.</p>
        </motion.div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((svc, i) => {
            const Icon = (svc.icon && ICON_MAP[svc.icon]) ? ICON_MAP[svc.icon] : IconCode;
            const num = svc.num || `0${i + 1}`;
            return (
              <motion.div
                key={svc.title || i}
                initial={{ opacity: 0, x: -60 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.55, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -5, transition: { duration: 0.22 } }}
                className="group relative flex flex-col gap-4 overflow-hidden rounded-3xl border-2 border-black/10 bg-black/[0.06] p-7 transition-colors duration-300 hover:border-black/25 hover:bg-black/[0.11]"
              >
                <span className="absolute right-5 top-5 select-none font-display text-5xl font-black text-black/[0.07]">{num}</span>
                <span className="flex h-11 w-11 items-center justify-center rounded-xl border-2 border-black/20 bg-black/10 text-black transition-all duration-300 group-hover:bg-black group-hover:text-accent group-hover:border-black">
                  <Icon />
                </span>
                <h3 className="font-display text-[15px] font-black leading-snug text-black">
                  <FormattedText text={svc.title} />
                </h3>
                <p className="text-[13px] font-medium leading-relaxed text-black/60">
                  <FormattedText text={svc.desc} />
                </p>
                <span className="absolute bottom-0 left-0 h-[3px] w-0 rounded-full bg-black/30 transition-all duration-500 group-hover:w-full" />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* 3. CTA BANNER */
export function CtaBanner() {
  const { content } = useContent();
  const cta: Partial<CtaContent> = content.cta || {};

  if (!cta.title && !cta.badge) return null;


  const scrollToContact = () => {
    if (cta.buttonLink && cta.buttonLink.startsWith("#")) {
      const id = cta.buttonLink.replace("#", "");
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    } else if (cta.buttonLink) {
      window.location.href = cta.buttonLink;
    } else {
      document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const emailHref = cta.secondaryLink || (content.settings?.email ? `mailto:${content.settings.email}` : "");

  return (
    <section
      data-yellow-section="true"
      className="relative w-full overflow-hidden rounded-[2.5rem] bg-accent py-24 sm:rounded-[4.5rem]"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden">
        <span className="select-none font-display text-[20vw] font-black leading-none text-black/[0.045] sm:text-[13vw]">HIRE ME</span>
      </div>
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-[0.04] [background-image:linear-gradient(to_right,#000_1px,transparent_1px),linear-gradient(to_bottom,#000_1px,transparent_1px)] [background-size:48px_48px]" />
      <div className="relative mx-auto max-w-4xl px-6 text-center md:px-10">
        <motion.div
          initial={{ opacity: 0, x: -80 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col items-center gap-7"
        >
          <span className="inline-flex items-center gap-2 rounded-full border-2 border-black/20 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.4em] text-black/60">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-black/50" />
            {cta.badge}
          </span>
          <h2 className="font-display text-4xl font-black leading-[1.08] text-black sm:text-5xl lg:text-6xl">
            <FormattedText text={cta.title} />
            <span className="relative inline-block">
              <FormattedText text={cta.highlight} />
              <span className="absolute -bottom-1 left-0 right-0 h-[4px] rounded-full bg-black/25" />
            </span>
            <FormattedText text={cta.titleEnd} />
          </h2>
          <p className="max-w-lg text-sm font-medium text-black/60 sm:text-base">
            <FormattedText text={cta.description} />
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-1">
            <Magnetic strength={0.3}>
              <motion.button
                type="button"
                onClick={scrollToContact}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.96 }}
                className="group relative overflow-hidden rounded-full bg-black px-9 py-4 text-xs font-black uppercase tracking-[0.28em] text-accent shadow-[0_8px_30px_rgba(0,0,0,0.4)] transition-all duration-300 hover:shadow-[0_14px_45px_rgba(0,0,0,0.55)]"
              >
                <span className="pointer-events-none absolute inset-0 -translate-x-full skew-x-[-20deg] bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                <span className="relative z-10 flex items-center gap-2">
                  {cta.buttonText || "Start a Project"}
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </span>
              </motion.button>
            </Magnetic>
            <a
              href={emailHref}
              className="inline-flex items-center gap-1.5 text-sm font-bold text-black/65 underline decoration-black/25 underline-offset-4 transition-all duration-200 hover:text-black hover:decoration-black"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                <rect width="20" height="16" x="2" y="4" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
              {cta.secondaryText || "Or just say hi"}
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
