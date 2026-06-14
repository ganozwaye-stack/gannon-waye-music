/**
 * INTENT ROUTES — Central route mapping for all clickable elements
 * Every display card, service box, proof card, and admin tool must map here.
 * Update this file when new routes are added.
 */

export const INTENT_ROUTES = {
  // Service sales pages
  service_cinematic_websites: '/systems/cinematic-websites',
  service_automated_social_workflows: '/systems/social-automation',
  service_dropshipping_dashboards: '/systems/dropshipping-inventory',
  service_ai_systems_manager: '/systems-manager',
  service_ecommerce_merch_stores: '/systems/ecommerce-merch-stores',
  service_approval_workflows: '/systems/approval-workflows',
  service_ai_content_systems: '/systems/ai-content-systems',
  service_artist_release_systems: '/systems/artist-release-systems',

  // Packages
  package_creator_launch: '/systems/packages/creator-launch-system',
  package_ecommerce_setup: '/systems/packages/ecommerce-setup',
  package_systems_retainer: '/systems/packages/systems-manager-retainer',

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
  systems_audit_booking: '/systems-manager#build-form',

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