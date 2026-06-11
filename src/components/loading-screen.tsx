'use client';

import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';

interface NoteProps {
  x: number;
  y: number;
  delay: number;
  children: React.ReactNode;
}

function Note({ x, y, delay, children }: NoteProps) {
  return (
    <motion.g
      initial={{ y: y }}
      animate={{ y: [y - 8, y + 8, y - 8] }}
      transition={{
        duration: 2.2,
        repeat: Infinity,
        ease: "easeInOut",
        delay: delay,
      }}
    >
      <g transform={`translate(${x}, 0)`}>
        {children}
      </g>
    </motion.g>
  );
}

export default function LoadingScreen() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Enable forcing loader via URL parameter for testing/viewing (e.g. ?force-load=true)
    const params = new URLSearchParams(window.location.search);
    if (params.get('force-load') === 'true') {
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 5000);
      return () => clearTimeout(timer);
    }

    // Otherwise, check session storage to only show once per browser session
    const hasSeen = sessionStorage.getItem('raaga-loading-seen');
    if (hasSeen) {
      setIsLoading(false);
      return;
    }

    const timer = setTimeout(() => {
      setIsLoading(false);
      sessionStorage.setItem('raaga-loading-seen', 'true');
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  // Lock body scroll when loading is active
  useEffect(() => {
    if (isLoading) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isLoading]);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white"
        >
          {/* Subtle elegant background gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#FFF9F9]/30 pointer-events-none" />

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: 'easeOut' }}
            className="relative z-10 flex flex-col items-center text-center px-6"
          >
            {/* Logo Image */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative w-48 h-48 sm:w-64 sm:h-64 rounded-full overflow-hidden border-4 border-primary/20 shadow-2xl mb-8 bg-white"
            >
              <Image
                src="/logo.jpeg"
                alt="Raaga Bhairavi Logo"
                fill
                className="object-cover"
                priority
                sizes="256px"
              />
            </motion.div>

            {/* Title as RAAGABHAIRAVI in mystical/elegant font */}
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="font-cinzel text-4xl sm:text-6xl lg:text-7xl font-bold tracking-normal text-[#c60001] uppercase mb-3"
            >
              RAAGA BHAIRAVI
            </motion.h1>

            {/* Subtitle in elegant italic serif font */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="font-serif italic text-sm sm:text-lg tracking-[0.2em] text-primary/95 mt-1 mb-6"
            >
              Echos of Divinity
            </motion.p>

            {/* Music Notes Wave Loading Animation */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="w-full max-w-[280px] sm:max-w-[340px] h-24 flex items-center justify-center relative overflow-visible mt-2"
            >
              <svg
                viewBox="0 0 400 120"
                className="w-full h-full overflow-visible"
              >
                <defs>
                  <linearGradient id="wave-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#c60001" stopOpacity="0.15" />
                    <stop offset="50%" stopColor="#c60001" stopOpacity="0.6" />
                    <stop offset="100%" stopColor="#c60001" stopOpacity="0.15" />
                  </linearGradient>
                </defs>

                {/* 5 Wavy Staff Lines */}
                {[...Array(5)].map((_, i) => {
                  const yOffset = (i - 2) * 8;
                  return (
                    <motion.path
                      key={i}
                      d={`M 10 ${60 + yOffset} C 90 ${20 + yOffset}, 150 ${100 + yOffset}, 200 ${60 + yOffset} C 250 ${20 + yOffset}, 310 ${100 + yOffset}, 390 ${60 + yOffset}`}
                      fill="none"
                      stroke="url(#wave-grad)"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      animate={{
                        strokeWidth: [1.2, 1.8, 1.2],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        delay: i * 0.15,
                        ease: "easeInOut",
                      }}
                    />
                  );
                })}

                {/* Treble Clef (Left Side) */}
                <motion.g
                  initial={{ y: 0 }}
                  animate={{ y: [-3, 3, -3] }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  transform="translate(15, 20)"
                >
                  <path
                    d="M 15 45 C 10 40, 15 30, 20 30 C 25 30, 25 40, 20 45 C 13 52, 5 57, 5 65 C 5 75, 13 80, 20 80 C 30 80, 32 65, 30 50 C 28 30, 20 10, 20 0 L 20 85 C 20 90, 16 95, 12 95 C 8 95, 5 91, 5 87 C 5 83, 9 80, 13 80 C 16 80, 20 82, 20 85"
                    fill="none"
                    stroke="#c60001"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="drop-shadow-[0_2px_4px_rgba(198,0,1,0.2)]"
                  />
                </motion.g>

                {/* Floating Notes */}
                {/* Note 1 */}
                <Note x={75} y={42} delay={0.0}>
                  <ellipse cx="6" cy="0" rx="5" ry="3.5" transform="rotate(-20 6 0)" className="fill-[#c60001]" />
                  <line x1="10" y1="0" x2="10" y2="-18" stroke="#c60001" strokeWidth="1.8" strokeLinecap="round" />
                </Note>

                {/* Note 2 */}
                <Note x={125} y={65} delay={0.3}>
                  <ellipse cx="6" cy="0" rx="5" ry="3.5" transform="rotate(-20 6 0)" className="fill-[#c60001]" />
                  <line x1="10" y1="0" x2="10" y2="-18" stroke="#c60001" strokeWidth="1.8" strokeLinecap="round" />
                  <path d="M 10 -18 C 15 -14, 16 -10, 14 -6" stroke="#c60001" strokeWidth="1.8" fill="none" strokeLinecap="round" />
                </Note>

                {/* Note 3 */}
                <Note x={180} y={60} delay={0.6}>
                  <ellipse cx="6" cy="5" rx="5" ry="3.5" transform="rotate(-20 6 5)" className="fill-[#c60001]" />
                  <line x1="10" y1="5" x2="10" y2="-13" stroke="#c60001" strokeWidth="1.8" strokeLinecap="round" />
                  <ellipse cx="22" cy="1" rx="5" ry="3.5" transform="rotate(-20 22 1)" className="fill-[#c60001]" />
                  <line x1="26" y1="1" x2="26" y2="-17" stroke="#c60001" strokeWidth="1.8" strokeLinecap="round" />
                  <polygon points="10,-13 26,-17 26,-13 10,-9" className="fill-[#c60001]" />
                </Note>

                {/* Note 4 */}
                <Note x={245} y={38} delay={0.9}>
                  <ellipse cx="6" cy="0" rx="5" ry="3.5" transform="rotate(-20 6 0)" className="fill-[#c60001]" />
                  <line x1="10" y1="0" x2="10" y2="-18" stroke="#c60001" strokeWidth="1.8" strokeLinecap="round" />
                </Note>

                {/* Note 5 */}
                <Note x={295} y={62} delay={1.2}>
                  <ellipse cx="6" cy="0" rx="5" ry="3.5" transform="rotate(-20 6 0)" className="fill-[#c60001]" />
                  <line x1="10" y1="0" x2="10" y2="-18" stroke="#c60001" strokeWidth="1.8" strokeLinecap="round" />
                  <path d="M 10 -18 C 15 -14, 16 -10, 14 -6" stroke="#c60001" strokeWidth="1.8" fill="none" strokeLinecap="round" />
                </Note>

                {/* Note 6 */}
                <Note x={345} y={50} delay={1.5}>
                  <ellipse cx="6" cy="5" rx="5" ry="3.5" transform="rotate(-20 6 5)" className="fill-[#c60001]" />
                  <line x1="10" y1="5" x2="10" y2="-13" stroke="#c60001" strokeWidth="1.8" strokeLinecap="round" />
                  <ellipse cx="22" cy="1" rx="5" ry="3.5" transform="rotate(-20 22 1)" className="fill-[#c60001]" />
                  <line x1="26" y1="1" x2="26" y2="-17" stroke="#c60001" strokeWidth="1.8" strokeLinecap="round" />
                  <polygon points="10,-13 26,-17 26,-13 10,-9" className="fill-[#c60001]" />
                </Note>
              </svg>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

