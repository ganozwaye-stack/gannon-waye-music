// Safety hold: this legacy runner could spend AI quota and notify Slack.
// It creates no drafts, tasks, notifications, or external messages while held.
Deno.serve(async () => Response.json({
  success: false,
  skipped: true,
  reason: 'Safety hold active: autonomous social generation and Slack notification are disabled pending a bounded owner-confirmed internal-draft workflow.',
}, { status: 409 }));
