import { motion } from "framer-motion";
import { useContent } from "../store/content";
import { ArrowRightIcon, ChevronDownIcon, ChipIcon, RobotIcon } from "./Icons";
import Magnetic from "./Magnetic";
import { FormattedText } from "./FormattedText";

function OrbitBadge({ text }: { text: string }) {
  return (
    <svg
      viewBox="0 0 200 200"
      className="h-48 w-48 animate-spin-slow text-accent/70 lg:h-56 lg:w-56"
      aria-hidden="true"
    >
      <defs>
        <path id="orbit-circle" d="M100,100 m-78,0 a78,78 0 1,1 156,0 a78,78 0 1,1 -156,0" />
      </defs>
      <text className="fill-current font-sans text-[13px] font-bold uppercase tracking-[0.2em]">
        <textPath href="#orbit-circle">{text}</textPath>
      </text>
    </svg>
  );
}

/** Static upper-half arc text — sits above the rotating badge, never spins.
 *  `radius` controls how far the text arc is from the centre (default 104).
 *  Text auto-centers on the arc regardless of length. */
function StaticArcText({ text, radius = 104 }: { text: string; radius?: number }) {
  // Keep a small padding so text doesn't clip at the SVG edges
  const pad = 12;
  const size = (radius + pad) * 2;
  const cx = size / 2;
  const cy = size / 2;
  // Upper half-circle arc: left → top → right
  const d = `M ${cx - radius},${cy} A ${radius},${radius} 0 0,1 ${cx + radius},${cy}`;

  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      style={{ width: `${size / 16}rem`, height: `${size / 16}rem` }}
      className="text-accent/55"
      aria-hidden="true"
    >
      <defs>
        <path id="static-arc-top" d={d} />
      </defs>
      <text className="fill-current font-sans text-[11px] font-bold uppercase tracking-[0.22em]">
        <textPath href="#static-arc-top" startOffset="50%" textAnchor="middle">
          {text}
        </textPath>
      </text>
    </svg>
  );
}

export default function Hero() {
  const { content } = useContent();
  const hero = content.hero;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
    },
  };

  return (
    <section id="home" className="relative flex min-h-screen items-center overflow-hidden pt-24 pb-16">
      {/* Top-Left Radiant Golden Glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-16 -top-16 h-[34rem] w-[34rem] rounded-full [background:radial-gradient(circle,rgba(255,193,7,0.12)_0%,transparent_70%)]"
      />
      {/* Top-Center Secondary Glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/4 -top-28 h-[26rem] w-[26rem] rounded-full [background:radial-gradient(circle,rgba(255,193,7,0.08)_0%,transparent_70%)]"
      />
      {/* Right Accent Soft Glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-20 top-1/4 h-[30rem] w-[30rem] rounded-full [background:radial-gradient(circle,rgba(255,193,7,0.06)_0%,transparent_70%)]"
      />

      {/* Background Dot Matrix */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 [background-image:radial-gradient(rgba(255,255,255,0.05)_1px,transparent_1px)] [background-size:28px_28px] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_45%,black,transparent)]"
      />

      <div className="relative z-10 mx-auto grid w-full max-w-7xl items-center gap-14 px-6 py-16 md:px-10 lg:grid-cols-[1.15fr_0.85fr] lg:px-16">
        {/* Left Side: Editorial Typography & Actions */}
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="flex flex-col pr-8 sm:pr-0">
          {/* Greeting Pill */}
          <motion.div variants={itemVariants}>
            <span className="inline-flex items-center gap-2 rounded-full border border-accent/25 bg-accent/5 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.35em] text-accent backdrop-blur-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse shadow-[0_0_8px_rgba(255,193,7,1)]" />
              <FormattedText text={hero.greeting} />
            </span>
          </motion.div>

          {/* Name Headline */}
          <motion.h1
            variants={itemVariants}
            className="mt-6 font-display text-5xl font-extrabold leading-[1.06] text-white sm:text-6xl lg:text-7xl"
          >
            {hero.nameIntro}{" "}
            <span className="relative inline-block text-accent">
              {hero.name}
              <span className="absolute -bottom-1 left-0 right-0 h-[3px] rounded-full bg-gradient-to-r from-accent via-yellow-200 to-transparent opacity-80" />
            </span>
          </motion.h1>

          {/* Primary Role */}
          <motion.p
            variants={itemVariants}
            className="mt-6 font-display text-2xl font-bold text-white sm:text-3xl lg:text-4xl"
          >
            <FormattedText text={hero.roleLine1} />
          </motion.p>

          {/* Subtitle / Bio */}
          <motion.div
            variants={itemVariants}
            className="mt-3 max-w-xl text-base leading-relaxed text-gray-300 md:text-lg"
          >
            <FormattedText text={hero.roleLine2} />
          </motion.div>

          {/* Buttons */}
          <motion.div variants={itemVariants} className="mt-10 flex flex-wrap items-center gap-4">
            {/* Primary "MY WORKS" Button (White Background) */}
            <Magnetic strength={0.3}>
              <motion.a
                href={hero.buttonLink || "#projects"}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full border border-white bg-white px-8 py-3.5 text-xs font-bold uppercase tracking-[0.22em] text-black shadow-[0_0_25px_rgba(255,255,255,0.2)] transition-all duration-300 hover:bg-white hover:shadow-[0_0_40px_rgba(255,255,255,0.4)]"
              >
                <span className="pointer-events-none absolute inset-0 -translate-x-full skew-x-[-20deg] bg-gradient-to-r from-transparent via-black/10 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                <span className="relative z-10 flex items-center gap-2.5">
                  {hero.buttonText}
                  <ArrowRightIcon className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </motion.a>
            </Magnetic>

            {/* Secondary "CONTACT ME" Button */}
            <Magnetic strength={0.3}>
              <motion.a
                href="#contact"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="group inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/[0.03] px-7 py-3.5 text-xs font-bold uppercase tracking-[0.22em] text-white backdrop-blur-sm transition-all duration-300 hover:border-accent hover:text-accent hover:shadow-[0_0_25px_rgba(255,193,7,0.2)]"
              >
                Contact Me
              </motion.a>
            </Magnetic>
          </motion.div>
        </motion.div>

        {/* Right Side: High-Tech 3D Orbital Emblem */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="relative hidden h-[28rem] items-center justify-center lg:flex"
        >
          {/* Subtle Ambient Gold Backlight */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute h-72 w-72 rounded-full [background:radial-gradient(circle,rgba(255,193,7,0.08)_0%,transparent_70%)]"
          />

          {/* Concentric Rings */}
          <div className="absolute inset-0 m-auto h-[24rem] w-[24rem] rounded-full border border-white/5" />
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 m-auto h-[17rem] w-[17rem] rounded-full border border-dashed border-accent/25"
          />

          {/* Orbiting Text Circle */}
          <div className="absolute inset-0 flex items-center justify-center">
            <OrbitBadge text={hero.orbitText} />
          </div>

          {/* Static upper-half arc text — does NOT rotate */}
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <StaticArcText
              text={hero.staticArcText || ""}
              radius={hero.staticArcRadius ?? 104}
            />
          </div>

          {/* Central Code Icon */}
          <span
            className="absolute select-none font-display text-[6.5rem] font-extrabold leading-none text-transparent [-webkit-text-stroke:1.5px_rgba(255,193,7,0.45)] [filter:drop-shadow(0_0_15px_rgba(255,193,7,0.35))]"
          >
            {"</>"}
          </span>

          {/* Floating High-Tech Chips */}
          <motion.span
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            whileHover={{ scale: 1.15, rotate: 6 }}
            className="absolute left-8 top-14 cursor-default rounded-xl border border-white/10 bg-black/70 px-3.5 py-2 font-display text-lg font-bold text-accent shadow-lg backdrop-blur-md transition-colors hover:border-accent"
          >
            {"{ }"}
          </motion.span>

          <motion.span
            animate={{ y: [0, -16, 0] }}
            transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
            whileHover={{ scale: 1.15, rotate: -6 }}
            className="absolute bottom-16 right-10 cursor-default rounded-xl border border-white/10 bg-black/70 px-3.5 py-2 font-display text-lg font-bold text-white/70 shadow-lg backdrop-blur-md transition-colors hover:border-white/30"
          >
            {"( )"}
          </motion.span>

          <motion.span
            animate={{ scale: [1, 1.35, 1], opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="absolute right-24 top-24 h-2.5 w-2.5 rounded-full bg-accent shadow-[0_0_16px_rgba(255,193,7,0.9)]"
          />

          <motion.span
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
            whileHover={{ scale: 1.15 }}
            className="absolute bottom-28 left-5 flex cursor-default flex-col items-center gap-1 rounded-xl border border-white/10 bg-black/70 px-3 py-2 text-accent shadow-lg backdrop-blur-md transition-colors hover:border-accent"
          >
            <ChipIcon className="h-5 w-5" />
            <span className="text-[9px] font-bold uppercase tracking-[0.25em] text-white/60">AI</span>
          </motion.span>

          <motion.span
            animate={{ y: [0, -15, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1.2 }}
            whileHover={{ scale: 1.15 }}
            className="absolute right-3 top-44 flex cursor-default flex-col items-center gap-1 rounded-xl border border-white/10 bg-black/70 px-3 py-2 text-white/70 shadow-lg backdrop-blur-md transition-colors hover:border-white/30"
          >
            <RobotIcon className="h-5 w-5" />
            <span className="text-[9px] font-bold uppercase tracking-[0.25em] text-accent/80">ML</span>
          </motion.span>
        </motion.div>
      </div>



      {/* Scroll Down Indicator */}
      <motion.a
        href="#about"
        aria-label="Scroll to About section"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.32em] text-gray-400 transition-colors hover:text-accent"
      >
        <span>Scroll</span>
        <ChevronDownIcon className="h-4 w-4 text-accent" />
      </motion.a>
    </section>
  );
}
