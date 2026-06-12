'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';

export default function ShareFloat() {
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith('/admin') || pathname === '/admin-login';
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  if (isAdminRoute) return null;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText('https://raaga-bhairavi.vercel.app/');
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const shareLinks = [
    {
      name: 'WhatsApp',
      url: 'https://api.whatsapp.com/send?text=Check%20out%20RAAGA%20BHAIRAVI%20-%20Premium%20Carnatic%20Musical%20Group:%20https://raaga-bhairavi.vercel.app/',
      color: '#25D366',
      icon: (
        <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.504-5.714-1.466L0 24zm6.59-4.846c1.6.95 3.498 1.45 5.419 1.451 5.394 0 9.784-4.382 9.788-9.774a9.715 9.715 0 0 0-2.87-6.914 9.69 9.69 0 0 0-6.903-2.868c-5.399 0-9.787 4.383-9.792 9.775a9.717 9.717 0 0 0 1.488 5.163l-.988 3.6 3.693-.97.185.11zM17.067 14.18c-.273-.137-1.614-.796-1.864-.887-.25-.092-.432-.137-.613.137-.182.273-.705.887-.864 1.07-.159.182-.318.204-.591.068-.272-.136-1.15-.424-2.19-1.353-.81-.722-1.356-1.616-1.515-1.888-.159-.272-.017-.419.12-.555.122-.122.272-.318.409-.477.136-.159.182-.272.272-.454.091-.181.045-.34-.023-.477-.068-.136-.613-1.477-.84-2.023-.222-.534-.448-.46-.613-.468l-.523-.01c-.182 0-.477.068-.727.34-.25.273-.954.933-.954 2.273s.977 2.636 1.114 2.818c.136.182 1.922 2.936 4.656 4.116.65.28 1.157.447 1.554.573.653.208 1.248.178 1.717.108.523-.078 1.614-.659 1.841-1.295.227-.636.227-1.181.159-1.295-.068-.113-.25-.204-.523-.341z" />
        </svg>
      )
    },
    {
      name: 'Facebook',
      url: 'https://www.facebook.com/sharer/sharer.php?u=https://raaga-bhairavi.vercel.app/',
      color: '#1877F2',
      icon: (
        <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      )
    },
    {
      name: 'X (Twitter)',
      url: 'https://twitter.com/intent/tweet?url=https://raaga-bhairavi.vercel.app/&text=Check%20out%20RAAGA%20BHAIRAVI%20-%20Premium%20Carnatic%20Musical%20Group',
      color: '#000000',
      icon: (
        <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      )
    }
  ];

  return (
    <>
      {/* Background overlay to close menu on click outside */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-transparent cursor-default"
          onClick={() => setIsOpen(false)}
        />
      )}

      <div className="fixed bottom-[92px] right-6 md:bottom-6 md:left-6 md:right-auto z-50 flex flex-col-reverse items-center gap-3">
        {/* Main Floating Share Button */}
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          className="w-14 h-14 rounded-full bg-[#c60001] hover:bg-[#a50001] text-white flex items-center justify-center shadow-lg transition-transform duration-300 hover:scale-105 relative z-50 overflow-hidden cursor-pointer"
          title="Share Website"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {/* Sweep Shine Effect */}
          <motion.span
            className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-20 z-20 pointer-events-none"
            animate={{
              x: ['-150%', '150%']
            }}
            transition={{
              repeat: Infinity,
              repeatDelay: 4,
              duration: 1.5,
              ease: "easeInOut"
            }}
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="relative z-10"
          >
            <circle cx="18" cy="5" r="3" />
            <circle cx="6" cy="12" r="3" />
            <circle cx="18" cy="19" r="3" />
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
          </svg>
        </motion.button>

        {/* Share Options Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 15, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 15, scale: 0.95 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="glass-panel shadow-2xl rounded-2xl p-4 w-48 mb-1 border border-primary/5 flex flex-col space-y-2 relative z-50 overflow-hidden"
            >
              <span className="text-[10px] font-bold text-text-secondary uppercase tracking-[0.2em] px-1 block mb-1">
                Share Via
              </span>

              {shareLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-3 px-3 py-2 rounded-xl hover:bg-primary/5 transition-colors text-sm font-medium text-foreground group"
                >
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-white transition-transform group-hover:scale-110"
                    style={{ backgroundColor: link.color }}
                  >
                    {link.icon}
                  </div>
                  <span>{link.name}</span>
                </a>
              ))}

              <div className="h-[1px] bg-primary/10 my-1" />

              {/* Copy Link Button */}
              <button
                onClick={handleCopyLink}
                className="flex items-center space-x-3 px-3 py-2 rounded-xl hover:bg-primary/5 transition-colors text-sm font-medium text-foreground w-full text-left group cursor-pointer"
              >
                <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-primary/10 text-primary transition-transform group-hover:scale-110">
                  {copied ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#25D366" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                    </svg>
                  )}
                </div>
                <span>{copied ? 'Link Copied!' : 'Copy Link'}</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
