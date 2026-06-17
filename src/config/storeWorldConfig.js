// Hero image for the immersive Gannon Waye Merch Store
// Set to empty string "" to fall back to the interactive CSS scene
export const BOUTIQUE_HERO_IMAGE = "https://media.base44.com/images/public/69eb7905ca6eb4180010f794/cf2757c39_3d0e6cbc-87a7-4f9e-8d1c-05b82eb5b2e1.png";

export const STORE_PRODUCTS = [
  {
    id: "front-hoodie",
    name: 'Respect Is Earned Hoodie',
    shortName: "Respect Is Earned Hoodie",
    tooltip: "Shop the hoodie",
    price: "$89",
    priceValue: 89,
    priceNote: "+ postage",
    status: "available",
    badge: "Hoodie",
    category: "hoodies",
    link: "/store/product/thankyou-respect-is-earned-hoodie-front",
    images: [
      "https://media.base44.com/images/public/69eb7905ca6eb4180010f794/4454da55f_RespectisEarnedThankyouDarkGreyHoodieFront.png",
    ],
    description: "Dark grey oversized hoodie featuring the Thankyou artwork on the front with Gannon Waye signature detail. A wearable piece from the Respect Is Earned collection.",
    options: { size: ["S", "M", "L", "XL", "2XL", "3XL"] },
    addons: ["mug-addon", "poster-addon"],
    hotspot: { left: "2%", top: "38%", width: "20%", height: "48%" }
  },
  {
    id: "back-hoodie",
    name: 'Respect Is Earned Hoodie',
    shortName: "Respect Is Earned Hoodie",
    tooltip: "Shop the hoodie",
    price: "$89",
    priceValue: 89,
    priceNote: "+ postage",
    status: "available",
    badge: "Hoodie",
    category: "hoodies",
    link: "/store/product/thankyou-respect-is-earned-hoodie-back",
    images: [
      "https://media.base44.com/images/public/69eb7905ca6eb4180010f794/4454da55f_RespectisEarnedThankyouDarkGreyHoodieFront.png",
    ],
    description: "Dark grey oversized hoodie with the lyric line Respect Is Earned, Not A Game You Make Me Play across the back. Designed as a statement piece from Thankyou.",
    options: { size: ["S", "M", "L", "XL", "2XL", "3XL"] },
    addons: ["mug-addon", "poster-addon"],
    hotspot: { left: "76%", top: "48%", width: "22%", height: "30%" }
  },
  {
    id: "winter-writing-comfort-bundle",
    name: "Winter Writing & Comfort Bundle",
    shortName: "Winter Bundle",
    tooltip: "Shop the hero winter bundle",
    price: "$129",
    priceValue: 129,
    priceNote: "+ postage",
    status: "available",
    badge: "Featured Bundle",
    category: "bundles",
    excludeFromDiscounts: true,
    link: "/store/product/winter-writing-comfort-bundle",
    images: [
      "https://media.base44.com/images/public/69eb7905ca6eb4180010f794/9d145e3d6_generated_image.png",
      "https://media.base44.com/images/public/69eb7905ca6eb4180010f794/6822f58e3_4.jpg",
      "https://media.base44.com/images/public/69eb7905ca6eb4180010f794/4454da55f_RespectisEarnedThankyouDarkGreyHoodieFront.png",
    ],
    description: "The hero bundle of the Thankyou Merch Store. Includes the oversized Respect Is Earned hoodie plus the Thankyou journal, pen and thermos flask. Discount already applied — excluded from promo codes.",
    includes: ["Respect Is Earned Hoodie", "Thankyou Journal", "Thankyou Pen", "Thankyou Thermos Flask", "Gift Box"],
    options: { size: ["S", "M", "L", "XL", "2XL", "3XL"] },
    addons: ["mug-addon", "poster-addon"],
    hotspot: { left: "36%", top: "47%", width: "28%", height: "22%" }
  },
  {
    id: "journal-pen-thermos-bundle",
    name: "Thankyou Journal, Pen & Thermos Flask Bundle",
    shortName: "Journal Bundle",
    tooltip: "Shop the writing bundle",
    price: "$59",
    priceValue: 59,
    priceNote: "+ postage",
    status: "available",
    badge: "Bundle",
    category: "bundles",
    excludeFromDiscounts: true,
    link: "/store/product/journal-pen-thermos-bundle",
    images: [
      "https://media.base44.com/images/public/69eb7905ca6eb4180010f794/6822f58e3_4.jpg",
      "https://media.base44.com/images/public/69eb7905ca6eb4180010f794/146ccc6c7_5.jpg",
      "https://media.base44.com/images/public/69eb7905ca6eb4180010f794/3afc9d17f_3.jpg",
    ],
    description: "A premium Thankyou writing set featuring the Respect Is Earned journal, matching pen and thermos flask. Designed for reflection, writing, healing and comfort.",
    addons: ["mug-addon", "poster-addon"],
    hotspot: { left: "54%", top: "47%", width: "18%", height: "22%" }
  },
  {
    id: "mug",
    name: 'Thankyou "Respect Is Earned" Coffee Mug',
    shortName: "Coffee Mug",
    tooltip: "Shop the mug",
    price: "$9.90",
    priceValue: 9.90,
    priceNote: "+ postage",
    status: "available",
    badge: "Mug",
    category: "mugs",
    link: "/store/product/thankyou-respect-is-earned-coffee-mug",
    images: [
      "https://media.base44.com/images/public/69eb7905ca6eb4180010f794/d1e8a7822_MugFront.png",
      "https://media.base44.com/images/public/69eb7905ca6eb4180010f794/0261db66f_MugBack.png",
    ],
    description: "Ceramic Thankyou coffee mug featuring the Respect Is Earned lyric artwork. A simple daily reminder from the song.",
    addons: ["poster-addon"],
    hotspot: { left: "34%", top: "72%", width: "36%", height: "12%" }
  },
  {
    id: "wall-poster",
    name: 'Thankyou "Respect Is Earned" Wall Poster',
    shortName: "Wall Poster",
    tooltip: "Shop lyric wall posters",
    price: "From $19",
    priceValue: 19,
    priceNote: "A4 · A3 · A2 · A1",
    status: "available",
    badge: "Poster",
    category: "posters",
    needsImages: true,
    link: "/store/product/thankyou-respect-is-earned-wall-poster",
    images: [],
    description: "Premium Thankyou lyric wall poster. Multiple sizes available — A4 $19 · A3 $29 · A2 $39 · A1 $59.",
    options: { size: ["A4 — $19", "A3 — $29", "A2 — $39", "A1 — $59"] },
    addons: ["mug-addon"],
    hotspot: { left: "24%", top: "28%", width: "52%", height: "20%" }
  },
  {
    id: "cd",
    name: "Thankyou CD",
    shortName: "Thankyou CD",
    tooltip: "View Thankyou CD",
    price: "Sold Out",
    priceValue: 0,
    status: "sold_out",
    badge: "Sold Out",
    category: "collectables",
    link: "/store/product/thankyou-cd",
    images: [
      "https://media.base44.com/images/public/69eb7905ca6eb4180010f794/c2a1369c4_1.png",
    ],
    description: "Thankyou physical CD collectable. Currently sold out — join the waitlist.",
    hotspot: { left: "32%", top: "85%", width: "24%", height: "10%" }
  },
  {
    id: "tote-bag",
    name: "Thankyou Tote Bag",
    shortName: "Tote Bag",
    tooltip: "View tote bag",
    price: "$15",
    priceValue: 15,
    status: "sold_out",
    badge: "Sold Out",
    soldOutPermanent: true,
    category: "bags",
    link: "/store/product/thankyou-tote-bag",
    images: [
      "https://media.base44.com/images/public/69eb7905ca6eb4180010f794/d45dc7100_RespectisEarnedToteBagFront.png",
      "https://media.base44.com/images/public/69eb7905ca6eb4180010f794/39dab5737_RespectisEarnedToteBagBack.png",
    ],
    description: "Thankyou tote bag featuring campaign artwork and signature detail. Currently sold out.",
    hotspot: { left: "67%", top: "79%", width: "13%", height: "12%" }
  },
  {
    id: "mums-garden",
    name: "Mum's Garden",
    shortName: "Mum's Garden",
    tooltip: "Private memorial space",
    price: "Tribute",
    status: "memorial",
    badge: "Private",
    category: "tribute",
    link: "/mums-garden",
    images: [],
    description: "A private tribute space connected to Mum's Garden.",
    hotspot: { left: "82%", top: "18%", width: "15%", height: "23%" }
  }
];

export const STORE_ADDONS = [
  {
    id: "mug-addon",
    name: 'Add Thankyou "Respect Is Earned" Mug — $10',
    price: "$10",
    priceValue: 10,
    image: "https://media.base44.com/images/public/69eb7905ca6eb4180010f794/d1e8a7822_MugFront.png"
  },
  {
    id: "poster-addon",
    name: 'Add Thankyou "Respect Is Earned" Wall Poster — $39',
    price: "$39",
    priceValue: 39,
    image: ""
  }
];