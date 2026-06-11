'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';

export default function WhatsAppFloat() {
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith('/admin') || pathname === '/admin-login';

  if (isAdminRoute) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center justify-center">
      {/* Expanding Pulse Circle */}
      <motion.div
        className="absolute w-14 h-14 rounded-full bg-[#25D366]/40 pointer-events-none z-0"
        animate={{
          scale: [1, 1.8],
          opacity: [0.6, 0]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatDelay: 3,
          ease: "easeOut"
        }}
      />

      <motion.a
        href="https://wa.me/+917358689256?text=Hello%20Raaga%20Bhairavi,%20I%20would%20like%20to%20inquire%20about%20booking%20a%20performance!"
        target="_blank"
        rel="noopener noreferrer"
        className="relative z-10 w-14 h-14 rounded-full bg-[#25D366] hover:bg-[#20ba5a] text-white flex items-center justify-center shadow-lg transition-transform duration-300 hover:scale-105 overflow-hidden"
        title="Chat on WhatsApp"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <svg
          viewBox="0 0 24 24"
          width="28"
          height="28"
          fill="currentColor"
          className="relative z-10"
        >
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.504-5.714-1.466L0 24zm6.59-4.846c1.6.95 3.498 1.45 5.419 1.451 5.394 0 9.784-4.382 9.788-9.774a9.715 9.715 0 0 0-2.87-6.914 9.69 9.69 0 0 0-6.903-2.868c-5.399 0-9.787 4.383-9.792 9.775a9.717 9.717 0 0 0 1.488 5.163l-.988 3.6 3.693-.97.185.11zM17.067 14.18c-.273-.137-1.614-.796-1.864-.887-.25-.092-.432-.137-.613.137-.182.273-.705.887-.864 1.07-.159.182-.318.204-.591.068-.272-.136-1.15-.424-2.19-1.353-.81-.722-1.356-1.616-1.515-1.888-.159-.272-.017-.419.12-.555.122-.122.272-.318.409-.477.136-.159.182-.272.272-.454.091-.181.045-.34-.023-.477-.068-.136-.613-1.477-.84-2.023-.222-.534-.448-.46-.613-.468l-.523-.01c-.182 0-.477.068-.727.34-.25.273-.954.933-.954 2.273s.977 2.636 1.114 2.818c.136.182 1.922 2.936 4.656 4.116.65.28 1.157.447 1.554.573.653.208 1.248.178 1.717.108.523-.078 1.614-.659 1.841-1.295.227-.636.227-1.181.159-1.295-.068-.113-.25-.204-.523-.341z" />
        </svg>

        {/* Sweep Shine Effect */}
        <motion.span
          className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/50 to-transparent -skew-x-20 z-20 pointer-events-none"
          animate={{
            x: ['-150%', '150%']
          }}
          transition={{
            repeat: Infinity,
            repeatDelay: 3.5,
            duration: 1.5,
            ease: "easeInOut"
          }}
        />
      </motion.a>
    </div>
  );
}
