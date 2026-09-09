// Permanent owner lock for the Gannon Waye boutique world.
//
// This file is deliberately separate from product data. The artwork is presentation,
// not inventory, pricing or checkout authority. No agent, automation, admin control,
// theme update or product workflow may replace, move, crop, hide or reinterpret it.
//
// The only valid product source for public sales is the live MerchProduct entity.

export const STOREFRONT_ART_LOCK = Object.freeze({
  lockId: 'gannon-waye-boutique-world-v1',
  version: 3,
  permanent: true,
  ownerInstructionDate: '2026-09-09',
  imageUrl: 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/437c98b2a_generated_image.png',
  imageSha256: '7f50212c63f53a090b3797f06be9b515ca7771270ae08482fc8f904d92192f31',
  publicRoute: '/store',
  productSource: 'MerchProduct where is_active=true, publication_status=live and is_stage_one_sale=true',
  rule: 'The boutique world artwork remains permanently on the public store. Product data may change through the governed MerchProduct lifecycle, but the world artwork itself must not be replaced, moved, cropped, hidden or regenerated — and no overlay, banner, text block or other element may be placed over any part of it — without the owner’s explicit, contemporaneous permission for that specific change. This applies equally to human edits, AI agents and the Base44 builder. Clickable hotspot zones (see StorefrontHotspot entity / /admin/store-hotspots) are the one sanctioned exception: they are transparent, owner-managed, and never obscure the artwork.',
  coveringRequiresOwnerPermission: true,
  // v3 (owner-directed, 9 September 2026): "MERCH STORE" gold lettering added
  // beneath the GANNON WAYE neon sign, and the counter rebuilt as a full
  // boutique display from the owner's supplied bundle photo — the folded
  // Respect Is Earned hoodie, the journal, pen and thermos gift box set, and
  // the coffee mugs back on display. Regenerated twice on the owner's explicit
  // instruction in chat on 9 September 2026; the lock itself remains permanent.
  // v1 artwork: cf2757c39_3d0e6cbc-87a7-4f9e-8d1c-05b82eb5b2e1.png.
  // v2 artwork: b271037e0_generated_image.png.
});

export const BOUTIQUE_HERO_IMAGE = STOREFRONT_ART_LOCK.imageUrl;
export const BOUTIQUE_HERO_SHA256 = STOREFRONT_ART_LOCK.imageSha256;
export const BOUTIQUE_HERO_LOCKED = STOREFRONT_ART_LOCK.permanent;