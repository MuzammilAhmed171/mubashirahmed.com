import { motion } from "framer-motion";
import { useContent } from "../store/content";
import { DEFAULT_EXPERIENCES, type ExperienceItem } from "../data";
import SectionHeading from "./SectionHeading";
import Reveal from "./Reveal";
import { FormattedText } from "./FormattedText";

export default function Experience() {
  const { content } = useContent();

  // If user disabled Experience section globally in Admin settings
  if (content.settings.showExperience === false) return null;

  const rawList = content.experiences && content.experiences.length > 0 ? content.experiences : DEFAULT_EXPERIENCES;
  const experiences = rawList.filter((item) => item.active !== false);

  if (experiences.length === 0) return null;

  return (
    <section id="experience" className="relative overflow-hidden py-24 sm:py-32">
      {/* Background radial glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 top-1/4 h-[500px] w-[500px] rounded-full [background:radial-gradient(circle,rgba(255,193,7,0.04)_0%,transparent_70%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 bottom-1/4 h-[500px] w-[500px] rounded-full [background:radial-gradient(circle,rgba(255,193,7,0.03)_0%,transparent_70%)]"
      />

      <div className="relative mx-auto w-full max-w-5xl px-6 md:px-10 lg:px-16">
        <SectionHeading
          watermark="CAREER"
          title="Work Experience"
          subtitle="My professional journey, roles, and impact across companies & worldwide clients."
          direction="down"
          sectionId="experience"
        />

        {/* Timeline Container */}
        <div className="relative mt-12 sm:mt-16">
          {/* Vertical Glowing Timeline Line */}
          <div
            aria-hidden="true"
            className="absolute left-4 top-4 bottom-4 w-[2px] bg-gradient-to-b from-accent via-accent/40 to-transparent sm:left-1/2 sm:-translate-x-1/2"
          />

          <div className="space-y-10 sm:space-y-14">
            {experiences.map((exp, idx) => {
              const isEven = idx % 2 === 0;

              return (
                <div
                  key={exp.id || idx}
                  className="relative flex flex-col sm:flex-row items-start"
                >
                  {/* Timeline Center Node */}
                  <div
                    aria-hidden="true"
                    className="absolute left-4 -translate-x-1/2 top-6 z-10 flex h-7 w-7 items-center justify-center rounded-full border-2 border-accent bg-neutral-950 shadow-[0_0_15px_rgba(255,193,7,0.6)] sm:left-1/2"
                  >
                    <span className="h-2 w-2 rounded-full bg-accent animate-pulse" />
                  </div>

                  {/* Left / Right Card Container */}
                  <div
                    className={`ml-10 sm:ml-0 w-full sm:w-[calc(50%-2rem)] ${
                      isEven ? "sm:mr-auto sm:pr-4" : "sm:ml-auto sm:pl-4"
                    }`}
                  >
                    <Reveal direction={isEven ? "left" : "right"} distance={45} delay={idx * 80}>
                      <article className="group relative rounded-2xl border border-white/10 bg-white/[0.025] p-6 sm:p-7 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-accent/40 hover:bg-white/[0.045] hover:shadow-[0_15px_40px_rgba(255,193,7,0.08)]">
                        {/* Period & Type Badges */}
                        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/5 pb-3">
                          <span className="inline-flex items-center gap-1.5 rounded-full border border-accent/30 bg-accent/10 px-3 py-1 font-mono text-xs font-bold text-accent">
                            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                            {exp.period}
                          </span>

                          {exp.type && (
                            <span className="rounded-md border border-white/10 bg-white/5 px-2.5 py-0.5 text-[11px] font-semibold text-gray-400">
                              {exp.type}
                            </span>
                          )}
                        </div>

                        {/* Role & Company */}
                        <div className="mt-4">
                          <h3 className="font-display text-lg sm:text-xl font-bold text-white transition-colors group-hover:text-accent">
                            <FormattedText text={exp.role} />
                          </h3>

                          <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-gray-300">
                            {exp.link ? (
                              <a
                                href={exp.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-semibold text-accent/90 underline-offset-4 hover:underline hover:text-accent"
                              >
                                {exp.company}
                              </a>
                            ) : (
                              <span className="font-semibold text-gray-200">{exp.company}</span>
                            )}

                            {exp.location && (
                              <>
                                <span className="text-gray-600">•</span>
                                <span className="text-xs text-gray-400">{exp.location}</span>
                              </>
                            )}
                          </div>
                        </div>

                        {/* Description */}
                        <div className="mt-4 text-sm leading-relaxed text-gray-400">
                          <FormattedText text={exp.description} />
                        </div>

                        {/* Tech Stack Pills */}
                        {exp.technologies && exp.technologies.length > 0 && (
                          <div className="mt-5 flex flex-wrap gap-1.5 pt-2 border-t border-white/5">
                            {exp.technologies.map((tech) => (
                              <span
                                key={tech}
                                className="rounded-md border border-white/10 bg-black/40 px-2.5 py-0.5 text-[11px] font-medium text-gray-300 transition-colors group-hover:border-accent/30 group-hover:text-white"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                        )}
                      </article>
                    </Reveal>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
