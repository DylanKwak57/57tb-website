'use client';

import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';
import { LINE_URL } from '@/lib/constants';

export function FloatingCTA() {
  return (
    <motion.a
      href={LINE_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 bg-brand-gold rounded-full shadow-lg shadow-brand-gold/20 hover:scale-110 hover:bg-brand-champagne transition-all duration-300"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1.5, type: 'spring', stiffness: 200 }}
      aria-label="Book via LINE"
    >
      <MessageCircle size={28} className="text-brand-black" />
      <motion.div
        className="absolute inset-0 rounded-full border-2 border-brand-gold"
        animate={{ scale: [1, 1.3, 1], opacity: [0.6, 0, 0.6] }}
        transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
      />
    </motion.a>
  );
}
