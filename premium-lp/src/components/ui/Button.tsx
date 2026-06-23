import type { AnchorHTMLAttributes, ReactNode } from 'react';

type Variant = 'primary' | 'ghost' | 'light';

interface ButtonProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  variant?: Variant;
  children: ReactNode;
}

/**
 * Premium link-button with a smooth, restrained hover.
 * Uses an anchor so it works for in-page (#) and external links.
 */
const base =
  'group relative inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 text-sm font-medium transition-all duration-500 ease-smooth focus:outline-none focus-visible:ring-2 focus-visible:ring-violet focus-visible:ring-offset-2';

const variants: Record<Variant, string> = {
  // Solid dark "締め色" button with a sliding sheen on hover.
  primary:
    'bg-ink text-ivory shadow-[0_10px_30px_-10px_rgba(10,12,16,0.5)] hover:-translate-y-0.5 hover:shadow-[0_18px_40px_-12px_rgba(31,79,255,0.45)]',
  // Outlined, for secondary actions on light backgrounds.
  ghost:
    'border border-ink/15 text-ink hover:border-ink/40 hover:-translate-y-0.5 bg-white/40 backdrop-blur',
  // For dark sections (CTA).
  light:
    'bg-ivory text-ink hover:-translate-y-0.5 hover:shadow-[0_18px_40px_-12px_rgba(255,255,255,0.35)]',
};

export function Button({ variant = 'primary', children, className = '', ...rest }: ButtonProps) {
  return (
    <a className={`${base} ${variants[variant]} ${className}`} {...rest}>
      <span className="relative z-10">{children}</span>
      <span
        aria-hidden
        className="relative z-10 transition-transform duration-500 ease-smooth group-hover:translate-x-1"
      >
        →
      </span>
    </a>
  );
}
