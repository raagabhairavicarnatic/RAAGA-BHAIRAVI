'use client';

import React, { useState, useEffect } from 'react';
import { db, auth } from '@/lib/firebase';
import { supabase } from '@/lib/supabase';
import { collection, onSnapshot, query, orderBy, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { ImageIcon, Plus, Trash2, Edit2, X, Play, Upload, Pin } from 'lucide-react';

interface GalleryItem {
  id: string;
  type: 'image' | 'youtube';
  title: string;
  imageUrl: string;
  youtubeUrl?: string;
  createdAt: number;
  pinned?: boolean;
}

export default function AdminGalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);
  
  // Form states
  const [form, setForm] = useState({
    type: 'image' as 'image' | 'youtube',
    title: '',
    imageUrl: '', // For manual URL input
    youtubeUrl: '',
    pinned: false,
  });
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const q = query(collection(db, 'gallery'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const dbItems: GalleryItem[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        dbItems.push({
          id: docSnap.id,
          type: data.type,
          title: data.title,
          imageUrl: data.imageUrl,
          youtubeUrl: data.youtubeUrl || '',
          createdAt: data.createdAt,
          pinned: !!data.pinned,
        });
      });
      // Sort client-side: pinned items first, then by createdAt desc
      dbItems.sort((a, b) => {
        const aPinned = a.pinned ? 1 : 0;
        const bPinned = b.pinned ? 1 : 0;
        if (aPinned !== bPinned) return bPinned - aPinned;
        return b.createdAt - a.createdAt;
      });
      setItems(dbItems);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadFile(e.target.files[0]);
    }
  };

  const getYoutubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const handleDelete = async (item: GalleryItem) => {
    if (!confirm('Are you sure you want to delete this gallery item?')) return;
    try {
      // 1. Delete from Supabase Storage if it's an uploaded image
      if (item.type === 'image' && item.imageUrl.includes('supabase.co')) {
        const parts = item.imageUrl.split('/gallery/');
        const fileName = parts[parts.length - 1];
        await supabase.storage.from('gallery').remove([fileName]).catch((err) => console.warn(err));
      }

      // 2. Delete Firestore doc
      await deleteDoc(doc(db, 'gallery', item.id));
    } catch (error) {
      console.error('Error deleting gallery item:', error);
      alert('Failed to delete item.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      let finalImageUrl = form.imageUrl.trim();

      if (form.type === 'image') {
        if (uploadFile) {
          // If editing and user uploads a new image, delete the old Supabase image first
          if (editingItem && editingItem.imageUrl.includes('supabase.co')) {
            const parts = editingItem.imageUrl.split('/gallery/');
            const fileName = parts[parts.length - 1];
            await supabase.storage.from('gallery').remove([fileName]).catch((err) => console.warn(err));
          }

          // Upload actual file to Supabase Storage
          const fileName = `${Date.now()}_${uploadFile.name}`;
          const { error: uploadError } = await supabase.storage
            .from('gallery')
            .upload(fileName, uploadFile, {
              cacheControl: '3600',
              upsert: false
            });
          if (uploadError) throw uploadError;

          // Retrieve public url
          const { data: { publicUrl } } = supabase.storage
            .from('gallery')
            .getPublicUrl(fileName);
          finalImageUrl = publicUrl;
        } else if (!finalImageUrl && editingItem) {
          // Retain existing image if editing and no new file or URL is provided
          finalImageUrl = editingItem.imageUrl;
        } else if (!finalImageUrl) {
          alert('Please upload an image file or input a valid Image URL.');
          setSubmitting(false);
          return;
        }
      } else {
        // YouTube video: Auto-extract ID and set standard youtube thumbnail if not provided
        const yid = getYoutubeId(form.youtubeUrl);
        if (!yid) {
          alert('Invalid YouTube URL.');
          setSubmitting(false);
          return;
        }
        finalImageUrl = `https://img.youtube.com/vi/${yid}/0.jpg`;
      }

      const adminEmail = auth.currentUser?.email || 'Unknown';
      const payload = {
        type: form.type,
        title: form.title,
        imageUrl: finalImageUrl,
        youtubeUrl: form.type === 'youtube' ? form.youtubeUrl.trim() : null,
        updatedAt: Date.now(),
        updatedBy: adminEmail,
        pinned: form.pinned,
      };

      if (editingItem) {
        await updateDoc(doc(db, 'gallery', editingItem.id), payload);
      } else {
        await addDoc(collection(db, 'gallery'), {
          ...payload,
          createdAt: Date.now(),
          createdBy: adminEmail,
        });
      }
      
      // Reset & close
      setForm({
        type: 'image',
        title: '',
        imageUrl: '',
        youtubeUrl: '',
        pinned: false,
      });
      setUploadFile(null);
      setEditingItem(null);
      setShowModal(false);
    } catch (error) {
      console.error('Error saving gallery item:', error);
      alert('Failed to save gallery item.');
    } finally {
      setSubmitting(false);
    }
  };

  const openAddModal = () => {
    setEditingItem(null);
    setForm({
      type: 'image',
      title: '',
      imageUrl: '',
      youtubeUrl: '',
      pinned: false,
    });
    setUploadFile(null);
    setShowModal(true);
  };

  const openEditModal = (item: GalleryItem) => {
    setEditingItem(item);
    setForm({
      type: item.type,
      title: item.title,
      imageUrl: item.type === 'image' ? item.imageUrl : '',
      youtubeUrl: item.type === 'youtube' ? item.youtubeUrl || '' : '',
      pinned: !!item.pinned,
    });
    setUploadFile(null);
    setShowModal(true);
  };

  return (
    <div className="space-y-8 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <h1 className="font-serif text-3xl font-bold text-foreground">Manage Gallery</h1>
          <p className="text-xs text-text-secondary">Upload photos or reference concert video links</p>
        </div>
        <button
          onClick={openAddModal}
          className="px-5 py-3 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold uppercase tracking-wider flex items-center space-x-2 glow-button cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Gallery Item</span>
        </button>
      </div>

      {/* Media Grid list */}
      {loading ? (
        <div className="text-text-secondary text-sm">Loading media catalog...</div>
      ) : items.length === 0 ? (
        <div className="glass-panel p-10 rounded-2xl text-center text-text-secondary text-sm border border-primary/5">
          No gallery items found. Click "Add Gallery Item" to upload your first image.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {items.map((item) => (
            <div
              key={item.id}
              className="glass-panel p-4 rounded-2xl flex flex-col space-y-4 shadow-sm border border-primary/5 relative group"
            >
              {/* Media Thumbnail */}
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-primary/5 shadow-sm">
                <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                {item.type === 'youtube' && (
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                    <Play className="w-8 h-8 text-white fill-white" />
                  </div>
                )}
                {/* Floating Pin Button */}
                <button
                  onClick={async () => {
                    try {
                      await updateDoc(doc(db, 'gallery', item.id), {
                        pinned: !item.pinned,
                        updatedAt: Date.now(),
                        updatedBy: auth.currentUser?.email || 'Unknown'
                      });
                    } catch (err) {
                      console.error("Error toggling pin status:", err);
                    }
                  }}
                  className={`absolute top-3 right-3 w-8 h-8 rounded-xl flex items-center justify-center shadow-md cursor-pointer transition-all z-10 ${
                    item.pinned 
                      ? 'bg-primary text-white scale-105' 
                      : 'bg-white/90 text-text-secondary border border-primary/10 opacity-0 group-hover:opacity-100 hover:bg-white hover:text-primary'
                  }`}
                  title={item.pinned ? "Unpin from Top" : "Pin to Top"}
                >
                  <Pin className="w-4 h-4 fill-current" />
                </button>
              </div>

              {/* Info & Actions */}
              <div className="flex items-center justify-between px-1">
                <div>
                  <h4 className="text-xs font-bold text-foreground truncate max-w-[120px]">{item.title}</h4>
                  <span className="text-[9px] uppercase tracking-wider text-text-light">{item.type}</span>
                </div>
                <div className="flex items-center space-x-2 flex-shrink-0">
                  <button
                    onClick={() => openEditModal(item)}
                    className="w-8 h-8 rounded-xl border border-primary/10 text-text-secondary hover:border-primary hover:text-primary flex items-center justify-center cursor-pointer transition-colors"
                    title="Edit Item"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(item)}
                    className="w-8 h-8 rounded-xl border border-primary/10 text-text-secondary hover:border-primary-deep hover:text-primary-deep flex items-center justify-center cursor-pointer transition-colors"
                    title="Delete Item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Form Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md glass-panel p-8 rounded-3xl shadow-2xl relative overflow-hidden border border-primary/5">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-6 right-6 text-text-secondary hover:text-primary transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <h2 className="font-serif text-2xl font-bold text-foreground mb-6">
              {editingItem ? 'Edit Gallery Item' : 'Add Gallery Item'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Type Select */}
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-text-secondary">Item Type</label>
                <div className="flex items-center space-x-4">
                  <label className="flex items-center space-x-1.5 text-xs text-foreground cursor-pointer">
                    <input
                      type="radio"
                      name="type"
                      checked={form.type === 'image'}
                      onChange={() => setForm({ ...form, type: 'image' })}
                      className="accent-primary"
                    />
                    <span>Showcase Image</span>
                  </label>
                  <label className="flex items-center space-x-1.5 text-xs text-foreground cursor-pointer">
                    <input
                      type="radio"
                      name="type"
                      checked={form.type === 'youtube'}
                      onChange={() => setForm({ ...form, type: 'youtube' })}
                      className="accent-primary"
                    />
                    <span>YouTube Video</span>
                  </label>
                </div>
              </div>

              {/* Title */}
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-text-secondary">Item Title</label>
                <input
                  type="text"
                  name="title"
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full bg-white border border-primary/10 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-primary text-foreground"
                  placeholder="e.g. Classical Concert Highlights"
                />
              </div>

              {/* Image Mode */}
              {form.type === 'image' && (
                <div className="space-y-4">
                  {/* File Upload */}
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-text-secondary block">Upload Image File</label>
                    <label className="w-full flex flex-col items-center justify-center px-4 py-5 bg-white border border-dashed border-primary/20 rounded-xl cursor-pointer hover:border-primary transition-colors text-center">
                      <Upload className="w-6 h-6 text-primary mb-1" />
                      <span className="text-[11px] text-text-secondary">
                        {uploadFile ? uploadFile.name : 'Choose a JPEG/PNG file...'}
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>
                  </div>

                  <div className="text-center text-[10px] text-text-light font-semibold uppercase">Or</div>

                  {/* Manual URL fallback */}
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-text-secondary">External Image URL</label>
                    <input
                      type="url"
                      name="imageUrl"
                      value={form.imageUrl}
                      onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                      className="w-full bg-white border border-primary/10 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-primary text-foreground"
                      placeholder="e.g. https://images.pexels.com/...jpg"
                    />
                  </div>
                </div>
              )}

              {/* YouTube Mode */}
              {form.type === 'youtube' && (
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-text-secondary">YouTube Video Link</label>
                  <input
                    type="url"
                    name="youtubeUrl"
                    required
                    value={form.youtubeUrl}
                    onChange={(e) => setForm({ ...form, youtubeUrl: e.target.value })}
                    className="w-full bg-white border border-primary/10 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-primary text-foreground"
                    placeholder="e.g. https://www.youtube.com/watch?v=..."
                  />
                  <span className="block text-[9px] text-text-light leading-relaxed mt-1">
                    The thumbnail is automatically extracted from YouTube.
                  </span>
                </div>
              )}

              {/* Pin to Top Checkbox */}
              <div className="flex items-center space-x-2 pt-1 pb-2">
                <input
                  type="checkbox"
                  id="pinned"
                  checked={form.pinned}
                  onChange={(e) => setForm({ ...form, pinned: e.target.checked })}
                  className="w-4 h-4 accent-primary rounded cursor-pointer"
                />
                <label htmlFor="pinned" className="text-xs text-text-secondary font-medium cursor-pointer select-none">
                  Pin this item to the top
                </label>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold uppercase tracking-widest glow-button transition-colors cursor-pointer flex items-center justify-center"
              >
                <span>{submitting ? 'Processing...' : (editingItem ? 'Save Changes' : 'Add Item')}</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
