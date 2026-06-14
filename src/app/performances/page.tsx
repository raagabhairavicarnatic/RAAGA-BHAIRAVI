'use client';

import React, { useState, useEffect } from 'react';
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

const defaultPerformances: PerformanceItem[] = [];

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
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
            {performances.length === 0 ? (
              <div className="glass-panel p-16 rounded-3xl text-center text-text-secondary text-sm border border-primary/5">
                No performances logged at this time. Please check back later.
              </div>
            ) : (
              performances.map((perf, index) => {
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
                        <img
                          src={perf.images[0] || 'https://images.pexels.com/photos/164743/pexels-photo-164743.jpeg?auto=compress&cs=tinysrgb&w=800'}
                          alt={perf.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          loading="lazy"
                        />
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

                      <p className="text-text-secondary text-sm sm:text-base leading-relaxed font-light text-justify">
                        {renderBoldText(perf.description)}
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
              })
            )}
          </div>
        )}
      </div>
    </div>
  );
}
