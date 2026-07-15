import { motion, MotionConfig } from 'framer-motion';

// A contained "aurora liquid" effect — drop this inside any `relative overflow-hidden`
// section (typically a dark hero) and it fills that section only. Blobs are oversized
// relative to their box and only ever translate by a percentage of their OWN size, so
// they can never reveal a hard edge or affect page scroll size.
//
// Wrapped in MotionConfig reducedMotion="never" because framer-motion 12+ automatically
// respects the OS/browser "reduce motion" preference by default — appropriate for most
// UI motion, but this is a purely decorative background flourish we want to always play.
const blobTransition = (duration) => ({
  duration,
  repeat: Infinity,
  ease: 'easeInOut',
});

export default function AuroraBackground() {
  return (
    <MotionConfig reducedMotion="never">
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <motion.div
          className="absolute -top-1/3 -left-1/4 w-[70%] h-[160%] rounded-full bg-brand-900/80 blur-2xl"
          animate={{
            x: ['0%', '8%', '-6%', '0%'],
            y: ['0%', '10%', '5%', '0%'],
            scale: [1, 1.08, 0.96, 1],
          }}
          transition={blobTransition(16)}
        />
        <motion.div
          className="absolute -top-1/4 -right-1/4 w-[65%] h-[150%] rounded-full bg-brand-600/50 blur-2xl"
          animate={{
            x: ['0%', '-8%', '6%', '0%'],
            y: ['0%', '-6%', '-9%', '0%'],
            scale: [1, 1.05, 0.94, 1],
          }}
          transition={blobTransition(20)}
        />
        <motion.div
          className="absolute -bottom-1/3 left-1/4 w-[60%] h-[150%] rounded-full bg-brand-400/35 blur-2xl"
          animate={{
            x: ['0%', '7%', '0%'],
            y: ['0%', '-8%', '0%'],
            scale: [1, 1.1, 1],
          }}
          transition={blobTransition(18)}
        />
      </div>
    </MotionConfig>
  );
}
