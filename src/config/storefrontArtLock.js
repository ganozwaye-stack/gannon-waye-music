// Permanent owner lock for the Gannon Waye merchandise hero.
//
// This file is deliberately separate from product data. The artwork is presentation,
// not inventory, pricing or checkout authority. No agent, automation, admin control,
// theme update or product workflow may replace, move, crop, hide or reinterpret it —
// the only way this image changes is the owner supplying a new artwork himself.
//
// The only valid product source for public sales is the live MerchProduct entity.

export const STOREFRONT_ART_LOCK = Object.freeze({
  lockId: 'gannon-waye-merch-hero-v6',
  version: 6,
  permanent: true,
  ownerInstructionDate: '2026-10-26',
  // v6 (owner-directed, 26 October 2026): brand separation. The v5 boutique world
  // photograph carried Thanking You Kindly (TYK) branded items — a framed "Mum's
  // Garden" tribute piece and a wall of TYK campaign posters — and TYK-brand work
  // must never appear on gannonwaye.com. The owner instructed that the hero instead
  // show Gannon Waye Music merchandise only, naming the Respect Is Earned product
  // photography. This is the owner's own GWM hoodie studio photograph, already used
  // as the hoodie's verified product image — no regeneration, no AI-altered imagery.
  // sha256 of the exact image bytes, computed 26 October 2026.
  imageSha256: '7db85b25773fbc1ea297df60d5050745ebd7c805ca1a8dc1576ff2695084647f',
  imageUrl: 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/23e54b3e2_hoodie-premium-studio-back-hero-4x5.png',
  imageAlt: 'Respect Is Earned hoodie — official Gannon Waye Music merchandise',
  publicRoute: '/store',
  productSource: 'MerchProduct where is_active=true, publication_status=live and is_stage_one_sale=true',
  rule: 'The merchandise hero artwork remains permanently on the public store. Product data may change through the governed MerchProduct lifecycle, but the hero artwork itself must not be replaced, moved, cropped, hidden or regenerated — and no overlay, banner, text block or other element may be placed over any part of the image itself — without the owner’s explicit, contemporaneous permission for that specific change. This applies equally to human edits, AI agents and the Base44 builder. Clickable hotspot zones (see StorefrontHotspot entity / /admin/merch-visual-lab) are the one sanctioned exception: they are transparent, owner-managed, and never obscure the artwork.',
  coveringRequiresOwnerPermission: true,
  // Standing brand-separation rule (owner, 26 October 2026): no Thanking You Kindly
  // (TYK) branded product, poster, tribute piece or campaign artwork may appear
  // anywhere on gannonwaye.com, including inside the store hero image.
  brandSeparationRule: 'TYK-branded items must never appear on gannonwaye.com. Gannon Waye Music merchandise only.',
  // Artwork history: v1 = the owner's original bright boutique photograph.
  // v2 and v3 were AI regenerations, retired because they distorted the faces
  // printed on in-scene products, including Sonia Waye's portrait. v5 = the
  // owner-supplied externally redesigned boutique world (11 September 2026),
  // retired on 26 October 2026 for carrying TYK-brand items. v6 = the owner's
  // GWM product photography. Standing owner rule: no AI regeneration of this
  // artwork and no AI-generated or AI-altered human face, ever.
});

export const BOUTIQUE_HERO_IMAGE = STOREFRONT_ART_LOCK.imageUrl;
export const BOUTIQUE_HERO_SHA256 = STOREFRONT_ART_LOCK.imageSha256;
export const BOUTIQUE_HERO_LOCKED = STOREFRONT_ART_LOCK.permanent;