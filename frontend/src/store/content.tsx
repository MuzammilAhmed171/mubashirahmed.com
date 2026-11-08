import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  BASIC_INFO,
  CONTACT_ITEMS,
  INFO_GRID,
  PROFILE_IMAGE,
  PROJECTS,
  REVIEWS,
  SKILLS,
  TESTIMONIALS,
  DEFAULT_SOCIALS,
  DEFAULT_FAQS,
  DEFAULT_EXPERIENCES,
  DEFAULT_CERTIFICATIONS,
  ALL_NAV_LINKS,
  uid,
  type SocialLink,
  type SocialPlatform,
  type FaqItem,
  type ExperienceItem,
  type CertificationItem,
  type CtaContent,
  type SiteContent,
} from "../data";
import { api, apiEnabled, getToken } from "../lib/api";

export type {
  SiteContent,
  Project,
  Review,
  Testimonial,
  ContactItem,
  HeroContent,
  AboutContent,
  SiteSettings,
  StatItem,
  ServiceItem,
  CtaContent,
  SocialLink,
  SocialPlatform,
  FaqItem,
} from "../data";
export { uid, DEFAULT_SOCIALS, DEFAULT_FAQS } from "../data";

const DEFAULT_CTA: CtaContent = {
  badge: "",
  title: "",
  highlight: "",
  titleEnd: "",
  description: "",
  buttonText: "Start a Project",
  buttonLink: "#contact",
  secondaryText: "",
  secondaryLink: "",
};

/* Defaults (Blank shell — all live content is fetched dynamically from MongoDB) */
const DEFAULT_CONTENT: SiteContent = {
  settings: {
    logoFirst: "",
    logoSecond: "",
    sideSignature: "",
    copyrightName: "",
    email: "",
    adminPassword: "",
    navLinks: ALL_NAV_LINKS,
    resume: { fileName: "", data: "" },
    footerTagline: "",
    footerQuickLinksTitle: "Quick Links",
    footerBottomNote: "",
  },
  hero: {
    greeting: "",
    nameIntro: "",
    name: "",
    roleLine1: "",
    roleLine2: "",
    buttonText: "My Works",
    buttonLink: "#projects",
    orbitText: "",
    staticArcText: "",
    staticArcRadius: 108,
  },
  about: {
    profileImage: "",
    headline: "",
    bioParagraphs: [],
    basicInfo: [],
    skills: [],
    infoGrid: [],
    statNumber: "",
    statLabel: "",
    buttonText: "Get in Touch",
  },
  projects: [],
  reviews: [],
  testimonials: [],
  contactItems: [],
  messages: [],
  stats: [],
  services: [],
  cta: DEFAULT_CTA,
  socials: [],
  faqs: [],
  experiences: [],
  certifications: [],
};

const STORAGE_KEY = "ma_portfolio_content_v4";



/**
 * Deep-merge `remote` onto `local`, but when the remote value is an empty string
 * and the local value is non-empty (e.g. data-URL image), keep the local value.
 * For arrays of objects with an `id` field, matching is done by `id` (not by index).
 */
function mergePreferLocal(local: unknown, remote: unknown): unknown {
  if (remote === null || remote === undefined) return local ?? remote;
  if (local === null || local === undefined) return remote;

  if (typeof remote === "string" && remote === "" && typeof local === "string" && local !== "") {
    return local;
  }

  if (Array.isArray(remote)) {
    if (!Array.isArray(local)) return remote;
    const isObjectArray =
      remote.length > 0 && typeof remote[0] === "object" && remote[0] !== null && "id" in remote[0];
    if (isObjectArray) {
      const localById = new Map<string, unknown>();
      (local as Array<Record<string, unknown>>).forEach((item) => {
        if (item && typeof item === "object" && typeof item.id === "string") {
          localById.set(item.id, item);
        }
      });
      return remote.map((remoteItem) => {
        if (remoteItem && typeof remoteItem === "object" && remoteItem !== null && "id" in remoteItem) {
          const localItem = localById.get((remoteItem as { id: string }).id);
          return localItem ? mergePreferLocal(localItem, remoteItem) : remoteItem;
        }
        return remoteItem;
      });
    }
    return remote.map((remoteItem, i) => mergePreferLocal((local as unknown[])[i], remoteItem));
  }

  if (typeof remote === "object" && typeof local === "object") {
    const out: Record<string, unknown> = { ...(local as Record<string, unknown>), ...(remote as Record<string, unknown>) };
    for (const key of Object.keys(out)) {
      if (key in (local as Record<string, unknown>) && key in (remote as Record<string, unknown>)) {
        out[key] = mergePreferLocal(
          (local as Record<string, unknown>)[key],
          (remote as Record<string, unknown>)[key],
        );
      }
    }
    return out;
  }

  return remote;
}

function withIds<T extends { id?: string }>(arr: T[], prefix: string): T[] {
  return arr.map((x, i) => (x.id ? x : { ...x, id: `${prefix}_${i}` }));
}

function normalizeNavLinks(
  savedNavLinks?: { id: string; label: string; hidden?: boolean }[]
): { id: string; label: string; hidden?: boolean }[] {
  if (!Array.isArray(savedNavLinks) || savedNavLinks.length === 0) {
    return ALL_NAV_LINKS;
  }
  const existingIds = new Set(savedNavLinks.map((l) => l.id));
  const result = [...savedNavLinks];
  for (const item of ALL_NAV_LINKS) {
    if (!existingIds.has(item.id)) {
      result.push({ ...item, hidden: true });
    }
  }
  return result;
}

function mergeContent(saved: Partial<SiteContent> | null): SiteContent {
  if (!saved || typeof saved !== "object") return DEFAULT_CONTENT;
  return {
    settings: {
      ...DEFAULT_CONTENT.settings,
      ...(saved.settings ?? {}),
      navLinks: normalizeNavLinks(saved.settings?.navLinks),
      resume: saved.settings?.resume ?? DEFAULT_CONTENT.settings.resume,
    },
    hero: { ...DEFAULT_CONTENT.hero, ...(saved.hero ?? {}) },
    about: { ...DEFAULT_CONTENT.about, ...(saved.about ?? {}) },
    projects: withIds(
      Array.isArray(saved.projects) ? saved.projects : [],
      "pj"
    ),
    reviews: withIds(Array.isArray(saved.reviews) ? saved.reviews : DEFAULT_CONTENT.reviews, "rv"),
    testimonials: withIds(
      Array.isArray(saved.testimonials) ? saved.testimonials : DEFAULT_CONTENT.testimonials,
      "tm",
    ),
    contactItems: Array.isArray(saved.contactItems) ? saved.contactItems : DEFAULT_CONTENT.contactItems,
    messages: Array.isArray(saved.messages) ? saved.messages : [],
    stats: Array.isArray(saved.stats) ? saved.stats : DEFAULT_CONTENT.stats,
    services: Array.isArray(saved.services) ? saved.services : DEFAULT_CONTENT.services,
    cta: saved.cta ? { ...DEFAULT_CONTENT.cta, ...saved.cta } : DEFAULT_CONTENT.cta,
    socials: Array.isArray(saved.socials) ? saved.socials : DEFAULT_CONTENT.socials,
    faqs: withIds(
      Array.isArray(saved.faqs) ? saved.faqs : [],
      "faq",
    ),
  };
}

export function loadContent(): SiteContent {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? mergeContent(JSON.parse(raw) as Partial<SiteContent>) : DEFAULT_CONTENT;
  } catch {
    return DEFAULT_CONTENT;
  }
}

type ContentStore = {
  content: SiteContent;
  isLoading: boolean;
  updateSection: <K extends keyof SiteContent>(key: K, value: SiteContent[K]) => void;
  addMessage: (m: { name: string; email: string; subject: string; message: string }) => void;
  resetAll: () => void;
  importContent: (json: string) => boolean;
  refreshFromServer: () => void;
};

const ContentContext = createContext<ContentStore | null>(null);

export function ContentProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<SiteContent>(loadContent);
  const [isLoading, setIsLoading] = useState(true);
  const contentRef = useRef(content);
  const pushTimer = useRef<number | null>(null);

  useEffect(() => {
    contentRef.current = content;
  }, [content]);

  /* Persist locally always (offline fallback + cache) */
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(content));
    } catch {
      /* storage full, content stays in memory */
    }
  }, [content]);

  /* Hydrate from the backend once (public view) */
  useEffect(() => {
    if (!apiEnabled) {
      setIsLoading(false);
      return;
    }
    let cancelled = false;
    api.content
      .fetchPublic()
      .then(({ content: remote, empty }) => {
        if (cancelled) return;
        if (!empty && remote) {
          const remoteContent = remote as Partial<SiteContent>;
          const sanitizedProjects = Array.isArray(remoteContent.projects)
            ? remoteContent.projects
            : [];
          setContent({
            ...DEFAULT_CONTENT,
            ...remoteContent,
            settings: {
              ...DEFAULT_CONTENT.settings,
              ...(remoteContent.settings || {}),
              navLinks: normalizeNavLinks(remoteContent.settings?.navLinks),
            },
            hero: { ...DEFAULT_CONTENT.hero, ...(remoteContent.hero || {}) },
            about: { ...DEFAULT_CONTENT.about, ...(remoteContent.about || {}) },
            projects: sanitizedProjects,
            reviews: Array.isArray(remoteContent.reviews) ? remoteContent.reviews : [],
            testimonials: Array.isArray(remoteContent.testimonials) ? remoteContent.testimonials : [],
            contactItems: Array.isArray(remoteContent.contactItems) ? remoteContent.contactItems : [],
            stats: Array.isArray(remoteContent.stats) ? remoteContent.stats : [],
            services: Array.isArray(remoteContent.services) ? remoteContent.services : [],
            cta: { ...DEFAULT_CTA, ...(remoteContent.cta || {}) },
            socials: Array.isArray(remoteContent.socials) ? remoteContent.socials : [],
            faqs: Array.isArray(remoteContent.faqs) ? remoteContent.faqs : [],
            experiences: Array.isArray(remoteContent.experiences) ? remoteContent.experiences : [],
            certifications: Array.isArray(remoteContent.certifications) ? remoteContent.certifications : [],
          });
        }
        setIsLoading(false);
      })
      .catch(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const refreshFromServer = useCallback(() => {
    if (!apiEnabled || !getToken()) return;
    api.content
      .fetchFull()
      .then(({ content: full, empty }) => {
        if (!empty && full) {
          const fullContent = full as Partial<SiteContent>;
          const sanitizedProjects = Array.isArray(fullContent.projects)
            ? fullContent.projects
            : [];
          setContent({
            ...DEFAULT_CONTENT,
            ...fullContent,
            settings: {
              ...DEFAULT_CONTENT.settings,
              ...(fullContent.settings || {}),
              navLinks: normalizeNavLinks(fullContent.settings?.navLinks),
            },
            hero: { ...DEFAULT_CONTENT.hero, ...(fullContent.hero || {}) },
            about: { ...DEFAULT_CONTENT.about, ...(fullContent.about || {}) },
            projects: sanitizedProjects,
            reviews: Array.isArray(fullContent.reviews) ? fullContent.reviews : [],
            testimonials: Array.isArray(fullContent.testimonials) ? fullContent.testimonials : [],
            contactItems: Array.isArray(fullContent.contactItems) ? fullContent.contactItems : [],
            stats: Array.isArray(fullContent.stats) ? fullContent.stats : [],
            services: Array.isArray(fullContent.services) ? fullContent.services : [],
            cta: { ...DEFAULT_CTA, ...(fullContent.cta || {}) },
            socials: Array.isArray(fullContent.socials) ? fullContent.socials : [],
            faqs: Array.isArray(fullContent.faqs) ? fullContent.faqs : [],
            experiences: Array.isArray(fullContent.experiences) ? fullContent.experiences : [],
            certifications: Array.isArray(fullContent.certifications) ? fullContent.certifications : [],
          });
        }
      })
      .catch(() => { });
  }, []);

  /* Immediately sync section update to backend & local storage */
  const updateSection = useCallback(
    async <K extends keyof SiteContent>(key: K, value: SiteContent[K]) => {
      const nextContent = { ...contentRef.current, [key]: value };
      setContent(nextContent);
      contentRef.current = nextContent;

      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(nextContent));
      } catch {
        /* storage full, content stays in memory */
      }

      if (apiEnabled && getToken()) {
        if (pushTimer.current) window.clearTimeout(pushTimer.current);
        try {
          await api.content.push(nextContent);
        } catch (err) {
          console.error("[store] Instant push to backend failed:", err);
        }
      }
    },
    [],
  );

  const addMessage = useCallback(
    (m: { name: string; email: string; subject: string; message: string }) => {
      setContent((c) => ({
        ...c,
        messages: [{ ...m, id: uid(), date: new Date().toISOString(), read: false }, ...c.messages],
      }));
      if (apiEnabled) api.messages.send(m).catch(() => { });
    },
    [],
  );

  const resetAll = useCallback(() => {
    setContent(DEFAULT_CONTENT);
  }, []);

  const importContent = useCallback((json: string): boolean => {
    try {
      const parsed = JSON.parse(json) as Partial<SiteContent>;
      if (!parsed || typeof parsed !== "object" || !parsed.hero) return false;
      setContent(mergeContent(parsed));
      return true;
    } catch {
      return false;
    }
  }, []);

  return (
    <ContentContext.Provider
      value={{ content, isLoading, updateSection, addMessage, resetAll, importContent, refreshFromServer }}
    >
      {children}
    </ContentContext.Provider>
  );
}

export function useContent() {
  const ctx = useContext(ContentContext);
  if (!ctx) throw new Error("useContent must be used inside ContentProvider");
  return ctx;
}
