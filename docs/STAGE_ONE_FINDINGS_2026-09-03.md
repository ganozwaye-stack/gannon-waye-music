# Stage One findings

1. `/store` used the hard-coded StoreWorld catalogue. That catalogue exposed blocked or unverified products and identifiers that the secure checkout could not resolve.
2. `/store/all` used the live MerchProduct entity correctly, but it was secondary.
3. The two authorised records are live: the AUD 98 hoodie and AUD 59 journal, pen and thermos bundle.
4. Secure checkout still blocks those products because the current publication gate requires cost_verified_at, stock_verified_at and an HTTP supplier URL even for physically owned inventory. The records do not currently contain those fields.
5. Customer shipping is calculated from ShippingRateRule on the front end but from separate hard-coded constants in createCheckoutSession, allowing a displayed total and Stripe total to diverge.
6. The system contains unsupported GST registration and GST receipt wording.
7. The system contains public 1800RESPECT proceeds claims without a merchandise-level audited donation ledger.
8. The unauthorised HeyGen stock-photo avatar record remains evidence and must be quarantined, not deleted.

This record is internal and does not itself authorise external publication, spending, outreach or a paid live transaction.