'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { Image as ImageIcon, Play, X, ZoomIn, Eye, Pin } from 'lucide-react';

interface GalleryItem {
  id: string;
  type: 'image' | 'youtube';
  title: string;
  description?: string;
  imageUrl: string;
  youtubeUrl?: string;
  createdAt: number;
  pinned?: boolean;
}

const defaultGallery: GalleryItem[] = [];

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
};

export default function GalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeItem, setActiveItem] = useState<GalleryItem | null>(null);
  const [activeFilter, setActiveFilter] = useState<'all' | 'image' | 'youtube'>('all');

  const filteredItems = activeFilter === 'all'
    ? items
    : items.filter((item) => item.type === activeFilter);

  const filters: { key: 'all' | 'image' | 'youtube'; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'youtube', label: 'YouTube' },
    { key: 'image', label: 'Photos' },
  ];

  useEffect(() => {
    const q = query(collection(db, 'gallery'), orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const dbItems: GalleryItem[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        dbItems.push({
          id: doc.id,
          type: data.type,
          title: data.title,
          description: data.description || '',
          imageUrl: data.imageUrl,
          youtubeUrl: data.youtubeUrl,
          createdAt: data.createdAt,
          pinned: !!data.pinned,
        });
      });
      // Client-side sort: pinned items first, then by createdAt desc
      dbItems.sort((a, b) => {
        const aPinned = a.pinned ? 1 : 0;
        const bPinned = b.pinned ? 1 : 0;
        if (aPinned !== bPinned) return bPinned - aPinned;
        return b.createdAt - a.createdAt;
      });
      setItems(dbItems.length > 0 ? dbItems : defaultGallery);
      setLoading(false);
    }, (error) => {
      console.error("Error reading gallery from firestore:", error);
      setItems(defaultGallery);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

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
            <ImageIcon className="w-5 h-5" />
            <span className="text-xs uppercase tracking-[0.25em] font-semibold">Exhibits</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-6xl font-bold text-foreground tracking-tight">
            Media Gallery
          </h1>
          <p className="text-text-secondary text-sm sm:text-base max-w-md mx-auto">
            Browse through concert highlights, high-resolution performance photos, and YouTube concert records.
          </p>
          <div className="w-24 h-[1px] bg-primary/30 mx-auto mt-6" />

          {/* Filter Tabs */}
          <div className="flex items-center justify-center gap-2 pt-4">
            {filters.map((f) => (
              <button
                key={f.key}
                onClick={() => setActiveFilter(f.key)}
                className={`relative px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.15em] rounded-full transition-all duration-300 ${
                  activeFilter === f.key
                    ? 'bg-primary text-white shadow-md shadow-primary/25'
                    : 'bg-white/60 text-text-secondary hover:bg-white hover:text-foreground border border-primary/10'
                }`}
              >
                {f.label}
                {activeFilter === f.key && (
                  <motion.span
                    layoutId="galleryFilterPill"
                    className="absolute inset-0 bg-primary rounded-full -z-10"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Masonry / Pinterest Grid */}
        {loading ? (
          <div className="text-center py-20 text-text-secondary text-sm">
            Loading media items...
          </div>
        ) : (
          <div className="max-w-6xl mx-auto">
            {filteredItems.length === 0 ? (
              <div className="glass-panel p-16 rounded-3xl text-center text-text-secondary text-sm border border-primary/5">
                {items.length === 0
                  ? 'No gallery items uploaded yet. Please check back later.'
                  : `No ${activeFilter === 'youtube' ? 'YouTube videos' : 'photos'} found.`}
              </div>
            ) : (
              <div className="columns-1 sm:columns-2 md:columns-3 gap-6 space-y-6">
                {filteredItems.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, margin: '-50px' }}
                    transition={{ duration: 0.5 }}
                    onClick={() => {
                      if (item.type === 'image') {
                        setActiveItem(item);
                      } else if (item.youtubeUrl) {
                        window.open(item.youtubeUrl, '_blank', 'noopener,noreferrer');
                      }
                    }}
                    className="break-inside-avoid glass-panel p-3 rounded-2xl flex flex-col space-y-3 shadow-sm hover:shadow-md transition-shadow relative group cursor-pointer"
                  >
                    {/* Media frame */}
                    <div className="relative rounded-xl overflow-hidden aspect-[4/3] sm:aspect-auto shadow-sm">
                      {item.pinned && (
                        <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm text-[#d4af37] p-2 rounded-xl shadow-md z-20 border border-[#d4af37]/20 flex items-center justify-center" title="Pinned to Top">
                          <Pin className="w-3.5 h-3.5 fill-current" />
                        </div>
                      )}
                      {/* Next Image Optimized Lazy Loading */}
                      <div className="relative w-full h-auto overflow-hidden rounded-lg">
                        <Image
                          src={item.imageUrl}
                          alt={item.title}
                          width={450}
                          height={350}
                          className="w-full h-auto object-cover rounded-lg transition-transform duration-700 group-hover:scale-105"
                          sizes="(max-w-768px) 100vw, (max-w-1200px) 50vw, 33vw"
                        />
                      </div>

                      {/* Hover visual details */}
                      <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-4">
                        {item.type === 'image' ? (
                          <div className="w-12 h-12 rounded-full bg-white/90 text-primary-deep flex items-center justify-center shadow-lg">
                            <Eye className="w-5 h-5" />
                          </div>
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center shadow-lg">
                            <Play className="w-5 h-5 fill-white ml-0.5" />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Info Text */}
                    <div className="px-2 pb-1 flex items-center justify-between">
                      <span className="text-xs font-serif font-bold text-foreground truncate max-w-[80%]">
                        {item.title}
                      </span>
                      <span className="text-[9px] uppercase tracking-wider text-text-light flex-shrink-0">
                        {item.type}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Lightbox Modal for Images with side-by-side details */}
      <AnimatePresence>
        {activeItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveItem(null)}
            className="fixed inset-0 z-50 bg-white/95 backdrop-blur-md flex items-center justify-center p-4 md:p-6"
          >
            {/* Top Right Close Button on backdrop */}
            <button
              onClick={() => setActiveItem(null)}
              className="absolute top-6 right-6 text-text-secondary hover:text-primary transition-colors cursor-pointer z-50 p-2 rounded-full hover:bg-black/5"
            >
              <X className="w-8 h-8" />
            </button>

            {/* Modal Container */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-4xl max-h-[90vh] md:max-h-[75vh] bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row border border-primary/10"
            >
              {/* Left Column: Image Showcase */}
              <div className="w-full md:w-2/3 bg-white flex items-center justify-center p-6 relative min-h-[260px] md:min-h-[400px]">
                <img
                  src={activeItem.imageUrl}
                  alt={activeItem.title}
                  className="max-w-full max-h-[35vh] md:max-h-[65vh] object-contain rounded-xl"
                />
              </div>

              {/* Right Column: Title & Description Content (White Background) */}
              <div className="w-full md:w-1/3 p-6 md:p-8 flex flex-col justify-between bg-white text-foreground border-t md:border-t-0 md:border-l border-primary/10">
                <div className="space-y-4 overflow-y-auto max-h-[40vh] md:max-h-full pr-1">
                  <div className="flex items-center justify-between border-b border-primary/10 pb-3">
                    <span className="text-[10px] uppercase tracking-wider text-primary font-bold">
                      {activeItem.type}
                    </span>
                    <button
                      onClick={() => setActiveItem(null)}
                      className="text-text-secondary hover:text-primary transition-colors cursor-pointer"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  
                  <h3 className="font-serif text-lg sm:text-xl font-bold text-foreground leading-tight">
                    {activeItem.title}
                  </h3>

                  {activeItem.description ? (
                    <p className="text-xs sm:text-sm text-text-secondary leading-relaxed font-light text-justify pt-1 whitespace-pre-wrap">
                      {activeItem.description}
                    </p>
                  ) : (
                    <p className="text-xs text-text-light italic leading-relaxed pt-1">
                      No description provided for this gallery item.
                    </p>
                  )}
                </div>

                <div className="pt-4 border-t border-primary/10 flex justify-end mt-4">
                  <button
                    onClick={() => setActiveItem(null)}
                    className="px-5 py-2.5 rounded-xl border border-primary/20 hover:border-primary text-xs font-semibold text-text-secondary hover:text-primary transition-colors cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
