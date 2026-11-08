import { useCallback, useEffect, useState, type TouchEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useContent } from "../store/content";
import type { Project } from "../data";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  CloseIcon,
  ExpandIcon,
  ExternalLinkIcon,
  StarIcon,
} from "./Icons";
import { Reveal, SectionHeading, SmartImage } from "./ui";
import TiltCard from "./TiltCard";
import Magnetic from "./Magnetic";
import { FormattedText } from "./FormattedText";

/* ─── Project Card Component ─────────────────────────────────────────── */

function ProjectCard({
  project,
  index,
  onOpen,
  spotlight = false,
}: {
  project: Project;
  index: number;
  onOpen: (p: Project) => void;
  spotlight?: boolean;
}) {
  const formattedIndex = String(index + 1).padStart(2, "0");

  if (spotlight) {
    /* ─── Executive Spotlight Billboard (Single project layout) ─── */
    return (
      <Reveal direction="scale" delay={100} duration={0.7} className="w-full">
        <TiltCard className="w-full rounded-3xl">
          <article className="group relative overflow-hidden rounded-3xl border border-accent/40 bg-gradient-to-b from-[#141414] via-[#0e0e0e] to-[#080808] p-1 shadow-[0_25px_60px_rgba(0,0,0,0.85),0_0_40px_rgba(255,193,7,0.15)] transition-all duration-500 hover:border-accent hover:shadow-[0_30px_70px_rgba(0,0,0,0.9),0_0_55px_rgba(255,193,7,0.22)]">
            {/* Top Amber Accent Beam */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 top-0 z-30 h-[2px] bg-gradient-to-r from-transparent via-accent to-transparent opacity-80"
            />

            {/* Inner Content Grid */}
            <div className="flex flex-col lg:flex-row lg:items-stretch">
              {/* Left Column: Interactive App Window Frame */}
              <div className="flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#090909] lg:w-[58%]">
                {/* Browser Title Bar */}
                <div className="flex items-center justify-between border-b border-white/10 bg-[#121212] px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-red-500/80 transition-transform group-hover:scale-110" />
                    <span className="h-3 w-3 rounded-full bg-amber-400/80 transition-transform group-hover:scale-110" />
                    <span className="h-3 w-3 rounded-full bg-emerald-400/80 transition-transform group-hover:scale-110" />
                  </div>
                  <div className="font-mono text-xs font-bold text-accent">
                    #{formattedIndex}
                  </div>
                </div>

                {/* Screenshot Interactive Container */}
                <button
                  type="button"
                  onClick={() => onOpen(project)}
                  aria-label={`Open screenshots for ${project.title}`}
                  className="group/img relative block h-full w-full cursor-pointer overflow-hidden text-left focus-visible:outline-2 focus-visible:outline-accent"
                >
                  <SmartImage
                    src={project.gallery[0]}
                    alt={`${project.title} screenshot`}
                    label={project.title}
                    className="aspect-[16/10] w-full lg:h-full"
                    imgClassName="transition-transform duration-700 ease-out group-hover/img:scale-105"
                  />

                  {/* Hover Quicklook Overlay */}
                  <span className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 backdrop-blur-sm transition-all duration-300 group-hover/img:opacity-100">
                    <span className="flex items-center gap-2 rounded-full border border-accent bg-black/90 px-5 py-2.5 text-xs font-black uppercase tracking-wider text-accent shadow-[0_0_25px_rgba(255,193,7,0.4)] transition-transform duration-300 group-hover/img:scale-105">
                      <ExpandIcon className="h-4 w-4" />
                      Explore {project.gallery.length} Screenshots
                    </span>
                  </span>

                  {/* Live Status Pill */}
                  <div className="absolute left-4 top-4 z-20 flex items-center gap-2 rounded-full border border-emerald-500/30 bg-black/85 px-3 py-1 text-[11px] font-bold text-emerald-400 shadow-lg backdrop-blur-md">
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                    </span>
                    LIVE PRODUCTION SYSTEM
                  </div>

                  <span className="absolute bottom-4 right-4 rounded-full border border-white/15 bg-black/85 px-3 py-1 text-xs font-bold uppercase tracking-wider text-white backdrop-blur-md">
                    {project.gallery.length} Screenshots
                  </span>
                </button>
              </div>

              {/* Right Column: Project Dossier */}
              <div className="flex flex-col justify-between p-7 lg:w-[42%] lg:p-10">
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-accent/40 bg-accent/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-accent">
                      <StarIcon className="h-3 w-3 text-accent" />
                      TOP FEATURED SPOTLIGHT
                    </span>
                    <span className="font-mono text-xs font-semibold text-gray-500">
                      FLAGSHIP BUILD
                    </span>
                  </div>

                  <h3
                    onClick={() => onOpen(project)}
                    className="mt-4 cursor-pointer font-display text-2xl font-black text-white transition-colors duration-200 hover:text-accent sm:text-3xl"
                  >
                    {project.title}
                  </h3>

                  <div className="mt-4 text-sm leading-relaxed text-gray-300 sm:text-base">
                    <FormattedText text={project.description} />
                  </div>

                  {/* Highlights Grid */}
                  <div className="mt-6 grid grid-cols-2 gap-3 border-y border-white/10 py-5">
                    <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3">
                      <span className="block text-[10px] font-mono uppercase text-gray-500">Architecture</span>
                      <span className="font-semibold text-xs text-white">Full-Stack MERN</span>
                    </div>
                    <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3">
                      <span className="block text-[10px] font-mono uppercase text-gray-500">Experience</span>
                      <span className="font-semibold text-xs text-white">Pixel-Perfect UX</span>
                    </div>
                  </div>

                  {/* Tech Stack Chips */}
                  <div className="mt-5">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-gray-500">Technologies Used:</span>
                    <ul className="mt-2.5 flex flex-wrap gap-2">
                      {project.stack.map((tech) => (
                        <li
                          key={tech}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-accent/20 bg-accent/[0.05] px-3 py-1 text-xs font-semibold text-white/90 transition-colors hover:border-accent hover:text-accent"
                        >
                          <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                          {tech.toUpperCase()}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Primary Action Buttons */}
                <div className="mt-8 flex flex-wrap items-center gap-4 pt-4">
                  <Magnetic strength={0.25}>
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2.5 rounded-full bg-accent px-6 py-3 text-xs font-black uppercase tracking-[0.18em] text-black shadow-[0_0_25px_rgba(255,193,7,0.4)] transition-all duration-300 hover:scale-105 hover:bg-yellow-300 hover:shadow-[0_0_35px_rgba(255,193,7,0.65)]"
                    >
                      <ExternalLinkIcon className="h-4 w-4" />
                      Launch Live Demo
                    </a>
                  </Magnetic>

                  <Magnetic strength={0.25}>
                    <button
                      type="button"
                      onClick={() => onOpen(project)}
                      className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/[0.05] px-5 py-3 text-xs font-bold uppercase tracking-[0.16em] text-white backdrop-blur-md transition-all duration-300 hover:border-accent hover:text-accent hover:shadow-[0_0_20px_rgba(255,193,7,0.2)]"
                    >
                      <ExpandIcon className="h-4 w-4" />
                      View Screenshots
                    </button>
                  </Magnetic>
                </div>
              </div>
            </div>
          </article>
        </TiltCard>
      </Reveal>
    );
  }

  /* ─── Standard Grid Card ─── */
  return (
    <Reveal direction="flip-up" delay={index * 70} className="h-full">
      <TiltCard className="h-full rounded-2xl">
        <article
          className={`group relative flex h-full flex-col overflow-hidden rounded-2xl border bg-gradient-to-b from-[#141414] via-[#0d0d0d] to-[#080808] transition-all duration-300 hover:border-accent/60 hover:shadow-[0_20px_50px_rgba(0,0,0,0.85),0_0_30px_rgba(255,193,7,0.15)] ${
            project.featured ? "border-accent/35" : "border-white/10"
          }`}
        >
          {/* Top Golden Accent Line on hover */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 z-20 h-[2px] bg-gradient-to-r from-transparent via-accent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          />

          {/* Browser / App Header Mockup */}
          <div className="flex items-center justify-between border-b border-white/[0.08] bg-[#111111]/90 px-3.5 py-2.5 backdrop-blur-md">
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-red-500/80 transition-transform group-hover:scale-110" />
              <span className="h-2.5 w-2.5 rounded-full bg-amber-400/80 transition-transform group-hover:scale-110" />
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/80 transition-transform group-hover:scale-110" />
            </div>

            <div className="font-mono text-[11px] font-bold text-accent">
              #{formattedIndex}
            </div>
          </div>

          {/* Image Showcase */}
          <button
            type="button"
            onClick={() => onOpen(project)}
            aria-label={`Open screenshot gallery for ${project.title}`}
            className="group/img relative block w-full cursor-pointer overflow-hidden text-left focus-visible:outline-2 focus-visible:outline-accent"
          >
            <SmartImage
              src={project.gallery[0]}
              alt={`${project.title} screenshot`}
              label={project.title}
              className="aspect-[16/10] w-full"
              imgClassName="transition-transform duration-700 ease-out group-hover/img:scale-105"
            />

            {/* Hover overlay */}
            <span className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 backdrop-blur-[2px] transition-all duration-300 group-hover/img:opacity-100">
              <span className="flex items-center gap-2 rounded-full border border-accent bg-black/90 px-4 py-2 text-xs font-bold uppercase tracking-wider text-accent shadow-[0_0_20px_rgba(255,193,7,0.35)] transition-transform duration-300 group-hover/img:scale-105">
                <ExpandIcon className="h-4 w-4" />
                Preview Gallery
              </span>
            </span>

            {/* Badges on Image */}
            <div className="absolute left-3 top-3 z-20 flex items-center gap-2">
              {project.featured ? (
                <span className="inline-flex items-center gap-1 rounded-full border border-accent/40 bg-black/85 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-accent shadow-md backdrop-blur-md">
                  <StarIcon className="h-3 w-3 text-accent" />
                  Featured
                </span>
              ) : null}
            </div>

            <span className="absolute bottom-3 right-3 rounded-full border border-white/10 bg-black/80 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white/90 backdrop-blur-md">
              {project.gallery.length} Screens
            </span>
          </button>

          {/* Details / Content */}
          <div className="flex grow flex-col p-6">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-accent/80">
                {project.featured ? "FLAGSHIP PROJECT" : "WEB APPLICATION"}
              </span>
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                LIVE
              </div>
            </div>

            <h3
              onClick={() => onOpen(project)}
              className="mt-2 flex cursor-pointer items-baseline justify-between gap-2 font-display text-xl font-extrabold text-white transition-colors duration-200 group-hover:text-accent"
            >
              <span className="truncate">{project.title}</span>
              <span className="shrink-0 text-accent opacity-0 transition-all duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100">
                ↗
              </span>
            </h3>

            <div className="mt-2.5 text-sm leading-relaxed text-gray-400 line-clamp-2">
              <FormattedText text={project.description} />
            </div>

            {/* Tech Stack Pills */}
            <ul className="mt-4 flex flex-wrap gap-1.5">
              {project.stack.map((tech) => (
                <li
                  key={tech}
                  className="inline-flex items-center gap-1 rounded-md border border-white/8 bg-white/[0.04] px-2 py-0.5 text-[11px] font-semibold text-white/75 transition-colors hover:border-accent/40 hover:text-accent"
                >
                  <span className="h-1 w-1 rounded-full bg-accent/60" />
                  {tech.toUpperCase()}
                </li>
              ))}
            </ul>

            {/* Actions: Live Demo + Gallery */}
            <div className="mt-auto flex flex-wrap items-center gap-3 pt-5 border-t border-white/5">
              <Magnetic strength={0.25}>
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-accent px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-black shadow-[0_0_20px_rgba(255,193,7,0.25)] transition-all duration-300 hover:bg-yellow-300 hover:shadow-[0_0_30px_rgba(255,193,7,0.5)]"
                >
                  <ExternalLinkIcon className="h-3.5 w-3.5" />
                  Live Demo
                </a>
              </Magnetic>

              <Magnetic strength={0.25}>
                <button
                  type="button"
                  onClick={() => onOpen(project)}
                  className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.03] px-3.5 py-2 text-xs font-bold uppercase tracking-[0.14em] text-white transition-all duration-300 hover:border-accent hover:text-accent"
                >
                  <ExpandIcon className="h-3.5 w-3.5" />
                  Gallery
                </button>
              </Magnetic>
            </div>
          </div>
        </article>
      </TiltCard>
    </Reveal>
  );
}

/* ─── Skeleton Grid ──────────────────────────────────────────────────── */

function ProjectsSkeletonGrid() {
  return (
    <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0d0d0d] p-6">
          <div className="aspect-[16/10] w-full animate-pulse rounded-xl bg-neutral-800" />
          <div className="mt-5 h-6 w-3/5 animate-pulse rounded-md bg-neutral-800" />
          <div className="mt-3 h-4 w-full animate-pulse rounded-md bg-neutral-800/60" />
          <div className="mt-2 h-4 w-4/5 animate-pulse rounded-md bg-neutral-800/60" />
          <div className="mt-6 flex gap-2">
            {[1, 2, 3].map((s) => (
              <div key={s} className="h-6 w-16 animate-pulse rounded-md bg-neutral-800/50" />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ─── Main Projects Section ──────────────────────────────────────────── */

export default function Projects() {
  const { content, isLoading } = useContent();
  const visible = content.projects.filter((p) => !p.hidden);
  const featured = visible.filter((p) => p.featured);
  const regular = visible.filter((p) => !p.featured);

  const [filter, setFilter] = useState<"all" | "featured" | "regular">("all");
  const [selected, setSelected] = useState<Project | null>(null);
  const [slide, setSlide] = useState(0);
  const [touchX, setTouchX] = useState(0);

  const displayedProjects = visible.filter((p) => {
    if (filter === "featured") return p.featured;
    if (filter === "regular") return !p.featured;
    return true;
  });

  const openProject = useCallback((project: Project) => {
    setSelected(project);
    setSlide(0);
  }, []);

  const close = useCallback(() => setSelected(null), []);

  const galleryCount = selected?.gallery.length ?? 0;
  const nextSlide = useCallback(
    () => setSlide((s) => (s + 1) % galleryCount),
    [galleryCount]
  );
  const prevSlide = useCallback(
    () => setSlide((s) => (s - 1 + galleryCount) % galleryCount),
    [galleryCount]
  );

  useEffect(() => {
    if (!selected) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") nextSlide();
      if (e.key === "ArrowLeft") prevSlide();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [selected, close, nextSlide, prevSlide]);

  const onTouchStart = (e: TouchEvent) => setTouchX(e.touches[0].clientX);
  const onTouchEnd = (e: TouchEvent) => {
    const dx = e.changedTouches[0].clientX - touchX;
    if (Math.abs(dx) > 45) (dx < 0 ? nextSlide : prevSlide)();
  };

  // Dynamic layout class: handles 1 single project (Spotlight billboard) or grid perfectly!
  const isSingleSpotlight = displayedProjects.length === 1;
  const gridContainerClass = isSingleSpotlight
    ? "mx-auto mt-12 max-w-5xl"
    : displayedProjects.length === 2
    ? "mx-auto mt-12 grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-2"
    : "mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3";

  return (
    <section id="projects" className="relative overflow-hidden py-28">
      {/* Background Ambient Glows */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 top-1/3 h-96 w-96 rounded-full [background:radial-gradient(circle,rgba(255,193,7,0.04)_0%,transparent_70%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 bottom-1/4 h-96 w-96 rounded-full [background:radial-gradient(circle,rgba(245,158,11,0.03)_0%,transparent_70%)]"
      />

      <div className="relative mx-auto w-full max-w-7xl px-6 md:px-10 lg:px-16">
        <SectionHeading
          watermark="WORKS"
          title="Featured Projects"
          subtitle="Explore hand-crafted digital experiences, full-stack web applications, and scalable architectures."
          direction="down"
          sectionId="projects"
        />

        {/* Header & Tabs Row */}
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <Reveal direction="left" distance={45}>
            <div className="flex items-center gap-3">
              <span className="flex h-3 w-3 rounded-full bg-accent animate-pulse" />
              <h3 className="font-display text-2xl font-black">
                <span className="text-white">Featured </span>
                <span className="text-accent">Creations</span>
              </h3>
            </div>
            <span aria-hidden="true" className="mt-2 block h-[2px] w-28 bg-gradient-to-r from-accent via-amber-400 to-transparent" />
          </Reveal>

          {/* Morphing Category Tabs */}
          <Reveal direction="right" distance={45} delay={100} className="w-full sm:w-auto">
            <div className="flex w-full sm:w-auto items-center justify-between sm:justify-start gap-1 sm:gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden rounded-2xl sm:rounded-full border border-white/10 bg-white/[0.02] p-1.5 backdrop-blur-xl">
              {[
                { id: "all", label: "All Projects", shortLabel: "All", count: visible.length },
                { id: "featured", label: "Top Featured", shortLabel: "Featured", count: featured.length },
                { id: "regular", label: "Archive", shortLabel: "Archive", count: regular.length },
              ].map((tab) => {
                const isActive = filter === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setFilter(tab.id as any)}
                    className={`relative flex flex-1 sm:flex-initial items-center justify-center gap-1.5 sm:gap-2.5 rounded-xl sm:rounded-full px-2.5 py-2 sm:px-5 sm:py-2.5 text-[11px] sm:text-xs font-bold uppercase tracking-wider sm:tracking-[0.16em] transition-all duration-200 outline-none shrink-0 ${
                      isActive ? "text-black font-black" : "text-gray-400 hover:text-white"
                    }`}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="project-tab-pill"
                        className="absolute inset-0 rounded-xl sm:rounded-full bg-accent shadow-[0_0_25px_rgba(255,193,7,0.45)]"
                        transition={{ type: "spring", stiffness: 420, damping: 30 }}
                      />
                    )}
                    <span className="relative z-10 hidden min-[460px]:inline">{tab.label}</span>
                    <span className="relative z-10 inline min-[460px]:hidden">{tab.shortLabel}</span>
                    <span
                      className={`relative z-10 rounded-full px-1.5 py-0.5 sm:px-2 text-[10px] font-black ${
                        isActive ? "bg-black/25 text-black" : "bg-white/10 text-gray-400"
                      }`}
                    >
                      {tab.count}
                    </span>
                  </button>
                );
              })}
            </div>
          </Reveal>
        </div>

        {/* Project Cards Display */}
        {isLoading ? (
          <ProjectsSkeletonGrid />
        ) : filter === "all" && featured.length > 0 && regular.length > 0 ? (
          <div className="mt-12 space-y-14">
            {/* 1. Featured / Pinned Projects Group */}
            <div>
              <div className="mb-6 flex items-center gap-2">
                <StarIcon className="h-4 w-4 text-accent" />
                <span className="font-display text-xs sm:text-sm font-bold uppercase tracking-[0.2em] text-accent">
                  Top Featured Projects ({featured.length})
                </span>
              </div>
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                {featured.map((project, i) => (
                  <div key={project.id || project.title} className="h-full">
                    <ProjectCard
                      project={project}
                      index={i}
                      onOpen={openProject}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Separator Line */}
            <div className="flex items-center gap-4">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/15 to-white/10" />
              <span className="rounded-full border border-white/15 bg-white/[0.04] px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.22em] text-gray-400 backdrop-blur-sm">
                Archive &amp; More Projects ({regular.length})
              </span>
              <div className="h-px flex-1 bg-gradient-to-r from-white/10 via-white/15 to-transparent" />
            </div>

            {/* 2. Regular / Archive Projects Group */}
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {regular.map((project, i) => (
                <div key={project.id || project.title} className="h-full">
                  <ProjectCard
                    project={project}
                    index={featured.length + i}
                    onOpen={openProject}
                  />
                </div>
              ))}
            </div>
          </div>
        ) : displayedProjects.length > 0 ? (
          <div className={gridContainerClass}>
            {displayedProjects.map((project, i) => (
              <div key={project.id || project.title} className="h-full">
                <ProjectCard
                  project={project}
                  index={i}
                  onOpen={openProject}
                  spotlight={isSingleSpotlight}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-20 flex flex-col items-center justify-center gap-4 rounded-2xl border border-white/10 bg-white/[0.02] py-20 text-center">
            <div className="h-12 w-12 rounded-full border border-dashed border-accent/40 flex items-center justify-center text-accent text-lg">
              ✕
            </div>
            <p className="text-sm font-semibold text-gray-400">No projects found in this category.</p>
          </div>
        )}
      </div>

      {/* ─── OPTIMIZED & ENHANCED LIGHTBOX MODAL ───────────────────────── */}
      <AnimatePresence>
        {selected ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            role="dialog"
            aria-modal="true"
            aria-label={`${selected.title} gallery`}
            className="fixed inset-0 z-[120] flex items-center justify-center bg-black/95 p-3 sm:p-6 pt-32 sm:pt-28 backdrop-blur-2xl"
            onClick={close}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
          >
            <motion.div
              initial={{ scale: 0.94, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.94, opacity: 0, y: 15 }}
              transition={{ type: "spring", stiffness: 360, damping: 28 }}
              className="relative flex max-h-[85vh] w-full max-w-5xl flex-col overflow-y-auto rounded-2xl border border-white/15 bg-[#0a0a0a] shadow-[0_25px_80px_rgba(0,0,0,0.95),0_0_40px_rgba(255,193,7,0.1)] modal-scrollbar custom-scrollbar"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Top Bar */}
              <div className="sticky top-0 z-20 flex items-center justify-between border-b border-white/10 bg-[#0a0a0a]/95 px-5 py-4 backdrop-blur-md sm:px-7">
                <div className="min-w-0 pr-4">
                  <h3 className="truncate font-display text-lg font-black text-white sm:text-2xl">
                    {selected.title}
                  </h3>
                  <p className="mt-0.5 text-xs font-semibold text-accent">
                    Screen {slide + 1} of {selected.gallery.length}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  {selected.liveUrl && (
                    <a
                      href={selected.liveUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-full bg-accent px-4 py-2 text-xs font-black uppercase tracking-wider text-black shadow-md transition-colors hover:bg-yellow-300"
                    >
                      <ExternalLinkIcon className="h-3.5 w-3.5" />
                      <span>Live Demo</span>
                    </a>
                  )}

                  <button
                    type="button"
                    onClick={close}
                    aria-label="Close dialog"
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white transition-all duration-200 hover:rotate-90 hover:border-accent hover:text-accent"
                  >
                    <CloseIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Main Image Showcase with Slide Arrows */}
              <div className="relative flex min-h-[350px] sm:min-h-[450px] items-center justify-center overflow-visible bg-black/70 p-6 sm:p-8 pt-8 sm:pt-18">
                <div className="relative w-full max-w-4xl overflow-visible rounded-xl border border-white/10 shadow-2xl flex items-center justify-center">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={slide}
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      transition={{ duration: 0.22 }}
                      className="h-full w-full"
                    >
                      <SmartImage
                        src={selected.gallery[slide]}
                        alt={`${selected.title} screen ${slide + 1}`}
                        label={`${selected.title}, screen ${slide + 1}`}
                        className="h-full w-full object-contain"
                        imgClassName="max-h-[60vh] sm:max-h-[70vh] w-auto"
                      />
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Floating Left & Right Arrows */}
                {selected.gallery.length > 1 ? (
                  <>
                    <button
                      type="button"
                      onClick={prevSlide}
                      aria-label="Previous screenshot"
                      className="absolute left-4 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/75 text-white shadow-xl backdrop-blur-md transition-all duration-200 hover:scale-110 hover:border-accent hover:bg-accent hover:text-black"
                    >
                      <ChevronLeftIcon className="h-6 w-6" />
                    </button>
                    <button
                      type="button"
                      onClick={nextSlide}
                      aria-label="Next screenshot"
                      className="absolute right-4 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/75 text-white shadow-xl backdrop-blur-md transition-all duration-200 hover:scale-110 hover:border-accent hover:bg-accent hover:text-black"
                    >
                      <ChevronRightIcon className="h-6 w-6" />
                    </button>
                  </>
                ) : null}
              </div>

              {/* Bottom Thumbnail Strip & Shortcuts */}
              <div className="flex flex-col items-center justify-between gap-3 border-t border-white/10 bg-[#080808] px-5 py-3.5 sm:flex-row sm:px-7 mt-10">
                {/* Thumbnails */}
                <div className="scrollbar-thin flex items-center gap-2 overflow-x-auto pb-1 max-w-full">
                  {selected.gallery.map((img, i) => (
                    <button
                      key={`${i}_thumb_${img?.slice(0, 20)}`}
                      type="button"
                      onClick={() => setSlide(i)}
                      aria-label={`Jump to screen ${i + 1}`}
                      className={`relative shrink-0 overflow-hidden rounded-lg border-2 transition-all duration-200 ${
                        i === slide
                          ? "border-accent opacity-100 shadow-[0_0_12px_rgba(255,193,7,0.5)] scale-105"
                          : "border-transparent opacity-40 hover:opacity-80"
                      }`}
                    >
                      <SmartImage
                        src={img}
                        alt=""
                        label={`Screen ${i + 1}`}
                        className="h-11 w-18 object-cover rounded"
                      />
                    </button>
                  ))}
                </div>

                {/* Keyboard hints */}
                <span className="hidden text-[11px] font-semibold tracking-wider text-gray-500 sm:block">
                  <span className="rounded border border-white/10 bg-white/5 px-1.5 py-0.5 text-gray-400">←</span> /{" "}
                  <span className="rounded border border-white/10 bg-white/5 px-1.5 py-0.5 text-gray-400">→</span> Navigate •{" "}
                  <span className="rounded border border-white/10 bg-white/5 px-1.5 py-0.5 text-gray-400">ESC</span> Close
                </span>
              </div>

              {/* Project Details, Full Description & Tech Stack */}
              <div className="border-t border-white/10 bg-[#0c0c0c] p-6 sm:p-8 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/5 pb-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-bold uppercase tracking-wider text-accent">Tech Stack:</span>
                    {selected.stack.map((tech) => (
                      <span
                        key={tech}
                        className="rounded-lg border border-accent/25 bg-accent/10 px-3 py-1 text-xs font-semibold text-white"
                      >
                        {tech.toUpperCase()}
                      </span>
                    ))}
                  </div>

                  {selected.liveUrl && (
                    <a
                      href={selected.liveUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-accent hover:text-yellow-300 transition-colors"
                    >
                      <span>Open Website</span>
                      <ExternalLinkIcon className="h-3.5 w-3.5" />
                    </a>
                  )}
                </div>

                <div className="text-sm leading-relaxed text-gray-300 font-sans space-y-2">
                  <FormattedText text={selected.description} />
                </div>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </section>
  );
}
