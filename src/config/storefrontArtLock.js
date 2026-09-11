// Permanent owner lock for the Gannon Waye boutique world.
//
// This file is deliberately separate from product data. The artwork is presentation,
// not inventory, pricing or checkout authority. No agent, automation, admin control,
// theme update or product workflow may replace, move, crop, hide or reinterpret it —
// the only way this image changes is the owner supplying a new artwork himself,
// which is exactly how v5 arrived.
//
// The only valid product source for public sales is the live MerchProduct entity.

export const STOREFRONT_ART_LOCK = Object.freeze({
  lockId: 'gannon-waye-boutique-world-v5',
  version: 5,
  permanent: true,
  ownerInstructionDate: '2026-09-11',
  // v5 (owner-directed, 11 September 2026): the owner took the v1 artwork away,
  // had it redesigned externally, and supplied this new boutique world image
  // himself. It shows the full future merch line — Set Free and Thank You
  // hoodies, mugs, CDs and vinyl, totes and posters — so hotspots over items
  // that have no live product yet collect Express Interest instead of selling.
  imageSha256: 'owner-v5-2026-09-11-sha-pending-recompute',
  imageUrl: 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/31a17f0b8_image.png',
  publicRoute: '/store',
  productSource: 'MerchProduct where is_active=true, publication_status=live and is_stage_one_sale=true',
  rule: 'The boutique world artwork remains permanently on the public store. Product data may change through the governed MerchProduct lifecycle, but the world artwork itself must not be replaced, moved, cropped, hidden or regenerated — and no overlay, banner, text block or other element may be placed over any part of it — without the owner’s explicit, contemporaneous permission for that specific change. This applies equally to human edits, AI agents and the Base44 builder. Clickable hotspot zones (see StorefrontHotspot entity / /admin/store-hotspots) are the one sanctioned exception: they are transparent, owner-managed, and never obscure the artwork.',
  coveringRequiresOwnerPermission: true,
  // Artwork history: v1 = the owner's original bright boutique photograph.
  // v2 and v3 were AI regenerations, retired because they distorted the faces
  // printed on in-scene products, including Sonia Waye's portrait. v5 = the
  // owner-supplied externally redesigned boutique world (11 September 2026).
  // Standing owner rule: no AI regeneration of this artwork and no AI-generated
  // or AI-altered human face, ever.
});

export const BOUTIQUE_HERO_IMAGE = STOREFRONT_ART_LOCK.imageUrl;
export const BOUTIQUE_HERO_SHA256 = STOREFRONT_ART_LOCK.imageSha256;
export const BOUTIQUE_HERO_LOCKED = STOREFRONT_ART_LOCK.permanent;