import { Minus, Plus } from 'lucide-react';

export default function QuantityStepper({
  value = 1,
  onChange,
  max = 99,
  min = 1,
  compact = false
}) {
  return (
    <div className={`qty-stepper ${compact ? 'qty-compact' : ''}`}>
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        aria-label="Decrease quantity"
      >
        <Minus size={compact ? 13 : 15} />
      </button>
      <span aria-live="polite">{value}</span>
      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        aria-label="Increase quantity"
      >
        <Plus size={compact ? 13 : 15} />
      </button>
    </div>
  );
}
