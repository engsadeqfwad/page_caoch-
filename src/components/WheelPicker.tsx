import { useEffect, useLayoutEffect, useMemo, useRef } from 'react';

interface WheelPickerProps {
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
  unit: string;
  ariaLabel: string;
  compact?: boolean;
}

const ITEM_HEIGHT = 56;

export default function WheelPicker({
  value,
  min,
  max,
  onChange,
  unit,
  ariaLabel,
  compact = false,
}: WheelPickerProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number | null>(null);
  const initializedRef = useRef(false);
  const values = useMemo(
    () => Array.from({ length: max - min + 1 }, (_, index) => min + index),
    [min, max]
  );

  useLayoutEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const targetTop = (value - min) * ITEM_HEIGHT;
    if (!initializedRef.current) {
      scroller.scrollTop = targetTop;
      initializedRef.current = true;
    } else if (Math.abs(scroller.scrollTop - targetTop) > ITEM_HEIGHT + 2) {
      scroller.scrollTo({ top: targetTop, behavior: 'smooth' });
    }
  }, [min, value]);

  useEffect(() => () => {
    if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
  }, []);

  const syncValueFromScroll = () => {
    if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    frameRef.current = requestAnimationFrame(() => {
      const scroller = scrollerRef.current;
      if (!scroller) return;
      const nextValue = Math.min(max, Math.max(min, min + Math.round(scroller.scrollTop / ITEM_HEIGHT)));
      if (nextValue !== value) onChange(nextValue);
    });
  };

  const selectValue = (nextValue: number) => {
    const safeValue = Math.min(max, Math.max(min, nextValue));
    scrollerRef.current?.scrollTo({
      top: (safeValue - min) * ITEM_HEIGHT,
      behavior: 'smooth',
    });
  };

  return (
    <div className={`wheel-picker ${compact ? 'wheel-picker-compact' : ''}`}>
      <div
        ref={scrollerRef}
        className="wheel-picker-scroll"
        role="listbox"
        aria-label={ariaLabel}
        aria-activedescendant={`${ariaLabel.replace(/\s+/g, '-')}-${value}`}
        tabIndex={0}
        onScroll={syncValueFromScroll}
        onKeyDown={(event) => {
          if (event.key === 'ArrowUp') {
            event.preventDefault();
            selectValue(value - 1);
          } else if (event.key === 'ArrowDown') {
            event.preventDefault();
            selectValue(value + 1);
          } else if (event.key === 'Home') {
            event.preventDefault();
            selectValue(min);
          } else if (event.key === 'End') {
            event.preventDefault();
            selectValue(max);
          }
        }}
      >
        {values.map((item) => {
          const distance = Math.abs(item - value);
          return (
            <button
              id={`${ariaLabel.replace(/\s+/g, '-')}-${item}`}
              key={item}
              type="button"
              role="option"
              aria-selected={item === value}
              className={`wheel-picker-item ${item === value ? 'is-selected' : ''} ${distance > 2 ? 'is-distant' : ''}`}
              onClick={() => selectValue(item)}
            >
              <span>{item}</span>
              <span className="wheel-picker-unit">{unit}</span>
            </button>
          );
        })}
      </div>
      <div className="wheel-picker-selection" aria-hidden="true" />
      <div className="wheel-picker-fade wheel-picker-fade-top" aria-hidden="true" />
      <div className="wheel-picker-fade wheel-picker-fade-bottom" aria-hidden="true" />
    </div>
  );
}
