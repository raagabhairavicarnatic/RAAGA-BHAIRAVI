import type { Metadata, Viewport } from 'next';
import { Playfair_Display, Poppins, Cinzel } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import WhatsAppFloat from '@/components/whatsapp-float';
import ShareFloat from '@/components/share-float';
import LoadingScreen from '@/components/loading-screen';

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

const cinzel = Cinzel({
  subsets: ['latin'],
  variable: '--font-cinzel',
  weight: ['400', '500', '600', '700', '800', '900'],
  display: 'swap',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  title: 'RAAGA BHAIRAVI | Echos of Divinity',
  description:
    'Welcome to the official platform of RAAGA BHAIRAVI. Experience Divinity through Artistic music, contemporary, and fusion carnatic performances.',
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
      className={`${playfair.variable} ${poppins.variable} ${cinzel.variable} h-full scroll-smooth antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground font-sans selection:bg-primary/20 selection:text-primary-deep">
        {/* Animated 5s Loading Splash Screen */}
        <LoadingScreen />

        {/* Transparent Header/Navbar */}
        <Navbar />

        {/* Main page content area */}
        <main className="flex-1 w-full">{children}</main>

        {/* Floating Share Button */}
        <ShareFloat />

        {/* Floating WhatsApp Button */}
        <WhatsAppFloat />

        {/* Footer */}
        <Footer />
      </body>
    </html>
  );
}
