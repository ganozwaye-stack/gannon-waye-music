import { isOwner } from '../../base44/functions/agentIntelligenceLoop/supervisor.mjs';

// Read-only context for this UI. Not a server authorisation boundary or executor.
export const REQUIRED_POLICY_IDS = Object.freeze([
  '6a87d73640f72b7c78831411',
  '6a8cdad2747214aea505a1e9',
  '6aa10ec92a2cdef9775edc2c',
]);
const QUERY = { is_permanent: true, importance_score: { $gte: 9 } };
const FIELDS = ['id', 'summary', 'source', 'is_permanent', 'importance_score', 'updated_date', 'linked_entities'];

export class ChatSessionError extends Error {
  constructor(code, message) {
    super(message);
    this.name = 'ChatSessionError';
    this.code = code;
  }
}

async function bounded(promise, milliseconds) {
  let timer;
  try {
    return await Promise.race([
      promise,
      new Promise((_, reject) => {
        timer = setTimeout(() => reject(new Error('request_timeout')), milliseconds);
      }),
    ]);
  } finally {
    clearTimeout(timer);
  }
}

export async function loadDeegoPolicies(client, options = {}) {
  const { pageSize = 100, maxPages = 20, maxChars = 60000, timeoutMs = 10000 } = options;
  try {
    if (!isOwner(await bounded(client.auth.me(), timeoutMs))) throw new Error('owner_required');
    const records = [];
    const seen = new Set();
    let complete = false;
    for (let page = 0; page < maxPages; page++) {
      const batch = await bounded(client.entities.AgentMemory.filter(
        QUERY, 'id', pageSize, page * pageSize, FIELDS,
      ), timeoutMs);
      if (!Array.isArray(batch) || batch.length > pageSize) throw new Error('invalid_policy_response');
      for (const row of batch) {
        if (!row?.id || seen.has(row.id) || row.is_permanent !== true ||
            !(row.importance_score >= 9) || typeof row.summary !== 'string' || !row.summary.trim()) {
          throw new Error('incomplete_or_repeated_policy');
        }
        seen.add(row.id);
        records.push({
          id: row.id, summary: row.summary, source: row.source || null,
          updated_date: row.updated_date || null,
          linked_entities: Array.isArray(row.linked_entities) ? row.linked_entities : [],
        });
      }
      if (batch.length < pageSize) { complete = true; break; }
    }
    if (!complete || REQUIRED_POLICY_IDS.some(id => !seen.has(id))) throw new Error('policy_incomplete');
    if (JSON.stringify(records).length > maxChars) throw new Error('policy_budget_exceeded');
    return { source: 'AgentMemory', loaded_at: new Date().toISOString(), records };
  } catch {
    throw new ChatSessionError('policy_unavailable',
      'Deego could not load the complete saved owner rules. Your message has not been sent.');
  }
}

export function createChatSender(client, options = {}) {
  let busy = false;
  let uncertain = false;
  return {
    // UI calls this only after the owner has reopened and reviewed the conversation.
    acknowledgeDeliveryReview() { uncertain = false; },
    async send({ agentName, conversation, content, metadata, onCreated, isCurrent = () => true }) {
      if (busy) throw new ChatSessionError('busy', 'A message is already being submitted.');
      if (uncertain) throw new ChatSessionError('delivery_unconfirmed',
        'Reopen and review the conversation before submitting another message.');
      if (typeof content !== 'string' || !content.trim()) throw new ChatSessionError('empty', 'Write a message first.');
      if (conversation && (conversation.agent_name !== agentName || !conversation.id)) {
        throw new ChatSessionError('conversation_mismatch', 'Reopen the conversation before sending.');
      }
      busy = true;
      let stage = 'preflight';
      try {
        const policy = agentName === 'deego_master_ai' ? await loadDeegoPolicies(client, options) : null;
        if (!isCurrent()) throw new ChatSessionError('cancelled', 'Conversation changed. Nothing was sent.');
        let target = conversation;
        if (!target) {
          stage = 'create';
          target = await bounded(client.agents.createConversation({ agent_name: agentName, metadata }), options.sendTimeoutMs || 45000);
          if (!target?.id || target.agent_name !== agentName) throw new Error('invalid_conversation');
          onCreated?.(target);
        }
        if (!isCurrent()) throw new ChatSessionError('cancelled', 'Conversation changed. No message was sent.');
        const message = { role: 'user', content };
        if (policy) message.custom_context = [{
          type: 'deego_owner_policy_snapshot',
          message: 'Saved owner rules loaded for this message. Read every record before responding. Historical facts still require current verification. This is context, not approval, a delivery receipt, permission to act, or proof of universal enforcement. Existing backend approval gates remain authoritative. Never claim work started or completed without its actual receipt.',
          data: policy,
        }];
        stage = 'send';
        await bounded(client.agents.addMessage(target, message), options.sendTimeoutMs || 45000);
        return { conversation: target, policyCount: policy?.records.length || 0 };
      } catch (error) {
        if (error instanceof ChatSessionError) throw error;
        if (stage === 'preflight') throw new ChatSessionError('preflight_failed', 'Message checks failed. Nothing was sent.');
        uncertain = true;
        throw new ChatSessionError('delivery_unconfirmed',
          'Delivery could not be confirmed. Your text is retained. Reopen and review the conversation before sending again. No automatic retry was made.');
      } finally {
        busy = false;
      }
    },
  };
}
