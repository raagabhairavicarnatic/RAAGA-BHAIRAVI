import type { Metadata, Viewport } from 'next';
import { Playfair_Display, Poppins } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import ChatSystem from '@/components/chat-system';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  weight: ['400', '500', '600', '700', '800', '900'],
  display: 'swap',
});

const poppins = Poppins({
  subsets: ['latin'],
  variable: '--font-poppins',
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  title: 'RAAGA BHAIRAVI | Premium Modern Cinematic Musical Group',
  description:
    'Welcome to the official platform of RAAGA BHAIRAVI. Experience classical, contemporary, and fusion carnatic performances rendered in minimalist luxury and cinematic grandeur.',
  keywords: [
    'Raaga Bhairavi',
    'Carnatic Music Group',
    'Fusion Music Band',
    'Classical Music India',
    'Musical Group Booking',
    'Orchestral Carnatic Fusion',
  ],
  authors: [{ name: 'RAAGA BHAIRAVI' }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${poppins.variable} h-full scroll-smooth antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground font-sans selection:bg-primary/20 selection:text-primary-deep">
        {/* Transparent Header/Navbar */}
        <Navbar />

        {/* Main page content area */}
        <main className="flex-1 w-full">{children}</main>

        {/* Floating Chat Assistant */}
        <ChatSystem />

        {/* Footer */}
        <Footer />
      </body>
    </html>
  );
}
