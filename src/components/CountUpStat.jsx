import { useEffect, useRef, useState } from 'react';
import { useInView } from 'framer-motion';

// Parses "1,200+" into { number: 1200, suffix: '+' } so we can animate the numeric
// part while preserving whatever suffix (+, %, etc.) came with it.
function parseValue(str) {
  const match = String(str).match(/^([\d,]+)(.*)$/);
  if (!match) return { number: 0, suffix: str };
  return { number: parseInt(match[1].replace(/,/g, ''), 10), suffix: match[2] };
}

export default function CountUpStat({ value, duration = 1.5 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const [display, setDisplay] = useState(0);
  const { number, suffix } = parseValue(value);

  useEffect(() => {
    if (!inView) return;
    let start = null;
    let frameId;
    const step = (timestamp) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / (duration * 1000), 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic — fast start, gentle settle
      setDisplay(Math.round(eased * number));
      if (progress < 1) frameId = requestAnimationFrame(step);
    };
    frameId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frameId);
  }, [inView, number, duration]);

  return (
    <span ref={ref}>
      {display.toLocaleString()}
      {suffix}
    </span>
  );
}
