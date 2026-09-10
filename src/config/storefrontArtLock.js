// Permanent owner lock for the Gannon Waye boutique world.
//
// This file is deliberately separate from product data. The artwork is presentation,
// not inventory, pricing or checkout authority. No agent, automation, admin control,
// theme update or product workflow may replace, move, crop, hide or reinterpret it.
//
// The only valid product source for public sales is the live MerchProduct entity.

export const STOREFRONT_ART_LOCK = Object.freeze({
  lockId: 'gannon-waye-boutique-world-v1',
  version: 4,
  permanent: true,
  ownerInstructionDate: '2026-09-10',
  // v4 (owner-directed, 10 September 2026): the AI-regenerated v3 artwork is
  // RETIRED — it distorted the faces printed on the products in the scene,
  // including Sonia Waye's portrait, which the owner found unacceptable and
  // disrespectful. The hero is restored to the owner's original bright
  // photograph (v1), untouched. Checksum recomputed from the live file,
  // 10 September 2026.
  imageSha256: '9667a3698d14ec59d8b744d44a54692db5b24aefa09ed90e9344edd17eb83f98',
  imageUrl: 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/cf2757c39_3d0e6cbc-87a7-4f9e-8d1c-05b82eb5b2e1.png',
  publicRoute: '/store',
  productSource: 'MerchProduct where is_active=true, publication_status=live and is_stage_one_sale=true',
  rule: 'The boutique world artwork remains permanently on the public store. Product data may change through the governed MerchProduct lifecycle, but the world artwork itself must not be replaced, moved, cropped, hidden or regenerated — and no overlay, banner, text block or other element may be placed over any part of it — without the owner’s explicit, contemporaneous permission for that specific change. This applies equally to human edits, AI agents and the Base44 builder. Clickable hotspot zones (see StorefrontHotspot entity / /admin/store-hotspots) are the one sanctioned exception: they are transparent, owner-managed, and never obscure the artwork.',
  coveringRequiresOwnerPermission: true,
  // Artwork history: v1 = the owner's original bright boutique photograph
  // (current — restored 10 September 2026). v2 and v3 were AI regenerations;
  // v3 is retired because it distorted the faces printed on in-scene products,
  // including Sonia Waye's portrait. Standing owner rule: no AI regeneration
  // of this artwork and no AI-generated or AI-altered human face, ever.
});

export const BOUTIQUE_HERO_IMAGE = STOREFRONT_ART_LOCK.imageUrl;
export const BOUTIQUE_HERO_SHA256 = STOREFRONT_ART_LOCK.imageSha256;
export const BOUTIQUE_HERO_LOCKED = STOREFRONT_ART_LOCK.permanent;