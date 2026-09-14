import test from 'node:test';
import assert from 'node:assert/strict';
import { isCompleteInternalReceipt } from '../../base44/shared/deegoReceiptIntegrity.js';

function validReceipt() {
  const command = {
    id: 'command-1',
    command_key: 'key-1',
    task_id: 'task-1',
    canonical_input_hash: 'hash-1',
    runtime_state: 'accepted',
    external_actions: 0,
  };
  const task = {
    id: 'task-1',
    command_id: 'command-1',
    command_key: 'key-1',
    input_hash: 'hash-1',
    runtime_state: 'succeeded',
    external_actions: 0,
  };
  const events = [
    { sequence: 1, event_type: 'accepted', task_id: 'task-1', command_id: 'command-1', external_actions: 0 },
    { sequence: 2, event_type: 'started', task_id: 'task-1', command_id: 'command-1', external_actions: 0 },
    { sequence: 3, event_type: 'succeeded', task_id: 'task-1', command_id: 'command-1', external_actions: 0 },
  ];
  return { command, task, events, inputHash: 'hash-1' };
}

test('complete internal receipt requires one successful zero-action event chain', () => {
  assert.equal(isCompleteInternalReceipt(validReceipt()), true);
});

test('failed, incomplete, duplicate, mismatched, or non-zero-action receipts fail closed', () => {
  const failed = validReceipt();
  failed.task.runtime_state = 'failed';
  assert.equal(isCompleteInternalReceipt(failed), false);

  const incomplete = validReceipt();
  incomplete.events.pop();
  assert.equal(isCompleteInternalReceipt(incomplete), false);

  const duplicate = validReceipt();
  duplicate.events.push({ ...duplicate.events[2], sequence: 4 });
  assert.equal(isCompleteInternalReceipt(duplicate), false);

  const mismatched = validReceipt();
  mismatched.events[2].command_id = 'other-command';
  assert.equal(isCompleteInternalReceipt(mismatched), false);

  const nonZeroAction = validReceipt();
  nonZeroAction.events[1].external_actions = 1;
  assert.equal(isCompleteInternalReceipt(nonZeroAction), false);
});
