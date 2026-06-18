// Hero image for the immersive Gannon Waye Merch Store
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
      "https://media.base44.com/images/public/69eb7905ca6eb4180010f794/116a66e6b_Respect_is_Earned_Thankyou_Dark_Grey_Hoodie_Front-removebg-preview.png",
      "https://media.base44.com/images/public/69eb7905ca6eb4180010f794/3e484f441_Respect_is_Earned_Thankyou_Dark_Grey_Hoodie_Back-removebg-preview.png",
      "https://media.base44.com/images/public/69eb7905ca6eb4180010f794/babbbc3d4_ChatGPTImageJun17202605_07_15PM5.png",
      "https://media.base44.com/images/public/69eb7905ca6eb4180010f794/4f7409387_ChatGPTImageJun17202605_07_17PM6.png",
    ],
    description: "Dark grey oversized hoodie featuring the Thankyou artwork on the front with Gannon Waye signature detail. A wearable piece from the Respect Is Earned collection.",
    options: { size: ["S", "M", "L", "XL", "2XL", "3XL"] },
    addons: ["mug-addon", "poster-addon"],
    // Left clothing rack — spans the long rack running back along the wall
    hotspot: { left: "0%", top: "30%", width: "16%", height: "56%" }
  },
  {
    id: "back-hoodie",
    name: 'Respect Is Earned Hoodie — Back',
    shortName: "Hoodie Back View",
    tooltip: "See the back — Respect Is Earned lyric",
    price: "$89",
    priceValue: 89,
    priceNote: "+ postage",
    status: "available",
    badge: "Hoodie",
    category: "hoodies",
    link: "/store/product/thankyou-respect-is-earned-hoodie-front",
    images: [
      "https://media.base44.com/images/public/69eb7905ca6eb4180010f794/3e484f441_Respect_is_Earned_Thankyou_Dark_Grey_Hoodie_Back-removebg-preview.png",
      "https://media.base44.com/images/public/69eb7905ca6eb4180010f794/116a66e6b_Respect_is_Earned_Thankyou_Dark_Grey_Hoodie_Front-removebg-preview.png",
      "https://media.base44.com/images/public/69eb7905ca6eb4180010f794/27efba07c_ChatGPTImageJun17202605_07_15PM4.png",
    ],
    description: "Dark grey oversized hoodie with the lyric line Respect Is Earned, Not A Game You Make Me Play across the back. Designed as a statement piece from Thankyou.",
    options: { size: ["S", "M", "L", "XL", "2XL", "3XL"] },
    addons: ["mug-addon", "poster-addon"],
    // Right clothing rack — running back along right wall
    hotspot: { left: "76%", top: "30%", width: "24%", height: "56%" }
  },
  {
    id: "winter-writing-comfort-bundle",
    name: "Winter Writing & Comfort Bundle",
    shortName: "Winter Bundle",
    tooltip: "Shop the hero winter bundle — $119",
    price: "$119",
    priceValue: 119,
    priceNote: "+ postage",
    status: "available",
    badge: "Featured Bundle",
    category: "bundles",
    excludeFromDiscounts: true,
    link: "/store/product/winter-writing-comfort-bundle",
    images: [
      // Centre counter display — folded jumper + journal + thermos + pen + box as per reference image
      "https://media.base44.com/images/public/69eb7905ca6eb4180010f794/27efba07c_ChatGPTImageJun17202605_07_15PM4.png",
      "https://media.base44.com/images/public/69eb7905ca6eb4180010f794/4f7409387_ChatGPTImageJun17202605_07_17PM6.png",
      "https://media.base44.com/images/public/69eb7905ca6eb4180010f794/851236b30_BundleBox.png",
      "https://media.base44.com/images/public/69eb7905ca6eb4180010f794/5909cdcc0_BundleJournalPenThermos.jpg",
      "https://media.base44.com/images/public/69eb7905ca6eb4180010f794/69779807d_JournalBundle1920x1080px.jpg",
      "https://media.base44.com/images/public/69eb7905ca6eb4180010f794/babbbc3d4_ChatGPTImageJun17202605_07_15PM5.png",
    ],
    description: "The hero bundle of the Thankyou Merch Store. Includes the oversized Respect Is Earned hoodie plus the Thankyou journal, pen and thermos flask. Discount already applied — excluded from promo codes.",
    includes: ["Respect Is Earned Hoodie", "Thankyou Journal", "Thankyou Pen", "Thankyou Thermos Flask", "Gift Box"],
    options: { size: ["S", "M", "L", "XL", "2XL", "3XL"] },
    addons: ["mug-addon", "poster-addon"],
    // Centre counter display — top shelf (folded hoodie + journal + thermos + pen + box)
    hotspot: { left: "33%", top: "42%", width: "34%", height: "26%" }
  },
  {
    id: "journal-pen-thermos-bundle",
    name: "Thankyou Journal, Pen & Thermos Flask Bundle",
    shortName: "Journal Bundle",
    tooltip: "Shop the writing bundle — $59",
    price: "$59",
    priceValue: 59,
    priceNote: "+ postage",
    status: "available",
    badge: "Bundle",
    category: "bundles",
    excludeFromDiscounts: true,
    link: "/store/product/journal-pen-thermos-bundle",
    images: [
      "https://media.base44.com/images/public/69eb7905ca6eb4180010f794/5909cdcc0_BundleJournalPenThermos.jpg",
      "https://media.base44.com/images/public/69eb7905ca6eb4180010f794/69779807d_JournalBundle1920x1080px.jpg",
      "https://media.base44.com/images/public/69eb7905ca6eb4180010f794/89251de0a_image1.png",
      "https://media.base44.com/images/public/69eb7905ca6eb4180010f794/851236b30_BundleBox.png",
    ],
    description: "A premium Thankyou writing set featuring the Respect Is Earned journal, matching pen and thermos flask. Designed for reflection, writing, healing and comfort.",
    addons: ["mug-addon", "poster-addon"],
    // Centre counter — sits alongside winter bundle top shelf
    hotspot: { left: "50%", top: "42%", width: "17%", height: "22%" }
  },
  {
    id: "mug",
    name: 'Thankyou "Respect Is Earned" Coffee Mug',
    shortName: "Coffee Mug",
    tooltip: "Shop the mug — $9.90",
    price: "$9.90",
    priceValue: 9.90,
    priceNote: "+ postage",
    status: "available",
    badge: "Mug",
    category: "mugs",
    link: "/store/product/thankyou-respect-is-earned-coffee-mug",
    images: [
      "https://media.base44.com/images/public/69eb7905ca6eb4180010f794/b24fe1cbb_MugFront-removebg-preview.png",
      "https://media.base44.com/images/public/69eb7905ca6eb4180010f794/e92e274c1_MugBack-removebg-preview.png",
      "https://media.base44.com/images/public/69eb7905ca6eb4180010f794/14e1c73bb_MUG-removebg-preview.png",
      "https://media.base44.com/images/public/69eb7905ca6eb4180010f794/7c2845bc2_60438161-b7d9-4f9e-a805-52451602e485.png",
    ],
    description: "Ceramic Thankyou coffee mug featuring the Respect Is Earned lyric artwork. A simple daily reminder from the song.",
    addons: ["poster-addon"],
    // Lower shelf of centre counter — row of mugs
    hotspot: { left: "30%", top: "68%", width: "42%", height: "14%" }
  },
  {
    id: "wall-poster",
    name: 'Thankyou "Respect Is Earned" Wall Poster',
    shortName: "Wall Poster",
    tooltip: "Shop lyric wall posters — from $19",
    price: "From $19",
    priceValue: 19,
    priceNote: "A4 · A3 · A2 · A1",
    status: "available",
    badge: "Poster",
    category: "posters",
    needsImages: true,
    link: "/store/product/thankyou-respect-is-earned-wall-poster",
    images: [
      "https://media.base44.com/images/public/69eb7905ca6eb4180010f794/4e1ee5100_3cc92327-85e8-4975-9798-8ab605e3fea5.png",
      "https://media.base44.com/images/public/69eb7905ca6eb4180010f794/be4dd3729_5e2e49fe-b4c2-448f-9390-35847282f185.png",
      "https://media.base44.com/images/public/69eb7905ca6eb4180010f794/008439dbc_19e1b087-3885-49a3-84b4-c21bc66e2c14.png",
      "https://media.base44.com/images/public/69eb7905ca6eb4180010f794/94da1d0fc_27a4687d-57f7-4aee-a72a-6a3f83e262a0.png",
      "https://media.base44.com/images/public/69eb7905ca6eb4180010f794/71bab5a26_b576c5e1-1b07-4045-9dd4-7fbbde34b256.png",
      "https://media.base44.com/images/public/69eb7905ca6eb4180010f794/0439580ff_d76efdba-9035-43ee-b021-a6110ccc3c91.png",
      "https://media.base44.com/images/public/69eb7905ca6eb4180010f794/4dc8adb59_e49c41f2-adf8-472d-89be-9a7e2de20aa4.png",
      "https://media.base44.com/images/public/69eb7905ca6eb4180010f794/ca4e1cc3b_ChatGPTImageJun16202605_10_04PM.png",
      "https://media.base44.com/images/public/69eb7905ca6eb4180010f794/639ca3360_ChatGPTImageJun16202609_38_44AM2.png",
      "https://media.base44.com/images/public/69eb7905ca6eb4180010f794/af9517dc4_ChatGPTImageJun16202609_38_45AM3.png",
      "https://media.base44.com/images/public/69eb7905ca6eb4180010f794/b6a07a3c9_ChatGPTImageJun16202609_38_45AM4.png",
      "https://media.base44.com/images/public/69eb7905ca6eb4180010f794/fcc8a0620_ChatGPTImageJun16202609_38_45AM5.png",
      "https://media.base44.com/images/public/69eb7905ca6eb4180010f794/8cf7b49b0_ChatGPTImageJun16202609_38_46AM6.png",
    ],
    description: "Premium Thankyou lyric wall poster. Multiple sizes available — A4 $19 · A3 $29 · A2 $39 · A1 $59.",
    options: { size: ["A4 — $19", "A3 — $29", "A2 — $39", "A1 — $59"] },
    addons: ["mug-addon"],
    // Wall poster display — the row of 6-7 framed posters on the back wall
    hotspot: { left: "16%", top: "20%", width: "58%", height: "24%" }
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
    // Lower shelf CDs
    hotspot: { left: "30%", top: "82%", width: "42%", height: "10%" }
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
      "https://media.base44.com/images/public/69eb7905ca6eb4180010f794/a15746489_RespectisEarnedToteBagFront.png",
      "https://media.base44.com/images/public/69eb7905ca6eb4180010f794/96df2aba0_RespectisEarnedToteBagBack.png",
      "https://media.base44.com/images/public/69eb7905ca6eb4180010f794/ee10377b1_RespectisEarnedToteBag.png",
      "https://media.base44.com/images/public/69eb7905ca6eb4180010f794/d3d69be4c_Respect_is_Earned_Tote_Bag_Front-removebg-preview.png",
      "https://media.base44.com/images/public/69eb7905ca6eb4180010f794/0c49da374_Respect_is_Earned_Tote_Bag_Back-removebg-preview.png",
    ],
    description: "Thankyou tote bag featuring campaign artwork and signature detail. Currently sold out.",
    hotspot: { left: "67%", top: "78%", width: "9%", height: "13%" }
  },
  {
    id: "mums-garden",
    name: "Mum's Garden",
    shortName: "Mum's Garden",
    tooltip: "Visit Mum's Garden — private tribute",
    price: "Tribute",
    status: "memorial",
    badge: "Private",
    category: "tribute",
    link: "/mums-garden",
    images: [],
    description: "A private tribute space connected to Mum's Garden.",
    // Far back right — the Mum's Garden shrine/mirror area, further back and smaller
    hotspot: { left: "88%", top: "14%", width: "10%", height: "22%" }
  }
];

export const STORE_ADDONS = [
  {
    id: "mug-addon",
    name: 'Add Thankyou "Respect Is Earned" Mug — $10',
    price: "$10",
    priceValue: 10,
    image: "https://media.base44.com/images/public/69eb7905ca6eb4180010f794/b24fe1cbb_MugFront-removebg-preview.png"
  },
  {
    id: "poster-addon",
    name: 'Add Thankyou "Respect Is Earned" Wall Poster — $39',
    price: "$39",
    priceValue: 39,
    image: "https://media.base44.com/images/public/69eb7905ca6eb4180010f794/4e1ee5100_3cc92327-85e8-4975-9798-8ab605e3fea5.png"
  }
];