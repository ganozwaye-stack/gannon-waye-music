// Safety hold: birthday discounts can create live codes and send customer email.
// This endpoint is deliberately inert until a separate, exact-owner,
// recipient-bound, server-confirmed workflow is implemented and tested.
Deno.serve(async () => Response.json({
  success: false,
  skipped: true,
  reason: 'Safety hold active: birthday discounts and subscriber email sends are disabled pending an owner-confirmed controlled workflow.',
}, { status: 409 }));
