/**
 * INTENT ROUTES — Central route mapping for all clickable elements
 * Every display card, service box, proof card, and admin tool must map here.
 * Update this file when new routes are added.
 */

export const INTENT_ROUTES = {
  // Service sales pages
  service_cinematic_websites: '/systems/cinematic-websites',
  service_automated_social_workflows: '/contact',
  service_dropshipping_dashboards: '/contact',
  service_ai_systems_manager: '/contact',
  service_ecommerce_merch_stores: '/contact',
  service_approval_workflows: '/contact',
  service_ai_content_systems: '/contact',
  service_artist_release_systems: '/contact',

  // Packages stay behind an enquiry path until their scope, evidence and pricing are approved.
  package_creator_launch: '/contact',
  package_ecommerce_setup: '/contact',
  package_systems_retainer: '/contact',

  // Case studies
  case_study_gannon_waye_music_os: '/systems/case-studies/gannon-waye-music-os',
  case_study_ganozmix_direct: '/systems/case-studies/ganozmix-direct',

  // Store / products
  product_detail: '/store',
  product_admin_edit: '/admin/merch',

  // Lyrics
  lyrics_detail: '/lyrics',
  lyrics_admin_editor: '/admin/releases',

  // Merch admin
  merch_admin_editor: '/admin/merch',

  // Booking / audit
  systems_audit_booking: '/contact',

  // Admin tools
  admin_sales_pipeline: '/admin/revenue-command',
  admin_master_blueprint: '/admin/master-blueprint',
  admin_orders: '/admin/orders',
  admin_site_health: '/admin/site-health',
  admin_content: '/admin/content-command',
  admin_merch: '/admin/merch',
  admin_promo_codes: '/admin/promo-codes',
  admin_releases: '/admin/releases',
  admin_base44_exit: '/admin/base44-exit-plan',
};

export const getRoute = (intent) => INTENT_ROUTES[intent] || '/';