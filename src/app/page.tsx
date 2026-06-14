'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Calendar, ArrowRight, Play, Compass, Award, MapPin } from 'lucide-react';
import { db } from '@/lib/firebase';
import { collection, query, orderBy, limit, getDocs, where } from 'firebase/firestore';

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

const renderBoldText = (text: string) => {
  if (!text) return '';
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <span key={index} className="font-medium text-foreground">{part.slice(2, -2)}</span>;
    }
    return part;
  });
};

export default function Home() {
  const [latestEvent, setLatestEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [homePerformances, setHomePerformances] = useState<any[]>([]);
  const [loadingPerf, setLoadingPerf] = useState(true);

  useEffect(() => {
    const fetchLatestEvent = async () => {
      try {
        const todayStr = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
        
        // Find closest upcoming event
        const upcomingQuery = query(
          collection(db, 'events'),
          where('date', '>=', todayStr),
          orderBy('date', 'asc'),
          limit(1)
        );
        let querySnapshot = await getDocs(upcomingQuery);
        
        if (querySnapshot.empty) {
          // Fallback to the latest past event
          const pastQuery = query(
            collection(db, 'events'),
            orderBy('date', 'desc'),
            limit(1)
          );
          querySnapshot = await getDocs(pastQuery);
        }

        if (!querySnapshot.empty) {
          const doc = querySnapshot.docs[0];
          const data = doc.data();
          setLatestEvent({
            id: doc.id,
            ...data
          });
        }
      } catch (error) {
        console.error('Error fetching latest event:', error);
      } finally {
        setLoading(false);
      }
    };

    const fetchHomePerformances = async () => {
      try {
        const perfQuery = query(
          collection(db, 'performances'),
          orderBy('date', 'desc')
        );
        const querySnapshot = await getDocs(perfQuery);
        const allPerf: any[] = [];
        querySnapshot.forEach((doc) => {
          allPerf.push({ id: doc.id, ...doc.data() });
        });

        // Get pinned ones only (up to 2)
        const pinned = allPerf.filter(p => p.pinned === true).slice(0, 2);
        setHomePerformances(pinned);
      } catch (error) {
        console.error('Error fetching home performances:', error);
      } finally {
        setLoadingPerf(false);
      }
    };

    fetchLatestEvent();
    fetchHomePerformances();
  }, []);

  const formatDate = (dateStr: string) => {
    try {
      const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(dateStr).toLocaleDateString('en-US', options);
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="bg-background relative w-full overflow-hidden">
      {/* 1. Fullscreen Cinematic Hero Section */}
      <section className="relative w-full h-screen flex flex-col justify-center items-center overflow-hidden">
        {/* Background Cinematic Image (Blurred on mobile to fill viewport height, covers on desktop) */}
        <div className="absolute inset-0 w-full h-full z-0 block sm:hidden">
          <Image
            src="/homeback.png"
            alt="RAAGA BHAIRAVI Blurred Background"
            fill
            className="object-cover object-[center_top] filter blur-xl opacity-35"
            sizes="100vw"
            priority
            quality={50}
          />
        </div>

        {/* Foreground Cinematic Image (Framed, sharp, showing all 3 people on mobile) */}
        <div className="absolute top-[88px] left-4 right-4 aspect-[1436/707] rounded-2xl overflow-hidden shadow-lg border border-white/30 z-20 block sm:hidden">
          <Image
            src="/homeback.png"
            alt="RAAGA BHAIRAVI Painting"
            fill
            className="object-cover"
            sizes="100vw"
            priority
            quality={90}
          />
        </div>

        {/* Desktop Background Cinematic Image (Cover, hidden on mobile) */}
        <div className="absolute inset-0 w-full h-full z-0 hidden sm:block">
          <Image
            src="/homeback.png"
            alt="RAAGA BHAIRAVI Cinematic Background"
            fill
            className="object-cover object-[center_top]"
            sizes="100vw"
            priority
            quality={90}
          />
        </div>

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
          className="relative z-20 text-center max-w-4xl px-6 flex flex-col items-center justify-center space-y-4 sm:space-y-5 mt-12 sm:mt-28"
        >
          {/* Spacer to preserve space where the logo was */}
          <div className="h-[25vh] sm:h-56 sm:w-56 mb-2 sm:mb-4 pointer-events-none" />

          {/* Group Title */}
          <motion.h1
            variants={fadeInUp}
            className="font-serif text-4xl sm:text-7xl font-bold tracking-tight"
            style={{
              color: '#c60001',
              textShadow: '0 0 60px rgba(255,255,255,1), 0 0 30px rgba(255,255,255,1), 0 0 100px rgba(255,255,255,0.8), 0 4px 30px rgba(255,255,255,0.9)',
            }}
          >
            RAAGA BHAIRAVI
          </motion.h1>

          {/* Subtitle / Tagline */}
          <motion.p
            variants={fadeInUp}
            className="text-text-secondary text-sm sm:text-xl font-medium tracking-[0.15em] uppercase max-w-2xl leading-relaxed"
            style={{ textShadow: '0 0 50px rgba(255,255,255,1), 0 0 20px rgba(255,255,255,1), 0 4px 20px rgba(255,255,255,0.9)' }}
          >
            Echos of Divinity
          </motion.p>

          <motion.p
            variants={fadeInUp}
            className="text-xs sm:text-base max-w-lg leading-relaxed font-light"
            style={{ color: '#111111' }}
          >
           Holding Our Carnatic Heritage With Pride, Inspiring Generations Through The Timeless Language Of Music.
          </motion.p>

          {/* Animated Start Button */}
          <motion.div variants={fadeInUp} className="pt-2 sm:pt-4">
            <Link
              href="/vision"
              className="px-6 py-3 sm:px-8 sm:py-4 rounded-full bg-primary hover:bg-primary-hover text-white text-[10px] sm:text-xs font-semibold uppercase tracking-widest glow-button flex items-center space-x-2 transition-transform duration-300 hover:scale-105"
            >
              <span>Start Experience</span>
              <Play className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-white" />
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
          className="absolute bottom-6 sm:bottom-10 z-20 flex flex-col items-center cursor-pointer"
          onClick={() => {
            const nextSec = document.getElementById('about-teaser');
            nextSec?.scrollIntoView({ behavior: 'smooth' });
          }}
        >
          <span className="text-[10px] tracking-[0.3em] uppercase text-text-secondary mb-2">Scroll Down</span>
          <div className="w-[1px] h-6 sm:h-12 bg-primary/40" />
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
          <p className="text-text-secondary text-sm sm:text-base leading-relaxed text-justify">
            {renderBoldText("Formed In The Heart Of Carnatic Heritage, RAAGA BHAIRAVI Blends Classical Raga Hierarchies , Orchestral Harmonies, And Experimental Sounds.We Have Had The Privilege Of Performing At Various Concerts In Mutt, Stages, And Temples, Sharing The Beauty Of Carnatic Music With Diverse Audiences.Our Team Comprises Six Enthusiastic Students, United By A Common Love For Music.Together, We Strive To Deliver Soulful And Memorable Performances That Reflect Both Tradition And Creativity")}
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
              Discover highlights from our divine tours and concert hall recordings.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 max-w-4xl mx-auto">
            {loadingPerf ? (
              <div className="col-span-2 text-center py-12 text-text-secondary text-sm">
                Loading performances...
              </div>
            ) : homePerformances.length === 0 ? (
              <div className="col-span-2 glass-panel p-12 rounded-2xl text-center text-text-secondary text-sm border border-primary/5">
                No featured performances at this time.
              </div>
            ) : (
              homePerformances.map((perf) => (
                <motion.div
                  key={perf.id}
                  whileHover={{ y: -5 }}
                  transition={{ duration: 0.3 }}
                  className="glass-panel p-4 rounded-2xl flex flex-col space-y-4 hover:shadow-lg transition-shadow"
                >
                  <div className="relative w-full h-auto rounded-xl overflow-hidden shadow-sm">
                    <Image
                      src={perf.images?.[0] || 'https://images.pexels.com/photos/164743/pexels-photo-164743.jpeg?auto=compress&cs=tinysrgb&w=800'}
                      alt={perf.title}
                      width={600}
                      height={450}
                      className="w-full h-auto object-cover rounded-xl transition-transform duration-700 hover:scale-105"
                      sizes="(max-w-768px) 100vw, 400px"
                    />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-serif font-bold text-lg text-foreground">{perf.title}</h3>
                    <p className="text-xs text-text-secondary leading-relaxed line-clamp-2 font-light text-justify">
                      {renderBoldText(perf.description)}
                    </p>
                  </div>
                </motion.div>
              ))
            )}
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

        {loading ? (
          <div className="text-center py-12 text-text-secondary text-sm">
            Loading latest event...
          </div>
        ) : latestEvent ? (
          <div className="glass-panel p-6 rounded-2xl flex flex-col md:flex-row items-center gap-8 shadow-sm">
            <div className="relative w-full md:w-48 h-48 rounded-xl overflow-hidden flex-shrink-0 bg-primary/5">
              <Image
                src={latestEvent.imageUrl || "https://images.pexels.com/photos/167636/pexels-photo-167636.jpeg?auto=compress&cs=tinysrgb&w=800"}
                alt={latestEvent.title}
                fill
                className="object-cover"
                sizes="(max-w-768px) 100vw, 192px"
              />
            </div>
            <div className="flex-1 space-y-4 w-full text-center md:text-left">
              <div>
                <span className="text-xs text-primary font-semibold tracking-widest uppercase">
                  {formatDate(latestEvent.date)}
                </span>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-foreground mt-1">
                  {latestEvent.title}
                </h3>
                <div className="flex items-center justify-center md:justify-start space-x-1.5 text-xs text-text-light mt-1">
                  <MapPin className="w-3.5 h-3.5 text-primary" />
                  <span>{latestEvent.venue}, {latestEvent.place}</span>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-text-secondary leading-relaxed max-w-2xl font-light text-justify">
                {renderBoldText(latestEvent.description)}
              </p>
            </div>
          </div>
        ) : (
          <div className="glass-panel p-12 rounded-2xl text-center text-text-secondary text-sm shadow-sm">
            No upcoming events scheduled at this time. Check back soon!
          </div>
        )}
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
