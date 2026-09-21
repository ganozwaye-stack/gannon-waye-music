import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { relative, resolve } from 'node:path';

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

function listFiles(relativeDir) {
  const root = resolve(ROOT, relativeDir);
  if (!existsSync(root)) {
    failures.push(`${relativeDir} is missing.`);
    return [];
  }
  const files = [];
  const visit = (dir) => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const target = resolve(dir, entry.name);
      if (entry.isDirectory()) visit(target);
      else files.push(target);
    }
  };
  visit(root);
  return files;
}

// Workflows the owner has explicitly approved to run, recorded here with
// the approval date. Each must state that approval in its own description.
const OWNER_APPROVED_ACTIVE_WORKFLOWS = new Set([
  'base44/workflows/Deego Report → Master Spreadsheet.jsonc',
]);

function assertAutomationSafetyHold() {
  for (const target of listFiles('base44/functions').filter(file => file.endsWith('function.jsonc'))) {
    if (readFileSync(target, 'utf8').includes('"is_active": true')) {
      failures.push(`${relative(ROOT, target)} has an active function automation outside the safety hold.`);
    }
  }
  for (const target of listFiles('base44/workflows').filter(file => file.endsWith('.jsonc'))) {
    const content = readFileSync(target, 'utf8');
    const rel = relative(ROOT, target).replaceAll('\\', '/');
    if (OWNER_APPROVED_ACTIVE_WORKFLOWS.has(rel)) {
      if (!content.includes('Owner approved active')) {
        failures.push(`${rel} is on the owner-approved active list but does not record that approval in its description.`);
      }
      continue;
    }
    if (!content.includes('"condition": "${ false }"')) {
      failures.push(`${rel} has a workflow trigger that is not explicitly disabled by the safety hold.`);
    }
  }
}

function assertFunctionBoundarySafety() {
  const prohibitedSiblingImport = "from '../agentIntelligenceLoop/supervisor.mjs'";
  for (const target of listFiles('base44/functions').filter(file => file.endsWith('entry.ts'))) {
    if (readFileSync(target, 'utf8').includes(prohibitedSiblingImport)) {
      failures.push(`${relative(ROOT, target)} imports a sibling function helper that cannot be bundled for deployment.`);
    }
  }
}

function assertHeldAgentCard(dashboard, agentName, label) {
  const marker = `name: '${agentName}',`;
  const start = dashboard.indexOf(marker);
  const end = start === -1 ? -1 : dashboard.indexOf('\n  },', start);
  const card = start === -1 || end === -1 ? '' : dashboard.slice(start, end);
  if (!card.includes("status: 'Safety hold active'") || !card.includes('Safety hold active; not runnable') || !card.includes('disabled: true')) {
    failures.push(`${label} dashboard card must remain a disabled safety hold.`);
  }
}

function assertHeldAgentCards() {
  const dashboard = read('src/components/admin/agent-workbench/AgentRevenueStatus.jsx');
  assertHeldAgentCard(dashboard, 'GrowthOpportunityScanner', 'Growth Opportunity');
  assertHeldAgentCard(dashboard, 'ExecutiveMorningBrief', 'Executive Brief');
}

function assertHeldScannerPages() {
  const checks = [
    ['src/components/admin/ideas-family/GrowthEngine.jsx', '<Button disabled variant="outline"', 'Growth Engine'],
    ['src/pages/admin/IntelligenceToIncome.jsx', '<Button variant="outline" disabled>', 'Intelligence to Income'],
  ];
  for (const [path, disabledButton, label] of checks) {
    const page = read(path);
    if (!page.includes(disabledButton) || !page.includes('Safety hold active')) {
      failures.push(`${label} must show a disabled safety-hold control instead of a scanner runner.`);
    }
  }
}

function assertHeldWorkbench() {
  const workbench = read('src/pages/admin/AgentWorkbench.jsx');
  if (!workbench.includes('Held — no verified executor') || !workbench.includes('disabled')) {
    failures.push('Agent Workbench must keep its legacy-agent runner control disabled.');
  }
  if (workbench.includes('functions.invoke(')) {
    failures.push('Agent Workbench must not directly invoke legacy agents.');
  }
}

const required = [
  ['base44/functions/agentIntelligenceLoop/entry.ts', 'Authenticated owner session required.'],
  ['base44/functions/agentIntelligenceLoop/function.jsonc', '"is_active": false'],
  ['base44/workflows/Deego Heartbeat  -  Every 30 Minutes.jsonc', '"condition": "${ false }"'],
  ['base44/workflows/Agent Intelligence Loop  -  Every 4 Hours.jsonc', '"condition": "${ false }"'],

  ['base44/functions/autonomousAlertSystem/function.jsonc', '"is_active": false'],
  ['base44/functions/autonomousAlertSystem/entry.ts', "const LEGACY_HOLD_CODE = 'legacy_operational_audit_held'"],
  ['base44/functions/autonomousAlertSystem/entry.ts', 'Legacy operational audit is held.'],
  ['base44/functions/autonomousAlertSystem/entry.ts', 'external_actions: 0'],
  ['base44/functions/autonomousAlertSystem/entry.ts', 'network_requests: 0'],

  ['base44/functions/agentSelfImprovement/function.jsonc', '"is_active": false'],
  ['base44/functions/agentSelfImprovement/entry.ts', "const LEGACY_HOLD_CODE = 'legacy_self_improvement_held'"],
  ['base44/functions/agentSelfImprovement/entry.ts', 'Legacy self-improvement work is held.'],
  ['base44/functions/agentSelfImprovement/entry.ts', 'skipped: true'],
  ['base44/functions/agentSelfImprovement/entry.ts', 'external_actions: 0'],
  ['base44/functions/agentSelfImprovement/entry.ts', 'network_requests: 0'],

  ['base44/functions/deegoTelegram/entry.ts', "channel_key: 'telegram_owner'"],
  ['base44/functions/deegoTelegram/entry.ts', "config.send_enabled !== true"],
  ['base44/functions/deegoTelegram/entry.ts', "config.credentials_configured !== true"],
  ['base44/functions/deegoTelegram/entry.ts', "config.destination_configured !== true"],
  ['base44/functions/deegoTelegram/entry.ts', 'approvalMatchesDraft'],
  ['base44/functions/deegoTelegram/entry.ts', 'MessagingApprovalReceipt'],
  ['base44/functions/deegoTelegram/entry.ts', "provider_status: 'claimed'"],
  ['base44/functions/deegoTelegram/entry.ts', 'send_request_id: sendRequestId'],
  ['base44/functions/deegoTelegram/entry.ts', 'will not retry automatically'],

  ['base44/functions/executiveMorningBrief/function.jsonc', '"automations": []'],
  ['base44/workflows/Executive Morning Brief (Daily 7am).jsonc', '"condition": "${ false }"'],
  ['base44/workflows/Deego Morning Brief — 6am.jsonc', '"condition": "${ false }"'],
  ['base44/functions/executiveMorningBrief/entry.ts', "const LEGACY_HOLD_CODE = 'legacy_executive_morning_brief_held'"],
  ['base44/functions/executiveMorningBrief/entry.ts', "req.method !== 'POST'"],
  ['base44/functions/executiveMorningBrief/entry.ts', 'Legacy executive briefing is held.'],
  ['base44/functions/executiveMorningBrief/entry.ts', 'skipped: true'],
  ['base44/functions/executiveMorningBrief/entry.ts', 'external_actions: 0'],
  ['base44/functions/executiveMorningBrief/entry.ts', 'network_requests: 0'],
  ['base44/functions/executiveMorningBrief/entry.ts', 'internal_records_created: 0'],
  ['base44/functions/executiveMorningBrief/entry.ts', 'status: 503'],

  ['base44/functions/growthOpportunityScanner/function.jsonc', '"automations": []'],
  ['base44/workflows/Revenue Opportunity Scan (Daily 7am).jsonc', '"condition": "${ false }"'],
  ['base44/workflows/Viral Opportunity Scan (2h).jsonc', '"condition": "${ false }"'],
  ['base44/functions/growthOpportunityScanner/entry.ts', "const LEGACY_HOLD_CODE = 'legacy_growth_opportunity_scanner_held'"],
  ['base44/functions/growthOpportunityScanner/entry.ts', "req.method !== 'POST'"],
  ['base44/functions/growthOpportunityScanner/entry.ts', 'Legacy growth scanning is held.'],
  ['base44/functions/growthOpportunityScanner/entry.ts', 'skipped: true'],
  ['base44/functions/growthOpportunityScanner/entry.ts', 'external_actions: 0'],
  ['base44/functions/growthOpportunityScanner/entry.ts', 'network_requests: 0'],
  ['base44/functions/growthOpportunityScanner/entry.ts', 'internal_records_created: 0'],
  ['base44/functions/growthOpportunityScanner/entry.ts', 'status: 503'],

  ['base44/functions/autonomousResearch/function.jsonc', '"is_active": false'],
  ['base44/workflows/Autonomous Research Agent — Hourly.jsonc', '"condition": "${ false }"'],
  ['base44/functions/autonomousResearch/entry.ts', 'skipped: true'],
  ['base44/functions/autonomousResearch/entry.ts', 'Safety hold: legacy autonomous research is disabled.'],
  ['base44/functions/autonomousResearch/entry.ts', 'status: 503'],

  ['base44/functions/autonomousTrendEngine/function.jsonc', '"is_active": false'],
  ['base44/workflows/Trend Engine — Daily Report.jsonc', '"condition": "${ false }"'],
  ['base44/functions/autonomousTrendEngine/entry.ts', 'skipped: true'],
  ['base44/functions/autonomousTrendEngine/entry.ts', 'Safety hold: legacy trend generation is disabled.'],
  ['base44/functions/autonomousTrendEngine/entry.ts', 'status: 503'],

  ['base44/workflows/Hourly System Alert Check.jsonc', '"mode": "legacy_hold"'],
  ['src/pages/admin/FinalSystemStatus.jsx', 'Paused pending owner test'],
  ['src/components/admin/agent-workbench/AgentRevenueStatus.jsx', "invokeArgs: { mode: 'admin_supervisor' }"],
  ['src/components/admin/release-studio/NewReleaseStudio.jsx', 'Create a private release draft and blank review shells.'],
  ['src/components/admin/release-studio/NewReleaseStudio.jsx', 'auto_publish_on_release_date: false'],
  ['src/components/admin/release-studio/NewReleaseStudio.jsx', 'private_draft_acknowledged: privateDraftAcknowledged'],
  ['base44/entities/Release.jsonc', 'New Release Studio never authorises automatic publication'],
  ['base44/entities/Release.jsonc', 'There is no automatic distributor sync'],
  ['DISASTER_RECOVERY.md', 'npm run deploy'],
  ['src/components/admin/agent-workbench/AgentRevenueStatus.jsx', 'const SAFETY_HOLD_ACTIVE = true;'],
  ['src/components/admin/agent-workbench/AgentRevenueStatus.jsx', 'disabled={isRunning || agent.disabled}'],
  ['src/components/admin/ideas-family/GrowthEngine.jsx', 'Safety hold active'],
  ['src/pages/admin/IntelligenceToIncome.jsx', 'Safety hold active'],
  ['base44/functions/agentProposalScanner/entry.ts', 'Ecommerce scan requires Gannon owner sign-in.'],
  ['base44/functions/agentProposalScanner/entry.ts', "body?.mode !== 'manual_internal_review'"],
  ['base44/functions/socialCommentMonitor/entry.ts', 'Social comment triage requires Gannon owner sign-in.'],
  ['base44/functions/socialCommentMonitor/entry.ts', "body?.mode !== 'manual_internal_review'"],
  ['base44/functions/submitNewRelease/entry.ts', 'body.private_draft_acknowledged !== true'],
  ['base44/functions/submitNewRelease/entry.ts', "external_actions: 'held'"],
];

const forbidden = [
  ['src/pages/admin/FinalSystemStatus.jsx', 'agentProposalScanner, growthOpportunityScanner, agentIntelligenceLoop all running daily'],
  ['src/components/admin/agent-workbench/AgentRevenueStatus.jsx', "purpose: 'Researches topics, saves insights to KnowledgeVault'"],
  ['base44/functions/executiveMorningBrief/entry.ts', 'createClientFromRequest'],
  ['base44/functions/executiveMorningBrief/entry.ts', 'asServiceRole'],
  ['base44/functions/executiveMorningBrief/entry.ts', 'Core.InvokeLLM'],
  ['base44/functions/executiveMorningBrief/entry.ts', '.entities.'],
  ['base44/functions/executiveMorningBrief/entry.ts', 'fetch('],
  ['base44/functions/executiveMorningBrief/entry.ts', 'Deno.env'],
  ['base44/functions/executiveMorningBrief/entry.ts', 'sendSlackAlert'],
  ['base44/functions/executiveMorningBrief/entry.ts', 'was_automatic: true'],
  ['base44/functions/growthOpportunityScanner/entry.ts', 'createClientFromRequest'],
  ['base44/functions/growthOpportunityScanner/entry.ts', 'asServiceRole'],
  ['base44/functions/growthOpportunityScanner/entry.ts', 'Core.InvokeLLM'],
  ['base44/functions/growthOpportunityScanner/entry.ts', '.entities.'],
  ['base44/functions/growthOpportunityScanner/entry.ts', 'fetch('],
  ['base44/functions/growthOpportunityScanner/entry.ts', 'Deno.env'],
  ['base44/functions/autonomousResearch/entry.ts', 'fetch('],
  ['base44/functions/autonomousResearch/entry.ts', 'Deno.env'],
  ['base44/functions/autonomousResearch/entry.ts', 'createClientFromRequest'],
  ['base44/functions/autonomousResearch/entry.ts', 'asServiceRole'],
  ['base44/functions/autonomousResearch/entry.ts', 'Core.InvokeLLM'],
  ['base44/functions/autonomousResearch/entry.ts', '.entities.'],
  ['base44/functions/autonomousTrendEngine/entry.ts', 'fetch('],
  ['base44/functions/autonomousTrendEngine/entry.ts', 'Deno.env'],
  ['base44/functions/autonomousTrendEngine/entry.ts', 'createClientFromRequest'],
  ['base44/functions/autonomousTrendEngine/entry.ts', 'asServiceRole'],
  ['base44/functions/autonomousTrendEngine/entry.ts', 'Core.InvokeLLM'],
  ['base44/functions/autonomousTrendEngine/entry.ts', '.entities.'],
  ['src/components/admin/ideas-family/GrowthEngine.jsx', "functions.invoke('growthOpportunityScanner'"],
  ['src/pages/admin/IntelligenceToIncome.jsx', "functions.invoke('growthOpportunityScanner'"],
  ['src/components/admin/release-studio/NewReleaseStudio.jsx', 'Go live automatically at midnight on release day'],
  ['src/components/admin/release-studio/NewReleaseStudio.jsx', 'synced to Too Lost, and scheduled to go live'],
  ['base44/entities/Release.jsonc', 'publish this release publicly at midnight on its release date'],
  ['base44/entities/Release.jsonc', "'created' means it was synced at New Release Studio submission"],
  ['DISASTER_RECOVERY.md', 'npx base44 deploy'],
  ['base44/functions/autonomousAlertSystem/entry.ts', 'fetch('],
  ['base44/functions/autonomousAlertSystem/entry.ts', 'connectors.'],
  ['base44/functions/autonomousAlertSystem/entry.ts', 'KnowledgeVault'],
  ['base44/functions/autonomousAlertSystem/entry.ts', 'AdminNotification'],
  ['base44/functions/autonomousAlertSystem/entry.ts', 'DeegoAutomationRun'],
  ['base44/functions/autonomousAlertSystem/entry.ts', 'createClientFromRequest'],
  ['base44/functions/autonomousAlertSystem/entry.ts', 'asServiceRole'],
  ['base44/functions/agentSelfImprovement/entry.ts', 'createClientFromRequest'],
  ['base44/functions/agentSelfImprovement/entry.ts', 'asServiceRole'],
  ['base44/functions/agentSelfImprovement/entry.ts', 'Core.InvokeLLM'],
  ['base44/functions/agentSelfImprovement/entry.ts', 'KnowledgeVault'],
  ['base44/functions/agentSelfImprovement/entry.ts', 'AgentTaskLog'],
  ['base44/functions/agentSelfImprovement/entry.ts', 'AgentLearningRecord'],
  ['base44/functions/deegoTelegram/entry.ts', 'Core.SendEmail'],
  ['base44/functions/deegoTelegram/entry.ts', 'InvokeLLM'],
  ['base44/functions/deegoTelegram/entry.ts', 'GenerateImage'],
  ['base44/workflows/Hourly System Alert Check.jsonc', 'sends Slack alerts'],
];

for (const [path, snippet] of required) {
  if (!read(path).includes(snippet)) {
    failures.push(`${path} is missing required Deego safety or status-truth guard: ${snippet}`);
  }
}

for (const [path, snippet] of forbidden) {
  if (read(path).includes(snippet)) {
    failures.push(`${path} contains a stale Deego operational claim or capability: ${snippet}`);
  }
}

assertAutomationSafetyHold();
assertFunctionBoundarySafety();
assertHeldAgentCards();
assertHeldScannerPages();
assertHeldWorkbench();

if (failures.length) {
  console.error('Deego safety and status-truth check failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('Deego safety and status-truth check verified.');