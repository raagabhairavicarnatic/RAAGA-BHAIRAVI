'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth, isAdminUser } from '@/lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import AdminSidebar from '@/components/admin-sidebar';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser || !isAdminUser(currentUser.email)) {
        // Redirect if not logged in or not admin
        router.push('/admin-login');
      } else {
        setUser(currentUser);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [router]);

  if (loading) {
    return (
      <div className="bg-[#FFF9F9] min-h-screen flex items-center justify-center text-text-secondary text-sm">
        Verifying administrator authorization...
      </div>
    );
  }

  return (
    <div className="flex bg-[#FFF9F9] min-h-screen w-full font-sans">
      {/* Sidebar Panel */}
      <AdminSidebar />

      {/* Main Panel Content Area */}
      <main className="flex-1 p-10 overflow-y-auto max-h-screen">
        {children}
      </main>
    </div>
  );
}
