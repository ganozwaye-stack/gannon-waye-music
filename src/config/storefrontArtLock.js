// Permanent owner lock for the Gannon Waye boutique world.
//
// This file is deliberately separate from product data. The artwork is presentation,
// not inventory, pricing or checkout authority. No agent, automation, admin control,
// theme update or product workflow may replace, move, crop, hide or reinterpret it.
//
// The only valid product source for public sales is the live MerchProduct entity.

export const STOREFRONT_ART_LOCK = Object.freeze({
  lockId: 'gannon-waye-boutique-world-v1',
  version: 1,
  permanent: true,
  ownerInstructionDate: '2026-09-03',
  imageUrl: 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/cf2757c39_3d0e6cbc-87a7-4f9e-8d1c-05b82eb5b2e1.png',
  imageSha256: '9667a3698d14ec59d8b744d44a54692db5b24aefa09ed90e9344edd17eb83f98',
  publicRoute: '/store',
  productSource: 'MerchProduct where is_active=true, publication_status=live and is_stage_one_sale=true',
  rule: 'The boutique world artwork remains permanently on the public store. Product data may change through the governed MerchProduct lifecycle, but the world artwork itself must not be replaced, moved, cropped, hidden or regenerated.',
});

export const BOUTIQUE_HERO_IMAGE = STOREFRONT_ART_LOCK.imageUrl;
export const BOUTIQUE_HERO_SHA256 = STOREFRONT_ART_LOCK.imageSha256;
export const BOUTIQUE_HERO_LOCKED = STOREFRONT_ART_LOCK.permanent;
