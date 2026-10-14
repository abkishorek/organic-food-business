import { siteConfig } from '../config/site';

interface Props {
  value: number;
  onChange: (n: number) => void;
  label: string;
  min?: number;
}

export default function QuantityStepper({ value, onChange, label, min = 0 }: Props) {
  const max = siteConfig.ordering.maxQuantityPerLine;
  return (
    <div className="stepper" role="group" aria-label={`Quantity: ${label}`}>
      <button type="button" onClick={() => onChange(Math.max(min, value - 1))} aria-label={`Decrease ${label}`}>
        −
      </button>
      <output aria-live="polite">{value}</output>
      <button type="button" onClick={() => onChange(Math.min(max, value + 1))} disabled={value >= max} aria-label={`Increase ${label}`}>
        +
      </button>
    </div>
  );
}
