import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Testimonial } from "../data";
import { useContent } from "../store/content";
import { CheckIcon, ChevronLeftIcon, ChevronRightIcon, PlayIcon, StarIcon } from "./Icons";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";

/** Detects YouTube / Vimeo links so they can be embedded cleanly. */
function parseVideo(url?: string): { type: "iframe" | "video"; src: string } | null {
  if (!url || !url.trim()) return null;
  const trimmed = url.trim();
  const yt = trimmed.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{6,})/);
  if (yt) return { type: "iframe", src: `https://www.youtube.com/embed/${yt[1]}?autoplay=1&rel=0` };
  const vm = trimmed.match(/vimeo\.com\/(\d+)/);
  if (vm) return { type: "iframe", src: `https://player.vimeo.com/video/${vm[1]}?autoplay=1` };
  return { type: "video", src: trimmed };
}

/** Audio Wave Visualizer Micro-animation */
function SoundWave({ isPlaying }: { isPlaying?: boolean }) {
  return (
    <div className="flex items-end gap-1 h-5" aria-hidden="true">
      {[0.4, 0.8, 0.5, 1, 0.6, 0.9, 0.3].map((height, i) => (
        <motion.span
          key={i}
          animate={
            isPlaying
              ? { scaleY: [height * 0.4, height, height * 0.3, height * 0.9] }
              : { scaleY: [0.3, 0.5, 0.3] }
          }
          transition={{
            duration: 0.8 + (i % 3) * 0.2,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
          }}
          className="w-0.5 origin-bottom rounded-full bg-accent/70"
          style={{ height: "100%" }}
        />
      ))}
    </div>
  );
}

/** Full-Screen Cinema Video Modal */
function VideoModal({
  testimonial,
  onClose,
}: {
  testimonial: Testimonial;
  onClose: () => void;
}) {
  const embed = parseVideo(testimonial.video);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 lg:p-10">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/90 backdrop-blur-2xl"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative z-10 w-full max-w-4xl overflow-hidden rounded-3xl border border-accent/30 bg-neutral-950 p-2 sm:p-4 shadow-[0_25px_100px_rgba(255,193,7,0.15)]"
        >
          {/* Header Bar */}
          <div className="flex items-center justify-between px-3 py-2 border-b border-white/10 mb-3">
            <div className="flex items-center gap-3">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-accent text-[11px] font-black text-black">
                {testimonial.initials}
              </span>
              <div>
                <p className="font-display text-sm font-bold text-white">{testimonial.name}</p>
                <p className="text-[11px] text-gray-400">{testimonial.role}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-white/20 text-gray-400 transition-colors hover:border-white hover:text-white"
              aria-label="Close modal"
            >
              ✕
            </button>
          </div>

          {/* Media Player */}
          <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-black">
            {embed ? (
              embed.type === "iframe" ? (
                <iframe
                  src={embed.src}
                  title={`Video testimonial from ${testimonial.name}`}
                  className="h-full w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <video
                  src={embed.src}
                  controls
                  autoPlay
                  playsInline
                  className="h-full w-full object-contain"
                >
                  Your browser does not support the video tag.
                </video>
              )
            ) : (
              <div className="flex h-full w-full flex-col items-center justify-center gap-4 bg-[radial-gradient(circle_at_50%_40%,#262626,#070707_80%)] p-8 text-center">
                <span className="flex h-16 w-16 items-center justify-center rounded-full border border-accent/40 bg-accent/10 font-display text-2xl font-black text-accent shadow-[0_0_30px_rgba(255,193,7,0.25)]">
                  {testimonial.initials}
                </span>
                <p className="max-w-md font-display text-base font-bold text-white">
                  &ldquo;{testimonial.quote}&rdquo;
                </p>
                <p className="text-xs text-gray-400">
                  Client video recording is currently archived. Full verified project case study is available upon request.
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

export default function Testimonials() {
  const { content } = useContent();
  const rawList = content.testimonials ? content.testimonials.filter((t) => !t.hidden) : [];

  if (rawList.length === 0) return null;

  const [activeIndex, setActiveIndex] = useState(0);
  const [activeModal, setActiveModal] = useState<Testimonial | null>(null);
  const [viewMode, setViewMode] = useState<"spotlight" | "grid">("spotlight");
  const [isPlayingInline, setIsPlayingInline] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const testimonials = rawList;
  const count = testimonials.length;
  const activeItem = count > 0 ? testimonials[Math.min(activeIndex, count - 1)] : null;
  const embed = activeItem ? parseVideo(activeItem.video) : null;

  // Auto-rotate spotlight when not paused or playing
  useEffect(() => {
    if (isPaused || isPlayingInline || viewMode !== "spotlight" || count <= 1) return;
    const timer = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % count);
    }, 8000);
    return () => window.clearInterval(timer);
  }, [isPaused, isPlayingInline, viewMode, count]);

  // Reset inline player when active item changes
  useEffect(() => {
    setIsPlayingInline(false);
  }, [activeIndex]);

  const goNext = () => setActiveIndex((prev) => (prev + 1) % count);
  const goPrev = () => setActiveIndex((prev) => (prev - 1 + count) % count);

  return (
    <section id="testimonials" className="relative overflow-hidden py-24 sm:py-32">
      {/* Golden Ambient Blur Glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-36 top-24 h-[500px] w-[500px] rounded-full bg-accent/[0.04] blur-[150px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-36 bottom-24 h-[500px] w-[500px] rounded-full bg-accent/[0.03] blur-[150px]"
      />

      <div className="relative mx-auto w-full max-w-7xl px-6 md:px-10 lg:px-16">
        {/* Section Heading */}
        <SectionHeading
          watermark="TESTIMONIALS"
          title="Client Stories & Testimonials"
          subtitle="Watch and hear real founders, CTOs and product teams talk about their results."
        />

        {/* Trust Badges Strip & Layout View Switcher */}
        <Reveal direction="down" distance={20} delay={150}>
          <div className="mb-12 flex flex-wrap items-center justify-between gap-4 border-b border-white/[0.07] pb-6">
            {/* Trust highlights */}
            <div className="flex flex-wrap items-center gap-4 sm:gap-8">
              <div className="flex items-center gap-2">
                <span className="flex text-accent">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <StarIcon key={n} className="h-4 w-4 fill-accent text-accent" />
                  ))}
                </span>
                <span className="font-display text-sm font-bold text-white">5.0 / 5.0</span>
                <span className="text-xs text-gray-500">Client Rating</span>
              </div>

              <div className="hidden h-4 w-px bg-white/10 sm:block" />

              <div className="flex items-center gap-2 text-xs font-semibold text-gray-300">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400">
                  <CheckIcon className="h-3 w-3" />
                </span>
                <span>100% Verified Delivery</span>
              </div>

              <div className="hidden h-4 w-px bg-white/10 md:block" />

              <div className="hidden text-xs text-gray-400 md:block">
                <span>{count} Client Stories</span>
              </div>
            </div>

            {/* View Mode Switcher */}
            <div className="flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.02] p-1">
              <button
                type="button"
                onClick={() => setViewMode("spotlight")}
                className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold transition-all ${
                  viewMode === "spotlight"
                    ? "bg-accent text-black shadow-[0_0_15px_rgba(255,193,7,0.35)]"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3.5 w-3.5">
                  <circle cx="12" cy="12" r="10" />
                  <polygon points="10 8 16 12 10 16 10 8" fill="currentColor" />
                </svg>
                Spotlight
              </button>
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold transition-all ${
                  viewMode === "grid"
                    ? "bg-accent text-black shadow-[0_0_15px_rgba(255,193,7,0.35)]"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3.5 w-3.5">
                  <rect x="3" y="3" width="7" height="7" rx="1" />
                  <rect x="14" y="3" width="7" height="7" rx="1" />
                  <rect x="14" y="14" width="7" height="7" rx="1" />
                  <rect x="3" y="14" width="7" height="7" rx="1" />
                </svg>
                Grid
              </button>
            </div>
          </div>
        </Reveal>

        {testimonials.length === 0 ? (
          <p className="text-center text-sm text-gray-500 py-12">
            No testimonials added yet. Add them from the admin panel.
          </p>
        ) : viewMode === "spotlight" && activeItem ? (
          /* ============================================================ */
          /*  SPOTLIGHT CINEMA EXPERIENCE                                  */
          /* ============================================================ */
          <div
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            className="space-y-8"
          >
            {/* Large Cinema Showcase Card */}
            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.035] via-white/[0.015] to-black/80 p-6 sm:p-8 lg:p-10 shadow-[0_20px_80px_rgba(0,0,0,0.6)] backdrop-blur-xl transition-all duration-300 hover:border-accent/30">
              {/* Subtle gold top glow line */}
              <div className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-accent/40 to-transparent" />

              <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-12">
                {/* ---------------- Video / Media Theatre Frame (5 cols) ---------------- */}
                <div className="lg:col-span-5">
                  <div className="group relative aspect-[16/10] sm:aspect-video lg:aspect-[4/3] w-full overflow-hidden rounded-2xl border border-white/15 bg-neutral-950 shadow-2xl transition-all duration-300 hover:border-accent/40">
                    {/* If user clicked play inline and has embed */}
                    {isPlayingInline && embed ? (
                      embed.type === "iframe" ? (
                        <iframe
                          src={`${embed.src}?autoplay=1`}
                          title={`Video testimonial from ${activeItem.name}`}
                          className="h-full w-full"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      ) : (
                        <video
                          src={embed.src}
                          controls
                          autoPlay
                          playsInline
                          className="h-full w-full object-cover"
                        />
                      )
                    ) : (
                      /* Video Poster / Interactive Preview */
                      <div className="relative h-full w-full bg-[radial-gradient(circle_at_40%_30%,#262626,#0c0c0c_85%)]">
                        {/* Decorative Large Watermark Initials */}
                        <span
                          aria-hidden="true"
                          className="pointer-events-none absolute right-4 top-2 font-display text-8xl font-black text-white/[0.04] transition-colors duration-500 group-hover:text-accent/[0.08]"
                        >
                          {activeItem.initials}
                        </span>

                        {/* Top Badges */}
                        <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
                          <span className="flex items-center gap-1.5 rounded-full border border-white/15 bg-black/60 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-accent backdrop-blur-md">
                            <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
                            Client Story
                          </span>

                          <span className="rounded-full border border-white/10 bg-black/60 px-2.5 py-1 text-[10px] font-semibold tracking-wider text-gray-300 backdrop-blur-md">
                            ▶ {activeItem.duration || "0:45"}
                          </span>
                        </div>

                        {/* Center Animated Play Button */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                          <button
                            type="button"
                            onClick={() => {
                              if (embed) setActiveModal(activeItem);
                              else setIsPlayingInline(true);
                            }}
                            className="group/btn relative flex h-20 w-20 items-center justify-center rounded-full transition-transform duration-300 hover:scale-110 focus:outline-none"
                            aria-label={`Watch testimonial from ${activeItem.name}`}
                          >
                            {/* Outer pulsing gold ring */}
                            <span className="absolute inset-0 rounded-full bg-accent/20 animate-ping opacity-60" />
                            {/* Middle glow ring */}
                            <span className="absolute inset-0 rounded-full border border-accent/40 bg-accent/10 backdrop-blur-sm" />
                            {/* Inner button */}
                            <span className="relative flex h-14 w-14 items-center justify-center rounded-full bg-accent text-black shadow-[0_0_30px_rgba(255,193,7,0.5)] transition-all group-hover/btn:bg-yellow-300">
                              <PlayIcon className="h-6 w-6 ml-1" />
                            </span>
                          </button>

                          <p className="text-[11px] font-semibold tracking-wider text-gray-400 group-hover:text-white transition-colors">
                            {embed ? "Click to Watch in Cinema Mode" : "Verified Client Experience"}
                          </p>
                        </div>

                        {/* Bottom Strip inside thumbnail */}
                        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between z-10">
                          <span className="rounded-md bg-black/70 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-accent/90 border border-accent/20 backdrop-blur-sm">
                            {activeItem.project}
                          </span>
                          <SoundWave isPlaying={!isPaused} />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* ---------------- Narrative & Client Quotes (7 cols) ---------------- */}
                <div className="lg:col-span-7 flex flex-col justify-between">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeItem.id || activeIndex}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -15 }}
                      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                      className="space-y-6"
                    >
                      {/* Rating & Project Badge */}
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <span className="flex text-accent">
                            {[1, 2, 3, 4, 5].map((n) => (
                              <StarIcon
                                key={n}
                                className={`h-4 w-4 ${
                                  n <= activeItem.rating ? "fill-accent text-accent" : "text-gray-700"
                                }`}
                              />
                            ))}
                          </span>
                          <span className="font-display text-xs font-bold text-accent">
                            {activeItem.rating}.0 / 5.0
                          </span>
                        </div>

                        <span className="flex items-center gap-1.5 rounded-full border border-accent/30 bg-accent/5 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-accent">
                          <CheckIcon className="h-3 w-3" />
                          Verified Client
                        </span>
                      </div>

                      {/* Main Big Quote */}
                      <div className="relative">
                        <svg
                          className="absolute -top-4 -left-3 h-12 w-12 text-accent/15 -z-0"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                        </svg>
                        <blockquote className="relative z-10 font-display text-lg sm:text-xl lg:text-2xl font-bold leading-relaxed text-white">
                          &ldquo;{activeItem.quote}&rdquo;
                        </blockquote>
                      </div>

                      {/* Client Bio Strip */}
                      <div className="flex items-center justify-between border-t border-white/10 pt-6">
                        <div className="flex items-center gap-4">
                          <div className="flex h-13 w-13 shrink-0 items-center justify-center rounded-2xl border border-accent/40 bg-gradient-to-br from-neutral-900 to-neutral-800 font-display text-base font-black text-accent shadow-[0_0_20px_rgba(255,193,7,0.15)]">
                            {activeItem.initials}
                          </div>
                          <div>
                            <h4 className="font-display text-base font-bold text-white">
                              {activeItem.name}
                            </h4>
                            <p className="text-xs text-gray-400">{activeItem.role}</p>
                            <p className="mt-0.5 text-[11px] font-semibold text-accent/90">
                              Project: {activeItem.project}
                            </p>
                          </div>
                        </div>

                        {/* Navigation Arrows & Counter */}
                        <div className="flex items-center gap-3">
                          <span className="font-display text-xs font-bold text-gray-500 hidden sm:inline">
                            <span className="text-accent">{String(activeIndex + 1).padStart(2, "0")}</span>
                            {" / "}
                            {String(count).padStart(2, "0")}
                          </span>

                          <div className="flex gap-1.5">
                            <button
                              type="button"
                              onClick={goPrev}
                              aria-label="Previous testimonial"
                              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/[0.04] text-gray-300 transition-all hover:border-accent hover:bg-accent hover:text-black"
                            >
                              <ChevronLeftIcon className="h-4 w-4" />
                            </button>
                            <button
                              type="button"
                              onClick={goNext}
                              aria-label="Next testimonial"
                              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/[0.04] text-gray-300 transition-all hover:border-accent hover:bg-accent hover:text-black"
                            >
                              <ChevronRightIcon className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </div>

            {/* Interactive Carousel Thumbnails Selector */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {testimonials.map((t, idx) => {
                const isActive = idx === activeIndex;
                return (
                  <button
                    key={t.id || idx}
                    type="button"
                    onClick={() => setActiveIndex(idx)}
                    className={`relative flex flex-col justify-between overflow-hidden rounded-2xl border p-4 text-left transition-all duration-300 ${
                      isActive
                        ? "border-accent bg-accent/[0.06] shadow-[0_0_25px_rgba(255,193,7,0.1)] -translate-y-1"
                        : "border-white/[0.08] bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]"
                    }`}
                  >
                    {/* Top row */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <div className="flex items-center gap-2.5">
                        <span
                          className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-black transition-colors ${
                            isActive
                              ? "bg-accent text-black shadow-[0_0_15px_rgba(255,193,7,0.4)]"
                              : "bg-white/10 text-gray-300"
                          }`}
                        >
                          {t.initials}
                        </span>
                        <div className="min-w-0">
                          <p
                            className={`truncate text-xs font-bold font-display ${
                              isActive ? "text-accent" : "text-white"
                            }`}
                          >
                            {t.name}
                          </p>
                          <p className="truncate text-[10px] text-gray-500">{t.project}</p>
                        </div>
                      </div>

                      <span className="shrink-0 text-[10px] font-semibold text-gray-400">
                        {t.duration}
                      </span>
                    </div>

                    {/* Preview quote line */}
                    <p className="line-clamp-2 text-xs italic text-gray-400 leading-snug">
                      &ldquo;{t.quote}&rdquo;
                    </p>

                    {/* Active Golden Progress Bar */}
                    {isActive && (
                      <motion.div
                        layoutId="activeTabGlow"
                        className="absolute bottom-0 left-0 right-0 h-1 bg-accent"
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          /* ============================================================ */
          /*  GRID VIEW DISPLAY                                            */
          /* ============================================================ */
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((t, idx) => {
              const itemEmbed = parseVideo(t.video);
              return (
                <Reveal key={t.id || idx} delay={idx * 100}>
                  <article className="group flex h-full flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-white/[0.025] transition-all duration-300 hover:-translate-y-1.5 hover:border-accent/40 hover:shadow-[0_20px_50px_rgba(255,193,7,0.08)]">
                    {/* Media Area */}
                    <div className="relative aspect-video w-full overflow-hidden border-b border-white/10 bg-[radial-gradient(circle_at_30%_30%,#262626,#0c0c0c_80%)]">
                      <span
                        aria-hidden="true"
                        className="absolute left-3 top-2 font-display text-7xl font-black text-white/[0.04] group-hover:text-accent/[0.08] transition-colors"
                      >
                        {t.initials}
                      </span>

                      <button
                        type="button"
                        onClick={() => setActiveModal(t)}
                        className="absolute inset-0 flex items-center justify-center group-hover:scale-105 transition-transform"
                        aria-label={`Watch testimonial from ${t.name}`}
                      >
                        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-accent text-black shadow-[0_0_30px_rgba(255,193,7,0.4)]">
                          <PlayIcon className="h-6 w-6 ml-1" />
                        </span>
                      </button>

                      <div className="absolute top-3 left-3 rounded-md bg-black/70 px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-accent backdrop-blur-sm">
                        {t.project}
                      </div>

                      <div className="absolute bottom-3 right-3 rounded-md bg-black/70 px-2 py-0.5 text-[10px] font-semibold text-gray-300 backdrop-blur-sm">
                        ▶ {t.duration}
                      </div>
                    </div>

                    {/* Content Area */}
                    <div className="flex grow flex-col p-6">
                      <div className="flex items-center gap-1 text-accent mb-3">
                        {[1, 2, 3, 4, 5].map((n) => (
                          <StarIcon
                            key={n}
                            className={`h-3.5 w-3.5 ${
                              n <= t.rating ? "fill-accent text-accent" : "text-gray-700"
                            }`}
                          />
                        ))}
                        <span className="ml-1 text-xs font-bold text-accent">{t.rating}.0</span>
                      </div>

                      <blockquote className="grow text-sm italic leading-relaxed text-gray-300">
                        &ldquo;{t.quote}&rdquo;
                      </blockquote>

                      <div className="mt-6 flex items-center justify-between border-t border-white/5 pt-4">
                        <div className="flex items-center gap-3">
                          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-accent/40 bg-accent/10 font-display text-xs font-black text-accent">
                            {t.initials}
                          </span>
                          <div className="min-w-0">
                            <p className="truncate font-display text-xs font-bold text-white">
                              {t.name}
                            </p>
                            <p className="truncate text-[11px] text-gray-500">{t.role}</p>
                          </div>
                        </div>

                        <span className="shrink-0 flex items-center gap-1 rounded-full border border-accent/30 bg-accent/5 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-accent">
                          <CheckIcon className="h-2.5 w-2.5" />
                          Verified
                        </span>
                      </div>
                    </div>
                  </article>
                </Reveal>
              );
            })}
          </div>
        )}
      </div>

      {/* Cinema Modal */}
      {activeModal && (
        <VideoModal testimonial={activeModal} onClose={() => setActiveModal(null)} />
      )}
    </section>
  );
}
