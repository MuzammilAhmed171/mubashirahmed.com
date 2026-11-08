/* Types and default content for the whole site.
   Every field here is editable from the admin panel. */

export type LabelValue = { label: string; value: string };
export type SkillRow = { name: string; level: number };

export type Project = {
  id?: string;
  title: string;
  gallery: string[];
  liveUrl: string;
  description: string;
  stack: string[];
  featured?: boolean;
  hidden?: boolean;
};

export type Review = {
  id?: string;
  name: string;
  role: string;
  platform: string;
  rating: number;
  text: string;
  when: string;
  photo: string;
  initials: string;
  hidden?: boolean;
};

export type Testimonial = {
  id?: string;
  quote: string;
  name: string;
  role: string;
  project: string;
  initials: string;
  rating: number;
  video: string;
  duration: string;
  hidden?: boolean;
};

export type ContactItem = {
  title: string;
  value: string;
  icon: "signpost" | "phone" | "plane" | "globe";
  href?: string;
};

export type Message = {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  date: string;
  read: boolean;
};

export type HeroContent = {
  greeting: string;
  nameIntro: string;
  name: string;
  roleLine1: string;
  roleLine2: string;
  buttonText: string;
  buttonLink: string;
  orbitText: string;
  staticArcText?: string;
  staticArcRadius?: number;
  curvedStaticText?: string;
};

export type AboutContent = {
  profileImage: string;
  headline: string;
  bioParagraphs: string[];
  basicInfo: LabelValue[];
  skills: SkillRow[];
  infoGrid: LabelValue[];
  statNumber: string;
  statLabel: string;
  buttonText: string;
};

export type SiteSettings = {
  logoFirst: string;
  logoSecond: string;
  sideSignature: string;
  copyrightName: string;
  email: string;
  adminPassword: string;
  navLinks: { id: string; label: string; hidden?: boolean }[];
  resume: { fileName: string; data: string };
  footerTagline?: string;
  footerQuickLinksTitle?: string;
  footerBottomNote?: string;
  showExperience?: boolean;
  showCertifications?: boolean;
  sectionOrder?: string[];
  /** Per-section visibility. key = SectionId, value = true (shown) | false (hidden) */
  sectionVisibility?: Partial<Record<string, boolean>>;
  /** Custom heading titles per section (overrides built-in heading text) */
  sectionNames?: Partial<Record<string, string>>;
  /** Custom watermark/subtitle text per section (the faint large text behind headings) */
  sectionWatermarks?: Partial<Record<string, string>>;
};

export const ALL_NAV_LINKS: { id: string; label: string; hidden?: boolean }[] = [
  { id: "home", label: "Home", hidden: false },
  { id: "about", label: "About", hidden: false },
  { id: "experience", label: "Experience", hidden: true },
  { id: "projects", label: "Projects", hidden: false },
  { id: "services", label: "Services", hidden: true },
  { id: "certifications", label: "Certifications", hidden: true },
  { id: "reviews", label: "Reviews", hidden: true },
  { id: "testimonials", label: "Testimonials", hidden: true },
  { id: "faq", label: "FAQ", hidden: true },
  { id: "contact", label: "Contact", hidden: false },
];

export type SectionId =
  | "hero"
  | "stats"
  | "about"
  | "experience"
  | "projects"
  | "services"
  | "certifications"
  | "reviews"
  | "testimonials"
  | "cta"
  | "faq"
  | "contact";

export const DEFAULT_SECTION_ORDER: SectionId[] = [
  "hero",
  "stats",
  "about",
  "experience",
  "projects",
  "services",
  "certifications",
  "reviews",
  "testimonials",
  "cta",
  "faq",
  "contact",
];

export const SECTION_METADATA: Record<SectionId, { label: string; desc: string }> = {
  hero: { label: "Hero / Introduction", desc: "Top greeting, headline, roles, and call-to-action buttons" },
  stats: { label: "Stats Banner (Yellow)", desc: "Experience, projects delivered, client satisfaction metrics" },
  about: { label: "About Me", desc: "Biography, profile image, skills bars, and basic information" },
  experience: { label: "Work Experience", desc: "Professional employment history, current roles, and companies" },
  projects: { label: "Projects & Creations", desc: "Showcase portfolio, interactive galleries, and live links" },
  services: { label: "Services I Offer (Yellow)", desc: "Full Stack, React Native mobile, AI/ML, and UI/UX offerings" },
  certifications: { label: "Certifications & Licenses", desc: "Verified credentials, awards, and licenses" },
  reviews: { label: "Client Reviews", desc: "Client ratings and written testimonials" },
  testimonials: { label: "Video Testimonials", desc: "Interactive cinema video stories and client feedback" },
  cta: { label: "CTA Banner (Yellow)", desc: "Hire Me bold banner with direct project inquiry trigger" },
  faq: { label: "FAQ Questions", desc: "Frequently asked questions with expandable animated answers" },
  contact: { label: "Contact & Footer", desc: "Contact cards, message form, and bottom yellow footer" },
};

export type StatItem = { value: string; label: string };
export type ServiceItem = { icon: string; num: string; title: string; desc: string };
export type CtaContent = {
  badge: string;
  title: string;
  highlight: string;
  titleEnd: string;
  description: string;
  buttonText: string;
  buttonLink: string;
  secondaryText: string;
  secondaryLink: string;
};

export type SocialPlatform =
  | "github"
  | "linkedin"
  | "upwork"
  | "fiverr"
  | "twitter"
  | "instagram"
  | "facebook"
  | "youtube"
  | "whatsapp"
  | "mail"
  | "globe";

export type SocialLink = {
  id: string;
  platform: SocialPlatform;
  label: string;
  url: string;
  active: boolean;
};

export const DEFAULT_SOCIALS: SocialLink[] = [];

export type FaqItem = {
  id: string;
  q: string;
  a: string;
  category?: string;
  active?: boolean;
};

export const DEFAULT_FAQS: FaqItem[] = [];

export type ExperienceItem = {
  id: string;
  role: string;
  company: string;
  period: string; // e.g. "2023 - Present"
  location?: string; // e.g. "Remote / Worldwide"
  type?: string; // e.g. "Full-time", "Contract", "Freelance"
  description: string;
  technologies: string[];
  link?: string;
  active?: boolean;
};

export const DEFAULT_EXPERIENCES: ExperienceItem[] = [];

export type CertificationItem = {
  id: string;
  title: string;
  issuer: string; // e.g. "Meta", "Google", "DeepLearning.AI"
  issueDate: string; // e.g. "2024"
  credentialUrl?: string;
  credentialId?: string;
  badgeImage?: string;
  active?: boolean;
};

export const DEFAULT_CERTIFICATIONS: CertificationItem[] = [];

export type SiteContent = {
  settings: SiteSettings;
  hero: HeroContent;
  about: AboutContent;
  projects: Project[];
  reviews: Review[];
  testimonials: Testimonial[];
  contactItems: ContactItem[];
  messages: Message[];
  stats?: StatItem[];
  services?: ServiceItem[];
  cta?: CtaContent;
  socials?: SocialLink[];
  faqs?: FaqItem[];
  experiences?: ExperienceItem[];
  certifications?: CertificationItem[];
};

export const uid = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36);

const IMG = {
  profile: "",
  ecommerce: "",
  foodhub: "",
  analytics: "",
};

export const BASIC_INFO: LabelValue[] = [];
export const SKILLS: SkillRow[] = [];
export const INFO_GRID: LabelValue[] = [];
export const PROJECTS: Project[] = [];
export const REVIEWS: Review[] = [];
export const TESTIMONIALS: Testimonial[] = [];
export const CONTACT_ITEMS: ContactItem[] = [];
export const PROFILE_IMAGE = "";

