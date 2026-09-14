import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const ROOT = resolve('.');
const failures = [];

function read(path) {
  const target = resolve(ROOT, path);
  if (!existsSync(target)) {
    failures.push(`${path} is missing.`);
    return '';
  }
  return readFileSync(target, 'utf8');
}

function requireSnippet(path, snippet) {
  if (!read(path).includes(snippet)) {
    failures.push(`${path} is missing required evidence: ${snippet}`);
  }
}

function forbid(path, pattern, label) {
  if (pattern.test(read(path))) {
    failures.push(`${path} contains forbidden Deego internal-lane capability: ${label}`);
  }
}

const immutableEntities = [
  'base44/entities/DeegoExecutionCommand.jsonc',
  'base44/entities/DeegoExecutionTask.jsonc',
  'base44/entities/DeegoTaskEvent.jsonc',
];

for (const path of immutableEntities) {
  requireSnippet(path, '"create": false');
  requireSnippet(path, '"update": false');
  requireSnippet(path, '"delete": false');
  requireSnippet(path, '"role": "admin"');
  requireSnippet(path, '"external_actions"');
}

requireSnippet('base44/functions/deegoInternalDispatcher/function.jsonc', '"name": "deegoInternalDispatcher"');
requireSnippet('base44/functions/deegoInternalDispatcher/function.jsonc', '"entry": "entry.ts"');
forbid('base44/functions/deegoInternalDispatcher/function.jsonc', /automations|is_active|scheduled/, 'automation configuration');

requireSnippet('base44/functions/deegoInternalDispatcher/entry.ts', "const MODE = 'controlled_internal_test'");
requireSnippet('base44/functions/deegoInternalDispatcher/entry.ts', "const ACTION = 'synthetic_internal_test'");
requireSnippet('base44/functions/deegoInternalDispatcher/entry.ts', "const CAPABILITY = 'internal_summary'");
requireSnippet('base44/functions/deegoInternalDispatcher/entry.ts', 'isExactOwner(user)');
requireSnippet('base44/functions/deegoInternalDispatcher/entry.ts', 'external_actions: 0');
requireSnippet('base44/functions/deegoInternalDispatcher/entry.ts', 'network_requests: 0');
requireSnippet('base44/functions/deegoInternalDispatcher/entry.ts', 'DeegoExecutionCommand.create');
requireSnippet('base44/functions/deegoInternalDispatcher/entry.ts', 'DeegoExecutionTask.create');
requireSnippet('base44/functions/deegoInternalDispatcher/entry.ts', 'DeegoTaskEvent.create');
requireSnippet('base44/functions/deegoInternalDispatcher/entry.ts', 'concurrent platform test pending');
forbid(
  'base44/functions/deegoInternalDispatcher/entry.ts',
  /fetch\(|connectors\.|integrations\.|Core\.SendEmail|InvokeLLM|GenerateImage|functions\.invoke|secrets\.|Deno\.cron|setInterval\(/,
  'network, connector, model, secret, nested-function, or scheduler code',
);

requireSnippet('base44/functions/deegoInternalDispatcher/policy.ts', "DEEGO_INTERNAL_POLICY_VERSION = 'deego-internal-v1'");
requireSnippet('base44/functions/deegoInternalDispatcher/policy.ts', "'internal_summary'");
forbid(
  'base44/functions/deegoInternalDispatcher/policy.ts',
  /'email'|'message'|'social_post'|'publish'|'distribution'|'submission'|'payment'|'refund'|'purchase'|'connector_access'|'network_request'|'schedule'/,
  'external capability allowlist',
);

const planningOnlyAgents = [
  'base44/agents/deego_master_ai.jsonc',
  'base44/agents/deego_content_interviewer.jsonc',
  'base44/agents/deego_design_hub_operator.jsonc',
  'base44/agents/deego_gannons_mix_direct_operator.jsonc',
  'base44/agents/deego_market_radar.jsonc',
  'base44/agents/deego_operations_controller.jsonc',
  'base44/agents/deego_profit_attribution_analyst.jsonc',
  'base44/agents/deego_sound_vault_operator.jsonc',
];

for (const path of planningOnlyAgents) {
  requireSnippet(path, '"tool_configs": []');
  forbid(path, /allowed_operations|function_name/, 'direct tool permissions');
}

requireSnippet('base44/entities/AgentTaskLog.jsonc', '"default": false');
requireSnippet('base44/entities/AgentTaskLog.jsonc', '"create": {');
requireSnippet('base44/entities/AgentTaskLog.jsonc', '"role": "admin"');

requireSnippet('src/pages/admin/AgentRegistry.jsx', 'This registry is descriptive only.');
forbid(
  'src/pages/admin/AgentRegistry.jsx',
  /base44\.entities\.AgentTaskLog\.create|All sub-systems online and verified|Activate Agent|Run Now|Fully safe to automate|Allowed to auto-run/,
  'unverified agent execution or activation control',
);

requireSnippet('src/pages/admin/AgentWorkbench.jsx', 'Held — no verified executor');
forbid('src/pages/admin/AgentWorkbench.jsx', /base44\.functions\.invoke|Run Now|Auto-runs/, 'legacy runner control');
requireSnippet('src/pages/admin/AgentIntelligence.jsx', 'Legacy automated runners are held.');
forbid('src/pages/admin/AgentIntelligence.jsx', /base44\.functions\.invoke\('autonomousResearch'|base44\.functions\.invoke\('autonomousTrendEngine'/, 'legacy research runner control');
requireSnippet('src/pages/admin/ContentDashboard.jsx', 'Legacy research and trend runners are held');
forbid('src/pages/admin/ContentDashboard.jsx', /base44\.functions\.invoke\('autonomousResearch'|base44\.functions\.invoke\('autonomousTrendEngine'/, 'legacy dashboard runner control');
requireSnippet('src/pages/admin/OrchestratorChat.jsx', 'Deego is planning-only:');
forbid('src/pages/admin/OrchestratorChat.jsx', /Start \/execution mode|Run daily_money_radar/, 'false Deego execution prompt');
requireSnippet('src/components/admin/dashboard/DeegoRecommendations.jsx', 'no work has started or been sent.');
requireSnippet('src/pages/admin/AgentMessageBus.jsx', 'Internal Agent Message Ledger');
requireSnippet('src/pages/admin/AutomationAgentsHub.jsx', 'No verified executor or cross-agent relay is active');
forbid('src/pages/admin/AutomationAgentsHub.jsx', /Invoke Agent|Scheduled cron check|Dispatched tasks to/, 'fabricated execution evidence');
requireSnippet('src/pages/admin/AgentToolRegistry.jsx', 'This page is not an executor or policy-enforcement layer.');
forbid('src/pages/admin/AgentToolRegistry.jsx', /Safe to Auto-run|→ Execute →/, 'false tool-execution claim');
requireSnippet('src/pages/admin/ResearchGrid.jsx', 'Legacy automatic research is held.');

if (failures.length > 0) {
  console.error('Deego internal-lane check failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('Deego internal lane source safeguards verified.');
