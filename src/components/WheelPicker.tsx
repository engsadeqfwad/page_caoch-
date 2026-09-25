import React, { useRef, useEffect } from 'react';

interface WheelPickerProps {
  value: number;
  onChange: (val: number) => void;
  min: number;
  max: number;
  unit: string;
  step?: number;
  label?: string;
  icon?: React.ReactNode;
}

export default function WheelPicker({
  value,
  onChange,
  min,
  max,
  unit,
  step = 1,
  label,
  icon,
}: WheelPickerProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const isUserScrolling = useRef(false);
  const scrollTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Generate numbers array
  const items: number[] = [];
  for (let i = min; i <= max; i += step) {
    items.push(i);
  }

  const ITEM_HEIGHT = 48; // 48px per row

  // Center the active item on mount & when value changes externally
  useEffect(() => {
    if (isUserScrolling.current) return;
    const index = items.indexOf(value);
    if (index !== -1 && scrollRef.current) {
      scrollRef.current.scrollTop = index * ITEM_HEIGHT;
    }
  }, [value]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    isUserScrolling.current = true;
    if (scrollTimeout.current) clearTimeout(scrollTimeout.current);

    const scrollTop = e.currentTarget.scrollTop;
    const index = Math.round(scrollTop / ITEM_HEIGHT);
    const clampedIndex = Math.max(0, Math.min(items.length - 1, index));
    const targetValue = items[clampedIndex];

    if (targetValue !== undefined && targetValue !== value) {
      onChange(targetValue);
    }

    scrollTimeout.current = setTimeout(() => {
      isUserScrolling.current = false;
      // snap perfectly
      if (scrollRef.current) {
        scrollRef.current.scrollTo({
          top: clampedIndex * ITEM_HEIGHT,
          behavior: 'smooth',
        });
      }
    }, 120);
  };

  const selectItem = (val: number) => {
    onChange(val);
    const index = items.indexOf(val);
    if (index !== -1 && scrollRef.current) {
      scrollRef.current.scrollTo({
        top: index * ITEM_HEIGHT,
        behavior: 'smooth',
      });
    }
  };

  const handleNudge = (delta: number) => {
    const nextVal = Math.max(min, Math.min(max, value + delta));
    selectItem(nextVal);
  };

  return (
    <div className="flex flex-col items-center w-full">
      {label && (
        <div className="flex items-center gap-1.5 text-xs font-bold text-taupe mb-2">
          {icon}
          <span>{label}</span>
        </div>
      )}

      {/* Up Nudge Arrow Button */}
      <button
        type="button"
        onClick={() => handleNudge(-1)}
        className="w-10 h-7 flex items-center justify-center text-taupe/60 hover:text-gold transition-colors text-xs active:scale-95"
        aria-label="Previous"
      >
        ▲
      </button>

      {/* Main Wheel Viewport */}
      <div className="relative w-full max-w-[200px] h-[240px] rounded-3xl bg-dark-900/90 border border-white/10 overflow-hidden shadow-inner flex flex-col justify-center">
        {/* Subtle Top & Bottom Gradient Fades for 3D depth */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-dark-950 via-dark-900/90 to-transparent z-20" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-dark-950 via-dark-900/90 to-transparent z-20" />

        {/* Center Active Frame Highlight Box with luxury gold border */}
        <div className="pointer-events-none absolute inset-x-2 top-[96px] h-12 rounded-2xl border-2 border-gold/90 bg-gradient-to-r from-gold/20 via-gold/10 to-gold/20 shadow-neon-gold z-10" />

        {/* Scrollable Items Container */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="w-full h-full overflow-y-auto snap-y snap-mandatory no-scrollbar relative z-10"
        >
          {/* Top spacer (96px = exactly 2 items height) so 1st item aligns at center */}
          <div className="h-[96px] shrink-0" />

          {items.map((num) => {
            const isSelected = num === value;
            const diff = Math.abs(num - value);
            return (
              <div
                key={num}
                onClick={() => selectItem(num)}
                className={`h-12 flex items-center justify-center snap-center cursor-pointer select-none transition-all duration-150 px-2 ${
                  isSelected
                    ? 'text-white font-black text-xl scale-105'
                    : diff === 1
                    ? 'text-taupe/70 font-bold text-base scale-95'
                    : 'text-taupe/35 font-medium text-sm scale-90'
                }`}
              >
                <span>{num}</span>
                <span className={`text-xs ml-1 mr-1 ${isSelected ? 'text-gold font-bold' : 'text-taupe/50'}`}>
                  {unit}
                </span>
              </div>
            );
          })}

          {/* Bottom spacer (96px) so last item aligns at center */}
          <div className="h-[96px] shrink-0" />
        </div>
      </div>

      {/* Down Nudge Arrow Button */}
      <button
        type="button"
        onClick={() => handleNudge(1)}
        className="w-10 h-7 flex items-center justify-center text-taupe/60 hover:text-gold transition-colors text-xs active:scale-95"
        aria-label="Next"
      >
        ▼
      </button>
    </div>
  );
}
