'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { db } from '@/lib/firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import { Compass, Target, BookOpen, Music } from 'lucide-react';

interface VisionData {
  vision: string;
  mission: string;
  story: string;
}

const defaultData: VisionData = {
  vision: 'To curate a **luxury classical-contemporary crossover space** where **Indian raga wisdom** meets the **global orchestra**—enriching souls across generations.',
  mission: '**Preserve and venerate** traditional **Carnatic raga hierarchies**. **Innovate** boundary-pushing compositions incorporating **global ambient harmonies**. **Perform** in majestic acoustic environments to showcase classical music in **premium, luxury audio formats**.',
  story: '**RAAGA BHAIRAVI** was established as an **elite classical assembly** of award-winning vocalists, violinists, and percussionists. Driven by an **unwavering passion** for **acoustic purity**, **raga depth**, and **majestic arrangement**, the group has performed in global music festivals and world-class concert halls. We believe music is a **sacred sensory experience** that should be curated with care, luxury, and **artistic reverence**.',
};

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
      return <strong key={index} className="font-bold text-foreground">{part.slice(2, -2)}</strong>;
    }
    return part;
  });
};

export default function VisionPage() {
  const [data, setData] = useState<VisionData>(defaultData);

  useEffect(() => {
    // Listen to firestore changes
    const docRef = doc(db, 'vision', 'data');
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const firestoreData = docSnap.data();

        // Inject bold markers into legacy database content if they match default patterns
        const processLegacyValue = (key: keyof VisionData, fbVal: string) => {
          const fsVal = firestoreData[key] || '';
          if (!fsVal) return fbVal;
          const legacyText = fbVal.replace(/\*\*/g, '');
          if (fsVal === legacyText) {
            return fbVal;
          }
          return fsVal;
        };

        setData({
          vision: processLegacyValue('vision', defaultData.vision),
          mission: processLegacyValue('mission', defaultData.mission),
          story: processLegacyValue('story', defaultData.story),
        });
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="bg-[#FFF9F9] min-h-screen pt-32 pb-24 px-6 relative overflow-hidden">
      {/* Background design elements */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full filter blur-[120px] pointer-events-none" />

      <div className="max-w-5xl mx-auto space-y-20 relative z-10">
        {/* Header */}
        <motion.div
          initial="initial"
          animate="animate"
          variants={fadeInUp}
          className="text-center space-y-4 max-w-2xl mx-auto"
        >
          <div className="flex items-center justify-center space-x-3 text-primary">
            <Music className="w-5 h-5 animate-pulse" />
            <span className="text-xs uppercase tracking-[0.25em] font-semibold">Who We Are</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-6xl font-bold text-foreground tracking-tight">
            Our Vision & Mission
          </h1>
          <div className="w-24 h-[1px] bg-primary/30 mx-auto mt-6" />
        </motion.div>

        {/* Grid Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8">
          {/* Vision Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="glass-panel p-8 rounded-2xl flex flex-col space-y-4 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow"
          >
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <Compass className="w-6 h-6" />
            </div>
            <h2 className="font-serif text-2xl font-bold text-foreground">The Vision</h2>
            <p className="text-text-secondary text-sm leading-relaxed whitespace-pre-line text-justify">
              {renderBoldText(data.vision)}
            </p>
          </motion.div>

          {/* Mission Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="glass-panel p-8 rounded-2xl flex flex-col space-y-4 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow"
          >
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <Target className="w-6 h-6" />
            </div>
            <h2 className="font-serif text-2xl font-bold text-foreground">The Mission</h2>
            <p className="text-text-secondary text-sm leading-relaxed whitespace-pre-line text-justify">
              {renderBoldText(data.mission)}
            </p>
          </motion.div>
        </div>

        {/* Story Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="glass-panel p-10 rounded-3xl shadow-sm relative overflow-hidden max-w-4xl mx-auto border border-primary/5"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full filter blur-3xl pointer-events-none" />
          <div className="flex flex-col items-center text-center space-y-6">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <BookOpen className="w-5 h-5" />
            </div>
            <h2 className="font-serif text-3xl font-bold text-foreground">Our Story & Artistic Philosophy</h2>
            <div className="w-12 h-[1px] bg-primary/20" />
            <p className="text-text-secondary text-sm sm:text-base leading-relaxed max-w-3xl whitespace-pre-line font-light text-justify">
              {renderBoldText(data.story)}
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
