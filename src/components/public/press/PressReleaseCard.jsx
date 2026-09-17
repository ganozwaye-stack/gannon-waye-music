import { Link } from 'react-router-dom';

// One published single, written out in full for press: artwork, one-line pitch,
// credits, release date and the official listening links held on the Release record.
export default function PressReleaseCard({ release }) {
  const links = [
    release.spotify_link && { label: 'Spotify', url: release.spotify_link },
    release.apple_music_link && { label: 'Apple Music', url: release.apple_music_link },
    release.youtube_link && { label: 'YouTube', url: release.youtube_link },
    release.distributor_link && { label: 'All platforms', url: release.distributor_link },
  ].filter(Boolean);

  const releasedOn = release.release_date
    ? new Date(`${release.release_date}T00:00:00`).toLocaleDateString('en-AU', {
        day: 'numeric', month: 'long', year: 'numeric',
      })
    : null;

  return (
    <article className="rounded-2xl border border-border/40 bg-background/30 p-5">
      <div className="flex gap-4">
        {release.artwork_url && (
          <Link to={`/release/${release.id}`} className="shrink-0">
            <img
              src={release.artwork_url}
              alt={`${release.title} artwork`}
              className="w-24 h-24 rounded-xl object-cover border border-primary/25"
            />
          </Link>
        )}
        <div className="min-w-0">
          <p className="font-body text-[10px] tracking-[0.25em] uppercase text-primary">
            {release.type || 'single'}{releasedOn ? ` · Out ${releasedOn}` : ''}
          </p>
          <Link to={`/release/${release.id}`}>
            <h3 className="font-display text-2xl text-foreground mt-1 hover:text-primary transition-colors">
              {release.title}
            </h3>
          </Link>
          {release.version_label && (
            <p className="font-body text-xs text-muted-foreground mt-0.5">{release.version_label}</p>
          )}
        </div>
      </div>

      {release.description && (
        <p className="font-body text-sm text-foreground/70 leading-relaxed mt-4">
          {release.description}
        </p>
      )}

      {release.credits && (
        <p className="font-body text-xs text-muted-foreground leading-relaxed mt-3">
          {release.credits}
        </p>
      )}

      {links.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-4">
          {links.map((link) => (
            <a
              key={link.url}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-primary/35 text-primary px-4 py-1.5 font-body text-[11px] tracking-wider uppercase hover:bg-primary/10 transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>
      )}
    </article>
  );
}