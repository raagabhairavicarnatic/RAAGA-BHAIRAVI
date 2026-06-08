'use client';

import React, { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, query, orderBy, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { Calendar, Plus, Edit2, Trash2, X, MapPin } from 'lucide-react';

interface EventItem {
  id: string;
  title: string;
  date: string;
  venue: string;
  place: string;
  imageUrl: string;
  description: string;
}

export default function AdminEventsPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<EventItem | null>(null);

  // Form states
  const [form, setForm] = useState({
    title: '',
    date: '',
    venue: '',
    place: '',
    imageUrl: '',
    description: '',
  });

  useEffect(() => {
    const q = query(collection(db, 'events'), orderBy('date', 'asc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items: EventItem[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        items.push({
          id: docSnap.id,
          title: data.title,
          date: data.date,
          venue: data.venue,
          place: data.place,
          imageUrl: data.imageUrl,
          description: data.description,
        });
      });
      setEvents(items);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const openAddModal = () => {
    setEditingEvent(null);
    setForm({
      title: '',
      date: '',
      venue: '',
      place: '',
      imageUrl: '',
      description: '',
    });
    setShowModal(true);
  };

  const openEditModal = (event: EventItem) => {
    setEditingEvent(event);
    setForm({
      title: event.title,
      date: event.date,
      venue: event.venue,
      place: event.place,
      imageUrl: event.imageUrl,
      description: event.description,
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this event?')) return;
    try {
      await deleteDoc(doc(db, 'events', id));
    } catch (error) {
      console.error('Error deleting event:', error);
      alert('Failed to delete event.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingEvent) {
        // Update
        await updateDoc(doc(db, 'events', editingEvent.id), {
          ...form,
        });
      } else {
        // Add
        await addDoc(collection(db, 'events'), {
          ...form,
        });
      }
      setShowModal(false);
    } catch (error) {
      console.error('Error saving event:', error);
      alert('Failed to save event.');
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
          <h1 className="font-serif text-3xl font-bold text-foreground">Manage Events</h1>
          <p className="text-xs text-text-secondary">Add, edit, or remove live concert events</p>
        </div>
        <button
          onClick={openAddModal}
          className="px-5 py-3 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold uppercase tracking-wider flex items-center space-x-2 glow-button cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Event</span>
        </button>
      </div>

      {/* Events Table/List */}
      {loading ? (
        <div className="text-text-secondary text-sm">Loading event database...</div>
      ) : events.length === 0 ? (
        <div className="glass-panel p-10 rounded-2xl text-center text-text-secondary text-sm border border-primary/5">
          No events registered in database. Click "Add New Event" to register the first tour date.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {events.map((event) => (
            <div
              key={event.id}
              className="glass-panel p-6 rounded-2xl flex flex-col md:flex-row items-center gap-6 shadow-sm border border-primary/5"
            >
              {/* Event Image Mini */}
              <div className="w-24 h-24 rounded-xl overflow-hidden relative bg-primary/5 flex-shrink-0">
                <img src={event.imageUrl} alt={event.title} className="w-full h-full object-cover" />
              </div>

              {/* Event Details */}
              <div className="flex-1 space-y-2 text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start space-x-3">
                  <span className="text-xs text-primary font-bold uppercase tracking-wide">
                    {new Date(event.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </span>
                  <span className="text-[10px] text-text-light flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-primary" />
                    {event.venue}, {event.place}
                  </span>
                </div>
                <h3 className="font-serif text-xl font-bold text-foreground">{event.title}</h3>
                <p className="text-xs text-text-secondary line-clamp-2 leading-relaxed font-light">{event.description}</p>
              </div>

              {/* Action buttons */}
              <div className="flex items-center space-x-3 flex-shrink-0">
                <button
                  onClick={() => openEditModal(event)}
                  className="w-10 h-10 rounded-xl border border-primary/10 text-text-secondary hover:border-primary hover:text-primary flex items-center justify-center cursor-pointer transition-colors"
                  title="Edit Event"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(event.id)}
                  className="w-10 h-10 rounded-xl border border-primary/10 text-text-secondary hover:border-primary-deep hover:text-primary-deep flex items-center justify-center cursor-pointer transition-colors"
                  title="Delete Event"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
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
              {editingEvent ? 'Edit Event Details' : 'Add New Event'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Title */}
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-text-secondary">Event Title</label>
                  <input
                    type="text"
                    name="title"
                    required
                    value={form.title}
                    onChange={handleChange}
                    className="w-full bg-white border border-primary/10 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-primary text-foreground"
                    placeholder="e.g. The Heritage Fusion Festival"
                  />
                </div>

                {/* Date */}
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-text-secondary">Proposed Date</label>
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
                    placeholder="e.g. Concert Hall"
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
                    placeholder="e.g. New Delhi, India"
                  />
                </div>
              </div>

              {/* Image URL */}
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-text-secondary">Image URL</label>
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

              {/* Description */}
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-text-secondary">Description</label>
                <textarea
                  name="description"
                  required
                  rows={3}
                  value={form.description}
                  onChange={handleChange}
                  className="w-full bg-white border border-primary/10 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-primary text-foreground resize-none"
                  placeholder="Describe the concert set details..."
                />
              </div>

              {/* Actions */}
              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold uppercase tracking-widest glow-button transition-colors cursor-pointer"
              >
                {editingEvent ? 'Save Changes' : 'Create Event'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
