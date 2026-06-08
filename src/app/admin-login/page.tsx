'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { auth, isAdminUser } from '@/lib/firebase';
import { signInWithEmailAndPassword, onAuthStateChanged, signOut } from 'firebase/auth';
import { Lock, Mail, AlertTriangle, ShieldCheck } from 'lucide-react';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
};

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const router = useRouter();

  // If already logged in as admin, redirect directly to dashboard
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && isAdminUser(user.email)) {
        router.push('/admin');
      } else {
        setCheckingAuth(false);
      }
    });
    return () => unsubscribe();
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      // 1. Authenticate with Firebase Auth
      const userCredential = await signInWithEmailAndPassword(auth, email.trim(), password);
      const user = userCredential.user;

      // 2. Double-check if email is in the authorized admin list
      if (!isAdminUser(user.email)) {
        await signOut(auth);
        setError('Access Denied: This account is not registered as an administrator.');
      } else {
        router.push('/admin');
      }
    } catch (err: any) {
      console.error('Login error:', err);
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setError('Invalid email or password.');
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (checkingAuth) {
    return (
      <div className="bg-[#FFF9F9] min-h-screen flex items-center justify-center text-text-secondary text-sm">
        Checking authentication...
      </div>
    );
  }

  return (
    <div className="bg-[#FFF9F9] min-h-screen flex items-center justify-center px-6 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/5 rounded-full filter blur-[100px] pointer-events-none" />

      <motion.div
        initial="initial"
        animate="animate"
        variants={fadeInUp}
        className="w-full max-w-md glass-panel p-8 rounded-3xl shadow-xl border border-primary/5 relative z-10"
      >
        <div className="flex flex-col items-center text-center space-y-4 mb-8">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-serif text-2xl font-bold text-foreground">Admin Portal</h1>
            <p className="text-xs text-text-secondary mt-1">Sign in with authorized administrator credentials</p>
          </div>
        </div>

        {error && (
          <div className="bg-primary/5 border border-primary/20 text-primary-deep text-xs rounded-xl p-3 flex items-center space-x-2 mb-6">
            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          {/* Email */}
          <div className="space-y-2">
            <label htmlFor="email" className="text-xs font-semibold text-text-secondary">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-3.5 w-4 h-4 text-text-light" />
              <input
                type="email"
                id="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white border border-primary/10 focus:border-primary rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none text-foreground"
                placeholder="admin@example.com"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-2">
            <label htmlFor="password" className="text-xs font-semibold text-text-secondary">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-3.5 w-4 h-4 text-text-light" />
              <input
                type="password"
                id="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white border border-primary/10 focus:border-primary rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none text-foreground"
                placeholder="••••••••"
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold uppercase tracking-widest glow-button transition-colors flex items-center justify-center"
          >
            {submitting ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
