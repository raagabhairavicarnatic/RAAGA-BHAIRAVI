'use client';

import React, { useState, useEffect } from 'react';
import { auth, db } from '@/lib/firebase';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { BookOpen, Save, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminVisionPage() {
  const [form, setForm] = useState({
    vision: '',
    mission: '',
    story: '',
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const docRef = doc(db, 'vision', 'data');
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setForm({
          vision: data.vision || '',
          mission: data.mission || '',
          story: data.story || '',
        });
      }
      setLoading(false);
    }, (error) => {
      console.error("Error reading vision config from firestore:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSuccess(false);

    try {
      await setDoc(doc(db, 'vision', 'data'), {
        ...form,
        updatedAt: Date.now(),
        updatedBy: auth.currentUser?.email || 'Unknown',
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error('Error updating vision data:', error);
      alert('Failed to update Vision & Mission content.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="text-text-secondary text-sm">Loading philosophical content...</div>;
  }

  return (
    <div className="space-y-8 font-sans max-w-4xl">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="font-serif text-3xl font-bold text-foreground">Manage Vision & Mission</h1>
        <p className="text-xs text-text-secondary">Edit group philosophical statements, targets, and history narratives</p>
      </div>

      <AnimatePresence>
        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-[#25D366]/5 border border-[#25D366]/20 text-foreground text-xs rounded-xl p-4 flex items-center space-x-2"
          >
            <CheckCircle className="w-4 h-4 text-[#25D366]" />
            <span className="font-semibold">Changes published successfully. They are now live on the public Vision page.</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Form */}
      <form onSubmit={handleSubmit} className="glass-panel p-8 rounded-3xl space-y-6 shadow-sm border border-primary/5">
        <div className="flex items-center space-x-3 text-primary pb-2 border-b border-primary/5">
          <BookOpen className="w-5 h-5" />
          <h2 className="font-serif text-xl font-bold text-foreground">Artistic Manifesto Edit</h2>
        </div>

        <div className="bg-primary/5 border border-primary/10 rounded-xl p-4 text-xs text-text-secondary leading-relaxed">
          <strong>Formatting Tip:</strong> You can make specific words or letters bold on the public page by wrapping them in double asterisks, e.g., <code>**bold text**</code>.
        </div>

        {/* Vision */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-text-secondary uppercase tracking-wider block">The Vision Statement</label>
          <textarea
            name="vision"
            required
            rows={3}
            value={form.vision}
            onChange={handleChange}
            className="w-full bg-white border border-primary/10 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-primary text-foreground resize-none leading-relaxed"
            placeholder="e.g. To curate a luxury classical-contemporary crossover space..."
          />
        </div>

        {/* Mission */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-text-secondary uppercase tracking-wider block">The Mission Statement</label>
          <textarea
            name="mission"
            required
            rows={4}
            value={form.mission}
            onChange={handleChange}
            className="w-full bg-white border border-primary/10 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-primary text-foreground resize-none leading-relaxed"
            placeholder="Input goals separated by lines or bullet points..."
          />
        </div>

        {/* Story */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-text-secondary uppercase tracking-wider block">Our Story & Artistic Philosophy</label>
          <textarea
            name="story"
            required
            rows={6}
            value={form.story}
            onChange={handleChange}
            className="w-full bg-white border border-primary/10 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-primary text-foreground resize-none leading-relaxed"
            placeholder="Detailed narrative about the musical group's origin, milestones, and core values..."
          />
        </div>

        {/* Save button */}
        <button
          type="submit"
          disabled={submitting}
          className="px-6 py-3.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold uppercase tracking-widest glow-button transition-colors flex items-center justify-center space-x-2 cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>{submitting ? 'Publishing Changes...' : 'Publish Philosophy'}</span>
        </button>
      </form>
    </div>
  );
}
