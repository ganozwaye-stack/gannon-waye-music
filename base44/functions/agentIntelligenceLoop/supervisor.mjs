// Shared deterministic supervision policy. No external actions or paid integrations.
export const INTERVAL_MINUTES = Object.freeze({ critical: 15, high: 60, medium: 1440, low: 4320 });
export const SOURCES = ['DailyDashboardTask', 'ActionItem'];
export function isOwner(user) {
  return user?.role === 'admin' && ['ganozwaye@gmail.com', 'gannonwayemusic@gmail.com'].includes(String(user.email || '').trim().toLowerCase());
}
export function inspectTask(task, entity, now = Date.now()) {
  const priority = Object.hasOwn(INTERVAL_MINUTES, task.priority) ? task.priority : 'medium';
  const closed = ['complete', 'done'].includes(task.status);
  const verified = closed && Boolean(task.completion_evidence?.trim()) &&
    Boolean(task.completion_verified_by?.trim()) && Number.isFinite(Date.parse(task.completion_verified_at)) &&
    Date.parse(task.completion_verified_at) <= now;
  const last = Date.parse(task.supervisor_checked_at);
  const interval = INTERVAL_MINUTES[priority] * 60000;
  // Recalculate from current priority so urgency changes cannot retain a stale slow schedule.
  const next = Number.isFinite(last) ? last + interval : now;
  return {
    id: task.id, entity, title: task.title || 'Untitled task', priority, status: task.status,
    owner: task.owner || task.suggested_by || 'Unassigned',
    next_action: task.next_action || 'Review source and record the next action',
    evidence_required: closed && !verified, verified,
    follow_up_due: !verified && next <= now,
    next_follow_up_at: verified ? null : new Date(next).toISOString(),
  };
}
export async function listAll(api, limit = 200, maxPages = 100) {
  const records = [];
  const seen = new Set();
  for (let page = 0; page < maxPages; page++) {
    const batch = await api.list('id', limit, page * limit);
    if (!Array.isArray(batch)) throw new Error('Invalid task list response');
    for (const row of batch) {
      if (!row.id || seen.has(row.id)) throw new Error('Task pagination changed; retry the review');
      seen.add(row.id); records.push(row);
    }
    if (batch.length < limit) return records;
  }
  throw new Error('Task review exceeded its pagination limit; no complete coverage claimed');
}
export async function snapshot(entities, now = Date.now()) {
  const groups = await Promise.all(SOURCES.map(async entity =>
    (await listAll(entities[entity])).map(task => inspectTask(task, entity, now))));
  return groups.flat().sort((a,b) =>
    INTERVAL_MINUTES[a.priority] - INTERVAL_MINUTES[b.priority] ||
    String(a.id).localeCompare(String(b.id)));
}
export async function supervise(entities, now = Date.now()) {
  const tasks = await snapshot(entities, now);
  let followedUp = 0;
  for (const task of tasks.filter(t => t.follow_up_due)) {
    // Reuse one internal alert per source task. This is not a delivered WhatsApp message.
    const query = { source: 'DeegoSupervisor', linked_entity: task.entity, linked_id: task.id };
    const existing = await entities.AdminNotification.filter(query, '-created_date', 1);
    const alert = {
      ...query, notification_type: 'system',
      severity: task.priority === 'critical' ? 'critical' : task.priority === 'high' ? 'high' : 'info',
      title: task.evidence_required ? 'Completion evidence needs review' : 'Task follow-up due',
      summary: task.title + ' · ' + task.owner + '. ' + task.next_action,
      requires_action: true, is_read: false,
      linked_route: '/admin/communications-hub?task=' + encodeURIComponent(task.id) + '&entity=' + task.entity,
    };
    if (existing[0]) await entities.AdminNotification.update(existing[0].id, alert);
    else await entities.AdminNotification.create(alert);
    // Only advance after the alert was successfully persisted; delegation never closes a task.
    await entities[task.entity].update(task.id, {
      supervisor_checked_at: new Date(now).toISOString(),
      next_follow_up_at: new Date(now + INTERVAL_MINUTES[task.priority] * 60000).toISOString(),
    });
    followedUp++;
  }
  return { followed_up: followedUp, reviewed: tasks.length,
    coverage: SOURCES, whatsapp_delivered: false, external_actions: 0,
    limitations: ['Only the two listed task registers are covered', 'Mailbox ingestion and outbound WhatsApp are not verified'] };
}
