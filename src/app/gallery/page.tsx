'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { Image as ImageIcon, Play, X, ZoomIn, Eye } from 'lucide-react';

interface GalleryItem {
  id: string;
  type: 'image' | 'youtube';
  title: string;
  imageUrl: string;
  youtubeUrl?: string;
  createdAt: number;
}

const defaultGallery: GalleryItem[] = [
  {
    id: 'gal-1',
    type: 'image',
    title: 'Grand Symphony Performance',
    imageUrl: 'https://images.pexels.com/photos/1916824/pexels-photo-1916824.jpeg?auto=compress&cs=tinysrgb&w=800',
    createdAt: 1,
  },
  {
    id: 'gal-2',
    type: 'youtube',
    title: 'Raga Bhairavi Violin Solo Curation',
    imageUrl: 'https://images.pexels.com/photos/167636/pexels-photo-167636.jpeg?auto=compress&cs=tinysrgb&w=800',
    youtubeUrl: 'https://www.youtube.com',
    createdAt: 2,
  },
  {
    id: 'gal-3',
    type: 'image',
    title: 'Acoustic Raga Curation Sessions',
    imageUrl: 'https://images.pexels.com/photos/164743/pexels-photo-164743.jpeg?auto=compress&cs=tinysrgb&w=800',
    createdAt: 3,
  },
  {
    id: 'gal-4',
    type: 'image',
    title: 'Vocal Performance & Raga Curation',
    imageUrl: 'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=800',
    createdAt: 4,
  },
  {
    id: 'gal-5',
    type: 'youtube',
    title: 'Classical Heritage Orchestration Tour',
    imageUrl: 'https://images.pexels.com/photos/164938/pexels-photo-164938.jpeg?auto=compress&cs=tinysrgb&w=800',
    youtubeUrl: 'https://www.youtube.com',
    createdAt: 5,
  },
];

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
};

export default function GalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

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
          imageUrl: data.imageUrl,
          youtubeUrl: data.youtubeUrl,
          createdAt: data.createdAt,
        });
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
        </motion.div>

        {/* Masonry / Pinterest Grid */}
        {loading ? (
          <div className="text-center py-20 text-text-secondary text-sm">
            Loading media items...
          </div>
        ) : (
          <div className="columns-1 sm:columns-2 md:columns-3 gap-6 space-y-6 max-w-6xl mx-auto">
            {items.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5 }}
                className="break-inside-avoid glass-panel p-3 rounded-2xl flex flex-col space-y-3 shadow-sm hover:shadow-md transition-shadow relative group cursor-pointer"
              >
                {/* Media frame */}
                <div className="relative rounded-xl overflow-hidden aspect-[4/3] sm:aspect-auto shadow-sm">
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
                      <button
                        onClick={() => setLightboxImage(item.imageUrl)}
                        className="w-12 h-12 rounded-full bg-white/90 hover:bg-white text-primary-deep flex items-center justify-center shadow-lg transition-colors"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                    ) : (
                      <a
                        href={item.youtubeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center shadow-lg transition-colors hover:bg-primary-hover"
                      >
                        <Play className="w-5 h-5 fill-white ml-0.5" />
                      </a>
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

      {/* Lightbox Modal for Images */}
      <AnimatePresence>
        {lightboxImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightboxImage(null)}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 cursor-zoom-out"
          >
            {/* Close Button */}
            <button
              onClick={() => setLightboxImage(null)}
              className="absolute top-6 right-6 text-white/75 hover:text-white transition-colors"
            >
              <X className="w-8 h-8" />
            </button>

            {/* Image display */}
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="relative max-w-4xl max-h-[80vh] aspect-[4/3] sm:aspect-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={lightboxImage}
                alt="Enlarged view"
                className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
