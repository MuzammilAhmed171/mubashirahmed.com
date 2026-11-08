import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useContent } from "../store/content";
import { SOCIAL_ICON_MAP, GlobeIcon } from "./Icons";

export default function FloatingSocialDock() {
  const { content } = useContent();
  const socials = content.socials ?? [];
  const activeSocials = socials.filter((s) => s.active && s.url.trim().length > 0);

  const [isOverYellow, setIsOverYellow] = useState(false);

  useEffect(() => {
    const yellowElements = document.querySelectorAll("[data-yellow-section='true']");
    if (yellowElements.length === 0) return;

    const visibleSet = new Set<Element>();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            visibleSet.add(entry.target);
          } else {
            visibleSet.delete(entry.target);
          }
        });
        setIsOverYellow(visibleSet.size > 0);
      },
      { rootMargin: "-35% 0px -35% 0px" }
    );

    yellowElements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  if (activeSocials.length === 0) return null;

  return (
    <motion.aside
      initial={{ x: 70, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
      aria-label="Social Profiles"
      className="fixed right-0 top-1/2 z-40 -translate-y-1/2 hidden sm:block"
    >
      {/* Floating Dock Body with Dynamic Color Adaptation */}
      <motion.div
        animate={{
          backgroundColor: isOverYellow ? "#0d0d0d" : "#FFC107",
          borderColor: isOverYellow ? "rgba(255, 193, 7, 0.6)" : "rgba(254, 240, 138, 0.7)",
        }}
        transition={{ duration: 0.35, ease: "easeInOut" }}
        className={`relative flex flex-col items-center gap-2.5 sm:gap-3 rounded-l-2xl sm:rounded-l-3xl border-y border-l px-2 py-3.5 sm:px-2.5 sm:py-4.5 transition-shadow duration-300 ${
          isOverYellow
            ? "shadow-[-10px_0_40px_rgba(0,0,0,0.85),0_12px_30px_rgba(0,0,0,0.9)] ring-1 ring-black/40"
            : "shadow-[-8px_0_30px_rgba(255,193,7,0.4),0_10px_25px_rgba(0,0,0,0.55)]"
        }`}
      >
        {/* Top Pip Indicator */}
        <span
          className={`h-1.5 w-1.5 rounded-full transition-colors duration-300 ${
            isOverYellow ? "bg-accent/80 shadow-[0_0_8px_rgba(255,193,7,0.8)]" : "bg-black/40"
          }`}
        />

        {/* Active Social Links */}
        <div className="flex flex-col items-center gap-2 sm:gap-2.5">
          {activeSocials.map((item) => {
            const Icon = (SOCIAL_ICON_MAP as Record<string, any>)[item.platform] ?? GlobeIcon;
            const isMail = item.url.startsWith("mailto:");

            return (
              <a
                key={item.id}
                href={item.url}
                target={isMail ? undefined : "_blank"}
                rel="noopener noreferrer"
                aria-label={item.label}
                className={`group/link relative flex h-8 w-8 sm:h-8.5 sm:w-8.5 items-center justify-center rounded-lg transition-all duration-200 active:scale-95 ${
                  isOverYellow
                    ? "text-accent hover:text-yellow-300 hover:bg-white/10"
                    : "text-black hover:text-black/75 hover:bg-black/10"
                }`}
              >
                <Icon className="h-4 w-4 sm:h-4.5 sm:w-4.5 transition-transform duration-200 group-hover/link:scale-125 group-hover/link:rotate-6" />

                {/* Left Floating Tooltip */}
                <span
                  role="tooltip"
                  className={`pointer-events-none absolute right-full top-1/2 mr-3 -translate-y-1/2 whitespace-nowrap rounded-md px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider opacity-0 shadow-2xl backdrop-blur-md transition-all duration-200 group-hover/link:-translate-x-1 group-hover/link:opacity-100 ${
                    isOverYellow
                      ? "border border-black/40 bg-accent text-black font-black"
                      : "border border-accent/40 bg-black/95 text-accent"
                  }`}
                >
                  {item.label}
                  {/* Tooltip triangle arrow */}
                  <span
                    className={`absolute left-full top-1/2 -translate-y-1/2 border-4 border-transparent ${
                      isOverYellow ? "border-l-accent" : "border-l-black/95"
                    }`}
                  />
                </span>
              </a>
            );
          })}
        </div>

        {/* Bottom Pip Indicator */}
        <span
          className={`h-1.5 w-1.5 rounded-full transition-colors duration-300 ${
            isOverYellow ? "bg-accent/80 shadow-[0_0_8px_rgba(255,193,7,0.8)]" : "bg-black/40"
          }`}
        />
      </motion.div>
    </motion.aside>
  );
}
