'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { Calendar, MapPin, Music } from 'lucide-react';

interface EventItem {
  id: string;
  title: string;
  date: string;
  venue: string;
  place: string;
  imageUrl: string;
  description: string;
}

const defaultEvents: EventItem[] = [];

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
};

export default function EventsPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const eventsQuery = query(collection(db, 'events'), orderBy('date', 'desc'));

    const unsubscribe = onSnapshot(eventsQuery, (snapshot) => {
      const items: EventItem[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        items.push({
          id: doc.id,
          title: data.title,
          date: data.date,
          venue: data.venue,
          place: data.place,
          imageUrl: data.imageUrl,
          description: data.description,
        });
      });
      // Fallback if firestore collection is empty
      setEvents(items.length > 0 ? items : defaultEvents);
      setLoading(false);
    }, (error) => {
      console.error("Error reading events from firestore:", error);
      setEvents(defaultEvents);
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
            <Calendar className="w-5 h-5" />
            <span className="text-xs uppercase tracking-[0.25em] font-semibold">Tour Schedule</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-6xl font-bold text-foreground tracking-tight">
            Upcoming Events
          </h1>
          <p className="text-text-secondary text-sm sm:text-base max-w-md mx-auto">
            Join our journey of classical majesty and contemporary elegance live in concert.
          </p>
          <div className="w-24 h-[1px] bg-primary/30 mx-auto mt-6" />
        </motion.div>

        {/* Events Cards Stack */}
        {loading ? (
          <div className="text-center py-20 text-text-secondary text-sm">
            Loading tour schedule...
          </div>
        ) : (
          <div className="space-y-8 max-w-5xl mx-auto">
            {events.length === 0 ? (
              <div className="glass-panel p-16 rounded-3xl text-center text-text-secondary text-sm border border-primary/5">
                No upcoming events scheduled at this time. Please check back later or contact us for private bookings.
              </div>
            ) : (
              events.map((event, index) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="glass-panel p-6 rounded-3xl flex flex-col md:flex-row items-center gap-8 hover:shadow-lg transition-all border border-primary/5"
                >
                  {/* Event Banner */}
                  <div className="relative w-full md:w-56 h-56 rounded-2xl overflow-hidden flex-shrink-0 bg-primary/5 shadow-sm">
                    <Image
                      src={event.imageUrl}
                      alt={event.title}
                      fill
                      className="object-cover transition-transform duration-700 hover:scale-105"
                      sizes="(max-w-768px) 100vw, 224px"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 space-y-4 w-full text-center md:text-left">
                    <div className="space-y-1">
                      <span className="text-xs text-primary font-bold tracking-widest uppercase">
                        {formatDate(event.date)}
                      </span>
                      <h3 className="font-serif text-2xl font-bold text-foreground">
                        {event.title}
                      </h3>
                      <div className="flex items-center justify-center md:justify-start space-x-1.5 text-xs text-text-light">
                        <MapPin className="w-3.5 h-3.5 text-primary" />
                        <span>{event.venue}, {event.place}</span>
                      </div>
                    </div>
                    <p className="text-xs sm:text-sm text-text-secondary leading-relaxed font-light">
                      {event.description}
                    </p>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
