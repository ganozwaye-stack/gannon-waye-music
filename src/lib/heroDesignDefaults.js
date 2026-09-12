// Single source of truth for the hero design fallback values. These mirror
// the HeroDesignSettings entity and are what the public hero falls back to
// when no saved settings record exists. The Hero Design Studio saves over
// them, so the owner, not the code, decides where the galaxy, orbit ring,
// sparks, heart and labels sit.

export const HERO_DESIGN_DEFAULTS = {
  hero_release_id: '',
  eyebrow_label: 'The New Single',
  heart_art_url: '',
  galaxy_image_url: '',
  ring_top_pct: 12,
  ring_left_pct: -22,
  ring_width_pct: 144,
  ring_aspect: 3.4,
  ring_rotation_deg: -14,
  spark_main_size: 8,
  spark_companion_size: 6,
  orbit_duration: 18,
  heart_size_pct: 100,
  galaxy_scan_pct: 12,
  galaxy_pos_y: 34,
  heart_pos_y_pct: 50,
  embers_enabled: true,
  rays_enabled: true,
};

// The official Set Free shell artwork, supplied by Gannon. Never regenerate,
// crop or edit it.
export const HERO_HEART_ART =
  'https://base44.app/api/apps/69eb7905ca6eb4180010f794/files/mp/public/69eb7905ca6eb4180010f794/63b521cc9_ArtworkSETFREEGANNONWAYE.jpg';