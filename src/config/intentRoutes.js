export const INTENT_ROUTES = {
  service_cinematic_websites: '/systems/cinematic-websites',
  service_automated_social_workflows: '/systems/social-automation',
  service_dropshipping_dashboards: '/systems/dropshipping-inventory',
  service_ai_systems_manager: '/systems-manager',
  service_ecommerce_merch_stores: '/systems/ecommerce-merch-stores',
  service_approval_workflows: '/systems/approval-workflows',
  service_control_panels: '/systems/control-panels',
  service_ai_content_systems: '/systems/ai-content-systems',
  service_artist_release_systems: '/systems/artist-release-systems',
  service_client_portals: '/systems/client-portals',
  service_automation_retainers: '/systems/automation-retainers',
  case_study_gannon_waye_music_os: '/systems/case-studies/gannon-waye-music-os',
  case_study_ganozmix_direct: '/systems/case-studies/ganozmix-direct',
  package_creator_launch_system: '/systems/packages/creator-launch-system',
  package_ecommerce_setup: '/systems/packages/ecommerce-setup',
  package_systems_manager_retainer: '/systems/packages/systems-manager-retainer',
  package_ai_content_operating_system: '/systems/packages/ai-content-operating-system',
  package_dropshipping_command_centre: '/systems/packages/dropshipping-command-centre',
  package_artist_release_os: '/systems/packages/artist-release-os',
  package_full_business_command_system: '/systems/packages/full-business-command-system',
  product_detail: '/store',
  product_admin_edit: '/admin/merch',
  lyrics_detail: '/lyrics',
  lyrics_admin_editor: '/admin/releases',
  merch_admin_editor: '/admin/merch',
  systems_audit_booking: '/systems-manager#build-form',
  admin_sales_pipeline: '/admin/owner-business?tab=leads',
  admin_master_blueprint: '/admin/master-blueprint',
};

export function routeForIntent(intent, fallback = '/') {
  return INTENT_ROUTES[intent] || fallback;
}

export function routeForProduct(product, isAdmin = false) {
  if (!product?.id) return routeForIntent(isAdmin ? 'product_admin_edit' : 'product_detail');
  return isAdmin ? `/admin/merch?product=${product.id}` : `/store?product=${product.id}`;
}

export function routeForLyrics(songSlugOrId, isAdmin = false) {
  if (!songSlugOrId) return routeForIntent(isAdmin ? 'lyrics_admin_editor' : 'lyrics_detail');
  return isAdmin ? `/admin/lyrics/${songSlugOrId}/edit` : `/lyrics/${songSlugOrId}`;
}
