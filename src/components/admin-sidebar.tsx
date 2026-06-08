'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import { LayoutDashboard, Calendar, Award, Image as ImageIcon, BookOpen, MessageSquare, LogOut, Music } from 'lucide-react';

const sidebarLinks = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/events', label: 'Events', icon: Calendar },
  { href: '/admin/performances', label: 'Performances', icon: Award },
  { href: '/admin/gallery', label: 'Gallery', icon: ImageIcon },
  { href: '/admin/vision', label: 'Vision & Mission', icon: BookOpen },
  { href: '/admin/messages', label: 'Live Chats', icon: MessageSquare },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/admin-login');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return (
    <aside className="w-64 bg-white border-r border-primary/5 h-screen sticky top-0 flex flex-col justify-between p-6 z-30 font-sans">
      <div className="space-y-8">
        {/* Brand */}
        <Link href="/" className="flex items-center space-x-2 group">
          <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-white">
            <Music className="w-4.5 h-4.5" />
          </div>
          <div>
            <span className="font-serif font-bold text-base tracking-wide text-foreground">
              RAAGA BHAIRAVI
            </span>
            <span className="block text-[8px] uppercase tracking-[0.2em] text-text-secondary">
              Admin Panel
            </span>
          </div>
        </Link>

        {/* Links */}
        <nav className="flex flex-col space-y-1">
          {sidebarLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-xs font-medium tracking-wide transition-all ${
                  isActive
                    ? 'bg-primary/5 text-primary border-l-2 border-primary'
                    : 'text-text-secondary hover:bg-primary/5 hover:text-primary'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="flex items-center space-x-3 px-4 py-3 rounded-xl text-xs font-medium tracking-wide text-text-secondary hover:bg-primary/5 hover:text-primary transition-all cursor-pointer w-full text-left focus:outline-none"
      >
        <LogOut className="w-4 h-4" />
        <span>Logout</span>
      </button>
    </aside>
  );
}
