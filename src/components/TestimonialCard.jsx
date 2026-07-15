import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';

/**
 * Renders a single testimonial card. "See more" only appears when the quote
 * actually wraps past 2 lines at the card's current width — measured directly
 * via the DOM (scrollHeight vs clientHeight) rather than guessed from character
 * count, so it stays accurate across screen sizes and font-loading timing.
 */
export default function TestimonialCard({ testimonial, delay = 0, onSeeMore }) {
  const quoteRef = useRef(null);
  const [isTruncated, setIsTruncated] = useState(false);

  useEffect(() => {
    const checkTruncation = () => {
      const el = quoteRef.current;
      if (!el) return;
      // A couple pixels of tolerance for sub-pixel rounding
      setIsTruncated(el.scrollHeight > el.clientHeight + 2);
    };

    checkTruncation();
    window.addEventListener('resize', checkTruncation);
    return () => window.removeEventListener('resize', checkTruncation);
  }, [testimonial.quote]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.4, delay, ease: 'easeOut' }}
      className="flex flex-col h-full bg-white/5 border border-white/10 rounded-2xl p-6"
    >
      <div className="w-10 h-10 rounded-full bg-brand-500/15 flex items-center justify-center mb-4 shrink-0">
        <Quote className="w-4 h-4 text-brand-400" />
      </div>

      <div className="flex-1 mb-5">
        <p ref={quoteRef} className="text-ink-200 text-sm leading-relaxed line-clamp-2">
          "{testimonial.quote}"
        </p>
        {isTruncated && (
          <button
            onClick={() => onSeeMore(testimonial)}
            className="text-xs text-brand-400 hover:text-brand-300 font-medium mt-1.5"
          >
            See more
          </button>
        )}
      </div>

      {/* Pinned to the bottom of the card via flex-1 above, so name/role align
          consistently across all cards regardless of quote length */}
      <div className="flex flex-col gap-0.5 shrink-0">
        <span className="text-sm font-semibold text-white leading-tight">{testimonial.name}</span>
        <span className="text-xs text-brand-400 leading-tight">{testimonial.role}</span>
      </div>
    </motion.div>
  );
}
