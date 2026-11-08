import { motion } from "framer-motion";
import { useContent } from "../store/content";
import { Reveal, SectionHeading } from "./ui";
import Magnetic from "./Magnetic";
import { FormattedText } from "./FormattedText";

function SkillBars() {
  const { content } = useContent();
  const skills = content.about.skills || [];

  if (skills.length === 0) return null;

  return (
    <div className="mt-12">
      <h3 className="font-display text-xl font-semibold text-white">Skills</h3>
      <div className="mt-6 space-y-6">
        {skills.map((skill, i) => (
          <div key={`${skill.name}-${i}`} className="group">
            <div className="mb-2 flex items-center justify-between text-sm font-medium text-white">
              <span className="transition-colors group-hover:text-accent">{skill.name}</span>
              <span className="font-bold text-accent">{skill.level}%</span>
            </div>
            <div className="h-2.5 overflow-hidden rounded-full bg-neutral-900 border border-white/5 p-[1px]">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: `${skill.level}%` }}
                viewport={{ once: true, margin: "-20px" }}
                transition={{
                  duration: 1.2,
                  delay: i * 0.1,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="h-full rounded-full bg-gradient-to-r from-accent/80 via-accent to-yellow-300 shadow-[0_0_12px_rgba(255,193,7,0.55)]"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function About() {
  const { content, isLoading } = useContent();
  const about = content.about;

  return (
    <section id="about" className="relative overflow-hidden py-28">
      <div aria-hidden="true" className="absolute right-0 top-1/3 h-80 w-80 rounded-full bg-accent/[0.015] blur-[140px]" />

      <div className="relative mx-auto w-full max-w-6xl px-6 md:px-10">
        <SectionHeading watermark="ABOUT" title="About Me" direction="down" sectionId="about" />

        <div className="grid gap-16 lg:grid-cols-2 lg:gap-14">
          <Reveal direction="left" distance={55}>
            <div className="relative h-52 w-52 sm:h-56 sm:w-56">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                aria-hidden="true"
                className="absolute -inset-3 rounded-full border border-dashed border-accent/25"
              />
              <div aria-hidden="true" className="absolute inset-0 translate-x-4 translate-y-4 rounded-full bg-accent shadow-[0_0_30px_rgba(255,193,7,0.3)]" />
              {isLoading ? (
                /* Skeleton shimmer while fetching */
                <div className="relative h-full w-full overflow-hidden rounded-full border-4 border-black bg-neutral-900">
                  <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/5 to-transparent" />
                </div>
              ) : about.profileImage ? (
                <motion.div
                  whileHover={{ scale: 1.04 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="relative h-full w-full overflow-hidden rounded-full border-4 border-black bg-neutral-900 shadow-2xl"
                >
                  <img
                    src={about.profileImage}
                    alt={`Portrait of ${content.hero.name}`}
                    loading="lazy"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                    className="h-full w-full object-cover transition-transform duration-700 hover:scale-110"
                  />
                </motion.div>
              ) : (
                <div className="relative h-full w-full rounded-full border-4 border-black bg-neutral-900" />
              )}
            </div>

            <ul className="mt-12 space-y-1">
              {about.basicInfo.map((row, i) => (
                <motion.li
                  key={`${row.label}-${i}`}
                  whileHover={{ x: 4 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  className="group flex items-center justify-between gap-6 border-b border-white/5 py-3.5 transition-colors hover:border-accent/40"
                >
                  <span className="text-sm font-bold text-white transition-colors group-hover:text-accent">{row.label}</span>
                  <span className="text-right text-sm text-gray-400 transition-colors group-hover:text-white">
                    <FormattedText text={row.value} />
                  </span>
                </motion.li>
              ))}
            </ul>

            <SkillBars />
          </Reveal>

          <Reveal direction="right" distance={55} delay={120}>
            <h3 className="font-display text-2xl font-bold leading-snug text-white sm:text-[1.7rem]">
              <FormattedText text={about.headline} as="span" />
            </h3>

            {about.bioParagraphs.map((para, i) =>
              para.trim() ? (
                <div key={i} className="mt-6 leading-relaxed text-gray-400">
                  <FormattedText text={para} />
                </div>
              ) : null,
            )}

            <dl className="mt-10 grid grid-cols-1 gap-x-10 gap-y-7 sm:grid-cols-2">
              {about.infoGrid.map((item, i) => (
                <motion.div
                  key={`${item.label}-${i}`}
                  whileHover={{ x: 3 }}
                  className="border-l-2 border-accent/60 pl-4 transition-colors hover:border-accent"
                >
                  <dt className="text-sm font-bold uppercase tracking-wider text-white">{item.label}</dt>
                  <dd className="mt-1.5 text-sm text-gray-400">
                    <FormattedText text={item.value} />
                  </dd>
                </motion.div>
              ))}
            </dl>

            <div className="mt-12 flex flex-wrap items-center gap-x-10 gap-y-6">
              <p className="flex items-center font-display leading-none">
                <span className="text-5xl font-extrabold text-accent drop-shadow-[0_0_15px_rgba(255,193,7,0.3)]">
                  {about.statNumber}
                </span>
                <span className="ml-3 max-w-[11rem] text-2xl font-bold leading-tight text-white">
                  <FormattedText text={about.statLabel} />
                </span>
              </p>
              <a
                href="#projects"
                className="inline-block rounded-full bg-accent px-7 py-2.5 text-xs font-bold uppercase tracking-[0.22em] text-black shadow-[0_5px_25px_rgba(255,193,7,0.3)] transition-all duration-300 hover:bg-yellow-300 hover:shadow-[0_12px_40px_rgba(255,193,7,0.5)]"
              >
                {about.buttonText}
              </a>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
