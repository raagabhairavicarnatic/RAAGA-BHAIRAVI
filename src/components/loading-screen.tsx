'use client';

import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';

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
              className="font-serif italic text-sm sm:text-lg tracking-[0.2em] text-primary/95 mt-1 mb-10"
            >
              Echos of Divinity
            </motion.p>

            {/* Small Loading Icon / Spinner */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="w-6 h-6 border-2 border-primary/20 border-t-primary rounded-full animate-spin"
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
