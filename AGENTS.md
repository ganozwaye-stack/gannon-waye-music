# AI Agent Development Guidelines & Rules

Welcome to the Gannon Waye Music repository. This project uses AI agents (including Codex, Claude Code, and cursor agents) to manage, upgrade, and test the codebase. All agents must strictly follow these rules to ensure safety, security, stability, and brand compliance.

---

## 0. STOP — READ THE VAULT FIRST

**Before anything else in this file, read [`docs/VAULT.md`](docs/VAULT.md).**

It is the single entry point shared by every agent working on this business — Codex,
Claude, Deego, the Base44 fleet, and any external assistant. It tells you what exists,
what order to read it in, what has been retracted, and how to write back what you learn.

The constitution it points to is also served publicly at
**https://gannonwaye.com/agent-rules.txt** (source: `public/agent-rules.txt`) so that
assistants with no repository access can still be bound by the same rules.

Two facts that are got wrong more often than any others, repeated here so they are
unmissable:

- **One real customer order exists.** The two $0.99 Stripe sessions are owner tests.
- **The domain is `gannonwaye.com`, with a Y.** Do not "correct" it from a photograph.

---

## 1. Git Workflow & Approval Rules

* **Single Source of Truth:** GitHub is the single source of truth.
* **No Direct Pushing:** Never push directly to `main` or `master`. All updates must be made through branches and Pull Requests (PRs).
* **PR Process:** 
  1. Create a new branch with a clean naming convention (e.g., `bugfix/`, `feature/`, or `upgrade/`).
  2. Open a Pull Request with a clear, concise summary of changes, files modified, test evidence, risks, and manual verification steps.
  3. Wait for Gannon's manual review/approval or the agent approval pipeline before merging.
* **One Issue at a Time:** Use GitHub Issues to track bugs and tasks. Create and fix issues one PR at a time.

---

## 2. Safety & "Do Not" Rules

* **DO NOT Expose Secrets:** Never hardcode API keys, client secrets, passwords, or tokens in source files or environment configuration files committed to Git.
* **GitHub Secrets Only:** Add any required configuration variables as GitHub Repository Settings Secrets or load them from non-committed `.env.local` files.
* **DO NOT Charge Stripe Live Accounts:** Never process real money, modify live Stripe pricing structures, or switch environments to live mode without explicit Gannon approval. Use Stripe Sandbox/Test Mode.
* **DO NOT Auto-Publish Social Posts:** Agents may generate and queue social media posts, captions, and visual prompts, but **must not** publish directly. All content must go to the Approval Queue first.
* **DO NOT Delete User Data:** Never run scripts or modify models that truncate, delete, or wipe user accounts, orders, fan activity, or memorial tribute data.
* **DO NOT Bypass Approval Queues:** Bypassing moderation or publishing content without approval is strictly forbidden.
* **DO NOT Run Unofficial Packages:** Avoid unofficial, unverified Codex or agent packages/apps to prevent credential theft.
* **CANONICAL BASE44 APP ONLY:** The production app ID is `69eb7905ca6eb4180010f794`. Never use `base44 eject` for download, backup, inspection, or development: Base44's eject command creates a new cloud app named `Copy` and rewrites the local binding to that clone. Do not run `base44 create` or `base44 link --create` unless Gannon explicitly requests a genuinely new app. Deploy the public site only with `npm run deploy`, which refuses any other app ID. Use connector reads, checkpoints, or the canonical repository for inspection and backup.
* **PERMANENT STOREFRONT WORLD LOCK:** The boutique world identified by `gannon-waye-boutique-world-v1` is an owner-locked permanent asset. No agent, automation, redesign, migration, theme change or product workflow may replace, move, crop, hide, regenerate or remove it from `/store`. Public prices, sizes, stock and checkout identifiers must come only from verified live `MerchProduct` records. Run `npm run test:storefront-lock` before every build. Only a new explicit written instruction from Gannon that names this lock may amend it.

---

## 3. Naming Rules

* **Branches:** Prefix with lowercase types:
  * `bugfix/issue-description` for bug fixes.
  * `feature/new-capability` for new pages or components.
  * `upgrade/platform-overhaul` for design system and architectural modifications.
* **Commits:** Follow semantic-ish patterns:
  * `fix: correct Instagram handle links in footer`
  * `feat: add support drawer and tipping modal`
  * `perf: lazy load large components on Dashboard`

---

## 4. Operational Requirements

* **Performance:** Ensure fast load times, query pagination, and skeleton loading screens for all dashboards.
* **Global Clickability:** Every card, metric tile, row item, and agent action must click through to its specific source/detail view.
* **Aesthetics:** The interface must feel cinematic, luxury, premium, and emotionally immersive (focusing on healing, grief, survival, and community).

---

## 5. Contact & Support
If any issue or test failure arises that you cannot resolve autonomously, stop work immediately and notify Gannon via a GitHub issue or the chat interface. Do not force override failing tests.

---

## 8. Cross-Agent Handoff Protocol

Multiple agents work on this repo and they cannot talk to each other directly. Claude (via Cowork/MCP) and Codex (via repo access) coordinate through one file. Gannon should not have to carry messages between them.

**Every agent, at the start of a session:**

1. Read `docs/HANDOFF.md` before doing anything else. It carries open findings, evidence, and who owns what.
2. Treat items marked `OPEN` as live work. Do not re-investigate items marked `CLOSED` — read the evidence line instead.

**Every agent, at the end of a session:**

3. Append your entry under `## Log`, newest first, using this shape:

   ```
   ### YYYY-MM-DD · <agent name>
   Did:      <what actually changed, with file paths or record ids>
   Found:    <new findings, with evidence — ids, URLs, counts>
   Left:     <what you did not finish and why>
   For:      <which agent or Gannon owns the next step>
   ```

4. Move any item you resolved from `OPEN` to `CLOSED`, and write the evidence that closes it. "Configured" is not evidence. A delivered event id, a passing test, a record id — those are evidence.

**Rules for the handoff file:**

* Never delete another agent's entry. Append only.
* Never mark something CLOSED on intent. Only on proof.
* If two agents disagree about a fact, both positions stay in the file until it is settled against a primary source.
* Durable rules and policies do not live here — they go in the `AgentMemory` entity, which is the long-term store. `HANDOFF.md` is for work in flight.


---

## 9. Owner Control, Fix First, and Rule Supervisor

### Standing authority

Gannon Waye is the final decision maker. Delegation never bypasses this file. A parent agent must pass these rules to every child agent and verify the child result before relying on it.

### Start gate

Before acting, classify the proposed action.

**GREEN:** The action is within Gannon's requested scope, costs nothing, uses no paid credits, is determinate, is reasonably reversible, and triggers no RED condition. Carry GREEN work through diagnosis, repair, and verification without repeatedly asking permission. This includes inspection, evidence gathering, drafting, local edits, creating or updating an approved repair branch, free testing, and preparation behind an approval gate.

**RED:** The action spends money or paid credits; publishes, posts, schedules, lists, sends externally, or contacts a customer; sets a price or financial commitment; issues a refund or transfers money; merges or deploys; deletes or destructively overwrites data; changes repository settings, accounts, credentials, permissions, or security controls; accepts a contract, licence, terms, or rights; or exposes private information. RED actions require Gannon's explicit approval for the exact action and target.

If classification is uncertain, classify it RED and stop.

Direct pushes to `main` or `master` remain forbidden. Branch work does not authorise a merge or deployment.

### Fix first rule

When Gannon asks to diagnose, repair, improve, or complete a task, do not stop after identifying the problem. Complete every available GREEN action, test the result, inspect for unintended effects, and bring back the strongest verified solution. If the only remaining step is RED, prepare it fully and stop at the approval gate.

### Mandatory owner briefing

Every substantive completion must lead with:

1. **Issue:** what was wrong.
2. **Evidence:** what proved it.
3. **Action taken:** what actually changed or was prepared.
4. **Current status:** what works now and what was verified.
5. **Solution:** why the action resolves the issue.
6. **Remaining blockers:** only unresolved items.
7. **Approval required:** the exact RED action, if any.

Never claim completion without a resolvable receipt. Distinguish completed work, prepared work, and recommendations.

### Rule supervisor

For multi-agent work, appoint one rule supervisor. The supervisor:

1. gives these controls to every participating agent;
2. reviews scope, cost, reversibility, privacy, and GREEN or RED classification;
3. stops conflicting or unauthorised actions;
4. records material actions in `governance/ADHERENCE_LOG.md`;
5. verifies that final claims match evidence.

The supervisor may stop work but may never approve a RED action for Gannon.

If a breach is detected, stop the affected work, preserve evidence, avoid compounding the change, and report the safest recovery path.
