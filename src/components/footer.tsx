'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { ArrowRight } from 'lucide-react';

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

export default function Footer() {
  const pathname = usePathname();
  const currentYear = new Date().getFullYear();

  const isAdminRoute = pathname.startsWith('/admin') || pathname === '/admin-login';

  if (isAdminRoute) return null;

  return (
    <footer className="bg-white border-t border-primary/5 py-16 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        {/* Brand Section */}
        <div className="md:col-span-2 space-y-6">
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-primary/20 shadow-md flex-shrink-0">
              <Image
                src="/logo.jpeg"
                alt="Raaga Bhairavi Logo"
                fill
                className="object-cover"
                sizes="56px"
              />
            </div>
            <div>
              <span className="font-serif font-bold text-xl tracking-wide text-foreground">
                RAAGA BHAIRAVI
              </span>
              <span className="block text-[9px] uppercase tracking-[0.25em] text-text-secondary">
                Carnatic Music
              </span>
            </div>
          </Link>
          <p className="text-text-secondary text-sm max-w-sm leading-relaxed">
            Echos of Divinity ... Holding Our Carnatic Heritage With Pride, Inspiring Generations Through The Timeless Language Of Music.
          </p>
          <div className="flex items-center space-x-4">
            <a
              href="https://www.instagram.com/raaga_bhairavi?igsh=MTBncDkwcG92bm9jdA%3D%3D"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-background flex items-center justify-center text-text-secondary hover:bg-primary hover:text-white transition-all duration-300"
              aria-label="Instagram"
            >
              <InstagramIcon className="w-4 h-4" />
            </a>
            <a
              href="https://www.youtube.com/@Raagabhairavi.carnatic"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-background flex items-center justify-center text-text-secondary hover:bg-primary hover:text-white transition-all duration-300"
              aria-label="YouTube"
            >
              <YoutubeIcon className="w-4 h-4" />
            </a>
            <a
              href="https://www.facebook.com/share/17QaGKCxBf/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-background flex items-center justify-center text-text-secondary hover:bg-primary hover:text-white transition-all duration-300"
              aria-label="Facebook"
            >
              <FacebookIcon className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-serif font-bold text-base text-foreground mb-6 uppercase tracking-wider">
            Explore
          </h4>
          <ul className="space-y-4">
            {['/vision', '/events', '/performances', '/gallery'].map((href) => (
              <li key={href}>
                <Link
                  href={href}
                  className="text-text-secondary hover:text-primary text-sm flex items-center group transition-colors"
                >
                  <ArrowRight className="w-3 h-3 mr-2 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  <span className="capitalize">{href.replace('/', '').replace('&', ' & ')}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact/Booking */}
        <div>
          <h4 className="font-serif font-bold text-base text-foreground mb-6 uppercase tracking-wider">
            Inquiries
          </h4>
          <ul className="space-y-4 text-sm text-text-secondary leading-relaxed">
            <li>
              <span className="block font-semibold text-foreground">Phone & WhatsApp:</span>
              <a href="tel:+917358689256" className="hover:text-primary transition-colors">
                +91 7358689256
              </a>
            </li>
            <li>
              <span className="block font-semibold text-foreground">Email:</span>
              <a href="mailto:raagabhairavi.carnatic@gmail.com" className="hover:text-primary transition-colors">
                raagabhairavi.carnatic@gmail.com
              </a>
            </li>
            <li>
              <span className="block font-semibold text-foreground">Location:</span>
              Tiruvottiyur,Chennai,Tamil Nadu
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto border-t border-primary/5 mt-16 pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-text-light">
        <p>© {currentYear} RAAGA BHAIRAVI. All rights reserved.</p>
        <div className="flex space-x-6 mt-4 md:mt-0">
          <Link href="/admin-login" className="hover:text-primary transition-colors">
            AdminPortal
          </Link>
          
        </div>
      </div>
    </footer>
  );
}
