'use client';

import React, { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, query, orderBy, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { auth } from '@/lib/firebase';
import { Award, Plus, Edit2, Trash2, X, MapPin, Video, Pin } from 'lucide-react';

interface PerformanceItem {
  id: string;
  title: string;
  description: string;
  date: string;
  place: string;
  venue: string;
  images: string[];
  videoUrl?: string;
  pinned?: boolean;
}

export default function AdminPerformancesPage() {
  const [performances, setPerformances] = useState<PerformanceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPerf, setEditingPerf] = useState<PerformanceItem | null>(null);

  // Form states
  const [form, setForm] = useState({
    title: '',
    description: '',
    date: '',
    place: '',
    venue: '',
    imageUrl: '', // mapped to images[0]
    videoUrl: '',
  });

  useEffect(() => {
    const q = query(collection(db, 'performances'), orderBy('date', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items: PerformanceItem[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        items.push({
          id: docSnap.id,
          title: data.title,
          description: data.description,
          date: data.date,
          place: data.place,
          venue: data.venue,
          images: data.images || [],
          videoUrl: data.videoUrl || '',
          pinned: data.pinned || false,
        });
      });
      setPerformances(items);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleTogglePin = async (id: string, currentlyPinned: boolean) => {
    const pinnedCount = performances.filter(p => p.pinned === true).length;
    
    if (!currentlyPinned && pinnedCount >= 2) {
      alert("You can only pin up to 2 performances. Please unpin one of the other pinned performances first.");
      return;
    }

    try {
      await updateDoc(doc(db, 'performances', id), {
        pinned: !currentlyPinned
      });
    } catch (error) {
      console.error('Error toggling pin:', error);
      alert('Failed to update pin status.');
    }
  };

  const openAddModal = () => {
    setEditingPerf(null);
    setForm({
      title: '',
      description: '',
      date: '',
      place: '',
      venue: '',
      imageUrl: '',
      videoUrl: '',
    });
    setShowModal(true);
  };

  const openEditModal = (perf: PerformanceItem) => {
    setEditingPerf(perf);
    setForm({
      title: perf.title,
      description: perf.description,
      date: perf.date,
      place: perf.place,
      venue: perf.venue,
      imageUrl: perf.images[0] || '',
      videoUrl: perf.videoUrl || '',
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this performance?')) return;
    try {
      await deleteDoc(doc(db, 'performances', id));
    } catch (error) {
      console.error('Error deleting performance:', error);
      alert('Failed to delete performance.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const adminEmail = auth.currentUser?.email || 'Unknown';
    try {
      const dataPayload = {
        title: form.title,
        description: form.description,
        date: form.date,
        place: form.place,
        venue: form.venue,
        images: form.imageUrl ? [form.imageUrl] : [],
        videoUrl: form.videoUrl || '',
        updatedAt: serverTimestamp(),
        updatedBy: adminEmail,
      };

      if (editingPerf) {
        await updateDoc(doc(db, 'performances', editingPerf.id), dataPayload);
      } else {
        await addDoc(collection(db, 'performances'), {
          ...dataPayload,
          createdAt: serverTimestamp(),
          createdBy: adminEmail,
        });
      }
      setShowModal(false);
    } catch (error) {
      console.error('Error saving performance:', error);
      alert('Failed to save performance.');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <h1 className="font-serif text-3xl font-bold text-foreground">Manage Performances</h1>
          <p className="text-xs text-text-secondary">Log concert histories and digital media highlights</p>
        </div>
        <button
          onClick={openAddModal}
          className="px-5 py-3 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold uppercase tracking-wider flex items-center space-x-2 glow-button cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Performance</span>
        </button>
      </div>

      {/* Performances list */}
      {loading ? (
        <div className="text-text-secondary text-sm">Loading performance database...</div>
      ) : performances.length === 0 ? (
        <div className="glass-panel p-10 rounded-2xl text-center text-text-secondary text-sm border border-primary/5">
          No performances logged in database. Click "Add Performance" to register the first historical concert.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {performances.map((perf) => (
            <div
              key={perf.id}
              className="glass-panel p-6 rounded-2xl flex flex-col md:flex-row items-center gap-6 shadow-sm border border-primary/5"
            >
              {/* Image Mini */}
              <div className="w-24 h-24 rounded-xl overflow-hidden relative bg-primary/5 flex-shrink-0">
                <img src={perf.images[0]} alt={perf.title} className="w-full h-full object-cover" />
              </div>

              {/* Details */}
              <div className="flex-1 space-y-2 text-center md:text-left">
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                  <span className="text-xs text-primary font-bold uppercase tracking-wide">
                    {new Date(perf.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </span>
                  <span className="text-[10px] text-text-light flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-primary" />
                    {perf.venue}, {perf.place}
                  </span>
                  {perf.videoUrl && (
                    <span className="text-[9px] text-[#25D366] bg-[#25D366]/5 px-2 py-0.5 rounded-full flex items-center gap-1 font-semibold">
                      <Video className="w-3.5 h-3.5" />
                      Video Linked
                    </span>
                  )}
                  {perf.pinned && (
                    <span className="text-[9px] text-[#c60001] bg-[#c60001]/5 px-2 py-0.5 rounded-full flex items-center gap-1 font-semibold">
                      <Pin className="w-3.5 h-3.5 fill-current" />
                      Pinned to Home
                    </span>
                  )}
                </div>
                <h3 className="font-serif text-xl font-bold text-foreground">{perf.title}</h3>
                <p className="text-xs text-text-secondary line-clamp-2 leading-relaxed font-light">{perf.description}</p>
              </div>

              {/* Action buttons */}
              <div className="flex items-center space-x-3 flex-shrink-0">
                <button
                  onClick={() => handleTogglePin(perf.id, perf.pinned || false)}
                  className={`w-10 h-10 rounded-xl border flex items-center justify-center cursor-pointer transition-colors ${
                    perf.pinned
                      ? 'bg-primary border-primary text-white hover:bg-primary-hover hover:border-primary-hover'
                      : 'border-primary/10 text-text-secondary hover:border-primary hover:text-primary'
                  }`}
                  title={perf.pinned ? "Unpin from Home" : "Pin to Home"}
                >
                  <Pin className={`w-4 h-4 ${perf.pinned ? 'fill-current' : ''}`} />
                </button>
                <button
                  onClick={() => openEditModal(perf)}
                  className="w-10 h-10 rounded-xl border border-primary/10 text-text-secondary hover:border-primary hover:text-primary flex items-center justify-center cursor-pointer transition-colors"
                  title="Edit Performance"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(perf.id)}
                  className="w-10 h-10 rounded-xl border border-primary/10 text-text-secondary hover:border-primary-deep hover:text-primary-deep flex items-center justify-center cursor-pointer transition-colors"
                  title="Delete Performance"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Form Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-xl glass-panel p-8 rounded-3xl shadow-2xl relative overflow-hidden border border-primary/5">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-6 right-6 text-text-secondary hover:text-primary transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <h2 className="font-serif text-2xl font-bold text-foreground mb-6">
              {editingPerf ? 'Edit Performance Details' : 'Log New Performance'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Title */}
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-text-secondary">Concert Title</label>
                  <input
                    type="text"
                    name="title"
                    required
                    value={form.title}
                    onChange={handleChange}
                    className="w-full bg-white border border-primary/10 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-primary text-foreground"
                    placeholder="e.g. Symphony Hall Concert"
                  />
                </div>

                {/* Date */}
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-text-secondary">Concert Date</label>
                  <input
                    type="date"
                    name="date"
                    required
                    value={form.date}
                    onChange={handleChange}
                    className="w-full bg-white border border-primary/10 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-primary text-foreground"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Venue */}
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-text-secondary">Venue</label>
                  <input
                    type="text"
                    name="venue"
                    required
                    value={form.venue}
                    onChange={handleChange}
                    className="w-full bg-white border border-primary/10 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-primary text-foreground"
                    placeholder="e.g. Royal Opera House"
                  />
                </div>

                {/* Place */}
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-text-secondary">Place / City</label>
                  <input
                    type="text"
                    name="place"
                    required
                    value={form.place}
                    onChange={handleChange}
                    className="w-full bg-white border border-primary/10 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-primary text-foreground"
                    placeholder="e.g. Mumbai, India"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Image URL */}
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-text-secondary">Showcase Image URL</label>
                  <input
                    type="url"
                    name="imageUrl"
                    required
                    value={form.imageUrl}
                    onChange={handleChange}
                    className="w-full bg-white border border-primary/10 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-primary text-foreground"
                    placeholder="e.g. https://images.pexels.com/...jpg"
                  />
                </div>

                {/* Video URL */}
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-text-secondary">Optional Video Link (YouTube)</label>
                  <input
                    type="url"
                    name="videoUrl"
                    value={form.videoUrl}
                    onChange={handleChange}
                    className="w-full bg-white border border-primary/10 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-primary text-foreground"
                    placeholder="e.g. https://youtube.com/..."
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-text-secondary">Performance Description</label>
                <textarea
                  name="description"
                  required
                  rows={3}
                  value={form.description}
                  onChange={handleChange}
                  className="w-full bg-white border border-primary/10 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-primary text-foreground resize-none"
                  placeholder="Describe the set composition and highlights..."
                />
              </div>

              {/* Actions */}
              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold uppercase tracking-widest glow-button transition-colors cursor-pointer"
              >
                {editingPerf ? 'Save Changes' : 'Publish Record'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
