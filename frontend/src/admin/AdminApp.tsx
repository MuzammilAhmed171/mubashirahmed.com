import { useState, type FormEvent } from "react";
import { ChevronLeftIcon, ChevronRightIcon, GlobeIcon } from "../components/Icons";
import { api, apiEnabled, setToken } from "../lib/api";
import { loadContent, useContent } from "../store/content";
import { OtpModal, PasswordInput, ToastProvider, useToast } from "./controls";
import { FormattingGuideProvider, useFormattingGuide } from "./FormattingGuideModal";
import {
  AboutTab,
  ContactInfoTab,
  DashboardTab,
  HeroTab,
  ProjectsTab,
  ReviewsTab,
  SectionsTab,
  SettingsTab,
  SocialLinksTab,
  TestimonialsTab,
  FaqTab,
  ExperienceTab,
  CertificationsTab,
} from "./tabs";

const TABS = [
  { id: "dashboard", label: "Dashboard" },
  { id: "hero", label: "Hero / Home" },
  { id: "about", label: "About Me" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "sections", label: "Sections & Navbar" },
  { id: "certifications", label: "Certifications" },
  { id: "faq", label: "FAQ Questions" },
  { id: "reviews", label: "Reviews" },
  { id: "testimonials", label: "Testimonials" },
  { id: "contact", label: "Contact Info" },
  { id: "socials", label: "Social Links" },
  { id: "settings", label: "Settings" },
] as const;

type TabId = (typeof TABS)[number]["id"];

/* ------------------------------------------------------------------ */
/*  Sidebar icons                                                      */
/* ------------------------------------------------------------------ */

function TabIcon({ id, className }: { id: TabId; className?: string }) {
  const common = {
    className,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };
  switch (id) {
    case "dashboard":
      return (
        <svg {...common}>
          <rect x="3.5" y="3.5" width="7" height="7" rx="1.5" />
          <rect x="13.5" y="3.5" width="7" height="7" rx="1.5" />
          <rect x="3.5" y="13.5" width="7" height="7" rx="1.5" />
          <rect x="13.5" y="13.5" width="7" height="7" rx="1.5" />
        </svg>
      );
    case "hero":
      return (
        <svg {...common}>
          <path d="M4 11.5 12 4l8 7.5" />
          <path d="M6 10.5V20h12v-9.5" />
          <path d="M10 20v-5.5h4V20" />
        </svg>
      );
    case "about":
      return (
        <svg {...common}>
          <circle cx="12" cy="8" r="3.6" />
          <path d="M5 20c1.2-3.2 3.8-5 7-5s5.8 1.8 7 5" />
        </svg>
      );
    case "experience":
      return (
        <svg {...common}>
          <rect x="3.5" y="8" width="17" height="12" rx="2" />
          <path d="M9 8V6.5A1.5 1.5 0 0 1 10.5 5h3A1.5 1.5 0 0 1 15 6.5V8" />
          <path d="M3.5 12.5h17" />
        </svg>
      );
    case "projects":
      return (
        <svg {...common}>
          <path d="M4 7a2 2 0 0 1 2-2h4l2 2h6a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7z" />
        </svg>
      );
    case "sections":
      return (
        <svg {...common}>
          <path d="M12 3.5 20.5 8 12 12.5 3.5 8 12 3.5z" />
          <path d="M4.5 12.5 12 16.7l7.5-4.2" />
          <path d="M4.5 16.5 12 20.7l7.5-4.2" />
        </svg>
      );
    case "certifications":
      return (
        <svg {...common}>
          <circle cx="12" cy="9" r="5" />
          <path d="M9 13.5 7.5 20l4.5-2.5L16.5 20 15 13.5" />
        </svg>
      );
    case "faq":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="8.5" />
          <text x="12" y="15.5" textAnchor="middle" fontSize="11" fontWeight="700" fill="currentColor" stroke="none">
            ?
          </text>
        </svg>
      );
    case "reviews":
      return (
        <svg {...common}>
          <path d="M12 3l2.7 5.6 6.1.8-4.5 4.2 1.1 6-5.4-3-5.4 3 1.1-6L3.2 9.4l6.1-.8L12 3z" />
        </svg>
      );
    case "testimonials":
      return (
        <svg {...common}>
          <path d="M20 12a8 8 0 0 1-11.6 7.1L4 20l1-4.3A8 8 0 1 1 20 12z" />
          <path d="M8.5 11.5h.01M12 11.5h.01M15.5 11.5h.01" />
        </svg>
      );
    case "contact":
      return (
        <svg {...common}>
          <rect x="3" y="5.5" width="18" height="13" rx="2" />
          <path d="M4 7.5 12 13l8-5.5" />
        </svg>
      );
    case "socials":
      return (
        <svg {...common}>
          <circle cx="6" cy="12" r="2.5" />
          <circle cx="17.5" cy="5.5" r="2.5" />
          <circle cx="17.5" cy="18.5" r="2.5" />
          <path d="M8.2 10.8l7.1-4M8.2 13.2l7.1 4" />
        </svg>
      );
    case "settings":
      return (
        <svg {...common}>
          <path d="M4 8h10M18 8h2M4 16h4M12 16h8" />
          <circle cx="16" cy="8" r="2.2" />
          <circle cx="10" cy="16" r="2.2" />
        </svg>
      );
  }
}

function LogoutIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M14 4H6a1.5 1.5 0 0 0-1.5 1.5v13A1.5 1.5 0 0 0 6 20h8" />
      <path d="M10 12h10M17 8.5 20.5 12 17 15.5" />
    </svg>
  );
}

function TagIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3.5 3.5H12l8.5 8.5-7 7L3.5 11.5V3.5z" />
      <circle cx="8" cy="8" r="1.6" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Login                                                              */
/* ------------------------------------------------------------------ */

function Login({ onLogin }: { onLogin: () => void }) {
  const { content, updateSection } = useContent();
  const toast = useToast();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  /* forgot-password flow */
  const [step, setStep] = useState<"login" | "email" | "otp" | "reset">("login");
  const [email, setEmail] = useState("");
  const [demoCode, setDemoCode] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [resetError, setResetError] = useState("");

  const submitLogin = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      if (apiEnabled) {
        const { token } = await api.auth.login(password);
        setToken(token);
        /* First-run migration: if the server has no content yet, push local. */
        try {
          const { empty } = await api.content.fetchFull();
          if (empty) await api.content.push(loadContent());
        } catch {
          /* non-fatal */
        }
        onLogin();
      } else {
        if (password === content.settings.adminPassword) onLogin();
        else setError("Wrong password. Please try again.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed.");
    } finally {
      setBusy(false);
    }
  };

  const submitEmail = async (e: FormEvent) => {
    e.preventDefault();
    setResetError("");
    if (!email.trim()) { setResetError("Enter your admin email."); return; }
    if (apiEnabled) {
      setBusy(true);
      try {
        await api.auth.requestOtp(email.trim());
        setStep("otp");
      } catch (err) {
        setResetError(err instanceof Error ? err.message : "Could not send code.");
      } finally {
        setBusy(false);
      }
    } else {
      if (email.trim().toLowerCase() !== content.settings.email.toLowerCase()) {
        setResetError("That email doesn't match the admin email on file.");
        return;
      }
      setDemoCode(String(Math.floor(100000 + Math.random() * 900000)));
      setStep("otp");
    }
  };

  const finishReset = async () => {
    setResetError("");
    if (newPass.length < 6) { setResetError("New password must be at least 6 characters."); return; }
    if (newPass !== confirmPass) { setResetError("Passwords do not match."); return; }
    setBusy(true);
    try {
      if (apiEnabled) {
        await api.auth.resetPassword(email.trim(), otpCode || demoCode, newPass);
      } else {
        updateSection("settings", { ...content.settings, adminPassword: newPass });
      }
      toast("Password updated. Log in with your new password");
      setStep("login");
      setPassword("");
      setNewPass("");
      setConfirmPass("");
    } catch (err) {
      setResetError(err instanceof Error ? err.message : "Could not reset password.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-black px-6">
      <div className="w-full max-w-sm animate-pop-in rounded-xl border border-white/10 bg-white/[0.02] p-8">
        <p className="font-display text-lg font-bold">
          <span className="text-white">Mubashir</span>
          <span className="text-accent">Ahmed</span>
        </p>
        <h1 className="mt-1 font-display text-2xl font-bold text-white">Admin Panel</h1>
        <p className="mt-2 text-sm text-gray-500">
          {step === "login" && "Enter your password to manage the website content."}
          {step === "email" && "Enter your admin email. We'll send a 6-digit verification code to it."}
          {step === "reset" && "Set a new password for the admin panel."}
        </p>

        {step === "login" ? (
          <form onSubmit={submitLogin}>
            <div className="mt-6">
              <PasswordInput label="Password" value={password} onChange={setPassword} placeholder="••••••••" />
            </div>
            {error ? <p className="mt-2 text-xs text-red-400">{error}</p> : null}
            <button type="submit" disabled={busy} className="mt-5 w-full rounded-full bg-accent py-2.5 text-xs font-bold uppercase tracking-[0.2em] text-black transition-colors hover:bg-yellow-300 disabled:opacity-60">
              {busy ? "Signing in…" : "Unlock"}
            </button>
            <button type="button" onClick={() => { setStep("email"); setError(""); }} className="mt-3 w-full text-center text-[11px] text-gray-500 underline underline-offset-4 transition-colors hover:text-accent">
              Forgot password?
            </button>
            {/* <p className="mt-5 text-center text-[11px] text-gray-600">
              Default password: <span className="text-gray-400">admin123</span>. Change it in Settings.
            </p> */}
          </form>
        ) : null}

        {step === "email" ? (
          <form onSubmit={submitEmail}>
            <div className="mt-6">
              <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.16em] text-gray-400">Admin email</label>
              <input
                autoFocus
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setResetError(""); }}
                placeholder="you@example.com"
                className="w-full rounded-md border border-white/10 bg-neutral-950 px-4 py-3 text-sm text-white placeholder-gray-600 outline-none transition-colors focus:border-accent"
              />
            </div>
            {resetError ? <p className="mt-2 text-xs text-red-400">{resetError}</p> : null}
            <button type="submit" disabled={busy} className="mt-5 w-full rounded-full bg-accent py-2.5 text-xs font-bold uppercase tracking-[0.2em] text-black transition-colors hover:bg-yellow-300 disabled:opacity-60">
              {busy ? "Sending…" : "Send Code"}
            </button>
            <button type="button" onClick={() => setStep("login")} className="mt-3 w-full text-center text-[11px] text-gray-500 underline underline-offset-4 transition-colors hover:text-accent">
              ← Back to login
            </button>
          </form>
        ) : null}

        {step === "otp" ? (
          <OtpModal
            email={email}
            demoCode={demoCode}
            onClose={() => setStep("email")}
            onVerified={(c) => {
              setOtpCode(c);
              setStep("reset");
            }}
            verifyRemote={apiEnabled ? (c) => api.auth.verifyOtp(email.trim(), c).then(() => {}) : undefined}
          />
        ) : null}

        {step === "reset" ? (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              finishReset();
            }}
          >
            <div className="mt-6 space-y-4">
              <PasswordInput label="New password" value={newPass} onChange={setNewPass} hint="Min 6 characters" />
              <PasswordInput label="Confirm new password" value={confirmPass} onChange={setConfirmPass} />
            </div>
            {resetError ? <p className="mt-2 text-xs text-red-400">{resetError}</p> : null}
            <button type="submit" disabled={busy} className="mt-5 w-full rounded-full bg-accent py-2.5 text-xs font-bold uppercase tracking-[0.2em] text-black transition-colors hover:bg-yellow-300 disabled:opacity-60">
              {busy ? "Saving…" : "Set New Password"}
            </button>
          </form>
        ) : null}

        <a href="#/" className="mt-5 block text-center text-[11px] text-gray-500 underline underline-offset-4 transition-colors hover:text-accent">
          ← Back to website
        </a>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Shell                                                              */
/* ------------------------------------------------------------------ */

function AdminShell() {
  const { content } = useContent();
  const [tab, setTab] = useState<TabId>("dashboard");
  const [collapsed, setCollapsed] = useState(() => {
    try {
      return localStorage.getItem("ma_admin_sidebar") === "collapsed";
    } catch {
      return false;
    }
  });
  const toggleCollapsed = () => {
    setCollapsed((c) => {
      try {
        localStorage.setItem("ma_admin_sidebar", c ? "expanded" : "collapsed");
      } catch {
        /* ignore */
      }
      return !c;
    });
  };
  const { openGuide } = useFormattingGuide();
  const unread = content.messages.filter((m) => !m.read).length;

  const logout = () => {
    sessionStorage.removeItem("ma_admin_auth");
    setToken(null);
    window.location.hash = "#/";
  };

  const titles: Record<TabId, string> = {
    dashboard: "Dashboard",
    hero: "Hero / Home Section",
    about: "About Me Section",
    experience: "Work Experience & History",
    projects: "Projects Manager",
    sections: "Services, Stats & Homepage Layout",
    certifications: "Certifications & Licenses",
    faq: "FAQ Questions & Answers",
    reviews: "Reviews Manager",
    testimonials: "Testimonials Manager",
    contact: "Contact Info",
    socials: "Social Links",
    settings: "Site Settings",
  };

  return (
    <div className="flex min-h-screen bg-[#070707] text-white">
      <aside
        className={`sticky top-0 hidden h-dvh shrink-0 flex-col overflow-hidden bg-black/60 transition-all duration-300 ease-in-out md:flex ${
          collapsed ? "w-[76px] border-r border-transparent px-3 py-5" : "w-60 border-r border-white/10 p-5"
        }`}
      >
        <div className={`flex ${collapsed ? "flex-col items-center gap-3" : "items-center justify-between gap-2"}`}>
          {collapsed ? (
            <span key="brand-m" title="Mubashir Ahmed" className="animate-admin-fade-slide font-display text-2xl font-bold leading-none text-accent">
              M
            </span>
          ) : (
            <a key="brand-full" href="#/" className="animate-admin-fade-slide font-display text-base font-bold">
              <span className="text-white">Mubashir</span>
              <span className="text-accent">Ahmed</span>
            </a>
          )}
          <button
            type="button"
            onClick={toggleCollapsed}
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-white/10 text-gray-400 transition-colors hover:border-accent hover:text-accent"
          >
            {collapsed ? <ChevronRightIcon className="h-4 w-4" /> : <ChevronLeftIcon className="h-4 w-4" />}
          </button>
        </div>
        {!collapsed && <p className="mt-0.5 text-[10px] font-bold uppercase tracking-[0.3em] text-gray-600">Admin Panel</p>}

        <nav className="scrollbar-thin mt-8 min-h-0 flex-1 space-y-1 overflow-y-auto pr-1">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              title={collapsed ? t.label : undefined}
              className={`relative flex w-full items-center rounded-md text-sm transition-all duration-200 ${
                collapsed ? "justify-center px-2 py-2.5" : "justify-between px-3.5 py-2.5 text-left"
              } ${tab === t.id ? "bg-accent font-bold text-black" : "text-gray-400 hover:bg-white/5 hover:text-white"}`}
            >
              <span className={`flex items-center ${collapsed ? "" : "gap-3"}`}>
                <TabIcon id={t.id} className="h-[18px] w-[18px] shrink-0" />
                {!collapsed && <span className="whitespace-nowrap">{t.label}</span>}
              </span>
              {t.id === "dashboard" && unread > 0 ? (
                collapsed ? (
                  <span className={`absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[9px] font-bold ${tab === t.id ? "bg-black text-accent" : "bg-accent text-black"}`}>
                    {unread}
                  </span>
                ) : (
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${tab === t.id ? "bg-black text-accent" : "bg-accent text-black"}`}>
                    {unread}
                  </span>
                )
              ) : null}
            </button>
          ))}
        </nav>

        <div className={`mt-auto space-y-3 border-t border-white/10 pt-5 ${collapsed ? "space-y-2 pt-4" : ""}`}>
          {collapsed ? (
            <>
              <button
                type="button"
                onClick={openGuide}
                title="Formatting Tags Guide"
                className="flex w-full items-center justify-center rounded-lg border border-accent/40 bg-accent/10 py-2 text-accent transition-all hover:bg-accent hover:text-black"
              >
                <TagIcon className="h-4 w-4" />
              </button>
              <a href="#/" title="View Website" className="flex w-full items-center justify-center rounded-md py-2 text-gray-400 transition-colors hover:text-accent">
                <GlobeIcon className="h-4 w-4" />
              </a>
              <button onClick={logout} title="Logout" className="flex w-full items-center justify-center rounded-full border border-white/15 py-2 text-gray-300 transition-colors hover:border-red-400 hover:text-red-400">
                <LogoutIcon className="h-4 w-4" />
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={openGuide}
                className="flex w-full items-center justify-center gap-2 rounded-lg border border-accent/40 bg-accent/10 px-3 py-2 text-xs font-bold text-accent shadow-[0_0_15px_rgba(255,193,7,0.15)] transition-all hover:bg-accent hover:text-black"
              >
                <TagIcon className="h-4 w-4" />
                <span>Formatting Tags Guide</span>
              </button>
              <a href="#/" className="block text-center text-xs font-semibold text-gray-400 transition-colors hover:text-accent">
                ← View Website
              </a>
              <button onClick={logout} className="w-full rounded-full border border-white/15 py-2 text-[11px] font-bold uppercase tracking-wider text-gray-300 transition-colors hover:border-red-400 hover:text-red-400">
                Logout
              </button>
            </>
          )}
        </div>
      </aside>

      <div className="min-w-0 flex-1">
        <header className="sticky top-0 z-40 border-b border-white/10 bg-black/80 backdrop-blur">
          <div className="flex items-center justify-between gap-4 px-5 py-4 md:px-8">
            <div>
              <h1 className="font-display text-lg font-bold text-white">{titles[tab]}</h1>
              <p className="text-[11px] text-gray-600">
                {apiEnabled ? "Connected to backend. Changes sync to the server." : "Changes save to this browser. Export a backup from Settings."}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={openGuide}
                className="flex items-center gap-1.5 rounded-full border border-accent/40 bg-accent/10 px-3.5 py-2 text-[11px] font-bold uppercase tracking-wider text-accent shadow-[0_0_15px_rgba(255,193,7,0.15)] transition-all hover:bg-accent hover:text-black active:scale-95"
                title="Open BBCode & Formatting Guide"
              >
                <TagIcon className="h-3.5 w-3.5" />
                <span>Formatting Tags</span>
              </button>
              <a href="#/" className="hidden rounded-full border border-white/15 px-4 py-2 text-[11px] font-bold uppercase tracking-wider text-gray-300 transition-colors hover:border-accent hover:text-accent sm:block md:hidden lg:block">
                View Site
              </a>
              <button onClick={logout} className="rounded-full border border-white/15 px-4 py-2 text-[11px] font-bold uppercase tracking-wider text-gray-300 transition-colors hover:border-red-400 hover:text-red-400 md:hidden">
                Logout
              </button>
            </div>
          </div>
          <nav className="scrollbar-thin flex gap-1 overflow-x-auto px-4 pb-3 md:hidden">
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`shrink-0 rounded-full px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-wider transition-colors ${
                  tab === t.id ? "bg-accent text-black" : "bg-white/5 text-gray-400"
                }`}
              >
                {t.label}
                {t.id === "dashboard" && unread > 0 ? ` (${unread})` : ""}
              </button>
            ))}
          </nav>
        </header>

        <main className="mx-auto w-full max-w-4xl px-5 py-8 md:px-8">
          {tab === "dashboard" ? <DashboardTab /> : null}
          {tab === "hero" ? <HeroTab /> : null}
          {tab === "about" ? <AboutTab /> : null}
          {tab === "experience" ? <ExperienceTab /> : null}
          {tab === "projects" ? <ProjectsTab /> : null}
          {tab === "sections" ? <SectionsTab /> : null}
          {tab === "certifications" ? <CertificationsTab /> : null}
          {tab === "faq" ? <FaqTab /> : null}
          {tab === "reviews" ? <ReviewsTab /> : null}
          {tab === "testimonials" ? <TestimonialsTab /> : null}
          {tab === "contact" ? <ContactInfoTab /> : null}
          {tab === "socials" ? <SocialLinksTab /> : null}
          {tab === "settings" ? <SettingsTab /> : null}
        </main>
      </div>
    </div>
  );
}

export default function AdminApp() {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem("ma_admin_auth") === "1");

  return (
    <ToastProvider>
      <FormattingGuideProvider>
        {authed ? (
          <AdminShell />
        ) : (
          <Login
            onLogin={() => {
              sessionStorage.setItem("ma_admin_auth", "1");
              setAuthed(true);
            }}
          />
        )}
      </FormattingGuideProvider>
    </ToastProvider>
  );
}
