import { motion } from 'framer-motion';

/**
 * Wraps children in a fade + slide-up animation that triggers once,
 * the first time the element scrolls into view.
 *
 * Usage: <FadeIn><SomeSection /></FadeIn>
 *        <FadeIn delay={0.1}>...</FadeIn>
 */
export default function FadeIn({ children, delay = 0, className = '', y = 16 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, delay, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
