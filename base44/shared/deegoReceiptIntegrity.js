const exactText = value => String(value ?? '').trim();

const expectedEvents = [
  { sequence: 1, event_type: 'accepted' },
  { sequence: 2, event_type: 'started' },
  { sequence: 3, event_type: 'succeeded' },
];

// A receipt is readable as successful only when its command, task, and ordered
// event chain agree on one zero-external-action internal request.
export function isCompleteInternalReceipt({ command, task, events, inputHash }) {
  if (
    !command
    || !task
    || exactText(task.input_hash) !== exactText(inputHash)
    || exactText(task.command_id) !== exactText(command.id)
    || exactText(task.command_key) !== exactText(command.command_key)
    || exactText(command.task_id) !== exactText(task.id)
    || exactText(command.canonical_input_hash) !== exactText(inputHash)
    || exactText(command.runtime_state) !== 'accepted'
    || exactText(task.runtime_state) !== 'succeeded'
    || Number(command.external_actions || 0) !== 0
    || Number(task.external_actions || 0) !== 0
    || !Array.isArray(events)
    || events.length !== expectedEvents.length
  ) {
    return false;
  }

  return expectedEvents.every((expected, index) => {
    const event = events[index];
    return Number(event?.sequence) === expected.sequence
      && exactText(event?.event_type) === expected.event_type
      && exactText(event?.task_id) === exactText(task.id)
      && exactText(event?.command_id) === exactText(command.id)
      && Number(event?.external_actions || 0) === 0;
  });
}
