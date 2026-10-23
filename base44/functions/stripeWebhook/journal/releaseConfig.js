// Backend only. Exact verified editions and provider prices. Only the two verified released singles are enabled; public purchase UI remains held pending its bounded release.
export const RELEASE_CONFIG=Object.freeze({
  "enabled": true,
  "liveMode": true,
  "launchBookIds": [
    "building-resilience",
    "healthy-boundaries"
  ],
  "emailDeliveryVerified": true,
  "stripeKeyEnv": "STRIPE_SECRET_KEY",
  "stripeWebhookSecretEnv": "STRIPE_WEBHOOK_SECRET",
  "orderUniquenessVerified": true,
  "orderLockId": "6adaa1cb842cbb5e966ad3db",
  "currentCatalogue": {
    "enabled": true,
    "fulfilmentType": "released",
    "approvedVersion": "gw_br11_hb10_singles_20261022",
    "deliveryTermsVersion": "gw_journal_mixed_delivery_v2_20261022",
    "bundleId": "six-journal-bundle",
    "bundlePriceCents": 4500,
    "bundleEnabled": false,
    "books": [
      {
        "id": "choosing-yourself",
        "title": "Choosing Yourself",
        "priceCents": 990,
        "releaseApproved": false,
        "preorderApproved": false
      },
      {
        "id": "knowing-your-worth",
        "title": "Knowing Your Worth",
        "priceCents": 990,
        "releaseApproved": false,
        "preorderApproved": false
      },
      {
        "id": "healthy-boundaries",
        "title": "Healthy Boundaries",
        "priceCents": 990,
        "releaseApproved": true,
        "preorderApproved": false,
        "editionVersion": "10",
        "fileUri": "mp/private/69eb7905ca6eb4180010f794/9943b92dc_HealthyBoundaries.pdf",
        "sha256": "2d5a05c79217cee7ddc978f91deae284703ef98250ab09bd042c98f3951bb53b",
        "stripePriceId": "price_1UTVmGEMr9QX7GBLyJaKilb3"
      },
      {
        "id": "working-with-people-pleasing",
        "title": "Working with People-Pleasing",
        "priceCents": 990,
        "releaseApproved": false,
        "preorderApproved": false
      },
      {
        "id": "building-resilience",
        "title": "Building Resilience",
        "priceCents": 990,
        "releaseApproved": true,
        "preorderApproved": false,
        "editionVersion": "11",
        "fileUri": "mp/private/69eb7905ca6eb4180010f794/572829079_BuildingResilience1.pdf",
        "sha256": "9f8eea15b0d5ccca2e70f4a9d9b550492ba034205af82dd5d4a1ed3c662b7ab6",
        "stripePriceId": "price_1UTVmFEMr9QX7GBLhkz4bJ1x"
      },
      {
        "id": "healing-after-toxic-relationships",
        "title": "Healing After Toxic Relationships",
        "priceCents": 990,
        "releaseApproved": false,
        "preorderApproved": false
      }
    ]
  },
  "catalogues": {
    "gw_br11_hb10_singles_20261022": {
      "enabled": true,
      "fulfilmentType": "released",
      "approvedVersion": "gw_br11_hb10_singles_20261022",
      "deliveryTermsVersion": "gw_journal_mixed_delivery_v2_20261022",
      "bundleId": "six-journal-bundle",
      "bundlePriceCents": 4500,
      "bundleEnabled": false,
      "books": [
        {
          "id": "choosing-yourself",
          "title": "Choosing Yourself",
          "priceCents": 990,
          "releaseApproved": false,
          "preorderApproved": false
        },
        {
          "id": "knowing-your-worth",
          "title": "Knowing Your Worth",
          "priceCents": 990,
          "releaseApproved": false,
          "preorderApproved": false
        },
        {
          "id": "healthy-boundaries",
          "title": "Healthy Boundaries",
          "priceCents": 990,
          "releaseApproved": true,
          "preorderApproved": false,
          "editionVersion": "10",
          "fileUri": "mp/private/69eb7905ca6eb4180010f794/9943b92dc_HealthyBoundaries.pdf",
          "sha256": "2d5a05c79217cee7ddc978f91deae284703ef98250ab09bd042c98f3951bb53b",
          "stripePriceId": "price_1UTVmGEMr9QX7GBLyJaKilb3"
        },
        {
          "id": "working-with-people-pleasing",
          "title": "Working with People-Pleasing",
          "priceCents": 990,
          "releaseApproved": false,
          "preorderApproved": false
        },
        {
          "id": "building-resilience",
          "title": "Building Resilience",
          "priceCents": 990,
          "releaseApproved": true,
          "preorderApproved": false,
          "editionVersion": "11",
          "fileUri": "mp/private/69eb7905ca6eb4180010f794/572829079_BuildingResilience1.pdf",
          "sha256": "9f8eea15b0d5ccca2e70f4a9d9b550492ba034205af82dd5d4a1ed3c662b7ab6",
          "stripePriceId": "price_1UTVmFEMr9QX7GBLhkz4bJ1x"
        },
        {
          "id": "healing-after-toxic-relationships",
          "title": "Healing After Toxic Relationships",
          "priceCents": 990,
          "releaseApproved": false,
          "preorderApproved": false
        }
      ]
    }
  },
  "fulfilmentReleases": {},
  "privateDownloadHosts": [
    "media.base44.com"
  ]
});
