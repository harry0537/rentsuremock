'use client';

import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';

// Create dynamic exports that will only render on the client
export const MotionDiv = dynamic(
  () => Promise.resolve(motion.div),
  { ssr: false }
);

export const MotionButton = dynamic(
  () => Promise.resolve(motion.button),
  { ssr: false }
);

export const MotionSpan = dynamic(
  () => Promise.resolve(motion.span),
  { ssr: false }
);

// For AnimatePresence, we need a different approach
export const AnimatePresence = dynamic(
  () => import('framer-motion').then(mod => mod.AnimatePresence),
  { ssr: false }
);

export default { MotionDiv, MotionButton, MotionSpan, AnimatePresence }; 