import { useEffect, useState } from "react";
import AdminApp from "./admin/AdminApp";
import About from "./components/About";
import Contact from "./components/Contact";
import Hero from "./components/Hero";
import Navbar from "./components/Navbar";
import Projects from "./components/Projects";
import { Reviews, Testimonials } from "./components/Social";
import { ContentProvider, useContent } from "./store/content";
import CustomCursor from "./components/CustomCursor";
import AmbientBackground from "./components/AmbientBackground";
import ScrollProgress from "./components/ScrollProgress";
import FloatingSocialDock from "./components/FloatingSocialDock";
import { StatsBanner, ServiceStrip, CtaBanner } from "./components/YellowSections";
import FAQ from "./components/FAQ";
import Experience from "./components/Experience";
import Certifications from "./components/Certifications";
import SkeletonPortfolio from "./components/SkeletonPortfolio";
import { DEFAULT_SECTION_ORDER, type SectionId } from "./data";

function useHashRoute() {
  const [hash, setHash] = useState(() => window.location.hash);
  useEffect(() => {
    const onChange = () => setHash(window.location.hash);
    window.addEventListener("hashchange", onChange);
    return () => window.removeEventListener("hashchange", onChange);
  }, []);
  return hash;
}

// function AdminButton() {
//   return (
//     <button
//       type="button"
//       onClick={() => {
//         window.location.hash = "#/admin";
//       }}
//       title="Admin Panel"
//       aria-label="Open admin panel"
//       className="fixed bottom-6 right-6 z-40 flex h-12 w-12 items-center justify-center rounded-full border border-white/15 bg-black/80 text-gray-500 shadow-[0_10px_30px_rgba(0,0,0,0.6)] backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:border-accent hover:text-accent hover:shadow-[0_10px_35px_rgba(255,193,7,0.25)]"
//     >
//       <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" className="h-5 w-5" aria-hidden="true">
//         <path d="M4 7h16" />
//         <path d="M4 12h16" />
//         <path d="M4 17h16" />
//         <circle cx="9" cy="7" r="2.1" className="fill-black" />
//         <circle cx="15" cy="12" r="2.1" className="fill-black" />
//         <circle cx="7" cy="17" r="2.1" className="fill-black" />
//       </svg>
//     </button>
//   );
// }

function Site() {
  const { content, isLoading } = useContent();

  if (isLoading && (!content.hero?.name || content.hero.name.trim() === "")) {
    return <SkeletonPortfolio />;
  }

  const sectionOrder = (content.settings.sectionOrder as SectionId[]) || DEFAULT_SECTION_ORDER;

  const sectionMap: Record<SectionId, React.ReactNode> = {
    hero: <Hero key="hero" />,
    stats: <StatsBanner key="stats" />,
    about: <About key="about" />,
    experience: <Experience key="experience" />,
    projects: <Projects key="projects" />,
    services: <ServiceStrip key="services" />,
    certifications: <Certifications key="certifications" />,
    reviews: <Reviews key="reviews" />,
    testimonials: <Testimonials key="testimonials" />,
    cta: <CtaBanner key="cta" />,
    faq: <FAQ key="faq" />,
    contact: <Contact key="contact" />,
  };

  const isSectionVisible = (secId: SectionId) => {
    if (content.settings.sectionVisibility?.[secId] === false) return false;
    if (secId === "experience" && content.settings.showExperience === false) return false;
    if (secId === "certifications" && content.settings.showCertifications === false) return false;
    return true;
  };

  const visibleSections = sectionOrder.filter(isSectionVisible);

  return (
    <div className="relative min-h-screen bg-black font-sans text-white antialiased">
      {/* Interactive smooth Custom Cursor Follower */}
      <CustomCursor />

      {/* Top golden reading progress bar & circular Back-to-Top button */}
      <ScrollProgress />

      {/* Dynamic ambient cursor glow & floating golden particles */}
      <AmbientBackground />

      {/* Floating Right-Side Vertical Social Dock with anti-merging color adaptation */}
      <FloatingSocialDock />


      <div aria-hidden="true" className="fixed bottom-0 left-7 z-40 hidden flex-col items-center gap-5 xl:flex">
        <span className="text-[10px] font-semibold uppercase tracking-[0.4em] text-gray-600 [writing-mode:vertical-rl]">
          {content.settings.sideSignature}
        </span>
        <span className="h-24 w-px bg-gradient-to-b from-gray-700 to-transparent" />
      </div>

      <Navbar />

      <main className="relative z-10">
        {visibleSections.map((secId) => sectionMap[secId] || null)}
      </main>

      {/* <AdminButton /> */}
    </div>
  );
}

function Root() {
  const hash = useHashRoute();
  return hash.startsWith("#/admin") ? <AdminApp /> : <Site />;
}

export default function App() {
  return (
    <ContentProvider>
      <Root />
    </ContentProvider>
  );
}
