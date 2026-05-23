import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Search, CheckCircle2, XCircle, AlertTriangle, Info, ExternalLink, ChevronRight, Filter } from 'lucide-react';

// ─── OPERATION STATUS STYLES ────────────────────────────────────────────────
const STATUS_STYLES = {
  'Working': 'bg-green-500/15 text-green-300 border-green-500/30',
  'Fixed': 'bg-green-500/15 text-green-300 border-green-500/30',
  'Verified': 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30',
  'Broken': 'bg-red-500/15 text-red-300 border-red-500/30',
  'Missing Destination': 'bg-red-500/15 text-red-300 border-red-500/30',
  'Static But Should Be Clickable': 'bg-orange-500/15 text-orange-300 border-orange-500/30',
  'Dead End': 'bg-red-500/15 text-red-300 border-red-500/30',
  'Needs Source Chain': 'bg-yellow-500/15 text-yellow-300 border-yellow-500/30',
  'Needs Back Button': 'bg-yellow-500/15 text-yellow-300 border-yellow-500/30',
  'Needs Detail View': 'bg-yellow-500/15 text-yellow-300 border-yellow-500/30',
  'Needs Approval Flow': 'bg-yellow-500/15 text-yellow-300 border-yellow-500/30',
  'Needs Data Connection': 'bg-orange-500/15 text-orange-300 border-orange-500/30',
  'Informational Only': 'bg-secondary text-muted-foreground',
};

const STATUS_ICON = {
  'Working': <CheckCircle2 className="w-3 h-3" />,
  'Fixed': <CheckCircle2 className="w-3 h-3" />,
  'Verified': <CheckCircle2 className="w-3 h-3" />,
  'Broken': <XCircle className="w-3 h-3" />,
  'Missing Destination': <XCircle className="w-3 h-3" />,
  'Static But Should Be Clickable': <AlertTriangle className="w-3 h-3" />,
  'Dead End': <XCircle className="w-3 h-3" />,
  'Needs Source Chain': <AlertTriangle className="w-3 h-3" />,
  'Needs Back Button': <AlertTriangle className="w-3 h-3" />,
  'Needs Detail View': <AlertTriangle className="w-3 h-3" />,
  'Needs Approval Flow': <AlertTriangle className="w-3 h-3" />,
  'Needs Data Connection': <AlertTriangle className="w-3 h-3" />,
  'Informational Only': <Info className="w-3 h-3" />,
};

// ─── PAGE REGISTRY ────────────────────────────────────────────────────────────
const PAGES = [
  // EXECUTIVE
  {
    page: 'Dashboard', route: '/admin', section: 'Executive', purpose: 'Main admin overview — KPIs, recent activity, quick links',
    operations: [
      { name: 'Notification Bell', type: 'Link', status: 'Working', action: 'Opens /admin/notifications' },
      { name: 'Quick stat cards', type: 'Card', status: 'Needs Source Chain', action: 'Should open underlying records' },
      { name: 'Recent Activity rows', type: 'Row', status: 'Needs Detail View', action: 'Should open detail for each record' },
      { name: 'Breadcrumb — Admin', type: 'Link', status: 'Working', action: 'Returns to /admin' },
    ],
  },
  {
    page: 'Notifications / Business Attention Centre', route: '/admin/notifications', section: 'Executive', purpose: 'Central hub for all system alerts, approvals, and attention items',
    operations: [
      { name: 'Unread tab', type: 'Tab', status: 'Working', action: 'Filters unread notifications' },
      { name: 'Needs Action tab', type: 'Tab', status: 'Working', action: 'Filters action-required items' },
      { name: 'Research tab', type: 'Tab', status: 'Working', action: 'Filters research notifications' },
      { name: 'System tab', type: 'Tab', status: 'Working', action: 'Filters system notifications' },
      { name: 'Notification row click', type: 'Row', status: 'Working', action: 'Opens notification detail modal' },
      { name: 'Mark as Read button', type: 'Button', status: 'Working', action: 'Marks notification read' },
      { name: 'Navigate to linked record', type: 'Link', status: 'Working', action: 'Follows linked_route' },
      { name: 'Severity badge (Critical/High/Warning/Info)', type: 'Badge', status: 'Static But Should Be Clickable', action: 'Should filter by severity' },
      { name: 'Summary stat cards', type: 'Card', status: 'Needs Source Chain', action: 'Should filter to matching records' },
    ],
  },
  {
    page: 'Approval Queue', route: '/admin/approval-queue', section: 'Executive', purpose: 'Review and approve/reject agent-generated action proposals',
    operations: [
      { name: 'Pending tab', type: 'Tab', status: 'Working', action: 'Shows pending items' },
      { name: 'Approved tab', type: 'Tab', status: 'Working', action: 'Shows approved items' },
      { name: 'Rejected tab', type: 'Tab', status: 'Working', action: 'Shows rejected items' },
      { name: 'Proposal row click', type: 'Row', status: 'Working', action: 'Opens detail modal' },
      { name: 'Approve button', type: 'Button', status: 'Working', action: 'Sets status to approved' },
      { name: 'Reject button', type: 'Button', status: 'Working', action: 'Sets status to rejected' },
      { name: 'Risk badge', type: 'Badge', status: 'Static But Should Be Clickable', action: 'Should filter by risk level' },
      { name: 'Agent name', type: 'Label', status: 'Static But Should Be Clickable', action: 'Should open agent detail' },
      { name: 'Long content scroll', type: 'Scroll', status: 'Working', action: 'Scrollable content area' },
      { name: 'Source chain trace', type: 'Link', status: 'Working', action: 'Shows proposal source' },
    ],
  },
  {
    page: 'Agent Task Log', route: '/admin/agent-task-log', section: 'Intelligence', purpose: 'Full audit trail of all agent actions',
    operations: [
      { name: 'All tab', type: 'Tab', status: 'Fixed', action: 'Shows all logs' },
      { name: 'Auto tab', type: 'Tab', status: 'Fixed', action: 'Filters automatic tasks' },
      { name: 'Approved tab', type: 'Tab', status: 'Fixed', action: 'Filters manually approved tasks' },
      { name: 'Pass tab', type: 'Tab', status: 'Fixed', action: 'Filters pass results' },
      { name: 'Blocked tab', type: 'Tab', status: 'Fixed', action: 'Filters blocked results' },
      { name: 'Escalated tab', type: 'Tab', status: 'Fixed', action: 'Filters escalated results' },
      { name: 'Task row click', type: 'Row', status: 'Fixed', action: 'Opens full task detail modal' },
      { name: 'Auto badge click', type: 'Badge', status: 'Fixed', action: 'Filters to auto tasks' },
      { name: 'Pass/fail badge click', type: 'Badge', status: 'Fixed', action: 'Filters to that result' },
      { name: 'Agent name click', type: 'Label', status: 'Fixed', action: 'Opens task detail' },
      { name: 'Source label click', type: 'Label', status: 'Fixed', action: 'Opens task detail with source chain' },
      { name: 'Date click', type: 'Label', status: 'Fixed', action: 'Resets filter (date filtering in detail)' },
      { name: 'Search bar', type: 'Search', status: 'Fixed', action: 'Filters tasks by title/agent/outcome/source' },
      { name: 'Back button in detail', type: 'Button', status: 'Fixed', action: 'Closes modal, returns to list' },
      { name: 'Source chain in detail', type: 'Link', status: 'Fixed', action: 'Shows recursive source chain' },
      { name: 'Related record links', type: 'Link', status: 'Fixed', action: 'Navigate to KnowledgeVault, ResearchGrid, etc.' },
      { name: 'Full report content', type: 'Content', status: 'Fixed', action: 'Scrollable full report in detail modal' },
    ],
  },
  {
    page: 'Executive Feed', route: '/admin/executive-feed', section: 'Executive', purpose: 'Daily intelligence summary and agent activity briefing',
    operations: [
      { name: 'Intelligence card click', type: 'Card', status: 'Needs Source Chain', action: 'Should open source record' },
      { name: 'Trigger Brief button', type: 'Button', status: 'Working', action: 'Triggers morning brief function' },
      { name: 'Summary metrics', type: 'Card', status: 'Needs Source Chain', action: 'Should filter to underlying records' },
    ],
  },
  {
    page: 'Audit Log', route: '/admin/audit-log', section: 'Executive', purpose: 'System-wide audit trail of all changes',
    operations: [
      { name: 'Audit row click', type: 'Row', status: 'Needs Detail View', action: 'Should open full audit record' },
      { name: 'Filter by entity', type: 'Filter', status: 'Working', action: 'Filters by entity type' },
      { name: 'Search log', type: 'Search', status: 'Working', action: 'Searches audit entries' },
    ],
  },
  {
    page: 'Growth Engine', route: '/admin/growth-engine', section: 'Executive', purpose: 'Growth opportunity management and tracking',
    operations: [
      { name: 'Opportunity card click', type: 'Card', status: 'Needs Detail View', action: 'Should open opportunity detail' },
      { name: 'Status badge', type: 'Badge', status: 'Static But Should Be Clickable', action: 'Should filter by status' },
      { name: 'Platform badge', type: 'Badge', status: 'Static But Should Be Clickable', action: 'Should filter by platform' },
      { name: 'Trigger Scan button', type: 'Button', status: 'Working', action: 'Runs growth scanner function' },
    ],
  },
  {
    page: 'Risk Alerts', route: '/admin/risk-alerts', section: 'Executive', purpose: 'Monitor and manage system risk alerts',
    operations: [
      { name: 'Risk row click', type: 'Row', status: 'Needs Detail View', action: 'Should open risk detail' },
      { name: 'Severity badge', type: 'Badge', status: 'Static But Should Be Clickable', action: 'Should filter by severity' },
      { name: 'Resolve button', type: 'Button', status: 'Working', action: 'Marks alert resolved' },
    ],
  },
  {
    page: 'Site Health', route: '/admin/site-health', section: 'Executive', purpose: 'Monitor platform health checks and system issues',
    operations: [
      { name: 'Health item click', type: 'Row', status: 'Needs Detail View', action: 'Should open health detail' },
      { name: 'Run Health Check button', type: 'Button', status: 'Working', action: 'Triggers automatedSiteTests function' },
      { name: 'Status badge', type: 'Badge', status: 'Static But Should Be Clickable', action: 'Should filter by status' },
    ],
  },
  // COMMERCE
  {
    page: 'Orders', route: '/admin/orders', section: 'Commerce', purpose: 'View and manage merch orders',
    operations: [
      { name: 'Order row click', type: 'Row', status: 'Working', action: 'Opens order detail' },
      { name: 'Status filter tabs', type: 'Tab', status: 'Working', action: 'Filters by order status' },
      { name: 'Customer name click', type: 'Label', status: 'Needs Source Chain', action: 'Should open supporter profile' },
      { name: 'Search orders', type: 'Search', status: 'Working', action: 'Searches order records' },
      { name: 'Mark Shipped button', type: 'Button', status: 'Working', action: 'Updates order status' },
    ],
  },
  {
    page: 'Products / Merch Management', route: '/admin/merch', section: 'Commerce', purpose: 'Manage merch product catalogue',
    operations: [
      { name: 'Product row/card click', type: 'Card', status: 'Needs Detail View', action: 'Should open product detail' },
      { name: 'Add Product button', type: 'Button', status: 'Working', action: 'Opens create form' },
      { name: 'Edit button', type: 'Button', status: 'Working', action: 'Opens edit form' },
      { name: 'Category badge', type: 'Badge', status: 'Static But Should Be Clickable', action: 'Should filter by category' },
      { name: 'Active/Inactive toggle', type: 'Toggle', status: 'Working', action: 'Toggles product visibility' },
    ],
  },
  {
    page: 'Promo Codes', route: '/admin/promo-codes', section: 'Commerce', purpose: 'Manage promotional discount codes',
    operations: [
      { name: 'Promo row click', type: 'Row', status: 'Needs Detail View', action: 'Should open promo detail with usage stats' },
      { name: 'Create Promo button', type: 'Button', status: 'Working', action: 'Opens create form' },
      { name: 'Active/Inactive badge', type: 'Badge', status: 'Static But Should Be Clickable', action: 'Should filter by status' },
      { name: 'Times used metric', type: 'Metric', status: 'Needs Source Chain', action: 'Should show orders using this code' },
    ],
  },
  {
    page: 'Revenue Command Centre', route: '/admin/revenue-command', section: 'Commerce', purpose: 'Central revenue opportunity management',
    operations: [
      { name: 'Opportunity row click', type: 'Row', status: 'Working', action: 'Opens detail modal' },
      { name: 'Status filter tabs', type: 'Tab', status: 'Working', action: 'Filters by status' },
      { name: 'Agent filter', type: 'Filter', status: 'Working', action: 'Filters by agent' },
      { name: 'Revenue type badge', type: 'Badge', status: 'Static But Should Be Clickable', action: 'Should filter by revenue type' },
      { name: 'Estimated value metric', type: 'Metric', status: 'Needs Source Chain', action: 'Should show source calculation' },
    ],
  },
  {
    page: 'Ecommerce Command', route: '/admin/ecommerce-command', section: 'Commerce', purpose: 'Ecommerce overview and quick actions',
    operations: [
      { name: 'Revenue card click', type: 'Card', status: 'Needs Source Chain', action: 'Should open revenue breakdown' },
      { name: 'Orders link', type: 'Link', status: 'Working', action: 'Goes to /admin/orders' },
      { name: 'Products link', type: 'Link', status: 'Working', action: 'Goes to /admin/merch' },
    ],
  },
  {
    page: 'Merch Feedback', route: '/admin/merch-feedback', section: 'Commerce', purpose: 'Review fan feedback on merch products',
    operations: [
      { name: 'Feedback row click', type: 'Row', status: 'Needs Detail View', action: 'Should open feedback detail' },
      { name: 'Status filter', type: 'Tab', status: 'Working', action: 'Filters by status' },
      { name: 'Rating badge', type: 'Badge', status: 'Static But Should Be Clickable', action: 'Should filter by rating' },
      { name: 'Mark Reviewed button', type: 'Button', status: 'Working', action: 'Updates feedback status' },
    ],
  },
  // SOCIAL / TIKTOK
  {
    page: 'TikTok App Review', route: '/admin/tiktok-review', section: 'Social', purpose: 'TikTok Developer review readiness checklist and scope matching',
    operations: [
      { name: 'Product row click', type: 'Row', status: 'Fixed', action: 'Opens product detail modal' },
      { name: 'Scope row click', type: 'Row', status: 'Fixed', action: 'Opens scope detail modal' },
      { name: 'Checklist item click', type: 'Row', status: 'Fixed', action: 'Toggles done + opens detail' },
      { name: 'Copy buttons', type: 'Button', status: 'Fixed', action: 'Copies value to clipboard' },
      { name: 'Readiness score bar', type: 'Metric', status: 'Fixed', action: 'Shows % complete' },
      { name: 'Scope warnings', type: 'Alert', status: 'Fixed', action: 'Shows remove-before-submission warnings' },
      { name: 'Recommended config', type: 'Card', status: 'Fixed', action: 'Shows fastest-approval scope set' },
      { name: 'Quick links', type: 'Link', status: 'Fixed', action: 'Opens TikTok portal, docs, policies' },
      { name: 'Language guide (safe/unsafe)', type: 'Info', status: 'Fixed', action: 'Lists safe and unsafe phrases' },
      { name: 'Security warning', type: 'Alert', status: 'Fixed', action: 'Warns about client secret exposure' },
    ],
  },
  {
    page: 'TikTok Screen Guide', route: '/admin/tiktok-screen-guide', section: 'Social', purpose: 'Step-by-step screen recording guide for TikTok review demo',
    operations: [
      { name: 'Part 1–8 step cards', type: 'Card', status: 'Fixed', action: 'Display recording instructions per section' },
      { name: 'Part 8 (TikTok workflow)', type: 'Card', status: 'Fixed', action: 'Required TikTok integration demo steps' },
      { name: 'Copy Voiceover button', type: 'Button', status: 'Fixed', action: 'Copies TikTok voiceover script' },
      { name: 'Related page links', type: 'Link', status: 'Fixed', action: 'Navigate to TikTok Review, Recording Studio, etc.' },
      { name: 'Voiceover cue cards', type: 'Card', status: 'Fixed', action: 'Shows cue + line for each section' },
      { name: 'Study Pals link', type: 'Button', status: 'Working', action: 'Opens /admin/orchestrator-chat' },
    ],
  },
  {
    page: 'TikTok Recording Studio', route: '/admin/tiktok-recording-studio', section: 'Social', purpose: 'Guided screen recording helper with MediaRecorder',
    operations: [
      { name: 'Start Recording button', type: 'Button', status: 'Fixed', action: 'Requests screen capture, starts MediaRecorder' },
      { name: 'Stop Recording button', type: 'Button', status: 'Fixed', action: 'Stops recorder, creates preview' },
      { name: 'Pause/Resume button', type: 'Button', status: 'Fixed', action: 'Pauses/resumes MediaRecorder' },
      { name: 'Recording timer', type: 'Metric', status: 'Fixed', action: 'Shows elapsed recording time' },
      { name: 'Step guide Next/Prev', type: 'Button', status: 'Fixed', action: 'Navigates guided recording steps' },
      { name: 'Step progress tabs', type: 'Tab', status: 'Fixed', action: 'Jump to any recording section' },
      { name: 'Open [page] links in steps', type: 'Link', status: 'Fixed', action: 'Opens target admin page' },
      { name: 'Readiness checklist items', type: 'Row', status: 'Fixed', action: 'Toggle pre-recording checks' },
      { name: 'Copy Voiceover button', type: 'Button', status: 'Fixed', action: 'Copies TikTok voiceover script' },
      { name: 'Video preview', type: 'Media', status: 'Fixed', action: 'Shows recorded video after stop' },
      { name: 'Download Recording button', type: 'Button', status: 'Fixed', action: 'Downloads recording as MP4/WEBM' },
      { name: 'Browser unsupported fallback', type: 'Alert', status: 'Fixed', action: 'Shows QuickTime/OBS/Loom alternatives' },
      { name: 'WEBM conversion warning', type: 'Alert', status: 'Fixed', action: 'Shows MP4 conversion instructions' },
      { name: 'Security reminder', type: 'Alert', status: 'Fixed', action: 'Warns not to show client secret' },
    ],
  },
  {
    page: 'Social Content Generator', route: '/admin/social-content', section: 'Social', purpose: 'AI-generated social media content drafts',
    operations: [
      { name: 'Generate Content button', type: 'Button', status: 'Working', action: 'Triggers AI content generation' },
      { name: 'Draft row click', type: 'Row', status: 'Needs Detail View', action: 'Should open draft detail' },
      { name: 'Send to Approval Queue', type: 'Button', status: 'Working', action: 'Creates approval queue item' },
      { name: 'Platform badge', type: 'Badge', status: 'Static But Should Be Clickable', action: 'Should filter by platform' },
    ],
  },
  // INTELLIGENCE
  {
    page: 'Agent Intelligence', route: '/admin/agent-intelligence', section: 'Intelligence', purpose: 'Agent IQ scores, learning records, activity logs',
    operations: [
      { name: 'IQ score card click', type: 'Card', status: 'Needs Source Chain', action: 'Should show what drives the IQ score' },
      { name: 'Learning Record click', type: 'Row', status: 'Working', action: 'Opens learning record detail' },
      { name: 'Autonomous Activity click', type: 'Row', status: 'Working', action: 'Opens activity detail' },
      { name: 'Trigger Research button', type: 'Button', status: 'Working', action: 'Runs autonomousResearch function' },
      { name: 'Trigger Trend Engine', type: 'Button', status: 'Working', action: 'Runs autonomousTrendEngine function' },
    ],
  },
  {
    page: 'Knowledge Vault', route: '/admin/knowledge-vault', section: 'Intelligence', purpose: 'Secure searchable knowledge repository',
    operations: [
      { name: 'Vault record click', type: 'Row', status: 'Working', action: 'Opens record detail modal' },
      { name: 'Add Record button', type: 'Button', status: 'Working', action: 'Opens create form' },
      { name: 'Category filter', type: 'Filter', status: 'Working', action: 'Filters by category' },
      { name: 'A–Z index filter', type: 'Filter', status: 'Working', action: 'Filters by first letter' },
      { name: 'Sensitive badge', type: 'Badge', status: 'Static But Should Be Clickable', action: 'Should filter sensitive records' },
      { name: 'Search bar', type: 'Search', status: 'Working', action: 'Full text search' },
    ],
  },
  {
    page: 'Research Grid', route: '/admin/research-grid', section: 'Intelligence', purpose: 'AI-powered market intelligence scanning',
    operations: [
      { name: 'Research card click', type: 'Card', status: 'Working', action: 'Opens research detail modal' },
      { name: 'Live Scan topic button', type: 'Button', status: 'Working', action: 'Triggers LLM research scan' },
      { name: 'Save to Vault button', type: 'Button', status: 'Working', action: 'Saves to KnowledgeVault' },
      { name: 'Create Approval Item', type: 'Button', status: 'Working', action: 'Creates approval queue entry' },
      { name: 'Category filter', type: 'Filter', status: 'Working', action: 'Filters by research category' },
    ],
  },
  {
    page: 'Agent Registry', route: '/admin/agent-registry', section: 'Intelligence', purpose: 'Manage and monitor all AI agents',
    operations: [
      { name: 'Agent card click', type: 'Card', status: 'Working', action: 'Opens agent detail modal' },
      { name: 'Activate/Deactivate button', type: 'Button', status: 'Working', action: 'Toggles agent status' },
      { name: 'Group filter', type: 'Filter', status: 'Working', action: 'Filters by agent group' },
      { name: 'Status badge', type: 'Badge', status: 'Static But Should Be Clickable', action: 'Should filter by status' },
      { name: 'Risk level badge', type: 'Badge', status: 'Static But Should Be Clickable', action: 'Should filter by risk' },
      { name: 'A–Z index', type: 'Filter', status: 'Working', action: 'Alphabetical filter' },
    ],
  },
  {
    page: 'Autonomous Ops', route: '/admin/autonomous-ops', section: 'Intelligence', purpose: 'Monitor automation loops and trigger manual runs',
    operations: [
      { name: 'Automation loop card', type: 'Card', status: 'Needs Source Chain', action: 'Should show recent runs/logs' },
      { name: 'Trigger button per loop', type: 'Button', status: 'Working', action: 'Manually triggers the function' },
      { name: 'Pending Approvals section', type: 'Card', status: 'Working', action: 'Shows pending approval items' },
      { name: 'Approval item click', type: 'Row', status: 'Working', action: 'Opens approval detail' },
    ],
  },
  {
    page: 'Agent Learning', route: '/admin/agent-learning', section: 'Intelligence', purpose: 'View agent learning records and improvement history',
    operations: [
      { name: 'Learning record row click', type: 'Row', status: 'Needs Detail View', action: 'Should open full learning record' },
      { name: 'Agent filter', type: 'Filter', status: 'Working', action: 'Filters by agent name' },
      { name: 'Lesson type badge', type: 'Badge', status: 'Static But Should Be Clickable', action: 'Should filter by lesson type' },
    ],
  },
  // COMMUNITY
  {
    page: 'Fan Messages', route: '/admin/fans', section: 'Community', purpose: 'View and manage fan comments and messages',
    operations: [
      { name: 'Comment row click', type: 'Row', status: 'Needs Detail View', action: 'Should open comment detail with reply' },
      { name: 'Status filter tabs', type: 'Tab', status: 'Working', action: 'Filters by approval status' },
      { name: 'Approve button', type: 'Button', status: 'Working', action: 'Approves comment' },
      { name: 'Reply button', type: 'Button', status: 'Working', action: 'Opens reply interface' },
      { name: 'Flag button', type: 'Button', status: 'Working', action: 'Flags comment for review' },
    ],
  },
  {
    page: 'Subscribers', route: '/admin/subscribers', section: 'Community', purpose: 'Manage email subscriber list',
    operations: [
      { name: 'Subscriber row click', type: 'Row', status: 'Needs Detail View', action: 'Should open subscriber profile' },
      { name: 'Export button', type: 'Button', status: 'Working', action: 'Exports subscriber list' },
      { name: 'Search', type: 'Search', status: 'Working', action: 'Searches subscribers' },
      { name: 'Status badge', type: 'Badge', status: 'Static But Should Be Clickable', action: 'Should filter by status' },
    ],
  },
  // OPERATIONS
  {
    page: 'Releases', route: '/admin/releases', section: 'Operations', purpose: 'Manage music releases and singles',
    operations: [
      { name: 'Release card click', type: 'Card', status: 'Needs Detail View', action: 'Should open release detail' },
      { name: 'Add Release button', type: 'Button', status: 'Working', action: 'Opens create form' },
      { name: 'Status badge', type: 'Badge', status: 'Static But Should Be Clickable', action: 'Should filter by status' },
      { name: 'is_current_single toggle', type: 'Toggle', status: 'Working', action: 'Sets as current single' },
      { name: 'is_published toggle', type: 'Toggle', status: 'Working', action: 'Publishes/unpublishes release' },
    ],
  },
  {
    page: 'Music Command Centre', route: '/admin/music-command', section: 'Operations', purpose: 'Music release management and planning hub',
    operations: [
      { name: 'Release card click', type: 'Card', status: 'Needs Detail View', action: 'Should open release detail' },
      { name: 'Pipeline status cards', type: 'Card', status: 'Needs Source Chain', action: 'Should filter releases by status' },
      { name: 'Trigger release functions', type: 'Button', status: 'Working', action: 'Triggers release-related functions' },
    ],
  },
  {
    page: 'API Setup', route: '/admin/api-setup', section: 'Operations', purpose: 'Configure external API integrations including TikTok',
    operations: [
      { name: 'Platform card click', type: 'Card', status: 'Needs Detail View', action: 'Should open platform setup detail' },
      { name: 'Connect TikTok button', type: 'Button', status: 'Working', action: 'Initiates TikTok OAuth flow' },
      { name: 'Status badge', type: 'Badge', status: 'Static But Should Be Clickable', action: 'Should filter by connection status' },
      { name: 'Setup step list', type: 'List', status: 'Working', action: 'Shows setup steps' },
    ],
  },
  // FINANCE
  {
    page: 'Financial Dashboard', route: '/admin/financials', section: 'Finance', purpose: 'Revenue, costs, margins, profit overview',
    operations: [
      { name: 'Revenue metric click', type: 'Metric', status: 'Needs Source Chain', action: 'Should open revenue breakdown by order' },
      { name: 'Profit metric click', type: 'Metric', status: 'Needs Source Chain', action: 'Should show profit calculation detail' },
      { name: 'Chart bar click', type: 'Chart', status: 'Needs Source Chain', action: 'Should filter to orders in that period' },
    ],
  },
  {
    page: 'Stripe Live Report', route: '/admin/stripe-live-report', section: 'Commerce', purpose: 'Live Stripe payment data and transaction status',
    operations: [
      { name: 'Transaction row click', type: 'Row', status: 'Needs Detail View', action: 'Should open Stripe transaction detail' },
      { name: 'Payment status badge', type: 'Badge', status: 'Static But Should Be Clickable', action: 'Should filter by payment status' },
      { name: 'Refresh button', type: 'Button', status: 'Working', action: 'Fetches latest Stripe data' },
    ],
  },
  // PUBLIC PAGES
  {
    page: 'Home', route: '/', section: 'Public', purpose: 'Public artist homepage',
    operations: [
      { name: 'Store CTA', type: 'Button', status: 'Working', action: 'Goes to /store' },
      { name: 'Music CTA', type: 'Button', status: 'Working', action: 'Goes to /music' },
      { name: 'Community CTA', type: 'Button', status: 'Working', action: 'Goes to /community' },
      { name: 'Newsletter signup', type: 'Form', status: 'Working', action: 'Submits email subscriber' },
      { name: 'Social links', type: 'Link', status: 'Working', action: 'Open external social profiles' },
    ],
  },
  {
    page: 'Music / Discography', route: '/music', section: 'Public', purpose: 'Display music releases and lyrics',
    operations: [
      { name: 'Release card click', type: 'Card', status: 'Working', action: 'Opens streaming links / lyrics' },
      { name: 'View Lyrics button', type: 'Button', status: 'Working', action: 'Opens LyricsModal' },
      { name: 'Current Single link', type: 'Button', status: 'Working', action: 'Goes to /current-single' },
      { name: 'Streaming link buttons', type: 'Link', status: 'Working', action: 'Open Spotify/Apple/YouTube' },
    ],
  },
  {
    page: 'Store', route: '/store', section: 'Public', purpose: 'Merch store for fans',
    operations: [
      { name: 'Product card click', type: 'Card', status: 'Working', action: 'Opens checkout modal' },
      { name: 'Add to Cart button', type: 'Button', status: 'Working', action: 'Adds item to cart' },
      { name: 'Checkout button', type: 'Button', status: 'Working', action: 'Opens Stripe checkout' },
      { name: 'Promo Code input', type: 'Form', status: 'Working', action: 'Validates promo code' },
      { name: 'Category filter', type: 'Filter', status: 'Working', action: 'Filters products by category' },
    ],
  },
  {
    page: 'Current Single', route: '/current-single', section: 'Public', purpose: 'Cinematic current single feature page',
    operations: [
      { name: 'Streaming platform buttons', type: 'Button', status: 'Working', action: 'Open streaming links' },
      { name: 'Support button', type: 'Button', status: 'Working', action: 'Goes to /back-this' },
      { name: 'Fan review section', type: 'Form', status: 'Working', action: 'Submits fan review' },
    ],
  },
];

const ALL_STATUSES = [...new Set(PAGES.flatMap(p => p.operations.map(o => o.status)))].sort();
const ALL_SECTIONS = [...new Set(PAGES.map(p => p.section))];

function OperationDetail({ op, page, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70" onClick={onClose}>
      <div className="bg-card border border-border rounded-xl max-w-md w-full p-5 space-y-3" onClick={e => e.stopPropagation()}>
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs text-muted-foreground">{page.page} · {page.route}</p>
            <h3 className="font-semibold mt-0.5">{op.name}</h3>
          </div>
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onClose}><X className="w-4 h-4" /></Button>
        </div>
        <div className="flex items-center gap-2">
          <Badge className={`text-xs border ${STATUS_STYLES[op.status] || 'bg-secondary'}`}>{STATUS_ICON[op.status]} {op.status}</Badge>
          <Badge variant="outline" className="text-xs">{op.type}</Badge>
        </div>
        <div className="border border-border rounded-lg p-3">
          <p className="text-xs text-muted-foreground mb-1">Expected Action</p>
          <p className="text-sm">{op.action}</p>
        </div>
        <div className="border border-border rounded-lg p-3 text-xs text-muted-foreground">
          <p>Page Section: <span className="text-foreground">{page.section}</span></p>
          <p>Page Purpose: <span className="text-foreground">{page.purpose}</span></p>
        </div>
        <Link to={page.route} target="_blank">
          <Button variant="outline" size="sm" className="gap-1 text-xs"><ExternalLink className="w-3 h-3" /> Go to {page.page}</Button>
        </Link>
      </div>
    </div>
  );
}

function X({ className }) {
  return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>;
}

export default function OperationRegistry() {
  const [search, setSearch] = useState('');
  const [sectionFilter, setSectionFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOp, setSelectedOp] = useState(null);
  const [expandedPages, setExpandedPages] = useState({});

  const togglePage = (route) => setExpandedPages(p => ({ ...p, [route]: !p[route] }));

  const filteredPages = PAGES.filter(p => {
    if (sectionFilter !== 'all' && p.section !== sectionFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      const pageMatch = p.page.toLowerCase().includes(q) || p.route.toLowerCase().includes(q) || p.purpose.toLowerCase().includes(q);
      const opMatch = p.operations.some(o => o.name.toLowerCase().includes(q) || o.action.toLowerCase().includes(q));
      if (!pageMatch && !opMatch) return false;
    }
    if (statusFilter !== 'all') {
      if (!p.operations.some(o => o.status === statusFilter)) return false;
    }
    return true;
  });

  const totalOps = PAGES.reduce((a, p) => a + p.operations.length, 0);
  const workingOps = PAGES.reduce((a, p) => a + p.operations.filter(o => o.status === 'Working' || o.status === 'Fixed' || o.status === 'Verified').length, 0);
  const brokenOps = PAGES.reduce((a, p) => a + p.operations.filter(o => o.status === 'Broken' || o.status === 'Dead End' || o.status === 'Missing Destination').length, 0);
  const needsWorkOps = totalOps - workingOps - brokenOps;

  return (
    <div className="space-y-5 pb-10">
      <div>
        <h1 className="text-3xl font-display font-bold gradient-gold-text">Operation Registry</h1>
        <p className="text-muted-foreground text-sm mt-1">Complete catalogue of every operation on every page — click any operation for detail</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Pages Audited', value: PAGES.length, color: 'text-primary' },
          { label: 'Total Operations', value: totalOps, color: 'text-cyan-400' },
          { label: 'Working / Fixed', value: workingOps, color: 'text-green-400' },
          { label: 'Needs Work', value: needsWorkOps, color: 'text-yellow-400' },
        ].map(s => (
          <Card key={s.label} className="cursor-pointer hover:border-primary/30" onClick={() => setStatusFilter('all')}>
            <CardContent className="p-4 text-center">
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search pages, operations, routes..."
            className="w-full pl-9 pr-4 py-2 bg-secondary border border-border rounded-lg text-sm focus:outline-none focus:border-primary/50"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setSectionFilter('all')}
            className={`px-3 py-1 rounded-full text-xs border transition-all ${sectionFilter === 'all' ? 'bg-primary text-primary-foreground border-primary' : 'border-border text-muted-foreground'}`}
          >All Sections</button>
          {ALL_SECTIONS.map(s => (
            <button key={s} onClick={() => setSectionFilter(s)}
              className={`px-3 py-1 rounded-full text-xs border transition-all ${sectionFilter === s ? 'bg-primary text-primary-foreground border-primary' : 'border-border text-muted-foreground hover:border-primary/40'}`}>
              {s}
            </button>
          ))}
        </div>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-2 py-0.5 rounded-full text-xs border transition-all ${statusFilter === 'all' ? 'bg-primary text-primary-foreground border-primary' : 'border-border text-muted-foreground'}`}
          >Any Status</button>
          {ALL_STATUSES.map(s => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={`px-2 py-0.5 rounded-full text-xs border transition-all ${statusFilter === s ? 'bg-primary text-primary-foreground border-primary' : `border-border text-muted-foreground hover:border-primary/40`}`}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Pages */}
      <div className="space-y-3">
        {filteredPages.map(p => {
          const isOpen = expandedPages[p.route];
          const visibleOps = statusFilter === 'all' ? p.operations : p.operations.filter(o => o.status === statusFilter);
          const fixedCount = p.operations.filter(o => o.status === 'Working' || o.status === 'Fixed' || o.status === 'Verified').length;
          const issueCount = p.operations.filter(o => !['Working','Fixed','Verified','Informational Only'].includes(o.status)).length;

          return (
            <Card key={p.route} className={issueCount > 0 ? 'border-yellow-500/20' : 'border-green-500/20'}>
              <div
                className="flex items-center justify-between p-4 cursor-pointer hover:bg-secondary/20"
                onClick={() => togglePage(p.route)}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <ChevronRight className={`w-4 h-4 text-muted-foreground shrink-0 transition-transform ${isOpen ? 'rotate-90' : ''}`} />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-sm">{p.page}</p>
                      <Badge variant="outline" className="text-xs">{p.section}</Badge>
                    </div>
                    <p className="text-xs text-primary font-mono">{p.route}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {fixedCount > 0 && <Badge className="bg-green-500/15 text-green-300 text-xs">{fixedCount} ✓</Badge>}
                  {issueCount > 0 && <Badge className="bg-yellow-500/15 text-yellow-300 text-xs">{issueCount} ⚠</Badge>}
                  <Link to={p.route} target="_blank" onClick={e => e.stopPropagation()}>
                    <Button variant="ghost" size="icon" className="h-6 w-6"><ExternalLink className="w-3 h-3" /></Button>
                  </Link>
                </div>
              </div>

              {isOpen && (
                <CardContent className="pt-0 pb-3 px-4 space-y-1.5">
                  <p className="text-xs text-muted-foreground pb-2 border-b border-border">{p.purpose}</p>
                  {visibleOps.map((op, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 py-1 px-2 rounded hover:bg-secondary/40 cursor-pointer transition-colors"
                      onClick={() => setSelectedOp({ op, page: p })}
                    >
                      <Badge className={`text-xs border shrink-0 ${STATUS_STYLES[op.status] || 'bg-secondary'}`}>
                        <span className="flex items-center gap-1">{STATUS_ICON[op.status]} {op.status}</span>
                      </Badge>
                      <Badge variant="outline" className="text-xs shrink-0">{op.type}</Badge>
                      <p className="text-sm flex-1 truncate">{op.name}</p>
                      <p className="text-xs text-muted-foreground truncate hidden md:block max-w-xs">{op.action}</p>
                    </div>
                  ))}
                  {visibleOps.length === 0 && <p className="text-xs text-muted-foreground py-2">No operations match the current filter.</p>}
                </CardContent>
              )}
            </Card>
          );
        })}
      </div>

      {selectedOp && <OperationDetail op={selectedOp.op} page={selectedOp.page} onClose={() => setSelectedOp(null)} />}
    </div>
  );
}