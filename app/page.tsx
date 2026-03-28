"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { type FormEvent, type MouseEvent, useEffect, useState } from "react";
import { Preloader } from "@/components/Preloader";
import { SceneBackground } from "@/components/SceneBackground";
import { projects } from "@/lib/projects";

const navItems = [
  { label: "About", href: "#about" },
  { label: "Porfolio", href: "#portfolio" },
    { label: "Contact", href: "#contact" }
];

const socialLinks = [
  { href: "https://www.instagram.com/elijvvh_", label: "Instagram", icon: "/icons/instagram.svg" },
  { href: "https://www.facebook.com/elijah.james.5667#", label: "Facebook", icon: "/icons/facebook.svg" },
  { href: "https://www.linkedin.com/in/elijah-cubing", label: "LinkedIn", icon: "/icons/linkedin.svg" }
];

export default function HomePage() {
  const [bootChecked, setBootChecked] = useState(false);
  const [showPreloader, setShowPreloader] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [activePortfolioTab, setActivePortfolioTab] = useState<"projects" | "techstack">("projects");
  const [showAllProjects, setShowAllProjects] = useState(false);
  const [scrollDirection, setScrollDirection] = useState<"up" | "down">("down");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formStatus, setFormStatus] = useState<"idle" | "success" | "error">("idle");
  const [formFeedback, setFormFeedback] = useState("");
  const [scrambleText, setScrambleText] = useState("Hello! I'm");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    website: ""
  });

  useEffect(() => {
    const seenPreloader = sessionStorage.getItem("portfolio_preloader_seen") === "1";
    if (seenPreloader) {
      setLoaded(true);
      setShowPreloader(false);
      setBootChecked(true);
      return;
    }

    setShowPreloader(true);
    setBootChecked(true);
  }, []);

  useEffect(() => {
    if (!loaded) {
      return;
    }

    const hash = window.location.hash;
    if (!hash) {
      return;
    }

    const target = document.querySelector(hash);
    if (!target) {
      return;
    }

    const timer = setTimeout(() => {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 80);

    return () => clearTimeout(timer);
  }, [loaded]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setFormStatus("idle");
    setFormFeedback("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      const result = (await response.json().catch(() => ({}))) as { error?: string };

      if (!response.ok) {
        throw new Error(result.error || "Request failed");
      }

      setFormStatus("success");
      setFormFeedback("Message sent successfully.");
      setFormData({ name: "", email: "", subject: "", message: "", website: "" });
    } catch (error) {
      setFormStatus("error");
      setFormFeedback(error instanceof Error ? error.message : "Failed to send. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (!loaded) {
      return;
    }

    const target = "Hello! I'm";
    const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let frame = 0;

    const interval = setInterval(() => {
      frame += 1;
      const reveal = Math.min(target.length, Math.floor(frame / 4));
      const next = target
        .split("")
        .map((char, index) => {
          if (char === " ") {
            return " ";
          }
          if (index < reveal) {
            return target[index];
          }
          return charset[Math.floor(Math.random() * charset.length)];
        })
        .join("");

      setScrambleText(next);
      if (reveal >= target.length) {
        clearInterval(interval);
        setScrambleText(target);
      }
    }, 70);

    return () => clearInterval(interval);
  }, [loaded]);


  useEffect(() => {
    let lastY = window.scrollY;

    const onScroll = () => {
      const currentY = window.scrollY;
      setScrollDirection(currentY > lastY ? "down" : "up");
      lastY = currentY;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  const handleNavClick = (event: MouseEvent<HTMLAnchorElement>, href: string) => {
    if (!href.startsWith("#")) {
      return;
    }
    event.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      window.history.replaceState(null, "", href);
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handlePreloaderComplete = () => {
    sessionStorage.setItem("portfolio_preloader_seen", "1");
    setShowPreloader(false);
    setLoaded(true);
  };

  if (!bootChecked) {
    return null;
  }

  const displayedProjects = showAllProjects ? projects : projects.slice(0, 3);

  return (
    <>
      {showPreloader && <Preloader onComplete={handlePreloaderComplete} />}
      <SceneBackground mode="particles" />

      <main className="relative z-10 min-h-screen overflow-hidden">
        <div className="ambient-grid pointer-events-none absolute inset-0 opacity-20" />

        <section className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-6 pb-16 pt-8 sm:px-10 md:pt-10">
          <motion.header
            className="flex items-center justify-between"
            initial={{ opacity: 0, y: 20 }}
            animate={loaded ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <p className="font-heading text-xl font-bold tracking-tight">DevFolio.</p>
            <nav className="hidden items-center gap-8 text-sm text-white/70 md:flex">
              {navItems.map((item) => (
                <motion.a
                  key={item.label}
                  href={item.href}
                  onClick={(event) => handleNavClick(event, item.href)}
                  className="relative transition-colors hover:text-white"
                  whileHover={{ scale: 1.05, textShadow: "0 0 12px rgba(123,102,255,0.8)" }}
                >
                  {item.label}
                </motion.a>
              ))}
            </nav>
          </motion.header>

          <div className="mt-14 grid flex-1 items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
            <motion.div
              initial={{ opacity: 0, y: 32 }}
              animate={loaded ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.9, delay: 0.35 }}
            >
              <motion.p
                className="text-sm uppercase tracking-[0.34em] text-white/55"
                initial={{ opacity: 0, y: 12 }}
                animate={loaded ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.45, delay: 0.42 }}
              >
                {scrambleText}
              </motion.p>
              <motion.h1
                className="mt-4 max-w-2xl bg-gradient-to-r from-white via-cyan-200 to-violet-300 bg-[length:180%_180%] bg-clip-text font-heading text-4xl font-extrabold leading-[1.08] tracking-tight text-transparent sm:text-5xl md:text-6xl"
              >
                Elijah James Cubing
              </motion.h1>
              <p className="mt-6 max-w-xl text-base leading-relaxed text-white/65 sm:text-lg">
                I build scalable, user-focused platforms that turn complex content into structured, accessible digital
                systems.
              </p>

              <div className="mt-10 flex flex-wrap gap-4">
                <motion.a
                  href="#portfolio"
                  className="rounded-full bg-white px-7 py-3 font-heading text-sm font-semibold text-black"
                  whileHover={{ scale: 1.04, boxShadow: "0 0 26px rgba(255,255,255,0.35)" }}
                  whileTap={{ scale: 0.98 }}
                >
                  View Projects
                </motion.a>
                <motion.a
                  href="#contact"
                  className="rounded-full border border-white/25 bg-white/5 px-7 py-3 font-heading text-sm font-semibold text-white backdrop-blur-sm"
                  whileHover={{ scale: 1.04, boxShadow: "0 0 26px rgba(59,165,255,0.25)" }}
                  whileTap={{ scale: 0.98 }}
                >
                  Contact Me
                </motion.a>
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={social.label}
                    className="rounded-full border border-white/20 bg-white/5 p-2.5 text-xs text-white/80 transition hover:border-white/40 hover:text-white"
                  >
                    <Image
                      src={social.icon}
                      alt={social.label}
                      width={18}
                      height={18}
                      className="opacity-95 brightness-0 invert"
                    />
                  </a>
                ))}
              </div>

            </motion.div>

            <motion.div
              className="mx-auto w-full max-w-md"
              initial={{ opacity: 0, y: 48 }}
              animate={loaded ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.95, delay: 0.45 }}
            >
              <article className="relative overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.03] p-4 shadow-hero backdrop-blur-sm">
                <div className="relative overflow-hidden rounded-2xl">
                  <Image
                    src="/Profile.jpg"
                    alt="Portrait hero image"
                    width={760}
                    height={980}
                    className="h-[500px] w-full object-cover saturate-110"
                    priority
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-black/15 to-transparent" />
                </div>

                <div className="absolute inset-x-8 bottom-8 rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur-md">
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate font-heading text-sm font-semibold text-white">@elijvvh_</p>
                      <p className="mt-1 text-xs text-white/75">Online and available for collaborations</p>
                    </div>
                    <a
                      href="#contact"
                      className="rounded-xl border border-white/25 bg-black/35 px-3 py-2 text-xs font-semibold text-white transition hover:bg-black/55"
                    >
                      Let&apos;s Talk
                    </a>
                  </div>
                </div>
              </article>
            </motion.div>
          </div>

          <motion.section
            id="about"
            className="mt-8 rounded-3xl border border-white/10 bg-white/[0.02] p-6 sm:p-8"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.25 }}
            transition={{ duration: scrollDirection === "down" ? 0.7 : 0 }}
          >
            <div className="grid items-center gap-8 lg:grid-cols-[0.9fr_1.1fr]">
              <div className="mx-auto w-full max-w-sm">
                <div className="relative aspect-[4/5] overflow-hidden rounded-[26px] border border-white/10 bg-white/[0.03] p-3 shadow-hero">
                  <Image
                    src="/Profile2.jpg"
                    alt="Elijah James Cubing about portrait"
                    fill
                    sizes="(max-width: 1024px) 90vw, 360px"
                    className="rounded-2xl object-cover object-top"
                  />
                </div>
              </div>

              <div>
                <p className="text-sm uppercase tracking-[0.34em] text-white/55">About Me</p>
                <h2 className="mt-3 max-w-2xl font-heading text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">
                  Full Stack Web Developer
                </h2>
                <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/65">
                  I&apos;m a full-stack developer focused on building structured, scalable platforms that solve real-world problems.
                  I specialize in turning complex information into organized, accessible systems where clarity, control, and reliability matter.
                  My work combines clean front-end execution with practical backend architecture to deliver fast, maintainable, and reliable applications that are built for long-term use, not just initial launch.
                </p>

                <div className="mt-6 max-w-xl rounded-2xl bg-white/[0.04] p-5 backdrop-blur-sm">
                  <p className="text-sm text-white/75">Curriculum Vitae</p>
                  <p className="mt-1 text-xs text-white/55">View or download my latest CV in PDF format.</p>
                  <div className="mt-4 flex flex-wrap gap-3">
                    <a
                      href="/CUBING_Resume.pdf"
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex rounded-full bg-white px-5 py-2 text-xs font-semibold text-black transition hover:scale-[1.03]"
                    >
                      View CV
                    </a>
                    <a
                      href="/Cubing_Resume.pdf"
                      download="Cubing_Resume.pdf"
                      className="inline-flex rounded-full border border-white/20 bg-white/5 px-5 py-2 text-xs font-semibold text-white transition hover:border-white/35"
                    >
                      Download CV
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </motion.section>

          <motion.section
            id="portfolio"
            className="mt-8 rounded-3xl border border-white/10 bg-white/[0.02] p-6 sm:p-8"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: scrollDirection === "down" ? 0.7 : 0 }}
          >
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-sm uppercase tracking-[0.34em] text-white/55">Porfolio</p>
              <h2 className="mt-3 font-heading text-3xl font-extrabold tracking-tight sm:text-4xl">
                Portfolio Showcase
              </h2>
              <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-white/65 sm:text-base">
                Explore a selection of projects that highlight both technical execution and design precision. Each build focuses on performance, 
                scalability, and clean architecture, combining modern frontend frameworks with efficient backend systems.
              </p>
            </div>

            <div className="mx-auto mt-8 flex max-w-4xl justify-center rounded-2xl border border-white/10 bg-white/[0.03] p-2">
              <button
                type="button"
                onClick={() => setActivePortfolioTab("projects")}
                className={`w-full rounded-xl px-4 py-3 text-center text-sm font-semibold transition sm:w-1/2 ${
                  activePortfolioTab === "projects"
                    ? "bg-white/10 text-white"
                    : "text-white/65 hover:text-white"
                }`}
              >
                Projects
              </button>
              <button
                type="button"
                onClick={() => setActivePortfolioTab("techstack")}
                className={`w-full rounded-xl px-4 py-3 text-center text-sm font-semibold transition sm:w-1/2 ${
                  activePortfolioTab === "techstack"
                    ? "bg-white/10 text-white"
                    : "text-white/65 hover:text-white"
                }`}
              >
                Tech Stack
              </button>
            </div>

            <div className="mt-8 min-h-[360px]">
              <AnimatePresence mode="wait">
                {activePortfolioTab === "projects" ? (
                  <>
                  <motion.div
                    key="projects"
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -14 }}
                    transition={{ duration: 0.35 }}
                    className="grid gap-5 md:grid-cols-2 xl:grid-cols-3"
                  >
                    {displayedProjects.map((item) => (
                      <article
                        key={item.title}
                        className="group overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-sm"
                      >
                        <div className="relative h-48 overflow-hidden">
                          <Image
                            src={item.image}
                            alt={item.title}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                            className="object-cover transition duration-500 group-hover:scale-105"
                          />
                          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-black/15 to-transparent" />
                        </div>
                        <div className="p-5">
                          <h3 className="font-heading text-lg font-semibold text-white">{item.title}</h3>
                          <p className="mt-2 text-sm leading-relaxed text-white/65">{item.summary}</p>
                          <Link
                            prefetch
                            href={`/projects/${item.slug}`}
                            className="mt-4 inline-flex rounded-full border border-white/20 px-4 py-2 text-xs font-semibold text-white transition hover:border-white/40"
                          >
                            View Details
                          </Link>
                        </div>
                      </article>
                    ))}
                  </motion.div>
                  {projects.length > 3 && (
                    <div className="mt-5 flex justify-center">
                      <button
                        type="button"
                        onClick={() => setShowAllProjects((prev) => !prev)}
                        className="rounded-full border border-white/20 bg-white/[0.03] px-5 py-2 text-xs font-semibold text-white transition hover:border-white/40"
                      >
                        {showAllProjects ? "See Less" : "See More"}
                      </button>
                    </div>
                  )}
                  </>
                ) : (
                  <motion.div
                    key="techstack"
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -14 }}
                    transition={{ duration: 0.35 }}
                    className="grid gap-5 md:grid-cols-2 xl:grid-cols-4"
                  >
                    <article className="rounded-2xl border border-cyan-300/20 bg-gradient-to-b from-cyan-400/10 to-transparent p-5 backdrop-blur-sm">
                      <h3 className="font-heading text-base font-semibold text-white">Languages</h3>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {[
                          { label: "Python", icon: "/icons/tech/python.svg" },
                          { label: "JavaScript", icon: "/icons/tech/javascript.svg" },
                          { label: "HTML", icon: "/icons/tech/html.svg" },
                          { label: "CSS", icon: "/icons/tech/css3.svg" }
                        ].map((item) => (
                          <span
                            key={item.label}
                            className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs text-white/90"
                          >
                            <Image
                              src={item.icon}
                              alt={item.label}
                              width={14}
                              height={14}
                              className="opacity-95 brightness-0 invert"
                            />
                            {item.label}
                          </span>
                        ))}
                      </div>
                    </article>

                    <article className="rounded-2xl border border-violet-300/20 bg-gradient-to-b from-violet-400/10 to-transparent p-5 backdrop-blur-sm">
                      <h3 className="font-heading text-base font-semibold text-white">Frontend & Backend</h3>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {["React", "Node.js", "FastAPI", "Flask"].map((item) => (
                          <span
                            key={item}
                            className="rounded-full bg-white/10 px-3 py-1 text-xs text-white/90"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </article>

                    <article className="rounded-2xl border border-emerald-300/20 bg-gradient-to-b from-emerald-400/10 to-transparent p-5 backdrop-blur-sm">
                      <h3 className="font-heading text-base font-semibold text-white">APIs & Databases</h3>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {["REST APIs", "PostgreSQL", "MySQL", "Supabase"].map((item) => (
                          <span
                            key={item}
                            className="rounded-full bg-white/10 px-3 py-1 text-xs text-white/90"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </article>

                    <article className="rounded-2xl border border-amber-300/20 bg-gradient-to-b from-amber-400/10 to-transparent p-5 backdrop-blur-sm">
                      <h3 className="font-heading text-base font-semibold text-white">Tools & Analytics</h3>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {["GitHub", "Postman", "Google Analytics"].map((item) => (
                          <span
                            key={item}
                            className="rounded-full bg-white/10 px-3 py-1 text-xs text-white/90"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </article>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.section>

          <motion.section
            id="contact"
            className="mt-8 rounded-3xl border border-white/10 bg-white/[0.02] p-6 sm:p-8"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: scrollDirection === "down" ? 0.7 : 0 }}
          >
            <div className="grid items-start gap-8 lg:grid-cols-[0.95fr_1.05fr]">
              <div className="space-y-6">
                <div>
                  <p className="text-sm uppercase tracking-[0.34em] text-white/55">Contact</p>
                  <h2 className="mt-3 font-heading text-3xl font-extrabold tracking-tight sm:text-4xl">
                    Let&apos;s work together!
                  </h2>
                  <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/65 sm:text-base">
                    I&apos;m always open to meaningful collaborations and new opportunities. Send a message and I&apos;ll
                    get back to you as soon as possible.
                  </p>
                </div>

                <div className="space-y-3 text-sm text-white/80">
                  <p>
                    <span className="mr-2 text-white/50">Email:</span>
                    ejcubing@gmail.com
                  </p>
                  <p>
                    <span className="mr-2 text-white/50">Based in:</span>
                    Philippines
                  </p>
                </div>

                <div className="flex flex-wrap gap-3">
                  {socialLinks.map((social) => (
                    <a
                      key={`contact-${social.label}`}
                      href={social.href}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={social.label}
                      className="rounded-full border border-white/20 bg-white/[0.03] p-2.5 text-xs font-semibold text-white/80 transition hover:border-white/35 hover:text-white"
                    >
                      <Image
                        src={social.icon}
                        alt={social.label}
                        width={18}
                        height={18}
                        className="opacity-95 brightness-0 invert"
                      />
                    </a>
                  ))}
                </div>
              </div>

              <form
                onSubmit={handleSubmit}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-sm sm:p-6"
              >
                <div className="space-y-4">
                  <input
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    value={formData.website}
                    onChange={(event) => setFormData((prev) => ({ ...prev, website: event.target.value }))}
                    className="hidden"
                    aria-hidden="true"
                  />
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(event) => setFormData((prev) => ({ ...prev, name: event.target.value }))}
                    placeholder="Your Name"
                    className="w-full rounded-xl border border-white/15 bg-white/[0.03] px-4 py-3 text-sm text-white placeholder:text-white/45 outline-none transition focus:border-white/30"
                  />
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(event) => setFormData((prev) => ({ ...prev, email: event.target.value }))}
                    placeholder="Your Email"
                    className="w-full rounded-xl border border-white/15 bg-white/[0.03] px-4 py-3 text-sm text-white placeholder:text-white/45 outline-none transition focus:border-white/30"
                  />
                  <input
                    type="text"
                    required
                    value={formData.subject}
                    onChange={(event) => setFormData((prev) => ({ ...prev, subject: event.target.value }))}
                    placeholder="Subject"
                    className="w-full rounded-xl border border-white/15 bg-white/[0.03] px-4 py-3 text-sm text-white placeholder:text-white/45 outline-none transition focus:border-white/30"
                  />
                  <textarea
                    required
                    rows={6}
                    value={formData.message}
                    onChange={(event) => setFormData((prev) => ({ ...prev, message: event.target.value }))}
                    placeholder="Your Message"
                    className="w-full resize-none rounded-xl border border-white/15 bg-white/[0.03] px-4 py-3 text-sm text-white placeholder:text-white/45 outline-none transition focus:border-white/30"
                  />

                  <div className="flex flex-col items-start gap-3">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full rounded-xl bg-white px-6 py-3 text-sm font-semibold text-black transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {isSubmitting ? "Sending..." : "Send Message"}
                    </button>

                    {formStatus === "success" && (<p className="text-sm text-emerald-300">{formFeedback}</p>)}
                    {formStatus === "error" && (<p className="text-sm text-rose-300">{formFeedback}</p>)}
                  </div>
                </div>
              </form>
            </div>
          </motion.section>
        </section>
      </main>
    </>
  );
}




























