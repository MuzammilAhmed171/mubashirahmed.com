import { useEffect, useState } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { useContent } from "../store/content";
import { CloseIcon } from "./Icons";

export default function Navbar() {
  const { content } = useContent();
  const { navLinks, logoFirst, logoSecond, showExperience, showCertifications } = content.settings;

  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("home");
  const [open, setOpen] = useState(false);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const { scrollYProgress } = useScroll();
  const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);

  const isLinkActive = (l: { id: string; label: string; hidden?: boolean }) => {
    if (l.hidden) return false;
    if (content.settings.sectionVisibility?.[l.id] === false) return false;
    if (l.id === "experience" && showExperience === false) return false;
    if (l.id === "certifications" && showCertifications === false) return false;
    return true;
  };

  const activeNavLinks = (navLinks || []).filter(isLinkActive);

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const isScrolled = window.scrollY > 40;
          setScrolled((prev) => (prev !== isScrolled ? isScrolled : prev));
          ticking = false;
        });
        ticking = true;
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const ids = activeNavLinks.map((l) => l.id);
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [activeNavLinks]);

  return (
    <>
      {/* Scroll progress bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 z-[60] h-[2px] origin-left bg-gradient-to-r from-accent via-yellow-300 to-accent shadow-[0_0_12px_rgba(255,193,7,0.8)]"
        style={{ scaleX }}
      />

      {/* Floating Header */}
      <motion.header
        initial={{ y: -70, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="fixed inset-x-0 top-0 z-50 flex justify-center px-4"
      >
        <motion.nav
          layout
          initial={false}
          animate={{
            maxWidth: scrolled ? 760 : 1240,
            marginTop: scrolled ? 14 : 0,
            paddingLeft: scrolled ? 22 : 36,
            paddingRight: scrolled ? 22 : 36,
            paddingTop: scrolled ? 10 : 20,
            paddingBottom: scrolled ? 10 : 20,
            borderRadius: scrolled ? 9999 : 0,
            backgroundColor: scrolled ? "rgba(7, 7, 7, 0.85)" : "transparent",
            borderColor: scrolled ? "rgba(255, 193, 7, 0.25)" : "transparent",
            borderWidth: scrolled ? 1 : 0,
            backdropFilter: scrolled ? "blur(20px)" : "blur(0px)",
            WebkitBackdropFilter: scrolled ? "blur(20px)" : "blur(0px)",
            boxShadow: scrolled
              ? "0 20px 50px rgba(0, 0, 0, 0.8), 0 0 30px rgba(255, 193, 7, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.06)"
              : "none",
          }}
          transition={{
            type: "spring",
            stiffness: 280,
            damping: 28,
            mass: 0.8,
          }}
          className={`mx-auto flex w-full items-center justify-between border-solid transition-[backdrop-filter,background-color] duration-300 ${
            scrolled ? "border backdrop-blur-xl" : "border-0 backdrop-blur-none bg-transparent"
          }`}
        >
          {/* Logo */}
          <motion.a
            href="#home"
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.94 }}
            className="relative z-10 flex shrink-0 items-center gap-1.5 font-display text-xl font-black tracking-tight"
          >
            <span className="text-white">{logoFirst}</span>
            <span className="text-accent">{logoSecond}</span>
            <motion.span
              animate={{ opacity: [1, 0.35, 1], scale: [1, 1.25, 1] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
              className="-mr-1.5 h-1.5 w-1.5 rounded-full bg-accent shadow-[0_0_8px_rgba(255,193,7,1)]"
            />
          </motion.a>

          {/* Desktop Navigation Links */}
          <ul className="hidden items-center gap-1 pl-1.5 md:flex">
            {activeNavLinks.map((link) => {
              const isActive = active === link.id;
              const isHov = hoveredId === link.id;
              return (
                <li key={link.id} className="relative">
                  <motion.a
                    href={`#${link.id}`}
                    onHoverStart={() => setHoveredId(link.id)}
                    onHoverEnd={() => setHoveredId(null)}
                    className="relative block rounded-full px-4 py-2 text-[13px] font-semibold tracking-wide outline-none transition-colors"
                  >
                    {/* Hover Pill */}
                    {isHov && !isActive && (
                      <motion.span
                        layoutId="nav-hov-pill"
                        className="absolute inset-0 rounded-full bg-white/[0.08]"
                        transition={{ type: "spring", stiffness: 450, damping: 35 }}
                      />
                    )}

                    {/* Active Pill */}
                    {isActive && (
                      <motion.span
                        layoutId="nav-act-pill"
                        className="absolute inset-0 rounded-full bg-accent/20 shadow-[inset_0_0_0_1px_rgba(255,193,7,0.35)]"
                        transition={{ type: "spring", stiffness: 450, damping: 35 }}
                      />
                    )}

                    {/* Text */}
                    <motion.span
                      animate={{
                        color: isActive
                          ? "#ffc107"
                          : isHov
                          ? "#ffffff"
                          : "rgba(255,255,255,0.7)",
                      }}
                      transition={{ duration: 0.15 }}
                      className="relative z-10 select-none"
                    >
                      {link.label}
                    </motion.span>

                    {/* Active Dot indicator */}
                    {isActive && (
                      <motion.span
                        layoutId="nav-act-dot"
                        className="absolute bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-accent shadow-[0_0_6px_rgba(255,193,7,1)]"
                        transition={{ type: "spring", stiffness: 500, damping: 35 }}
                      />
                    )}
                  </motion.a>
                </li>
              );
            })}
          </ul>

          {/* CTA Button — Desktop */}
          <motion.a
            href="#contact"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="group relative hidden shrink-0 overflow-hidden rounded-full bg-accent px-5 py-2 text-[11px] font-black uppercase tracking-[0.2em] text-black shadow-[0_0_20px_rgba(255,193,7,0.35)] transition-all duration-300 hover:bg-yellow-300 hover:shadow-[0_0_30px_rgba(255,193,7,0.6)] md:flex md:items-center md:gap-2"
          >
            <span className="pointer-events-none absolute inset-0 -translate-x-full skew-x-[-20deg] bg-gradient-to-r from-transparent via-white/35 to-transparent transition-transform duration-600 group-hover:translate-x-full" />
            <span className="relative z-10">Hire Me</span>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="relative z-10 h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </motion.a>

          {/* Mobile hamburger */}
          <motion.button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-label="Toggle menu"
            whileTap={{ scale: 0.9 }}
            className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/15 text-white transition-colors duration-200 hover:border-accent/60 hover:text-accent md:hidden"
          >
            <AnimatePresence mode="wait">
              {open ? (
                <motion.span
                  key="x"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.18 }}
                >
                  <CloseIcon className="h-4 w-4" />
                </motion.span>
              ) : (
                <motion.span
                  key="hb"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.18 }}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="h-4 w-4">
                    <path d="M4 7h16M4 12h11M4 17h7" />
                  </svg>
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </motion.nav>
      </motion.header>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="mob"
            initial={{ opacity: 0, y: -12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.96 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-x-4 top-[74px] z-40 overflow-hidden rounded-2xl border border-white/10 bg-[#080808]/96 shadow-[0_24px_60px_rgba(0,0,0,0.9)] backdrop-blur-2xl md:hidden"
          >
            <ul className="flex flex-col gap-1 p-3">
              {activeNavLinks.map((link, i) => (
                <motion.li
                  key={link.id}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.2 }}
                >
                  <a
                    href={`#${link.id}`}
                    onClick={() => setOpen(false)}
                    className={`flex items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200 ${
                      active === link.id
                        ? "bg-accent/15 text-accent shadow-[inset_0_0_0_1px_rgba(255,193,7,0.3)]"
                        : "text-white/70 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <span>{link.label}</span>
                    {active === link.id && (
                      <span className="h-1.5 w-1.5 rounded-full bg-accent shadow-[0_0_8px_rgba(255,193,7,1)]" />
                    )}
                  </a>
                </motion.li>
              ))}
              <li className="pt-2 px-1 pb-1">
                <a
                  href="#contact"
                  onClick={() => setOpen(false)}
                  className="block w-full rounded-xl bg-accent py-3 text-center text-xs font-black uppercase tracking-[0.22em] text-black transition-all duration-200 hover:bg-yellow-300"
                >
                  Hire Me
                </a>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
