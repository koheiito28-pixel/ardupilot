import { brand, nav, footer } from '../../data/content';

export function Footer() {
  return (
    <footer className="border-t border-ink/10 bg-ivory py-16">
      <div className="section-shell flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
        <div className="max-w-sm">
          <div className="text-xl font-semibold tracking-tightest">{brand.name}</div>
          <p className="mt-3 text-sm leading-relaxed text-ink/55">{brand.tagline}。{footer.note}</p>
        </div>

        <nav className="flex flex-wrap gap-x-10 gap-y-3">
          {nav.links.map((l) => (
            <a key={l.href} href={l.href} className="text-sm text-ink/60 transition-colors hover:text-ink">
              {l.label}
            </a>
          ))}
        </nav>
      </div>

      <div className="section-shell mt-12 border-t border-ink/10 pt-6">
        <p className="text-xs text-ink/40">{footer.copyright}</p>
      </div>
    </footer>
  );
}
