import React, { useEffect, useRef, useState, type ChangeEvent, type FormEvent, type ReactNode } from "react";
import { motion } from "framer-motion";
import { useContent } from "../store/content";
import { CheckIcon, CONTACT_ICONS, PlaneIcon, SOCIAL_ICON_MAP, GlobeIcon } from "./Icons";
import { Reveal, SectionHeading } from "./ui";
import Magnetic from "./Magnetic";
import { FormattedText } from "./FormattedText";
import { ALL_NAV_LINKS } from "../data";

type FormData = { name: string; email: string; subject: string; message: string };
type FormErrors = Partial<Record<keyof FormData, string>>;
type Status = "idle" | "sending" | "sent";

const EMPTY_FORM: FormData = { name: "", email: "", subject: "", message: "" };
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function ContactForm() {
  const { addMessage } = useContent();
  const [form, setForm] = useState<FormData>(EMPTY_FORM);
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<Status>("idle");
  const timers = useRef<number[]>([]);

  useEffect(() => () => timers.current.forEach((t) => window.clearTimeout(t)), []);

  const update =
    (field: keyof FormData) =>
      (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm((f) => ({ ...f, [field]: e.target.value }));
        setErrors((err) => ({ ...err, [field]: undefined }));
      };

  const validate = (): FormErrors => {
    const errs: FormErrors = {};
    if (!form.name.trim()) errs.name = "Please enter your name.";
    if (!form.email.trim()) errs.email = "Please enter your email.";
    else if (!EMAIL_RE.test(form.email)) errs.email = "That email doesn't look right.";
    if (!form.subject.trim()) errs.subject = "A short subject helps me reply faster.";
    if (form.message.trim().length < 10) errs.message = "Tell me a little more, at least 10 characters.";
    return errs;
  };

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.values(errs).some(Boolean)) return;

    const submission = { ...form };
    setStatus("sending");
    timers.current.push(
      window.setTimeout(() => {
        addMessage(submission);
        setStatus("sent");
        setForm(EMPTY_FORM);
        timers.current.push(window.setTimeout(() => setStatus("idle"), 6000));
      }, 1200),
    );
  };

  const inputClass = (hasError: boolean) =>
    `w-full rounded-md border bg-neutral-950 px-4 py-3 text-sm text-white placeholder-gray-600 outline-none transition-all duration-300 focus:ring-1 ${hasError
      ? "border-red-400/60 focus:border-red-400 focus:ring-red-400/30"
      : "border-white/10 focus:border-accent focus:ring-accent/40"
    }`;

  return (
    <form
      id="contact-form"
      onSubmit={onSubmit}
      noValidate
      className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 transition-colors duration-300 hover:border-accent/25 sm:p-9"
    >
      <div className="grid grid-cols-1 gap-4 sm:gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="contact-name" className="mb-2 block text-[11px] font-bold uppercase tracking-[0.18em] text-gray-400">
            Your Name
          </label>
          <input id="contact-name" type="text" value={form.name} onChange={update("name")} placeholder="John Carter" className={inputClass(!!errors.name)} />
          {errors.name ? <p className="mt-1.5 text-xs text-red-400">{errors.name}</p> : null}
        </div>

        <div>
          <label htmlFor="contact-email" className="mb-2 block text-[11px] font-bold uppercase tracking-[0.18em] text-gray-400">
            Email Address
          </label>
          <input id="contact-email" type="email" value={form.email} onChange={update("email")} placeholder="john@company.com" className={inputClass(!!errors.email)} />
          {errors.email ? <p className="mt-1.5 text-xs text-red-400">{errors.email}</p> : null}
        </div>
      </div>

      <div className="mt-4 sm:mt-5">
        <label htmlFor="contact-subject" className="mb-2 block text-[11px] font-bold uppercase tracking-[0.18em] text-gray-400">
          Subject
        </label>
        <input id="contact-subject" type="text" value={form.subject} onChange={update("subject")} placeholder="Project inquiry: MERN web app" className={inputClass(!!errors.subject)} />
        {errors.subject ? <p className="mt-1.5 text-xs text-red-400">{errors.subject}</p> : null}
      </div>

      <div className="mt-4 sm:mt-5">
        <label htmlFor="contact-message" className="mb-2 block text-[11px] font-bold uppercase tracking-[0.18em] text-gray-400">
          Message
        </label>
        <textarea id="contact-message" rows={5} value={form.message} onChange={update("message")} placeholder="Tell me about your project, timeline and budget..." className={`${inputClass(!!errors.message)} resize-none`} />
        {errors.message ? <p className="mt-1.5 text-xs text-red-400">{errors.message}</p> : null}
      </div>

      {status === "sent" ? (
        <div className="mt-6 flex items-center gap-3 rounded-md border border-accent/40 bg-accent/10 px-4 py-3 text-sm text-accent">
          <CheckIcon className="h-4 w-4 shrink-0" />
          Message sent! It&apos;s now in my inbox, and I&apos;ll reply within 24 hours.
        </div>
      ) : null}

      <div className="mt-6 sm:mt-7">
        <Magnetic strength={0.25} className="w-full sm:w-auto">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            type="submit"
            disabled={status === "sending"}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-full bg-accent px-8 py-3.5 sm:py-3 text-xs font-bold uppercase tracking-[0.22em] text-black shadow-[0_5px_25px_rgba(255,193,7,0.3)] transition-all duration-300 hover:bg-yellow-300 hover:shadow-[0_14px_40px_rgba(255,193,7,0.5)] disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0"
          >
            {status === "sending" ? (
              <>
                <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4 animate-spin" aria-hidden="true">
                  <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2.5" opacity="0.25" />
                  <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                </svg>
                Sending...
              </>
            ) : (
              <>
                <PlaneIcon className="h-4 w-4" />
                Send Message
              </>
            )}
          </motion.button>
        </Magnetic>
      </div>
    </form>
  );
}

export default function Contact() {
  const { content } = useContent();
  const { contactItems } = content;
  const { email, copyrightName, resume, logoFirst, logoSecond, navLinks } = content.settings;
  const activeSocials = (content.socials ?? []).filter((s) => s.active && s.url.trim().length > 0);

  const resumeReady = !!resume.data;

  const scrollToForm = () => {
    document.getElementById("contact-form")?.scrollIntoView({ behavior: "smooth", block: "center" });
    window.setTimeout(
      () =>
        (document.getElementById("contact-name") as HTMLInputElement | null)?.focus({ preventScroll: true }),
      650,
    );
  };


  return (
    <>
      <section id="contact" className="relative overflow-hidden pt-28 pb-0">
        <div aria-hidden="true" className="absolute -right-32 top-16 h-96 w-96 rounded-full bg-accent/[0.04] blur-[130px]" />

        <div className="relative mx-auto w-full max-w-6xl px-6 md:px-10">
          <SectionHeading watermark="CONTACT" title="Contact Me" subtitle="Below are the details to reach out to me!" direction="down" sectionId="contact" />

          {/* Contact Info Items (Circular Design) */}
          <div className="grid grid-cols-1 min-[480px]:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-x-6 sm:gap-y-10">
            {contactItems.map((item, i) => {
              const Icon = CONTACT_ICONS[item.icon] ?? CONTACT_ICONS.globe;
              const inner = (
                <span className="flex flex-col items-center gap-4 sm:gap-5 text-center w-full max-w-full">
                  <span className="flex h-20 w-20 sm:h-28 sm:w-28 items-center justify-center rounded-full border border-white/10 bg-[#141414] text-accent shadow-[0_10px_30px_rgba(0,0,0,0.6)] transition-all duration-300 group-hover:-translate-y-1.5 group-hover:border-accent group-hover:shadow-[0_10px_40px_rgba(255,193,7,0.35)]">
                    <Icon className="h-8 w-8 sm:h-10 sm:w-10" />
                  </span>
                  <span className="w-full max-w-full px-2">
                    <span className="block font-display text-xs sm:text-sm font-bold uppercase tracking-[0.18em] text-white">
                      {item.title}
                    </span>
                    <span className="mt-1.5 sm:mt-2 block text-xs sm:text-sm text-gray-400 transition-colors group-hover:text-gray-300 break-all sm:break-normal">
                      {item.value}
                    </span>
                  </span>
                </span>
              );

              const isResumeCard = item.title.toLowerCase().includes("resume");
              let wrapper: ReactNode;
              if (isResumeCard && resumeReady) {
                wrapper = (
                  <a href={resume.data} download={resume.fileName || "resume.pdf"} className="group inline-flex w-fit" aria-label={`Download ${resume.fileName || "resume"}`}>
                    {inner}
                  </a>
                );
              } else if (item.href) {
                wrapper = (
                  <a href={item.href} className="group inline-flex w-fit" aria-label={item.title}>
                    {inner}
                  </a>
                );
              } else {
                wrapper = <div className="group inline-flex w-fit">{inner}</div>;
              }

              return (
                <Reveal key={`${item.title}-${i}`} direction="down" distance={30} delay={i * 90} className="text-center flex justify-center w-full">
                  {wrapper}
                </Reveal>
              );
            })}
          </div>

          {/* Form & Info Section */}
          <div className="mt-16 sm:mt-24 grid grid-cols-1 gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14">
            <Reveal direction="left" distance={50}>
              <ContactForm />
            </Reveal>

            <Reveal direction="right" distance={50} delay={120}>
              <div className="flex h-full flex-col justify-center">
                <span className="flex w-fit items-center gap-2.5 rounded-full border border-accent/30 bg-accent/10 px-3.5 py-1.5 text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.2em] text-accent">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
                  </span>
                  Available for new projects
                </span>

                <h3 className="mt-5 sm:mt-6 font-display text-2xl font-black leading-snug text-white sm:text-3xl">
                  Let&apos;s build something <span className="text-accent underline decoration-accent/40 decoration-2 underline-offset-4">great</span> together.
                </h3>
                <p className="mt-3 sm:mt-4 text-sm sm:text-base leading-relaxed text-gray-400">
                  Whether it&apos;s a brand-new MERN platform, an AI feature, or rescuing a stuck project, drop a
                  message and I&apos;ll personally get back to you.
                </p>

                <ul className="mt-6 sm:mt-8 space-y-3.5 sm:space-y-4">
                  {[
                    "Response within 24 hours, guaranteed",
                    "Free 30-minute consultation call",
                    "Remote-friendly, working worldwide from Pakistan",
                  ].map((point) => (
                    <li key={point} className="flex items-start gap-3.5 text-sm text-gray-300">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rotate-45 bg-accent shadow-[0_0_8px_rgba(255,193,7,0.8)]" />
                      {point}
                    </li>
                  ))}
                </ul>

                <div className="mt-8 sm:mt-10 rounded-xl border border-white/10 bg-white/[0.02] p-4 sm:p-5 overflow-hidden">
                  <p className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-gray-400">
                    Direct Inquiries
                  </p>
                  <a
                    href={`mailto:${email}`}
                    className="mt-1 block font-display text-sm min-[390px]:text-base sm:text-lg font-black text-accent transition-colors hover:text-yellow-300 hover:underline break-all"
                  >
                    {email}
                  </a>
                </div>
              </div>
            </Reveal>
          </div>

          {/* "Have a Question" Floating CTA Bar (short section -> enters from left) */}
          <Reveal direction="left" distance={60} className="mt-16 sm:mt-24 flex flex-col items-center justify-between gap-6 rounded-2xl border border-accent/30 bg-accent/5 p-6 backdrop-blur-md sm:flex-row sm:p-10">
            <div className="text-center sm:text-left">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-accent">Quick Action</span>
              <h3 className="mt-1 font-display text-2xl font-black text-white sm:text-3xl">Ready to Discuss Your Next Big Idea?</h3>
            </div>
            <Magnetic strength={0.35} className="w-full sm:w-auto">
              <motion.button
                type="button"
                onClick={scrollToForm}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.96 }}
                className="group relative w-full overflow-hidden rounded-full bg-accent px-8 py-3.5 text-xs font-black uppercase tracking-[0.22em] text-black shadow-[0_0_25px_rgba(255,193,7,0.4)] transition-all duration-300 hover:bg-yellow-300 hover:shadow-[0_0_40px_rgba(255,193,7,0.7)] sm:w-auto sm:shrink-0"
              >
                <span className="pointer-events-none absolute inset-0 -translate-x-full skew-x-[-20deg] bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                <span className="relative z-10 flex items-center justify-center gap-2">
                  Click Here
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </span>
              </motion.button>
            </Magnetic>
          </Reveal>
        </div>{/* close max-w-6xl */}
      </section>

      {/* ═══════════════ FULL-WIDTH YELLOW FOOTER ═══════════════ */}
      <footer className="mt-12 relative w-full overflow-hidden bg-[#FFC107] rounded-t-[50px] sm:rounded-t-[70px]">
        {/* Noise grain texture */}
        <svg className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.08]" xmlns="http://www.w3.org/2000/svg">
          <filter id="footerNoise"><feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="4" stitchTiles="stitch" /><feColorMatrix type="saturate" values="0" /></filter>
          <rect width="100%" height="100%" filter="url(#footerNoise)" />
        </svg>

        <div className="relative z-10 mx-auto w-full max-w-7xl px-6 sm:px-10 lg:px-20">
          {/* ── 2-Column layout ── */}
          <div className="flex flex-col gap-10 py-10 sm:py-12 lg:flex-row lg:items-start lg:justify-between lg:gap-16">

            {/* LEFT: Logo + tagline + socials */}
            <div className="flex flex-col items-center lg:items-start lg:max-w-xs">
              <a href="#home" className="inline-flex items-center gap-1.5 font-display text-2xl sm:text-3xl font-black tracking-tight">
                <span className="text-[#1a1a1a]">{logoFirst}</span>
                <span className="text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.15)]">{logoSecond}</span>
                <span className="h-2 w-2 rounded-full bg-[#1a1a1a]" />
              </a>
              {content.settings.footerTagline && (
                <p className="mt-2.5 text-center text-sm leading-relaxed text-[#1a1a1a]/55 lg:text-left">
                  <FormattedText text={content.settings.footerTagline} />
                </p>
              )}
              {/* Social icons */}
              {activeSocials.length > 0 && (
                <div className="mt-5 flex items-center gap-2">
                  {activeSocials.map((item) => {
                    const Icon = (SOCIAL_ICON_MAP as Record<string, React.ComponentType<React.SVGProps<SVGSVGElement>>>)[item.platform] ?? GlobeIcon;
                    const isMail = item.url.startsWith("mailto:");
                    return (
                      <a
                        key={item.id}
                        href={item.url}
                        target={isMail ? undefined : "_blank"}
                        rel="noopener noreferrer"
                        aria-label={item.label}
                        title={item.label}
                        className="group flex h-9 w-9 items-center justify-center rounded-full border border-[#1a1a1a]/20 text-[#1a1a1a]/55 transition-all duration-200 hover:scale-110 hover:bg-[#1a1a1a] hover:text-[#FFC107] hover:border-transparent active:scale-95"
                      >
                        <Icon className="h-[17px] w-[17px]" />
                      </a>
                    );
                  })}
                </div>
              )}
            </div>

            {/* RIGHT: Quick nav links */}
            <div className="flex flex-col items-center lg:items-start">
              <p className="mb-4 text-[11px] font-black uppercase tracking-[0.25em] text-[#1a1a1a]/40">
                {content.settings.footerQuickLinksTitle || "Quick Links"}
              </p>
              <nav className="grid grid-cols-2 gap-x-12 sm:gap-x-16 gap-y-2.5 w-full min-w-[280px] max-w-[340px]">
                {ALL_NAV_LINKS.map((item) => {
                  const customLabel =
                    content.settings.navLinks?.find((l) => l.id === item.id)?.label ||
                    content.settings.sectionNames?.[item.id] ||
                    item.label;
                  return (
                    <a
                      key={item.id}
                      href={`#${item.id}`}
                      className="group flex items-center gap-2 text-sm font-semibold text-[#1a1a1a]/65 transition-colors duration-200 hover:text-[#1a1a1a] select-none"
                    >
                      <span className="h-px w-3 shrink-0 bg-[#1a1a1a] opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
                      <span className="truncate transition-transform duration-200 group-hover:translate-x-1">
                        {customLabel}
                      </span>
                    </a>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Bottom strip */}
          <div className="flex flex-col items-center justify-between gap-2 border-t border-[#1a1a1a]/12 py-4 sm:flex-row">
            <p className="text-xs font-medium text-[#1a1a1a]/50">
              © {new Date().getFullYear()} <span className="font-bold text-[#1a1a1a]/75">{copyrightName}</span> · All rights reserved
            </p>
            {content.settings.footerBottomNote ? (
              <p className="text-xs font-medium text-[#1a1a1a]/40">
                <FormattedText text={content.settings.footerBottomNote} />
              </p>
            ) : null}
          </div>
        </div>
      </footer>
    </>
  );
}
