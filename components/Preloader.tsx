"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

type PreloaderProps = {
  onComplete: () => void;
};

const loaderLines = ["Welcome, Friendly Visitor.", "Let's build something together."];

export function Preloader({ onComplete }: PreloaderProps) {
  const [lineIndex, setLineIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [displayedLines, setDisplayedLines] = useState<string[]>([]);
  const [hideLoader, setHideLoader] = useState(false);

  useEffect(() => {
    if (lineIndex >= loaderLines.length) {
      const closeTimer = setTimeout(() => setHideLoader(true), 800);
      return () => clearTimeout(closeTimer);
    }

    const currentLine = loaderLines[lineIndex];
    if (charIndex < currentLine.length) {
      const typingTimer = setTimeout(() => setCharIndex((prev) => prev + 1), 65);
      return () => clearTimeout(typingTimer);
    }

    const pauseTimer = setTimeout(() => {
      setDisplayedLines((prev) => [...prev, currentLine]);
      setLineIndex((prev) => prev + 1);
      setCharIndex(0);
    }, 420);

    return () => clearTimeout(pauseTimer);
  }, [charIndex, lineIndex]);

  useEffect(() => {
    if (!hideLoader) {
      return;
    }
    const timeout = setTimeout(() => onComplete(), 850);
    return () => clearTimeout(timeout);
  }, [hideLoader, onComplete]);

  return (
    <AnimatePresence>
      {!hideLoader && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-surface-900"
          initial={{ y: 0 }}
          exit={{ y: "-100%" }}
          transition={{ duration: 0.85, ease: [0.8, 0, 0.2, 1] }}
        >
          <div className="w-full max-w-2xl px-6 text-center">
            <div className="relative mx-auto inline-block overflow-hidden">
              <p className="bg-gradient-to-r from-zinc-200 via-white to-zinc-400 bg-clip-text font-heading text-6xl font-black tracking-tight text-transparent sm:text-7xl">
                EJ
              </p>
              <motion.span
                className="pointer-events-none absolute inset-y-0 w-1/2 bg-gradient-to-r from-transparent via-white/55 to-transparent"
                animate={{ x: ["-120%", "220%"] }}
                transition={{ duration: 2.6, ease: "easeInOut" }}
              />
            </div>

            <div className="mx-auto mt-7 max-w-xl text-center">
              {displayedLines.map((line) => (
                <p key={line} className="text-base leading-8 text-white/80 sm:text-lg">
                  {line}
                </p>
              ))}
              {lineIndex < loaderLines.length && (
                <p className="text-base leading-8 text-white/90 sm:text-lg">
                  {loaderLines[lineIndex].slice(0, charIndex)}
                  <motion.span
                    className="ml-1 inline-block h-5 w-[2px] bg-white/90 align-middle"
                    animate={{ opacity: [1, 0.2, 1] }}
                    transition={{ duration: 0.8, repeat: Infinity }}
                  />
                </p>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
