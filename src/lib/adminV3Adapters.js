// ─── Owner Command V3 — Data Adapters ─────────────────────────────────────
// Read-only adapters that map existing entity data into unified display models.
// No records are created, updated, or deleted.

// ─── Content Stage Mapping ────────────────────────────────────────────────
export const CONTENT_STAGES = [
  'Research', 'Idea', 'Draft', 'Visual required', 'Quality review',
  'Waiting for Gannon', 'Approved', 'Scheduled', 'Published', 'Measured', 'Archived',
];

export function mapContentStage(item) {
  const status = (item.status || '').toLowerCase();
  if (status === 'archived') return 'Archived';
  if (status === 'posted' || status === 'published') return 'Published';
  if (status === 'performance_review' || status === 'measured') return 'Measured';
  if (status === 'scheduled') return 'Scheduled';
  if (status === 'approved' || status === 'ready_to_schedule') return 'Approved';
  if (status === 'needs_approval' || status === 'ready_for_review' || status === 'waiting_for_approval') return 'Waiting for Gannon';
  if (status === 'needs_asset' || status === 'needs_visual' || status === 'visual_required') return 'Visual required';
  if (status === 'quality_review') return 'Quality review';
  if (status === 'draft') return 'Draft';
  if (status === 'idea') return 'Idea';
  return 'Research';
}

// ─── Agent Crew Mapping ───────────────────────────────────────────────────
export const AGENT_CREW_NAMES = [
  'Owner Orchestrator', 'Music Crew', 'Content Crew', 'Commerce Crew',
  'Coaching Crew', 'Audience Crew', 'Money Crew', 'Systems Crew',
];

export const CREW_PURPOSES = {
  'Owner Orchestrator': 'Strategic decisions, approvals, and cross-crew coordination',
  'Music Crew': 'Releases, mastering, lyrics, distribution, and sync licensing',
  'Content Crew': 'Social content, scheduling, visuals, and publishing pipeline',
  'Commerce Crew': 'Merch, orders, fulfilment, suppliers, and inventory',
  'Coaching Crew': 'Client pathway, workbooks, sessions, and resources',
  'Audience Crew': 'Fans, subscribers, supporters, community, and engagement',
  'Money Crew': 'Revenue, payments, Stripe, charity, and financial tracking',
  'Systems Crew': 'Integrations, security, audits, QA, and platform health',
};

export function mapAgentCrew(agentName) {
  const name = (agentName || '').toLowerCase();
  if (name.includes('orchestrat') || name.includes('owner') || name.includes('master_blueprint')) return 'Owner Orchestrator';
  if (name.includes('music') || name.includes('release') || name.includes('streaming') || name.includes('sync') || name.includes('mastering') || name.includes('royalty')) return 'Music Crew';
  if (name.includes('content') || name.includes('social') || name.includes('metricool') || name.includes('video') || name.includes('trend') || name.includes('memorial_visual')) return 'Content Crew';
  if (name.includes('merch') || name.includes('commerce') || name.includes('order') || name.includes('store') || name.includes('shipping') || name.includes('procurement') || name.includes('pricing') || name.includes('merch_visual')) return 'Commerce Crew';
  if (name.includes('coach') || name.includes('workbook') || name.includes('academic') || name.includes('literature')) return 'Coaching Crew';
  if (name.includes('fan') || name.includes('audience') || name.includes('community') || name.includes('engagement') || name.includes('superfan') || name.includes('newsletter') || name.includes('partnership')) return 'Audience Crew';
  if (name.includes('revenue') || name.includes('stripe') || name.includes('payment') || name.includes('money') || name.includes('booking_revenue') || name.includes('email_revenue')) return 'Money Crew';
  return 'Systems Crew';
}

// ─── Incident Grouping ───────────────────────────────────────────────────
// Groups repeating system events using a stable fingerprint.
// Does NOT delete underlying history — only groups for display.
export function groupIncidents(issues = []) {
  const groups = {};
  issues.forEach(issue => {
    const fingerprint = `${issue.category || 'uncategorised'}::${issue.title || 'untitled'}`;
    if (!groups[fingerprint]) {
      groups[fingerprint] = {
        fingerprint,
        title: issue.title,
        category: issue.category,
        severity: issue.severity,
        status: issue.status,
        count: 0,
        firstSeen: issue.created_date,
        lastSeen: issue.created_date,
        nextAction: issue.next_action || 'Investigate and resolve',
        items: [],
      };
    }
    groups[fingerprint].count++;
    groups[fingerprint].items.push(issue);
    const created = new Date(issue.created_date || 0);
    if (created > new Date(groups[fingerprint].lastSeen || 0)) {
      groups[fingerprint].lastSeen = issue.created_date;
    }
    if (created < new Date(groups[fingerprint].firstSeen || Date.now())) {
      groups[fingerprint].firstSeen = issue.created_date;
    }
  });
  return Object.values(groups).sort((a, b) => b.count - a.count);
}

// ─── Coaching Stage Mapping ───────────────────────────────────────────────
export const COACHING_STAGES = [
  'Enquiry', 'Suitability', 'Booking', 'Payment', 'Agreement & Preparation',
  'Session', 'Resources & Action Plan', 'Follow Up', 'Testimonial Request', 'Next Suitable Offer',
];

export function mapCoachingStage(lead) {
  const status = (lead.status || '').toLowerCase();
  if (status === 'testimonial' || status === 'testimonial_request') return 'Testimonial Request';
  if (status === 'follow_up' || status === 'followup') return 'Follow Up';
  if (status === 'session' || status === 'session_complete') return 'Session';
  if (status === 'resources' || status === 'resource_sent') return 'Resources & Action Plan';
  if (status === 'agreement' || status === 'prepared') return 'Agreement & Preparation';
  if (status === 'paid' || status === 'payment') return 'Payment';
  if (status === 'booked' || status === 'booking') return 'Booking';
  if (status === 'suitable' || status === 'suitability') return 'Suitability';
  if (status === 'enquiry' || status === 'new') return 'Enquiry';
  if (status === 'next_offer' || status === 'upgrade') return 'Next Suitable Offer';
  return 'Enquiry';
}

// ─── Legacy Route Classification ──────────────────────────────────────────
export const ROUTE_CLASSIFICATIONS = {
  primary: 'Main destination for this workspace',
  specialist: 'Deep specialist tool for specific work',
  duplicate_candidate: 'Overlaps with another route — candidate for future merge',
  placeholder: 'Minimal or placeholder page',
  broken: 'Known broken or non-functional',
  unknown: 'Not yet verified',
};

export const ROUTE_RECOMMENDATIONS = {
  keep: 'Keep as primary destination',
  merge: 'Merge with related route',
  redirect: 'Redirect to primary route',
  archive: 'Archive after verification',
  investigate: 'Investigate before deciding',
};