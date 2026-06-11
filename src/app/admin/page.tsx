'use client';

import React, { useEffect, useState } from 'react';
import { auth, db } from '@/lib/firebase';
import { collection, getDocs, orderBy, query, limit } from 'firebase/firestore';
import { Calendar, Award, ImageIcon, BookOpen, ShieldAlert, UserCheck, Clock, User } from 'lucide-react';

interface SectionMeta {
  count: number;
  lastUpdated: string | null;
  lastUpdatedBy: string | null;
}

export default function AdminDashboardPage() {
  const [events, setEvents] = useState<SectionMeta>({ count: 0, lastUpdated: null, lastUpdatedBy: null });
  const [performances, setPerformances] = useState<SectionMeta>({ count: 0, lastUpdated: null, lastUpdatedBy: null });
  const [gallery, setGallery] = useState<SectionMeta>({ count: 0, lastUpdated: null, lastUpdatedBy: null });
  const [vision, setVision] = useState<SectionMeta>({ count: 0, lastUpdated: null, lastUpdatedBy: null });
  const [loading, setLoading] = useState(true);
  const adminEmail = auth.currentUser?.email || 'Administrator';

  const formatDate = (ts: any): string => {
    if (!ts) return 'N/A';
    try {
      const date = ts?.toDate ? ts.toDate() : new Date(ts);
      return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    } catch {
      return 'N/A';
    }
  };

  const getLatestMeta = (docs: any[]): { lastUpdated: string | null; lastUpdatedBy: string | null } => {
    if (docs.length === 0) return { lastUpdated: null, lastUpdatedBy: null };
    // Sort by updatedAt or createdAt descending
    const sorted = [...docs].sort((a, b) => {
      const aTime = a.updatedAt || a.createdAt || null;
      const bTime = b.updatedAt || b.createdAt || null;
      if (!aTime) return 1;
      if (!bTime) return -1;
      const aMs = aTime?.toDate ? aTime.toDate().getTime() : new Date(aTime).getTime();
      const bMs = bTime?.toDate ? bTime.toDate().getTime() : new Date(bTime).getTime();
      return bMs - aMs;
    });
    const latest = sorted[0];
    return {
      lastUpdated: formatDate(latest.updatedAt || latest.createdAt || null),
      lastUpdatedBy: latest.updatedBy || latest.createdBy || null,
    };
  };

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [eventsSnap, perfSnap, gallerySnap, visionSnap] = await Promise.all([
          getDocs(collection(db, 'events')),
          getDocs(collection(db, 'performances')),
          getDocs(collection(db, 'gallery')),
          getDocs(collection(db, 'vision')),
        ]);

        const eventDocs = eventsSnap.docs.map(d => d.data());
        const perfDocs = perfSnap.docs.map(d => d.data());
        const galleryDocs = gallerySnap.docs.map(d => d.data());
        const visionDocs = visionSnap.docs.map(d => d.data());

        setEvents({ count: eventsSnap.size, ...getLatestMeta(eventDocs) });
        setPerformances({ count: perfSnap.size, ...getLatestMeta(perfDocs) });
        setGallery({ count: gallerySnap.size, ...getLatestMeta(galleryDocs) });
        setVision({ count: visionSnap.size, ...getLatestMeta(visionDocs) });
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const sections = [
    { label: 'Total Events', icon: Calendar, data: events, href: '/admin/events' },
    { label: 'Performances', icon: Award, data: performances, href: '/admin/performances' },
    { label: 'Gallery Items', icon: ImageIcon, data: gallery, href: '/admin/gallery' },
    { label: 'Vision & Mission', icon: BookOpen, data: vision, href: '/admin/vision' },
  ];

  return (
    <div className="space-y-10">
      {/* Welcome banner */}
      <div className="glass-panel p-8 rounded-3xl shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border border-primary/5">
        <div className="space-y-2">
          <h1 className="font-serif text-3xl font-bold text-foreground">Welcome Back</h1>
          <p className="text-xs text-text-secondary flex items-center gap-1.5">
            <UserCheck className="w-4 h-4 text-primary" />
            <span>Logged in as: <strong className="text-foreground">{adminEmail}</strong></span>
          </p>
        </div>
        <div className="bg-primary/5 border border-primary/10 px-4 py-2 rounded-xl text-primary text-[10px] uppercase font-bold tracking-widest flex items-center gap-1.5">
          <ShieldAlert className="w-4 h-4" />
          <span>Full Access Console</span>
        </div>
      </div>

      {/* Stats Cards */}
      {loading ? (
        <div className="text-text-secondary text-sm">Loading statistical metrics...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {sections.map(({ label, icon: Icon, data, href }) => (
            <a
              key={label}
              href={href}
              className="glass-panel p-6 rounded-2xl border border-primary/5 shadow-sm hover:shadow-md hover:border-primary/20 transition-all space-y-4 group"
            >
              {/* Top Row */}
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-text-secondary uppercase tracking-wider font-semibold">{label}</span>
                <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                  <Icon className="w-5 h-5" />
                </div>
              </div>

              {/* Count */}
              <p className="font-serif text-4xl font-bold text-foreground">{data.count}</p>

              {/* Meta info */}
              <div className="border-t border-primary/5 pt-3 space-y-1.5">
                <div className="flex items-center gap-1.5 text-[10px] text-text-secondary">
                  <Clock className="w-3 h-3 text-primary flex-shrink-0" />
                  <span>Last updated: <span className="text-foreground font-medium">{data.lastUpdated || 'No records yet'}</span></span>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-text-secondary">
                  <User className="w-3 h-3 text-primary flex-shrink-0" />
                  <span>Updated by: <span className="text-foreground font-medium">{data.lastUpdatedBy || '—'}</span></span>
                </div>
              </div>
            </a>
          ))}
        </div>
      )}

      {/* Helpful Guidelines */}
      <div className="glass-panel p-8 rounded-3xl border border-primary/5 shadow-sm space-y-4">
        <h2 className="font-serif text-xl font-bold text-foreground">Quick Administration Guide</h2>
        <div className="w-12 h-[1px] bg-primary/20" />
        <ul className="list-disc pl-5 text-xs text-text-secondary space-y-2 leading-relaxed">
          <li><strong>Events:</strong> Add new performances or tours, edit timings, and update banners. Changes reflect instantly on the public <code>/events</code> page.</li>
          <li><strong>Performances:</strong> Log performance history and collaborations. Pin up to 2 performances to feature them on the Home page. Optionally link a YouTube URL to show a play button.</li>
          <li><strong>Gallery:</strong> Upload images or input YouTube links to show in the Pinterest masonry layout.</li>
          <li><strong>Vision &amp; Mission:</strong> Update the overarching group details and philosophical statements directly.</li>
        </ul>
      </div>
    </div>
  );
}
