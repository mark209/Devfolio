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
    title: "Fast API",
    summary: "Core API built from the ground up to ingest, structure, and manage phonetics data from external sources for reliable downstream use",
    description:
      "A custom-built API developed from the ground up to handle the ingestion, structuring, and lifecycle management of externally provided phonetics data. The system is designed to transform raw datasets into organized, system-ready formats while maintaining consistency and scalability. To streamline access and simplify ongoing data operations, retrieval is integrated with Google Sheets, enabling efficient updates, visibility, and lightweight management without compromising performance or data integrity.",
    image: "/Port4.jpg",
    detailImage: "/Deets4.jpg",
    technologies: ["Python", "FastAPI", "REST APIs", "Google Sheets API", "gspread", "Uvicorn", "JSON"],
    features: [
  "Ingests and structures externally sourced data",
  "Retrieves and updates data seamlessly via Google Sheets integration",
  "Validation-first request handling and error management",
  "Modular API architecture prepared for scaling and future expansions",
  "Optimized for performance and consistent data delivery"
],
    liveDemoUrl: "#",
    githubUrl: "#"
  }
];

export function getProjectBySlug(slug: string) {
  return projects.find((project) => project.slug === slug);
}

