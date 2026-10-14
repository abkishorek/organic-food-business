import { useId } from 'react';

/**
 * A thin line of linked diamonds, drawn in the manner of Kasuti, Karnataka's
 * counted-thread embroidery. Original artwork, purely decorative.
 */
export default function StitchDivider({ className = '' }: { className?: string }) {
  const id = useId();
  return (
    <svg className={`stitch ${className}`} width="100%" height="14" aria-hidden="true" focusable="false">
      <defs>
        <pattern id={id} width="28" height="14" patternUnits="userSpaceOnUse">
          <path d="M0 7H8M20 7H28" />
          <path d="M14 1.5 19.5 7 14 12.5 8.5 7Z" />
        </pattern>
      </defs>
      <rect width="100%" height="14" fill={`url(#${id})`} />
    </svg>
  );
}
