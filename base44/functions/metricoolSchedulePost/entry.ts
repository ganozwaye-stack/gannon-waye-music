// Safety hold: Metricool scheduling can publish to external social accounts.
// No schedule, provider request, or post-state mutation may occur from this legacy endpoint.
Deno.serve(async () => Response.json({
  success: false,
  skipped: true,
  reason: 'Safety hold active: external social scheduling is disabled pending an exact-owner, content-bound, one-use approval workflow.',
}, { status: 409 }));
