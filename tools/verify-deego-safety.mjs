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

function assertAutomationSafetyHold() {
  for (const target of listFiles('base44/functions').filter(file => file.endsWith('function.jsonc'))) {
    if (readFileSync(target, 'utf8').includes('"is_active": true')) {
      failures.push(`${relative(ROOT, target)} has an active function automation outside the safety hold.`);
    }
  }
  for (const target of listFiles('base44/workflows').filter(file => file.endsWith('.jsonc'))) {
    if (readFileSync(target, 'utf8').includes('"condition": null')) {
      failures.push(`${relative(ROOT, target)} has an enabled legacy workflow trigger outside the safety hold.`);
    }
  }
}

const required = [
  ['base44/functions/agentIntelligenceLoop/entry.ts', 'Authenticated owner session required.'],
  ['base44/functions/agentIntelligenceLoop/function.jsonc', '"is_active": false'],
  ['base44/workflows/Deego Heartbeat  -  Every 30 Minutes.jsonc', '"condition": "${ false }"'],
  ['base44/workflows/Agent Intelligence Loop  -  Every 4 Hours.jsonc', '"condition": "${ false }"'],
  ['base44/functions/autonomousAlertSystem/function.jsonc', '"is_active": false'],
  ['base44/functions/autonomousAlertSystem/entry.ts', 'state_fingerprint'],
  ['base44/functions/autonomousAlertSystem/entry.ts', 'No material Deego state change since the last audit.'],
  ['src/pages/admin/FinalSystemStatus.jsx', 'Paused pending owner test'],
  ['src/pages/admin/AgentRevenueStatus.jsx', 'Manual owner-only; automated schedule paused'],
  ['src/pages/admin/AgentRevenueStatus.jsx', "invokeArgs: { mode: 'admin_supervisor' }"],
  ['base44/functions/executiveMorningBrief/function.jsonc', '"is_active": false'],
  ['base44/workflows/Deego Morning Brief — 6am.jsonc', '"condition": "${ false }"'],
  ['base44/functions/executiveMorningBrief/entry.ts', 'Executive brief requires Gannon owner sign-in.'],
  ['base44/functions/executiveMorningBrief/entry.ts', 'No Slack, email, post, or external delivery is allowed from this function.'],
  ['src/pages/admin/AgentRevenueStatus.jsx', 'Manual owner-only; automatic delivery paused'],
  ['src/pages/admin/AgentRevenueStatus.jsx', 'This uses AI quota and creates only internal records.'],
];

const forbidden = [
  ['src/pages/admin/FinalSystemStatus.jsx', 'agentProposalScanner, growthOpportunityScanner, agentIntelligenceLoop all running daily'],
  ['src/pages/admin/AgentRevenueStatus.jsx', "purpose: 'Researches topics, saves insights to KnowledgeVault'"],
  ['base44/functions/executiveMorningBrief/entry.ts', 'sendSlackAlert'],
  ['base44/functions/executiveMorningBrief/entry.ts', 'was_automatic: true'],
];

for (const [path, snippet] of required) {
  if (!read(path).includes(snippet)) {
    failures.push(`${path} is missing required Deego safety or status-truth guard: ${snippet}`);
  }
}

for (const [path, snippet] of forbidden) {
  if (read(path).includes(snippet)) {
    failures.push(`${path} contains a stale Deego operational claim: ${snippet}`);
  }
}

assertAutomationSafetyHold();

if (failures.length) {
  console.error('Deego safety and status-truth check failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('Deego safety and status-truth check verified.');
