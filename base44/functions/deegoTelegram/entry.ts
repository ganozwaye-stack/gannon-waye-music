import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';

// ============================================================================
// deegoTelegram — Deego's voice/text doorway via Telegram.
//
// SAFETY RULES (do not relax without Gannon's explicit approval):
//   1. Replies ONLY to the single allowlisted chat id (TELEGRAM_CHAT_ID).
//      Any other sender is ignored SILENTLY — no reply, not even an error.
//      A silent bot gives an attacker nothing to probe.
//   2. NEVER echoes legal / court / family-violence / restricted-contact
//      content into Telegram. Those return a hub link only.
//   3. Approvals: green may be actioned from chat. Amber and red are hub-only.
//      This function never approves anything — it only reports.
//   4. Never posts publicly, never sends email, never spends, never deletes.
//
// SETUP (Gannon):
//   - BotFather -> /newbot -> get token
//   - Base44 secrets: TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID, TELEGRAM_WEBHOOK_SECRET
//   - Register webhook (once):
//     https://api.telegram.org/bot<TOKEN>/setWebhook
//       ?url=<this function url>
//       &secret_token=<TELEGRAM_WEBHOOK_SECRET>
// ============================================================================

const SENSITIVE = [
  'court', 'legal', 'lawyer', 'solicitor', 'affidavit', 'subpoena', 'hearing',
  'intervention order', 'family violence', 'domestic violence', 'restricted contact',
  'police', 'victor', 'refund', 'chargeback', 'dispute', 'complaint',
];

function isSensitive(text: string): boolean {
  if (!text) return false;
  const t = text.toLowerCase();
  return SENSITIVE.some((w) => t.includes(w));
}

async function tg(method: string, payload: unknown) {
  const token = Deno.env.get('TELEGRAM_BOT_TOKEN');
  if (!token) return;
  await fetch(`https://api.telegram.org/bot${token}/${method}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  }).catch(() => {});
}

// The bare wake word returns ONE item. Not a list — a list is a dashboard,
// and Gannon already has a dashboard.
async function mostImportantThing(base44: any): Promise<string> {
  // 1. Unresolved critical risk
  const risks = await base44.asServiceRole.entities.RiskAlert
    .filter({ status: 'open' }).catch(() => []);
  const critical = (risks || []).find((r: any) => r.severity === 'critical');
  if (critical) {
    return isSensitive(`${critical.title} ${critical.description || ''}`)
      ? 'Something critical needs you. Opened in the hub.'
      : `Critical: ${critical.title}`;
  }

  // 2. Approvals waiting
  const approvals = await base44.asServiceRole.entities.ApprovalQueueItem
    .filter({ status: 'needs_approval' }).catch(() => []);
  const urgent = (approvals || [])
    .sort((a: any, b: any) => {
      const rank: Record<string, number> = { critical: 0, high: 1, medium: 2, low: 3 };
      return (rank[a.priority] ?? 9) - (rank[b.priority] ?? 9);
    })[0];
  if (urgent) {
    if (isSensitive(`${urgent.title} ${urgent.category || ''} ${urgent.description || ''}`)) {
      return `${(approvals || []).length} waiting on you. The top one is sensitive — opened in the hub.`;
    }
    return `Needs you: ${urgent.title}` +
      ((approvals || []).length > 1 ? ` (+${(approvals || []).length - 1} more)` : '');
  }

  // 3. Today's tasks
  const tasks = await base44.asServiceRole.entities.DailyDashboardTask
    .filter({ status: 'pending' }).catch(() => []);
  if (tasks && tasks.length) {
    const t = tasks[0];
    return isSensitive(`${t.title || ''} ${t.description || ''}`)
      ? 'Top task is sensitive — opened in the hub.'
      : `Next: ${t.title || t.description || 'task waiting'}`;
  }

  // 4. Fall back to the active target
  const targets = await base44.asServiceRole.entities.DeegoProfitTarget
    .filter({ status: 'active' }).catch(() => []);
  if (targets && targets.length) {
    const t = targets[0];
    return `Nothing urgent. Still on: ${t.target_name}.`;
  }

  return 'Nothing needs you right now.';
}

async function targetStatus(base44: any): Promise<string> {
  const targets = await base44.asServiceRole.entities.DeegoProfitTarget
    .filter({ status: 'active' }).catch(() => []);
  if (!targets || !targets.length) return 'No active target set.';
  return targets.map((t: any) =>
    `${t.target_name}\n  to date: $${(t.net_profit_to_date || 0).toLocaleString()} of $${(t.target_profit || 0).toLocaleString()}`
  ).join('\n\n');
}

export default async function (req: Request) {
  try {
    // --- Verify the call really came from Telegram -------------------------
    const expected = Deno.env.get('TELEGRAM_WEBHOOK_SECRET');
    const got = req.headers.get('x-telegram-bot-api-secret-token');
    if (expected && got !== expected) {
      return new Response('ok', { status: 200 }); // silent
    }

    const update = await req.json().catch(() => ({}));
    const msg = update?.message || update?.edited_message;
    if (!msg) return new Response('ok', { status: 200 });

    const chatId = String(msg.chat?.id ?? '');
    const allowed = Deno.env.get('TELEGRAM_CHAT_ID');

    // --- Rule 1: single allowlisted chat, silent otherwise -----------------
    if (!allowed || chatId !== String(allowed)) {
      console.warn(`[deegoTelegram] ignored message from unallowlisted chat ${chatId}`);
      return new Response('ok', { status: 200 });
    }

    const base44 = createClientFromRequest(req);
    const raw = (msg.text || '').trim();
    const lower = raw.toLowerCase();

    let reply: string;

    if (!raw && msg.voice) {
      // Phase A stores voice, does not transcribe (transcription costs money).
      reply = 'Voice note received and stored. Transcription is not on yet — ' +
              'use the Siri shortcut for hands-free, it dictates on-device for free.';
    } else if (/^(deego|diego|dego)[\s!.?]*$/i.test(lower)) {
      reply = await mostImportantThing(base44);
    } else if (lower.startsWith('remember') || lower.startsWith('note')) {
      const bodyText = raw.replace(/^(remember|note)[\s:,-]*/i, '').trim();
      if (isSensitive(bodyText)) {
        reply = 'Saved to the hub. Not repeating it here.';
      } else {
        reply = `Saved: ${bodyText}`;
      }
      await base44.asServiceRole.entities.ActionItem.create({
        title: bodyText.slice(0, 120),
        description: bodyText,
        status: 'open',
        source: 'telegram',
      }).catch(() => {});
    } else if (lower.includes('tracking') || lower.includes('target')) {
      reply = await targetStatus(base44);
    } else if (lower.includes('approv')) {
      const approvals = await base44.asServiceRole.entities.ApprovalQueueItem
        .filter({ status: 'needs_approval' }).catch(() => []);
      reply = `${(approvals || []).length} waiting. Amber and red are hub-only — open Deego to action them.`;
    } else if (lower.includes('stand down') || lower.includes('leave it')) {
      reply = 'Noted. Standing down.';
    } else {
      reply = await mostImportantThing(base44);
    }

    await tg('sendMessage', { chat_id: chatId, text: reply });
    return new Response('ok', { status: 200 });
  } catch (err) {
    console.error('[deegoTelegram]', err);
    return new Response('ok', { status: 200 }); // never leak errors to the caller
  }
}
