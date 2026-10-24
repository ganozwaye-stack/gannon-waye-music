import BrandIcon from '@/components/public/BrandIcon';
import { resolveOfficialLinks } from '@/config/officialLinks';

// Official Gannon Waye social and music links, sourced from the verified
// Linktree hub (https://linktr.ee/gann0nwaye). External links always open in a
// new tab with an accessible label naming the destination.
export default function OfficialSocialLinks({ settings = {}, variant = 'icons', className = '' }) {
  const links = resolveOfficialLinks(settings);

  const labelFor = link => `Gannon Waye on ${link.label}`;

  if (variant === 'rows') {
    return (
      <div className={`flex flex-col gap-2 ${className}`}>
        {links.map(link => (
          <a
            key={link.key}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={labelFor(link)}
            className="flex items-center gap-2.5 font-body text-sm text-foreground/70 hover:text-primary transition-colors"
          >
            <BrandIcon brand={link.key} className="w-4 h-4 shrink-0" />
            {link.label} <span className="text-muted-foreground/70 text-xs">{link.handle}</span>
          </a>
        ))}
      </div>
    );
  }

  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      {links.map(link => (
        <a
          key={link.key}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={labelFor(link)}
          title={labelFor(link)}
          className="flex items-center justify-center w-9 h-9 rounded-full border border-border/40 hover:border-primary/50 text-muted-foreground hover:text-primary hover:bg-primary/5 transition-all"
        >
          <BrandIcon brand={link.key} className="w-4 h-4" />
        </a>
      ))}
    </div>
  );
}