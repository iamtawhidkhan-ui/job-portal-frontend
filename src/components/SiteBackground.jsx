import { motion, MotionConfig } from 'framer-motion';

// A very subtle, slow-moving ambient texture behind the whole site. Sits fixed to the
// viewport at low opacity so it reads as gentle "life" in plain white/light sections
// without competing with text or creating a hard seam against opaque dark sections
// (which naturally occlude it). Percentage-based transforms only — see AuroraBackground
// for why that matters (keeps motion contained, never reveals a hard edge).
//
// Wrapped in MotionConfig reducedMotion="never" — see AuroraBackground for why.
const blobTransition = (duration) => ({
  duration,
  repeat: Infinity,
  ease: 'easeInOut',
});

export default function SiteBackground() {
  return (
    <MotionConfig reducedMotion="never">
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none" aria-hidden="true">
        <motion.div
          className="absolute -top-1/4 -left-1/5 w-[50%] h-[70%] rounded-full bg-brand-300/25 blur-2xl"
          animate={{
            x: ['0%', '10%', '-8%', '0%'],
            y: ['0%', '8%', '4%', '0%'],
          }}
          transition={blobTransition(24)}
        />
        <motion.div
          className="absolute top-1/3 -right-1/5 w-[45%] h-[60%] rounded-full bg-brand-400/18 blur-2xl"
          animate={{
            x: ['0%', '-9%', '7%', '0%'],
            y: ['0%', '-7%', '-10%', '0%'],
          }}
          transition={blobTransition(28)}
        />
        <motion.div
          className="absolute bottom-0 left-1/3 w-[40%] h-[55%] rounded-full bg-brand-500/18 blur-2xl"
          animate={{
            x: ['0%', '8%', '0%'],
            y: ['0%', '-6%', '0%'],
          }}
          transition={blobTransition(26)}
        />
      </div>
    </MotionConfig>
  );
}
