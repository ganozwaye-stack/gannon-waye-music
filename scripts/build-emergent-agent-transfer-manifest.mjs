import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const root = process.cwd();
const agentsDir = path.join(root, 'base44', 'agents');
const outputPath = path.join(root, 'docs', 'EMERGENT_AGENT_TRANSFER_MANIFEST_2026-07-21.json');

const deployedInBase44 = new Set([
  'academic_writing_coach',
  'api_setup_assistant',
  'booking_revenue_agent',
  'content_revenue_agent',
  'email_revenue_agent',
  'fan_engagement_agent',
  'literature_researcher',
  'merch_sales_agent',
  'music_orchestrator',
  'orchestrator',
  'order_support',
  'partnership_agent',
  'pricing_optimiser',
  'qa_systems_auditor',
  'release_launch_agent',
  'revenue_orchestrator',
  'shipping_optimisation',
  'streaming_royalty_agent',
  'superfan_converter',
  'sync_licensing_agent',
]);

const waveOne = new Set([
  'approval_gate',
  'orchestrator',
  'music_orchestrator',
  'content_revenue_agent',
  'merch_sales_agent',
  'video_intake_agent',
  'scripting_caption_agent',
  'performance_learning_agent',
  'metricool_agent',
  'qa_systems_auditor',
  'security_secrets_agent',
]);

const waveTwo = new Set([
  'booking_revenue_agent',
  'email_revenue_agent',
  'fan_engagement_agent',
  'ganozmix_direct',
  'merch_visual_agent',
  'order_support',
  'partnership_agent',
  'pricing_optimiser',
  'release_launch_agent',
  'revenue_orchestrator',
  'shipping_optimisation',
  'social_grid_architect',
  'streaming_royalty_agent',
  'stripe_revenue_protection',
  'superfan_converter',
  'sync_licensing_agent',
]);

function migrationWave(name) {
  if (waveOne.has(name)) return 1;
  if (waveTwo.has(name)) return 2;
  return 3;
}

const agents = fs.readdirSync(agentsDir)
  .filter((file) => file.endsWith('.jsonc'))
  .sort()
  .map((file) => {
    const config = JSON.parse(fs.readFileSync(path.join(agentsDir, file), 'utf8'));
    return {
      name: config.name,
      source_file: `base44/agents/${file}`,
      base44_status: deployedInBase44.has(config.name) ? 'deployed' : 'github_only',
      emergent_status: 'import_ready',
      migration_wave: migrationWave(config.name),
      description: config.description,
      entity_permissions: (config.tool_configs || []).map((tool) => ({
        entity: tool.entity_name,
        operations: tool.allowed_operations || [],
      })),
      safety: {
        approval_required_for_publication: true,
        approval_required_for_spending: true,
        secrets_must_be_recreated_in_target: true,
      },
    };
  });

const manifest = {
  generated_at: new Date().toISOString(),
  source: {
    platform: 'Base44',
    app_id: '6a1d91c28109c1a7274f350a',
    deployed_agent_count_verified: deployedInBase44.size,
    github_agent_definition_count: agents.length,
    live_agent_registry_record_count_verified: 0,
    catalogue_template_count: 94,
    legacy_seed_definition_count: 118,
  },
  target: {
    platform: 'Emergent',
    import_mode: 'recreate_from_github_manifest',
    direct_base44_agent_import_supported: false,
  },
  controls: {
    default_agent_state: 'disabled',
    human_approval_gate_required: true,
    no_auto_publish: true,
    no_spend_or_financial_commitment: true,
    no_secrets_in_manifest: true,
  },
  approval_queue_producers: [
    {
      name: 'generateDailyDrafts',
      current_base44_schedule: 'daily',
      target_state: 'disabled_until_queue_qa_passes',
    },
    {
      name: 'autonomousTrendEngine',
      current_base44_schedule: 'daily',
      target_state: 'disabled_until_queue_qa_passes',
    },
  ],
  agents,
};

fs.writeFileSync(outputPath, `${JSON.stringify(manifest, null, 2)}\n`);
console.log(`Wrote ${agents.length} agent definitions to ${outputPath}`);
