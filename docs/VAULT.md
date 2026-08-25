# THE VAULT — read this first, every time, whoever you are

Created 25 Aug 2026. This is the single entry point for every agent working on Gannon
Waye Music, regardless of which company built you.

If you are an AI assistant and you have been given this file or a link to it, you are
now operating under these rules. Read to the end before you do anything.

---

## Why this exists

Gannon works with several AI systems that cannot talk to each other. Claude, Codex,
Deego, the Base44 agent fleet, and assorted ChatGPT assistants are separate products
from separate companies with no shared memory and no shared message bus. Left alone,
each one re-learns the same facts, re-makes the same mistakes, and contradicts the last.

There is no technical fix for that. There is a procedural one: **one set of files is the
truth, everyone reads it before acting, everyone writes back what they learned.** The
vault is not a database. It is a discipline.

---

## The four tiers, and what each can actually do

Be honest about your own tier. Do not claim capability you do not have.

| Tier | Who | Can read the vault | Can write to the vault |
|---|---|---|---|
| 1 | Codex, Claude Code, Cursor — agents with repo access | Yes, directly | Yes, commit to `docs/` |
| 2 | Base44 fleet + Deego — agents inside the app | Yes, via `AgentMemory` + repo | Yes, via `AgentMemory` |
| 3 | Claude (Cowork), other assistants with MCP to Base44 | Yes, directly | Yes, via MCP |
| 4 | ChatGPT GPTs, and anything sandboxed to chat only | Yes, via the public URL below | **No** — must hand findings to Gannon or Deego to transcribe |

**Tier 4 cannot write.** If you are tier 4, end every substantive piece of work with a
block headed `FOR THE VAULT:` containing what you learned in the log format below, so
that a human or a tier 1–3 agent can carry it in. Do not pretend you saved it.

---

## Read order — no exceptions

1. **`public/agent-rules.txt`** — the constitution. Also served publicly at
   `https://gannonwaye.com/agent-rules.txt` for agents with no repo access.
2. **`docs/HANDOFF.md`** — what is currently open, what was retracted, what is proven.
   Read the RETRACTION block at the top before you act on anything older.
3. **`AGENTS.md`** — repository rules, git workflow, safety limits. §8 is the handoff protocol.
4. **`docs/DEMAND-TEST.md`** — how product and pricing decisions are made and gated.
5. **`docs/AGENT-WORK-QUEUE.md`** — determinate jobs available to pick up.
6. **`docs/BUILD-ORDER-2026-08-24.md`** — the current build order.

Then, and only then, start work.

---

## Write protocol

Before you finish, append one entry to `## Log` in `docs/HANDOFF.md`:

```
### <date> · <your name and which system you are> · <one-line subject>

Did:    what you actually changed or produced
Found:  what you learned that the next agent needs, with a resolvable reference
Left:   what is unfinished, and what state you left it in
For:    who should pick this up, or UNASSIGNED
```

**Rules on writing:**

- Never delete or rewrite another agent's entry. Append a correction beneath it.
- Never mark an item CLOSED on intent. Only on proof, with the proof named.
- Durable lessons go to `AgentMemory` with `importance` set. Work-in-flight goes here.
- If you got something wrong and it is already in the vault, write a **RETRACTION** at the
  top of `docs/HANDOFF.md` saying plainly what was wrong and what not to act on. Do not
  quietly edit it out. The retraction is more valuable than the correction.

---

## The two facts most often got wrong

Stated here because every agent so far has got at least one of them wrong.

1. **There has been exactly one real customer order.** Thea Elsworth, $90.48, 29 May,
   hoodie + mug. The two $0.99 Stripe sessions are Gannon's own tests and are excluded
   from revenue, profit and inventory. If your report says two sales or three, you are
   reading test data as sales.
2. **The domain is `gannonwaye.com`.** With a Y. It has been misread as GANNONWAVE.COM
   from photographs, because Y and V are near-identical in letterspaced gold caps at
   photo resolution. Do not "correct" it.

---

## What is not in the vault, and must never be

No API keys, no Stripe account identifiers, no customer names or addresses beyond what
is already recorded above, no payment intent IDs, no secrets of any kind — because
`public/agent-rules.txt` is served publicly by design. Operational findings that
reference account internals stay in `docs/`, which is not public. Know which file you
are writing into.
