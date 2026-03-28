export type Project = {
  slug: string;
  title: string;
  summary: string;
  description: string;
  image: string;
  detailImage: string;
  technologies: string[];
  features: string[];
  liveDemoUrl: string;
  githubUrl: string;
};

export const projects: Project[] = [
  {
    slug: "church-engine",
    title: "Church Engine",
    summary: "Centralized doctrine and ministry platform with intuitive navigation and scalable access for growing communities.",
    description:
      "A centralized faith-based knowledge platform focused on structured content delivery, clarity, and accessibility at scale. The system emphasizes role-based workflows, intuitive navigation, and efficient content management to support hundreds of users consuming doctrine, teachings, and church resources.",
    image: "/Port1.jpg",
    detailImage: "/Deets1.jpg",
    technologies: ["Node.js", "Express", "EJS", "JavaScript", "HTML", "CSS", "PHP", "express-session", "bcryptjs", "dotenv"],
    features: [
      "Role-based authentication with admin approval workflows",
      "Centralized content management for doctrine and teachings",
      "Full CRUD system for structured topic organization",
      "Responsive dashboard for scalable user access",
      "Secure Supabase backend with real-time data handling"
    ],
    liveDemoUrl: "https://churchengine.onrender.com/index.html",
    githubUrl: "#"
  },
  {
    slug: "arc-engine",
    title: "ARC Engine",
    summary: "Internal platform for managing FAQs, processes, and operational knowledge with a structured and scalable system.",
    description:
      "A phonetics support platform focused on delivering structured FAQs and script-based guidance to improve pronunciation accuracy and consistency. The system emphasizes organized content flow, fast search and retrieval, and responsive UI patterns.",
    image: "/Port2.jpg",
    detailImage: "/Deets2.jpg",
    technologies: ["Node.js", "Express", "JavaScript", "HTML", "CSS", "Supabase", "OpenAI API", "dotenv"],
    features: [
      "Structured FAQ and script-based content organization",
      "Fast search and keyword-driven information retrieval",
      "Modular content system for quick updates and additions",
      "Role-based access for controlled content management"
    ],
    liveDemoUrl: "https://arc-engine.onrender.com/index.html",
    githubUrl: "#"
  },
  {
    slug: "arcalphonetics",
    title: "ARCAlphonetics Website",
    summary: "Interactive landing page with clear content, responsive design, and inquiry flows.",
    description:
      "Arcalphonetics is a phonetics-focused learning platform presented through a clean and engaging landing page that highlights speech services, clear offerings, and direct contact flow.",
    image: "/Port3.jpg",
    detailImage: "/Deets3.jpg",
    technologies: ["Wix", "Google Ads", "Google Analytics"],
    features: [
      "Guided service selection flow",
      "Optimized booking and inquiry forms",
      "Strong content hierarchy for conversion",
      "Mobile-first responsive UX"
    ],
    liveDemoUrl: "https://www.arcalphonetics.com/",
    githubUrl: "#"
  },
  {
    slug: "devfolio-api",
    title: "Devfolio API",
    summary: "API service powering content, project metadata, and messaging integrations.",
    description:
      "A backend API layer designed for scalable portfolio integrations, including project endpoints, contact workflows, and modular service expansion with structured JSON responses.",
    image: "/Port1.jpg",
    detailImage: "/Deets1.jpg",
    technologies: ["Node.js", "Express", "REST APIs", "PostgreSQL", "Supabase"],
    features: [
      "RESTful endpoints for projects and contact data",
      "Validation-first request handling",
      "Modular route and service architecture",
      "Prepared for auth and role-based expansion"
    ],
    liveDemoUrl: "#",
    githubUrl: "#"
  }
];

export function getProjectBySlug(slug: string) {
  return projects.find((project) => project.slug === slug);
}
