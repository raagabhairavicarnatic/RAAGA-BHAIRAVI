'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { Award, Calendar, MapPin, ExternalLink, Play } from 'lucide-react';

interface PerformanceItem {
  id: string;
  title: string;
  description: string;
  date: string;
  place: string;
  venue: string;
  images: string[];
  videoUrl?: string;
}

const defaultPerformances: PerformanceItem[] = [
  {
    id: 'perf-1',
    title: 'Grand Orchestral Carnatic Symphony',
    description: 'A landmark fusion concert combining classical kritis with modern synthesized ambient music and violin ensembles. Performed to a sold-out crowd of over 3,000 patrons.',
    date: '2026-03-12',
    venue: 'Royal Opera House',
    place: 'Mumbai, India',
    images: ['https://images.pexels.com/photos/1916824/pexels-photo-1916824.jpeg?auto=compress&cs=tinysrgb&w=800'],
    videoUrl: 'https://youtube.com',
  },
  {
    id: 'perf-2',
    title: 'The Resonance Jugalbandi Tour',
    description: 'An instrumental dialogue featuring classical veena, violin, and percussion improvisations. This performance was broadcast live on cultural television.',
    date: '2025-11-20',
    venue: 'Tagore Theatre',
    place: 'Kolkata, India',
    images: ['https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=800'],
    videoUrl: 'https://youtube.com',
  },
  {
    id: 'perf-3',
    title: 'Acoustic Raga Curation at the Palace',
    description: 'A private heritage performance in the palace courtyard, emphasizing acoustical clarity and ancient compositions in their purest state.',
    date: '2025-08-05',
    venue: 'Mysore Palace Durbar',
    place: 'Mysore, India',
    images: ['https://images.pexels.com/photos/164743/pexels-photo-164743.jpeg?auto=compress&cs=tinysrgb&w=800'],
  },
];

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
};

export default function PerformancesPage() {
  const [performances, setPerformances] = useState<PerformanceItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const perfQuery = query(collection(db, 'performances'), orderBy('date', 'desc'));

    const unsubscribe = onSnapshot(perfQuery, (snapshot) => {
      const items: PerformanceItem[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        items.push({
          id: doc.id,
          title: data.title,
          description: data.description,
          date: data.date,
          place: data.place,
          venue: data.venue,
          images: data.images || [],
          videoUrl: data.videoUrl,
        });
      });
      setPerformances(items.length > 0 ? items : defaultPerformances);
      setLoading(false);
    }, (error) => {
      console.error("Error reading performances from firestore:", error);
      setPerformances(defaultPerformances);
      setLoading(false);
    });

    return () => unsubscribe();
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
    <div className="bg-[#FFF9F9] min-h-screen pt-32 pb-24 px-6 relative">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Header */}
        <motion.div
          initial="initial"
          animate="animate"
          variants={fadeInUp}
          className="text-center space-y-4 max-w-2xl mx-auto"
        >
          <div className="flex items-center justify-center space-x-3 text-primary">
            <Award className="w-5 h-5" />
            <span className="text-xs uppercase tracking-[0.25em] font-semibold">Our History</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-6xl font-bold text-foreground tracking-tight">
            Performances
          </h1>
          <p className="text-text-secondary text-sm sm:text-base max-w-md mx-auto">
            Explore our archives, live concert records, and grand collaborations over the years.
          </p>
          <div className="w-24 h-[1px] bg-primary/30 mx-auto mt-6" />
        </motion.div>

        {/* Performances List */}
        {loading ? (
          <div className="text-center py-20 text-text-secondary text-sm">
            Loading performances history...
          </div>
        ) : (
          <div className="space-y-16 max-w-6xl mx-auto">
            {performances.map((perf, index) => {
              const isEven = index % 2 === 0;
              return (
                <motion.div
                  key={perf.id}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                  className={`flex flex-col lg:flex-row items-center gap-12 ${
                    isEven ? '' : 'lg:flex-row-reverse'
                  }`}
                >
                  {/* Performance Media Showcase */}
                  <div className="w-full lg:w-[45%] aspect-[4/3] rounded-3xl overflow-hidden glass-panel p-3 relative group">
                    <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-md">
                      <Image
                        src={perf.images[0] || 'https://images.pexels.com/photos/164743/pexels-photo-164743.jpeg?auto=compress&cs=tinysrgb&w=800'}
                        alt={perf.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        sizes="(max-w-768px) 100vw, 500px"
                      />
                      {perf.videoUrl && (
                        <a
                          href={perf.videoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        >
                          <div className="w-16 h-16 rounded-full bg-primary/95 text-white flex items-center justify-center shadow-lg transform scale-90 group-hover:scale-100 transition-transform duration-300">
                            <Play className="w-6 h-6 fill-white ml-1" />
                          </div>
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Performance Description */}
                  <div className="w-full lg:w-[55%] space-y-6">
                    <div className="space-y-3">
                      <div className="flex flex-wrap items-center gap-4 text-xs text-text-light">
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-3.5 h-3.5 text-primary" />
                          <span>{formatDate(perf.date)}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MapPin className="w-3.5 h-3.5 text-primary" />
                          <span>{perf.venue}, {perf.place}</span>
                        </div>
                      </div>
                      <h2 className="font-serif text-2xl sm:text-3xl font-bold text-foreground leading-tight">
                        {perf.title}
                      </h2>
                    </div>

                    <p className="text-text-secondary text-sm sm:text-base leading-relaxed font-light">
                      {perf.description}
                    </p>

                    {perf.videoUrl && (
                      <div className="pt-2">
                        <a
                          href={perf.videoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center space-x-2 text-xs uppercase tracking-widest font-semibold text-primary hover:text-primary-hover group"
                        >
                          <span>Watch Performance</span>
                          <ExternalLink className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                        </a>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
