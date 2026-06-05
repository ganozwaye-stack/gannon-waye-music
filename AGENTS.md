# AI Agent Development Guidelines & Rules

Welcome to the Gannon Waye Music repository. This project uses AI agents (including Codex, Claude Code, and cursor agents) to manage, upgrade, and test the codebase. All agents must strictly follow these rules to ensure safety, security, stability, and brand compliance.

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
