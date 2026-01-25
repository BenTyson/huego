"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";

interface StatCounterProps {
  value: number;
  suffix?: string;
  label: string;
  duration?: number;
}

export function StatCounter({
  value,
  suffix = "",
  label,
  duration = 1.5,
}: StatCounterProps) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (!isInView) return;

    const startTime = Date.now();
    const endTime = startTime + duration * 1000;

    const tick = () => {
      const now = Date.now();
      const progress = Math.min(1, (now - startTime) / (duration * 1000));

      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * value));

      if (now < endTime) {
        requestAnimationFrame(tick);
      } else {
        setCount(value);
      }
    };

    requestAnimationFrame(tick);
  }, [isInView, value, duration]);

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M";
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(0) + "K";
    }
    return num.toLocaleString();
  };

  return (
    <motion.div
      ref={ref}
      className="text-center px-6"
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-3xl sm:text-4xl font-bold text-foreground mb-1">
        {formatNumber(count)}
        {suffix}
      </div>
      <div className="text-sm text-muted-foreground">{label}</div>
    </motion.div>
  );
}
