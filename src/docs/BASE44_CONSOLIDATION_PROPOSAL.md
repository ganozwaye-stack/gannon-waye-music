# Future Entity Consolidation Proposal

> **STATUS: PROPOSAL ONLY — DO NOT EXECUTE**
> Created: 2026-07-13
> This document proposes future schema consolidation. No schema changes have been made.
> All proposed migrations require explicit approval before execution.

## 1. WorkItem Model (Canonical Task Entity)

**Source entities to consolidate:**
- DailyDashboardTask
- StrategicPlanItem
- BlockedItem
- AdminPreparationItem
- WebsiteOverhaulTask

**Proposed unified schema:**
| Field | Type | Source Mapping |
|-------|------|---------------|
| title | string | All sources: title |
| description | string | All sources: description |
| category | string | All sources: category |
| priority | enum | All sources: priority (critical/high/medium/low) |
| status | enum | All sources: status (unified to: not_started/in_progress/blocked/needs_approval/scheduled/complete/deferred) |
| due_date | date | All sources: due_date |
| owner | string | All sources: owner |
| work_type | enum | NEW: daily/strategic/blocked/preparation/overhaul (derived from source entity) |
| timeframe | enum | StrategicPlanItem.timeframe → workItem.timeframe |
| sort_order | number | All sources: sort_order |

**Record counts (approx):** DailyDashboardTask + StrategicPlanItem + BlockedItem + AdminPreparationItem + WebsiteOverhaulTask

**Route dependencies:** /admin/dashboard, /admin/strategic-execution-plan, /admin/site-upgrade-audit
**Backend function dependencies:** generateReleaseSprint, executiveMorningBrief
**Automation dependencies:** None identified

**Rollback method:** Keep source entities frozen (not deleted) for 30 days after migration. If rollback needed, restore from source entity backups.

**Records that cannot be safely mapped:** Items where `work_type` cannot be determined from source data (e.g., items with null category).

---

## 2. Approval Model (Canonical Approval Entity)

**Source entities to consolidate:**
- ApprovalQueue (332 records, ~225 pending)
- ApprovalQueueItem (10 records, all needs_approval)

**Proposed unified schema:**
| Field | Type | Source Mapping |
|-------|------|---------------|
| title | string | ApprovalQueueItem.title; ApprovalQueue.action_title |
| description | string | ApprovalQueueItem.description; ApprovalQueue.action_description |
| status | enum | ApprovalQueue.status + ApprovalQueueItem.status → unified: pending/approved/rejected/archived |
| risk_level | enum | ApprovalQueue.risk_level; ApprovalQueueItem.priority |
| risk_type | array | ApprovalQueue.risk_type |
| agent_name | string | ApprovalQueue.agent_name |
| payload | object | ApprovalQueue.payload |
| proposed_output | string | ApprovalQueue.proposed_output |
| final_output | string | ApprovalQueue.final_output |
| decision_note | string | ApprovalQueue.decision_note |
| decided_by | string | ApprovalQueue.decided_by |
| decided_at | datetime | ApprovalQueue.decided_at |
| category | string | ApprovalQueueItem.category |
| approval_required | boolean | ApprovalQueueItem.approval_required |

**Route dependencies:** /admin/approval-queue
**Backend function dependencies:** onNewApprovalItem, publishApprovedProposal
**Automation dependencies:** Entity automation on ApprovalQueue

**Rollback method:** Keep both source entities for 30 days. Dual-write during transition.

**Records that cannot be safely mapped:** ApprovalQueue records with complex payloads that don't map to ApprovalQueueItem structure.

---

## 3. ContentItem Model (Canonical Content Entity)

**Source entities to consolidate:**
- ContentCalendarPost (~152 records)
- ContentPipelineItem
- ContentPost
- ContentStudioRecord

**Proposed unified schema:**
| Field | Type | Source Mapping |
|-------|------|---------------|
| title | string | All sources: title |
| description | string | All sources: description |
| stage | enum | All sources: status → unified display stage (Research/Idea/Draft/Visual required/Quality review/Waiting for Gannon/Approved/Scheduled/Published/Measured/Archived) |
| content_type | enum | ContentPipelineItem.content_type; ContentCalendarPost.content_type |
| platform | string | All sources: platform |
| caption | string | All sources: caption |
| hook | string | All sources: hook |
| hashtags | string | All sources: hashtags |
| visual_brief | string | All sources: visual_brief/needs_asset |
| asset_url | string | All sources: image_url/asset_url |
| destination_link | string | All sources: destination_link/link |
| related_release | string | All sources: related_release/related_song |
| owner | string | All sources: owner |
| due_date | date | All sources: due_date |
| sort_order | number | All sources: sort_order |

**Route dependencies:** /admin/content-studio, /admin/content-dashboard, /admin/social-schedule-queue
**Backend function dependencies:** generateContentPost, generateDailyDrafts, socialQualityCouncil
**Automation dependencies:** None identified

**Rollback method:** Keep source entities for 30 days. The adminV3Adapters.js mapping layer already maps these sources to unified stages without modifying source data.

**Records that cannot be safely mapped:** Items where the source status doesn't cleanly map to a unified stage (see mapContentStage in adminV3Adapters.js for current mapping logic).

---

## 4. Agent and AgentRun Models

**Source entities to consolidate:**
- AgentRegistry (223 records)
- AgentTaskLog (500+ records)
- AgentMessage
- AgentActionProposal

**Proposed model:**

### Agent (canonical agent definition)
| Field | Type | Source |
|-------|------|--------|
| name | string | AgentRegistry.name |
| crew | enum | Derived from mapAgentCrew() in adminV3Adapters.js |
| purpose | string | AgentRegistry.description |
| status | enum | Derived from calcAgentStatus() — not just registry status |
| connected_tools | array | AgentRegistry.tools/integrations |
| permission_level | string | AgentRegistry.permissions |

### AgentRun (execution log)
| Field | Type | Source |
|-------|------|--------|
| agent_id | ref | AgentRegistry.id → Agent.id |
| action | string | AgentTaskLog.action |
| status | enum | AgentTaskLog.status |
| result | object | AgentTaskLog.result |
| started_at | datetime | AgentTaskLog.created_date |
| completed_at | datetime | AgentTaskLog.updated_date |

**Route dependencies:** /admin/agent-registry, /admin/agent-task-log, /admin/agent-workbench
**Backend function dependencies:** agentIntelligenceLoop, agentProposalScanner, agentSelfImprovement
**Automation dependencies:** In-app agent automations

**Rollback method:** AgentRegistry is the source of truth — keep it intact. AgentRun can be rebuilt from AgentTaskLog if needed.

**Records that cannot be safely mapped:** AgentRegistry records where the agent name is null or doesn't match any known agent configuration.

---

## 5. AgentKnowledge Model

**Source entities to consolidate:**
- AgentLearningRecord
- AgentMemory
- MusicLearningRecord
- MusicAgentMemory

**Proposed unified schema:**
| Field | Type | Source |
|-------|------|--------|
| agent_name | string | All sources |
| knowledge_type | enum | learning/memory/music_learning/music_memory |
| content | string | All sources: content/insight |
| created_date | datetime | All sources |

**Note:** Must confirm unique data and dependencies before executing. These entities may contain duplicate insights.

---

## 6. Incident and Notification Models

**Source entities to consolidate:**
- SystemHealthIssue (~131 records)
- RiskAlert
- AdminNotification (500+ records, repeating events)

**Proposed models:**

### Incident (grouped)
| Field | Type | Source |
|-------|------|--------|
| fingerprint | string | Derived: `${category}::${title}` (see groupIncidents in adminV3Adapters.js) |
| title | string | SystemHealthIssue.title / RiskAlert.title |
| category | string | SystemHealthIssue.category / RiskAlert.alert_type |
| severity | enum | All sources |
| status | enum | All sources |
| occurrence_count | number | Derived from grouping |
| first_seen | datetime | Earliest record in group |
| last_seen | datetime | Most recent record in group |
| next_action | string | All sources: next_action |

### Notification (individual)
| Field | Type | Source |
|-------|------|--------|
| title | string | AdminNotification.title |
| type | enum | AdminNotification.notification_type |
| severity | enum | AdminNotification.severity |
| is_read | boolean | AdminNotification.is_read |
| linked_route | string | AdminNotification.linked_route |

**Key principle:** Repeating events are grouped for display (see groupIncidents in adminV3Adapters.js) but underlying records are never deleted.

---

## 7. Opportunity Model

**Source entities to consolidate:**
- GrowthOpportunity
- IdeaOpportunity (~431 records, ~355 "new")
- RevenueOpportunity
- ViralOpportunity

**Proposed unified schema:**
| Field | Type | Source |
|-------|------|--------|
| title | string | All sources |
| description | string | All sources |
| opportunity_type | enum | growth/idea/revenue/viral |
| status | enum | All sources → unified: new/investigating/actioned/deferred/archived |
| potential_value | number | RevenueOpportunity.estimated_value |
| priority | enum | All sources |
| created_date | datetime | All sources |

---

## Migration Execution Rules

1. **Do not execute until approved** — this is a proposal only
2. **Backup first** — export all source entity data before any migration
3. **Dual-write during transition** — write to both old and new entities for 30 days
4. **Keep source entities frozen** — do not delete source entities for 30 days after migration
5. **Verify counts** — ensure record counts match before and after
6. **Test all routes** — verify all dependent routes still work after migration
7. **Test all automations** — verify all dependent automations still fire correctly
8. **Rollback plan** — documented rollback method for each consolidation

## Records That Cannot Be Safely Mapped

- ApprovalQueue records with complex payloads
- AgentRegistry records with null names
- Content items with statuses that don't map to unified stages
- Notification events that don't have a clear category fingerprint
- Opportunity records with null status (cannot determine if new/actioned/archived)

These records should be manually reviewed before any migration.