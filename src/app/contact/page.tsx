'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { Phone, Mail, MapPin, CheckCircle, Send, MessageSquare } from 'lucide-react';

const InstagramIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    width="24"
    height="24"
    stroke="currentColor"
    strokeWidth="2"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const FacebookIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    width="24"
    height="24"
    stroke="currentColor"
    strokeWidth="2"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const YoutubeIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    width="24"
    height="24"
    stroke="currentColor"
    strokeWidth="2"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
  </svg>
);

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
};

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    eventType: '',
    date: '',
    location: '',
    message: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await addDoc(collection(db, 'bookings'), {
        ...formData,
        timestamp: serverTimestamp(),
      });
      setSuccess(true);
      setFormData({
        name: '',
        phone: '',
        eventType: '',
        date: '',
        location: '',
        message: '',
      });
    } catch (error) {
      console.error('Error submitting booking inquiry:', error);
      alert('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-[#FFF9F9] min-h-screen pt-32 pb-24 px-6 relative">
      {/* 1. Floating WhatsApp Button (Bottom Left) */}
      <a
        href="https://wa.me/1234567890?text=Hello%20Raaga%20Bhairavi,%20I%20would%20like%20to%20inquire%20about%20booking%20a%20performance!"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 left-6 z-50 w-14 h-14 rounded-full bg-[#25D366] hover:bg-[#20ba5a] text-white flex items-center justify-center shadow-lg transition-transform duration-300 hover:scale-105"
        title="Chat on WhatsApp"
      >
        <MessageSquare className="w-6 h-6 fill-white" />
        <span className="absolute -top-1 -right-1 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-[#25D366]"></span>
        </span>
      </a>

      <div className="max-w-7xl mx-auto space-y-16">
        {/* Header */}
        <motion.div
          initial="initial"
          animate="animate"
          variants={fadeInUp}
          className="text-center space-y-4 max-w-2xl mx-auto"
        >
          <div className="flex items-center justify-center space-x-3 text-primary">
            <Mail className="w-5 h-5" />
            <span className="text-xs uppercase tracking-[0.25em] font-semibold">Booking</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-6xl font-bold text-foreground tracking-tight">
            Contact For Booking
          </h1>
          <p className="text-text-secondary text-sm sm:text-base max-w-md mx-auto">
            Book our musical group for concerts, weddings, corporate galas, and global heritage tours.
          </p>
          <div className="w-24 h-[1px] bg-primary/30 mx-auto mt-6" />
        </motion.div>

        {/* Contact Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Info Card - Left (Col Span 5) */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5 space-y-6"
          >
            {/* Main info card */}
            <div className="glass-panel p-8 rounded-3xl space-y-8 shadow-sm">
              <h2 className="font-serif text-2xl font-bold text-foreground">Get In Touch</h2>
              
              <div className="space-y-6 text-sm">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block font-semibold text-foreground">Phone & WhatsApp</span>
                    <a href="tel:+1234567890" className="text-text-secondary hover:text-primary transition-colors">
                      +1 (234) 567-890
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block font-semibold text-foreground">Email Inquiries</span>
                    <a href="mailto:booking@raagabhairavi.com" className="text-text-secondary hover:text-primary transition-colors">
                      booking@raagabhairavi.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block font-semibold text-foreground">Creative Studio</span>
                    <span className="text-text-secondary">Chennai, Tamil Nadu, India</span>
                  </div>
                </div>
              </div>

              {/* Social Channels */}
              <div className="border-t border-primary/5 pt-6">
                <span className="block text-xs uppercase tracking-widest text-text-light font-semibold mb-4">Follow Us</span>
                <div className="flex items-center space-x-4">
                  <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-[#FFF9F9] flex items-center justify-center text-text-secondary hover:bg-primary hover:text-white transition-colors">
                    <InstagramIcon className="w-4 h-4" />
                  </a>
                  <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-[#FFF9F9] flex items-center justify-center text-text-secondary hover:bg-primary hover:text-white transition-colors">
                    <YoutubeIcon className="w-4 h-4" />
                  </a>
                  <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-[#FFF9F9] flex items-center justify-center text-text-secondary hover:bg-primary hover:text-white transition-colors">
                    <FacebookIcon className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>

            {/* Google Map Card */}
            <div className="glass-panel p-3 rounded-3xl overflow-hidden shadow-sm h-64">
              <iframe
                title="Studio Location Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3886.8520807833075!2d80.24503737593181!3d13.045051713286086!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a526644f5358055%3A0xb3ea219dc7d19760!2sT.%20Nagar%2C%20Chennai%2C%20Tamil%20Nadu!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                className="w-full h-full rounded-2xl border-0"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </motion.div>

          {/* Booking Form - Right (Col Span 7) */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 glass-panel p-8 rounded-3xl shadow-sm border border-primary/5"
          >
            <AnimatePresence mode="wait">
              {success ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="flex flex-col items-center justify-center text-center py-12 space-y-4"
                >
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary animate-bounce">
                    <CheckCircle className="w-8 h-8" />
                  </div>
                  <h2 className="font-serif text-2xl font-bold text-foreground">Inquiry Sent Successfully</h2>
                  <p className="text-sm text-text-secondary max-w-sm">
                    Thank you for your interest. Our management team will review your booking details and get back to you shortly.
                  </p>
                  <button
                    onClick={() => setSuccess(false)}
                    className="mt-6 px-6 py-2.5 rounded-full border border-primary/20 text-xs font-semibold uppercase tracking-wider text-primary hover:bg-primary hover:text-white transition-colors"
                  >
                    Send Another Inquiry
                  </button>
                </motion.div>
              ) : (
                <motion.form
                  key="booking-form"
                  onSubmit={handleSubmit}
                  className="space-y-6"
                >
                  <h2 className="font-serif text-2xl font-bold text-foreground mb-4">Performance Inquiry Form</h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Name */}
                    <div className="space-y-2">
                      <label htmlFor="name" className="text-xs font-semibold text-text-secondary">Your Name / Organization</label>
                      <input
                        type="text"
                        name="name"
                        id="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full bg-white border border-primary/10 focus:border-primary rounded-xl px-4 py-3 text-sm focus:outline-none text-foreground"
                        placeholder="e.g. Arvind"
                      />
                    </div>

                    {/* Phone */}
                    <div className="space-y-2">
                      <label htmlFor="phone" className="text-xs font-semibold text-text-secondary">Phone Number</label>
                      <input
                        type="tel"
                        name="phone"
                        id="phone"
                        required
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full bg-white border border-primary/10 focus:border-primary rounded-xl px-4 py-3 text-sm focus:outline-none text-foreground"
                        placeholder="e.g. +91 98765 43210"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Event Type */}
                    <div className="space-y-2">
                      <label htmlFor="eventType" className="text-xs font-semibold text-text-secondary">Event Type</label>
                      <select
                        name="eventType"
                        id="eventType"
                        required
                        value={formData.eventType}
                        onChange={handleChange}
                        className="w-full bg-white border border-primary/10 focus:border-primary rounded-xl px-4 py-3 text-sm focus:outline-none text-foreground"
                      >
                        <option value="">Select Event Type</option>
                        <option value="Concert">Grand Concert / Tour</option>
                        <option value="Festival">Music Festival</option>
                        <option value="Wedding">Wedding / Classical Reception</option>
                        <option value="Corporate">Corporate Gala</option>
                        <option value="Other">Other Performance</option>
                      </select>
                    </div>

                    {/* Date */}
                    <div className="space-y-2">
                      <label htmlFor="date" className="text-xs font-semibold text-text-secondary">Proposed Date</label>
                      <input
                        type="date"
                        name="date"
                        id="date"
                        required
                        value={formData.date}
                        onChange={handleChange}
                        className="w-full bg-white border border-primary/10 focus:border-primary rounded-xl px-4 py-3 text-sm focus:outline-none text-foreground"
                      />
                    </div>
                  </div>

                  {/* Location */}
                  <div className="space-y-2">
                    <label htmlFor="location" className="text-xs font-semibold text-text-secondary">Venue Location</label>
                    <input
                      type="text"
                      name="location"
                      id="location"
                      required
                      value={formData.location}
                      onChange={handleChange}
                      className="w-full bg-white border border-primary/10 focus:border-primary rounded-xl px-4 py-3 text-sm focus:outline-none text-foreground"
                      placeholder="e.g. Chennai Music Academy, India"
                    />
                  </div>

                  {/* Message */}
                  <div className="space-y-2">
                    <label htmlFor="message" className="text-xs font-semibold text-text-secondary">Inquiry Description / Message</label>
                    <textarea
                      name="message"
                      id="message"
                      rows={4}
                      required
                      value={formData.message}
                      onChange={handleChange}
                      className="w-full bg-white border border-primary/10 focus:border-primary rounded-xl px-4 py-3 text-sm focus:outline-none text-foreground resize-none"
                      placeholder="Tell us about the audience capacity, acoustic settings, and expected set duration..."
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-4 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold uppercase tracking-widest glow-button transition-colors flex items-center justify-center space-x-2"
                  >
                    <span>{submitting ? 'Sending inquiry...' : 'Send Inquiry'}</span>
                    <Send className="w-4 h-4" />
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
