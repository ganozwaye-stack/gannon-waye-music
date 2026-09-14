import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';
import {
  DEEGO_INTERNAL_POLICY_VERSION,
  exact,
  isExactOwner,
  isInternalCapability,
  sha256,
} from '../_shared/deegoInternalPolicy.ts';

// This first real Deego execution lane deliberately supports one action only.
// It creates a durable internal receipt and never accesses a connector, network,
// email, messaging, publishing, distribution, submissions, payments, or schedules.

const MODE = 'controlled_internal_test';
const ACTION = 'synthetic_internal_test';
const CAPABILITY = 'internal_summary';
const IDEMPOTENCY_KEY = /^[A-Za-z0-9:_-]{12,128}$/;

Deno.serve(async (req) => {
  if (req.method !== 'POST') {
    return Response.json({ error: 'POST required' }, { status: 405 });
  }

  let sr: any = null;
  let task: any = null;
  let command: any = null;
  let correlationId = '';

  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me().catch(() => null);
    if (!isExactOwner(user)) {
      return Response.json({ error: 'Exact owner sign-in is required.' }, { status: 403 });
    }

    const body = await req.json().catch(() => ({}));
    if (body.mode !== MODE || body.action !== ACTION) {
      return Response.json({
        error: 'This dispatcher accepts only the controlled synthetic internal test.',
      }, { status: 409 });
    }

    const idempotencyKey = exact(body.idempotency_key);
    if (!IDEMPOTENCY_KEY.test(idempotencyKey)) {
      return Response.json({
        error: 'idempotency_key must contain 12–128 letters, numbers, colons, underscores, or hyphens.',
      }, { status: 400 });
    }

    if (!isInternalCapability(CAPABILITY)) {
      return Response.json({ error: 'Requested capability is held by policy.' }, { status: 409 });
    }

    const requestedBy = exact(user.email).toLowerCase();
    const input = {
      mode: MODE,
      action: ACTION,
      idempotency_key: idempotencyKey,
      requested_capability: CAPABILITY,
      policy_version: DEEGO_INTERNAL_POLICY_VERSION,
    };
    const inputHash = await sha256(input);
    sr = base44.asServiceRole;

    // This is lookup-before-create idempotency. It is sufficient for a
    // zero-effect synthetic test, but production concurrency guarantees still
    // require a separate platform conditional-write test.
    const existing = await sr.entities.DeegoExecutionTask.filter(
      { idempotency_key: idempotencyKey },
      '-created_date',
      1,
    );
    if (existing?.[0]) {
      if (existing[0].input_hash !== inputHash) {
        return Response.json({
          error: 'This idempotency key was already used with a different payload.',
        }, { status: 409 });
      }
      return Response.json({
        ok: true,
        deduplicated: true,
        task_id: existing[0].id,
        command_id: existing[0].command_id,
        runtime_state: existing[0].runtime_state,
        external_actions: 0,
        network_requests: 0,
        idempotency_guarantee: 'lookup-before-create; concurrent platform test pending',
      });
    }

    const now = new Date().toISOString();
    correlationId = crypto.randomUUID();
    const commandKey = crypto.randomUUID();

    command = await sr.entities.DeegoExecutionCommand.create({
      command_key: commandKey,
      idempotency_key: idempotencyKey,
      requester_email: requestedBy,
      source: 'owner_manual',
      requested_capability: CAPABILITY,
      canonical_input_hash: inputHash,
      policy_version: DEEGO_INTERNAL_POLICY_VERSION,
      runtime_state: 'accepted',
      submitted_at: now,
      external_actions: 0,
    });

    task = await sr.entities.DeegoExecutionTask.create({
      command_id: command.id,
      command_key: commandKey,
      idempotency_key: idempotencyKey,
      requested_capability: CAPABILITY,
      policy_version: DEEGO_INTERNAL_POLICY_VERSION,
      input_hash: inputHash,
      runtime_state: 'queued',
      attempt_count: 1,
      requires_approval: false,
      receipt_version: 'deego-receipt-v1',
      external_actions: 0,
    });

    await sr.entities.DeegoExecutionCommand.update(command.id, { task_id: task.id });

    const recordEvent = async (sequence: number, eventType: string, details: string, payloadHash: string, errorCode?: string) => {
      await sr.entities.DeegoTaskEvent.create({
        task_id: task.id,
        command_id: command.id,
        sequence,
        event_type: eventType,
        actor: requestedBy,
        occurred_at: new Date().toISOString(),
        correlation_id: correlationId,
        payload_hash: payloadHash,
        details,
        ...(errorCode ? { error_code: errorCode } : {}),
        external_actions: 0,
      });
    };

    await recordEvent(1, 'accepted', 'Owner submitted the controlled synthetic internal test.', inputHash);

    const startedAt = new Date().toISOString();
    await sr.entities.DeegoExecutionTask.update(task.id, {
      runtime_state: 'running',
      started_at: startedAt,
    });
    await recordEvent(2, 'started', 'The internal-only receipt test started.', inputHash);

    const result = {
      receipt_version: 'deego-receipt-v1',
      task_type: ACTION,
      requested_capability: CAPABILITY,
      external_actions: 0,
      network_requests: 0,
      outcome: 'Synthetic internal receipt created.',
    };
    const resultHash = await sha256(result);
    const completedAt = new Date().toISOString();

    await sr.entities.DeegoExecutionTask.update(task.id, {
      runtime_state: 'succeeded',
      completed_at: completedAt,
      result_hash: resultHash,
      output_summary: result.outcome,
      external_actions: 0,
    });
    await recordEvent(3, 'succeeded', result.outcome, resultHash);

    return Response.json({
      ok: true,
      deduplicated: false,
      task_id: task.id,
      command_id: command.id,
      runtime_state: 'succeeded',
      receipt_version: result.receipt_version,
      external_actions: 0,
      network_requests: 0,
      idempotency_guarantee: 'lookup-before-create; concurrent platform test pending',
    });
  } catch (error) {
    const errorCode = 'internal_receipt_failed';
    const detail = 'The synthetic internal receipt did not complete. No external action was requested or performed.';

    if (sr && task && command) {
      const failedAt = new Date().toISOString();
      await sr.entities.DeegoExecutionTask.update(task.id, {
        runtime_state: 'failed',
        completed_at: failedAt,
        error_code: errorCode,
        output_summary: detail,
        external_actions: 0,
      }).catch(() => undefined);
      await sr.entities.DeegoTaskEvent.create({
        task_id: task.id,
        command_id: command.id,
        sequence: 99,
        event_type: 'failed',
        actor: 'deegoInternalDispatcher',
        occurred_at: failedAt,
        correlation_id: correlationId || crypto.randomUUID(),
        payload_hash: await sha256({ errorCode }),
        details: detail,
        error_code: errorCode,
        external_actions: 0,
      }).catch(() => undefined);
    }

    console.error('Deego internal dispatcher failed', error?.name);
    return Response.json({ error: detail }, { status: 500 });
  }
});
