/* Initial website content schema shell.
   No hardcoded personal details — all actual data is managed and populated
   directly via MongoDB database and the Admin panel. */

const seedContent = {
  settings: {
    logoFirst: "",
    logoSecond: "",
    sideSignature: "",
    copyrightName: "",
    email: "",
    adminPassword: "",
    navLinks: [
      { id: "home", label: "Home" },
      { id: "about", label: "About" },
      { id: "projects", label: "Projects" },
      { id: "contact", label: "Contact" },
    ],
    resume: { fileName: "", data: "" },
  },

  hero: {
    greeting: "",
    nameIntro: "",
    name: "",
    roleLine1: "",
    roleLine2: "",
    buttonText: "",
    buttonLink: "#projects",
    orbitText: "",
    staticArcText: "",
    staticArcRadius: 104,
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
    buttonText: "",
  },

  projects: [],
  reviews: [],
  testimonials: [],
  contactItems: [],
  messages: [],
  stats: [],
  services: [],
  cta: {},
  socials: [],
  faqs: [],
  experiences: [],
  certifications: [],
};

module.exports = { seedContent };
