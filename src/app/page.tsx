'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Calendar, ArrowRight, Play, Compass, Award } from 'lucide-react';

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

export default function Home() {
  return (
    <div className="bg-background relative w-full overflow-hidden">
      {/* 1. Fullscreen Cinematic Hero Section */}
      <section className="relative w-full h-screen flex flex-col justify-center items-center overflow-hidden">
        {/* Background Cinematic Image */}
        <Image
          src="/homeback.png"
          alt="RAAGA BHAIRAVI Cinematic Background"
          fill
          className="absolute top-0 left-0 w-full h-full object-cover object-[center_top] z-0"
          sizes="100vw"
          priority
          quality={90}
        />

        {/* Cinematic overlay: nearly transparent at top (faces visible), soft fade at bottom for text */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/5 via-white/20 to-[#FFF9F9]/90 z-10" />

        {/* Floating subtle light/glow particles */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full filter blur-[100px] animate-pulse z-10" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary-secondary/5 rounded-full filter blur-[100px] animate-pulse z-10" />

        {/* Hero Content - logo centered with space from navbar, text below */}
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="relative z-20 text-center max-w-4xl px-6 flex flex-col items-center justify-center space-y-5 mt-28"
        >
          {/* Spacer to preserve space where the logo was */}
          <div className="w-44 h-44 sm:w-56 sm:h-56 mb-4 pointer-events-none" />

          {/* Group Title */}
          <motion.h1
            variants={fadeInUp}
            className="font-serif text-5xl sm:text-7xl font-bold tracking-tight text-foreground"
          >
            RAAGA <span className="text-primary">BHAIRAVI</span>
          </motion.h1>

          {/* Subtitle / Tagline */}
          <motion.p
            variants={fadeInUp}
            className="text-text-secondary text-base sm:text-xl font-medium tracking-[0.15em] uppercase max-w-2xl leading-relaxed"
          >
            Symphony of Classical Majesty & Contemporary Elegance
          </motion.p>

          <motion.p
            variants={fadeInUp}
            className="text-text-light text-sm sm:text-base max-w-lg leading-relaxed font-light"
          >
            Experience premium Carnatic fusion, majestic orchestration, and artistic luxury music curation.
          </motion.p>

          {/* Animated Start Button */}
          <motion.div variants={fadeInUp} className="pt-4">
            <Link
              href="/vision"
              className="px-8 py-4 rounded-full bg-primary hover:bg-primary-hover text-white text-xs font-semibold uppercase tracking-widest glow-button flex items-center space-x-2 transition-transform duration-300 hover:scale-105"
            >
              <span>Start Experience</span>
              <Play className="w-4 h-4 fill-white" />
            </Link>
          </motion.div>
        </motion.div>

        {/* Scroll down indicator */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 10 }}
          transition={{
            repeat: Infinity,
            repeatType: 'reverse',
            duration: 1.2,
          }}
          className="absolute bottom-10 z-20 flex flex-col items-center cursor-pointer"
          onClick={() => {
            const nextSec = document.getElementById('about-teaser');
            nextSec?.scrollIntoView({ behavior: 'smooth' });
          }}
        >
          <span className="text-[10px] tracking-[0.3em] uppercase text-text-secondary mb-2">Scroll Down</span>
          <div className="w-[1px] h-12 bg-primary/40" />
        </motion.div>
      </section>

      {/* 2. About Preview Section */}
      <section id="about-teaser" className="py-24 px-6 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8 }}
          className="space-y-6"
        >
          <div className="flex items-center space-x-3 text-primary">
            <Compass className="w-5 h-5" />
            <span className="text-xs uppercase tracking-[0.25em] font-semibold">Our Identity</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-foreground leading-tight">
            Transcending Musical Boundaries Through Pure Artistry
          </h2>
          <p className="text-text-secondary text-sm sm:text-base leading-relaxed">
            Formed in the heart of Carnatic heritage, RAAGA BHAIRAVI blends classical raga hierarchies with global jazz, orchestral harmonies, and experimental sounds. Our performance acts as a sacred portal, bridging traditions to contemporary auditoriums worldwide.
          </p>
          <div className="pt-2">
            <Link
              href="/vision"
              className="inline-flex items-center space-x-2 text-xs uppercase tracking-widest font-semibold text-primary hover:text-primary-hover group"
            >
              <span>Explore Our Vision</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8 }}
          className="relative h-[350px] sm:h-[450px] w-full rounded-2xl overflow-hidden glass-panel p-3"
        >
          <div className="relative w-full h-full rounded-xl overflow-hidden shadow-md">
            <Image
              src="https://images.pexels.com/photos/164938/pexels-photo-164938.jpeg?auto=compress&cs=tinysrgb&w=800"
              alt="Musicians performance"
              fill
              className="object-cover transition-transform duration-700 hover:scale-105"
              sizes="(max-w-7xl) 50vw, 100vw"
              priority
            />
          </div>
        </motion.div>
      </section>

      {/* 3. Featured Performances Teaser */}
      <section className="bg-white py-24 px-6 border-y border-primary/5">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <div className="flex items-center justify-center space-x-3 text-primary">
              <Award className="w-5 h-5" />
              <span className="text-xs uppercase tracking-[0.25em] font-semibold">Performances</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-foreground">
              Grand Live Concerts
            </h2>
            <p className="text-text-secondary text-xs sm:text-sm">
              Discover highlights from our world tours and concert hall recordings.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6">
            {/* Performance Card 1 */}
            <motion.div
              whileHover={{ y: -5 }}
              transition={{ duration: 0.3 }}
              className="glass-panel p-4 rounded-2xl flex flex-col space-y-4 hover:shadow-lg transition-shadow"
            >
              <div className="relative h-64 rounded-xl overflow-hidden shadow-sm">
                <Image
                  src="https://images.pexels.com/photos/1916824/pexels-photo-1916824.jpeg?auto=compress&cs=tinysrgb&w=800"
                  alt="Concert scene"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="space-y-2">
                <h3 className="font-serif font-bold text-lg text-foreground">Symphony Hall Concert</h3>
                <p className="text-xs text-text-secondary leading-relaxed line-clamp-2">
                  A premium collaborative performance with the local Chamber Orchestra featuring complex violin and percussion jugalbandis.
                </p>
              </div>
            </motion.div>

            {/* Performance Card 2 */}
            <motion.div
              whileHover={{ y: -5 }}
              transition={{ duration: 0.3 }}
              className="glass-panel p-4 rounded-2xl flex flex-col space-y-4 hover:shadow-lg transition-shadow"
            >
              <div className="relative h-64 rounded-xl overflow-hidden shadow-sm">
                <Image
                  src="https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=800"
                  alt="Concert scene 2"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="space-y-2">
                <h3 className="font-serif font-bold text-lg text-foreground">Global Carnatic Fusion Tour</h3>
                <p className="text-xs text-text-secondary leading-relaxed line-clamp-2">
                  Showcasing contemporary improvisations of classic ragas combined with western rhythms and ambient synthesizers.
                </p>
              </div>
            </motion.div>
          </div>

          <div className="text-center pt-6">
            <Link
              href="/performances"
              className="inline-flex items-center space-x-2 px-6 py-3 rounded-full border border-primary/20 hover:border-primary text-xs uppercase tracking-wider font-semibold text-foreground hover:text-primary transition-all"
            >
              <span>View Performance History</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 4. Upcoming Events Preview Section */}
      <section className="py-24 px-6 max-w-7xl mx-auto space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-3 text-primary">
              <Calendar className="w-5 h-5" />
              <span className="text-xs uppercase tracking-[0.25em] font-semibold">Live Events</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-foreground">
              Experience Us Live
            </h2>
          </div>
          <div>
            <Link
              href="/events"
              className="inline-flex items-center space-x-2 px-6 py-3 rounded-full bg-primary hover:bg-primary-hover text-white text-xs uppercase tracking-wider font-semibold glow-button"
            >
              <span>All Tour Dates</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Static preview event card */}
        <div className="glass-panel p-6 rounded-2xl flex flex-col md:flex-row items-center gap-8 shadow-sm">
          <div className="relative w-full md:w-48 h-48 rounded-xl overflow-hidden flex-shrink-0">
            <Image
              src="https://images.pexels.com/photos/167636/pexels-photo-167636.jpeg?auto=compress&cs=tinysrgb&w=800"
              alt="Event banner"
              fill
              className="object-cover"
            />
          </div>
          <div className="flex-1 space-y-4 w-full text-center md:text-left">
            <div>
              <span className="text-xs text-primary font-semibold tracking-widest uppercase">Dec 18, 2026</span>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-foreground mt-1">
                The Heritage Fusion Festival
              </h3>
              <p className="text-xs text-text-light mt-1">Concert Hall, New Delhi, India</p>
            </div>
            <p className="text-xs sm:text-sm text-text-secondary leading-relaxed max-w-2xl">
              Join us for a premium classical-contemporary crossover performance headline act alongside globally acclaimed instrumental soloists.
            </p>
          </div>
          <div className="flex-shrink-0 w-full md:w-auto text-center">
            <Link
              href="/contact"
              className="inline-block w-full md:w-auto px-6 py-3 rounded-full border border-primary/20 hover:border-primary text-xs uppercase tracking-wider font-bold text-primary hover:bg-primary hover:text-white transition-all"
            >
              Book Passes
            </Link>
          </div>
        </div>
      </section>

      {/* 5. Contact / Booking Teaser */}
      <section className="bg-white/80 py-24 px-6 border-t border-primary/5 text-center relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/5 rounded-full filter blur-[80px]" />
        <div className="relative z-10 max-w-xl mx-auto space-y-8">
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-foreground">
            Bring RAAGA BHAIRAVI to Your Event
          </h2>
          <p className="text-text-secondary text-sm sm:text-base leading-relaxed">
            We are available for grand concert tours, cultural festivals, premium corporate galas, and select classical musical gatherings.
          </p>
          <div className="pt-4">
            <Link
              href="/contact"
              className="px-8 py-4 rounded-full bg-primary hover:bg-primary-hover text-white text-xs font-semibold uppercase tracking-widest glow-button inline-flex items-center space-x-2 transition-transform duration-300 hover:scale-105"
            >
              <span>Request Booking Details</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
