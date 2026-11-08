import { useEffect, useState } from "react";
import { motion, useScroll } from "framer-motion";
import { ChevronUpIcon } from "./Icons";

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const [showTopBtn, setShowTopBtn] = useState(false);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const shouldShow = window.scrollY > 400;
          setShowTopBtn((prev) => (prev !== shouldShow ? shouldShow : prev));
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    /* Floating Scroll to Top button with circular progress */
    <motion.button
      type="button"
      onClick={scrollToTop}
      aria-label="Back to top"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{
        opacity: showTopBtn ? 1 : 0,
        scale: showTopBtn ? 1 : 0.8,
        pointerEvents: showTopBtn ? "auto" : "none",
      }}
      transition={{ duration: 0.2 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.92 }}
      className="fixed bottom-7 right-7 z-50 flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-black/90 text-white shadow-[0_10px_35px_rgba(0,0,0,0.8)] backdrop-blur-md transition-colors hover:border-accent hover:text-accent hover:shadow-[0_0_20px_rgba(255,193,7,0.35)]"
    >
      <svg className="absolute inset-0 h-full w-full -rotate-90 p-1" viewBox="0 0 36 36">
        <circle
          cx="18"
          cy="18"
          r="16"
          className="stroke-white/10"
          strokeWidth="2.5"
          fill="none"
        />
        <motion.circle
          cx="18"
          cy="18"
          r="16"
          className="stroke-accent"
          strokeWidth="2.5"
          fill="none"
          strokeDasharray="100 100"
          style={{
            pathLength: scrollYProgress,
          }}
        />
      </svg>
      <ChevronUpIcon className="relative z-10 h-4 w-4" />
    </motion.button>
  );
}
