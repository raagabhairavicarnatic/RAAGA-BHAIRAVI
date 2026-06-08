'use client';

import React, { useEffect, useState } from 'react';
import { auth, db } from '@/lib/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { Calendar, Award, ImageIcon, MessageSquare, ShieldAlert, UserCheck } from 'lucide-react';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    events: 0,
    performances: 0,
    gallery: 0,
    unreadMessages: 0,
  });
  const [loading, setLoading] = useState(true);
  const adminEmail = auth.currentUser?.email || 'Administrator';

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const eventsSnap = await getDocs(collection(db, 'events'));
        const perfSnap = await getDocs(collection(db, 'performances'));
        const gallerySnap = await getDocs(collection(db, 'gallery'));
        
        // Count unread chats from admin point of view (unreadByAdmin == true)
        const chatQuery = query(collection(db, 'chats'), where('unreadByAdmin', '==', true));
        const chatSnap = await getDocs(chatQuery);

        setStats({
          events: eventsSnap.size,
          performances: perfSnap.size,
          gallery: gallerySnap.size,
          unreadMessages: chatSnap.size,
        });
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Events */}
          <div className="glass-panel p-6 rounded-2xl flex items-center justify-between border border-primary/5 shadow-sm">
            <div className="space-y-1">
              <span className="text-[10px] text-text-secondary uppercase tracking-wider font-semibold">Total Events</span>
              <p className="font-serif text-3xl font-bold text-foreground">{stats.events}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-primary/5 flex items-center justify-center text-primary">
              <Calendar className="w-6 h-6" />
            </div>
          </div>

          {/* Performances */}
          <div className="glass-panel p-6 rounded-2xl flex items-center justify-between border border-primary/5 shadow-sm">
            <div className="space-y-1">
              <span className="text-[10px] text-text-secondary uppercase tracking-wider font-semibold">Performances</span>
              <p className="font-serif text-3xl font-bold text-foreground">{stats.performances}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-primary/5 flex items-center justify-center text-primary">
              <Award className="w-6 h-6" />
            </div>
          </div>

          {/* Gallery */}
          <div className="glass-panel p-6 rounded-2xl flex items-center justify-between border border-primary/5 shadow-sm">
            <div className="space-y-1">
              <span className="text-[10px] text-text-secondary uppercase tracking-wider font-semibold">Gallery Items</span>
              <p className="font-serif text-3xl font-bold text-foreground">{stats.gallery}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-primary/5 flex items-center justify-center text-primary">
              <ImageIcon className="w-6 h-6" />
            </div>
          </div>

          {/* Chats */}
          <div className="glass-panel p-6 rounded-2xl flex items-center justify-between border border-primary/5 shadow-sm">
            <div className="space-y-1">
              <span className="text-[10px] text-text-secondary uppercase tracking-wider font-semibold">Active Chats</span>
              <p className="font-serif text-3xl font-bold text-foreground">{stats.unreadMessages}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-primary/5 flex items-center justify-center text-primary">
              <MessageSquare className="w-6 h-6" />
            </div>
          </div>
        </div>
      )}

      {/* Helpful Guidelines */}
      <div className="glass-panel p-8 rounded-3xl border border-primary/5 shadow-sm space-y-4">
        <h2 className="font-serif text-xl font-bold text-foreground">Quick Administration Guide</h2>
        <div className="w-12 h-[1px] bg-primary/20" />
        <ul className="list-disc pl-5 text-xs text-text-secondary space-y-2 leading-relaxed">
          <li><strong>Events:</strong> Add new performances or tours, edit timings, and update banners. Changes reflect instantly on the public `/events` page.</li>
          <li><strong>Performances:</strong> Log performance history and collaborations. You can optionally link a YouTube url to show a playable play button on their thumbnails.</li>
          <li><strong>Gallery:</strong> Upload images or input YouTube links to show in the Pinterest masonry layout.</li>
          <li><strong>Vision & Mission:</strong> Update the overarching group details and philosophical statements directly.</li>
          <li><strong>Live Chats:</strong> Connect in real-time with users who send messages via the floating chat helper. You can read, view unread statuses, and type replies instantly.</li>
        </ul>
      </div>
    </div>
  );
}
