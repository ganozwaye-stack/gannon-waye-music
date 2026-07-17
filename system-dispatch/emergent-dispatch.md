# Emergent Dispatch

Keep GanozMix Direct and subscription-service work separate from Gannon Waye Music payments and orders.

- No shared Stripe logic.
- No automatic supplier ordering.
- No marketplace publishing without approval.
- Reuse documentation and design patterns only where separation remains clear.
- Use `docs/base44-to-emergent-priority-list.md` as the current migration priority source.
- Treat Base44 as stabilize/export until Emergent has feature parity and Gannon approval.
- Use `docs/emergent-ganozmix-handoff.md` as the current GanozMix Direct build handoff.
