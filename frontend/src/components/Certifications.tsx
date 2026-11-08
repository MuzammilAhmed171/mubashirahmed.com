import { motion } from "framer-motion";
import { useContent } from "../store/content";
import { DEFAULT_CERTIFICATIONS, type CertificationItem } from "../data";
import SectionHeading from "./SectionHeading";
import Reveal from "./Reveal";
import { FormattedText } from "./FormattedText";

export default function Certifications() {
  const { content } = useContent();

  // If user disabled Certifications section globally in Admin settings
  if (content.settings.showCertifications === false) return null;

  const rawList =
    content.certifications && content.certifications.length > 0
      ? content.certifications
      : DEFAULT_CERTIFICATIONS;
  const certs = rawList.filter((item) => item.active !== false);

  if (certs.length === 0) return null;

  return (
    <section id="certifications" className="relative overflow-hidden py-24 sm:py-32">
      {/* Background glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/3 h-[500px] w-[600px] -translate-x-1/2 rounded-full bg-accent/[0.025] blur-[140px]"
      />

      <div className="relative mx-auto w-full max-w-6xl px-6 md:px-10 lg:px-16">
        <SectionHeading
          watermark="VERIFIED"
          title="Certifications & Licenses"
          subtitle="Industry-recognized credentials in Full-Stack Web Development, AI/ML, and Software Engineering."
          direction="down"
          sectionId="certifications"
        />

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {certs.map((cert, idx) => (
            <Reveal key={cert.id || idx} direction="up" distance={35} delay={idx * 80}>
              <article className="group flex h-full flex-col justify-between rounded-2xl border border-white/10 bg-white/[0.025] p-6 backdrop-blur-md transition-all duration-300 hover:-translate-y-1.5 hover:border-accent/40 hover:bg-white/[0.045] hover:shadow-[0_15px_45px_rgba(255,193,7,0.08)]">
                <div>
                  {/* Top: Issuer & Year */}
                  <div className="flex items-center justify-between gap-2 border-b border-white/5 pb-3">
                    <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-accent">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-accent/15 border border-accent/30 text-[10px]">
                        ★
                      </span>
                      {cert.issuer}
                    </span>
                    <span className="rounded-md border border-white/10 bg-white/5 px-2 py-0.5 font-mono text-[11px] font-semibold text-gray-400">
                      {cert.issueDate}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="mt-4 font-display text-base sm:text-lg font-bold leading-snug text-white transition-colors group-hover:text-accent">
                    <FormattedText text={cert.title} />
                  </h3>

                  {/* Credential ID */}
                  {cert.credentialId && (
                    <p className="mt-2 text-xs font-mono text-gray-500">
                      ID: <span className="text-gray-400">{cert.credentialId}</span>
                    </p>
                  )}
                </div>

                {/* Bottom Verification Link */}
                <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-gray-500">Verified Credential</span>
                  {cert.credentialUrl ? (
                    <a
                      href={cert.credentialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-accent transition-all group-hover:underline group-hover:text-yellow-300"
                    >
                      <span>Verify</span>
                      <span className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                        ↗
                      </span>
                    </a>
                  ) : (
                    <span className="text-xs text-emerald-400 font-semibold">Active ✓</span>
                  )}
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
