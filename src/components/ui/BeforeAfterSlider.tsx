'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';

interface BeforeAfterSliderProps {
  beforeImage?: string;
  afterImage: string;
  beforeLabel?: string;
  afterLabel?: string;
}

export function BeforeAfterSlider({
  beforeImage,
  afterImage,
  beforeLabel = 'Before',
  afterLabel = 'After',
}: BeforeAfterSliderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [sliderPos, setSliderPos] = useState(50);
  const [isDragging, setIsDragging] = useState(false);

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const pct = Math.max(5, Math.min(95, (x / rect.width) * 100));
    setSliderPos(pct);
  };

  const handlePointerDown = () => setIsDragging(true);
  const handlePointerUp = () => setIsDragging(false);
  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  };

  return (
    <div
      ref={containerRef}
      className="relative aspect-[3/4] select-none overflow-hidden rounded-sm border border-brand-gold/10 cursor-col-resize touch-none"
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      onPointerMove={handlePointerMove}
    >
      {/* After (full background) */}
      {afterImage ? (
        <img src={afterImage} alt={afterLabel} className="absolute inset-0 w-full h-full object-cover" />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-brand-gold/20 via-brand-card to-brand-dark" />
      )}

      {/* Before (clipped) */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ width: `${sliderPos}%` }}
      >
        {beforeImage ? (
          <img
            src={beforeImage}
            alt={beforeLabel}
            className="absolute inset-0 w-full h-full object-cover"
            style={{ width: containerRef.current?.offsetWidth || '100%' }}
          />
        ) : (
          <div
            className="absolute inset-0 bg-gradient-to-br from-brand-card via-brand-dark to-brand-card"
            style={{ width: containerRef.current?.offsetWidth || '100%' }}
          />
        )}
      </div>

      {/* Slider handle */}
      <motion.div
        className="absolute top-0 bottom-0 z-10"
        style={{ left: `${sliderPos}%`, x: '-50%' }}
        initial={false}
      >
        <div className="relative h-full flex items-center">
          <div className="w-0.5 h-full bg-brand-gold shadow-lg shadow-brand-gold/30" />
          <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 bg-brand-gold rounded-full flex items-center justify-center shadow-lg">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M5 3L2 8L5 13" stroke="#0A0A0A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M11 3L14 8L11 13" stroke="#0A0A0A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
      </motion.div>

      {/* Labels */}
      <span className="absolute top-3 left-3 px-2 py-0.5 bg-brand-black/70 text-brand-white text-xs rounded-sm backdrop-blur-sm">
        {beforeLabel}
      </span>
      <span className="absolute top-3 right-3 px-2 py-0.5 bg-brand-black/70 text-brand-gold text-xs rounded-sm backdrop-blur-sm">
        {afterLabel}
      </span>
    </div>
  );
}
