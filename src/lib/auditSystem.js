// ENTERPRISE AUDIT LOGGING SYSTEM
// Automatic audit trail on ALL entity operations with rollback capability

import { base44 } from '@/api/base44Client';

/**
 * Create audit log entry with field-level change tracking
 * Automatically called on ALL create/update/delete operations
 */
export const createAuditLog = async (entityName, entityId, action, newData, oldData = null) => {
  try {
    const user = await base44.auth.me();

    // Track field-level changes
    const changes = [];

    if (action === 'create' && newData) {
      // Create action: all fields are new
      Object.keys(newData).forEach(field => {
        if (['id', 'created_date', 'updated_date', 'created_by'].includes(field)) return;
        changes.push({
          field,
          old_value: null,
          new_value: newData[field],
        });
      });
    } else if (action === 'update' && oldData && newData) {
      // Update action: compare old vs new
      const allFields = new Set([...Object.keys(oldData || {}), ...Object.keys(newData || {})]);
      allFields.forEach(field => {
        if (['id', 'created_date', 'updated_date', 'created_by'].includes(field)) return;

        const oldValue = oldData?.[field];
        const newValue = newData?.[field];

        if (JSON.stringify(oldValue) !== JSON.stringify(newValue)) {
          changes.push({
            field,
            old_value: oldValue,
            new_value: newValue,
          });
        }
      });
    }

    // Create audit log entry
    const auditEntry = {
      entity_name: entityName,
      entity_id: entityId,
      action,
      user_email: user?.email || 'system',
      user_role: user?.role || 'system',
      timestamp: new Date().toISOString(),
      changes,
      description: `${action.toUpperCase()} ${entityName} #${entityId.slice(-6)}${changes.length > 0 ? ` (${changes.length} fields changed)` : ''}`,
      metadata: {
        ip_address: 'system',
        user_agent: 'automation',
        session_id: 'audit-system',
        rollback_available: action !== 'delete',
        triggering_workflow: 'entity-operation',
        affected_entities: [entityName],
        rollback_snapshot: action !== 'delete' ? {
          entity_name: entityName,
          entity_id: entityId,
          previous_state: oldData || null,
          current_state: newData,
          can_rollback: true,
        } : null,
      },
    };

    // Store audit log
    await base44.entities.AuditLog.create(auditEntry);

    console.log(`✓ Audit logged: ${entityName} #${entityId} (${action})`);
    return { success: true, auditId: entityId };
  } catch (error) {
    console.error('❌ Audit logging failed:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Perform rollback to previous state
 */
export const performRollback = async (auditLogId) => {
  try {
    const auditLogs = await base44.entities.AuditLog.filter({ id: auditLogId });
    if (auditLogs.length === 0) throw new Error('Audit log not found');

    const auditLog = auditLogs[0];
    if (!auditLog.metadata?.rollback_available) {
      throw new Error('Rollback not available for this audit log');
    }

    const { entity_name, entity_id, previous_state } = auditLog.metadata;

    // Restore to previous state
    if (previous_state) {
      await base44.entities[entity_name].update(entity_id, previous_state);
    } else {
      // If no previous state (create action), delete the entity
      await base44.entities[entity_name].delete(entity_id);
    }

    // Log the rollback
    await createAuditLog(entity_name, entity_id, 'rollback', previous_state || {}, null);

    return {
      success: true,
      message: `Rolled back ${entity_name} #${entity_id} to previous state`,
    };
  } catch (error) {
    console.error('Rollback failed:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Get audit history for an entity
 */
export const getAuditHistory = async (entityName, entityId) => {
  try {
    const logs = await base44.entities.AuditLog.filter({
      entity_name: entityName,
      entity_id: entityId,
    }, '-created_date');

    return {
      success: true,
      history: logs,
      changeCount: logs.reduce((sum, log) => sum + log.changes.length, 0),
    };
  } catch (error) {
    console.error('Failed to get audit history:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Auto-audit wrapper for entity operations
 */
export const auditedCreate = async (entityName, data) => {
  try {
    const result = await base44.entities[entityName].create(data);
    await createAuditLog(entityName, result.id, 'create', data);
    return result;
  } catch (error) {
    console.error(`Create ${entityName} failed:`, error);
    throw error;
  }
};

export const auditedUpdate = async (entityName, entityId, data) => {
  try {
    // Fetch old data for comparison
    const oldRecords = await base44.entities[entityName].filter({ id: entityId });
    const oldData = oldRecords.length > 0 ? oldRecords[0] : null;

    // Perform update
    const result = await base44.entities[entityName].update(entityId, data);

    // Create audit log
    await createAuditLog(entityName, entityId, 'update', data, oldData);

    return result;
  } catch (error) {
    console.error(`Update ${entityName} failed:`, error);
    throw error;
  }
};

export const auditedDelete = async (entityName, entityId) => {
  try {
    // Fetch data before deletion for rollback recovery
    const records = await base44.entities[entityName].filter({ id: entityId });
    const oldData = records.length > 0 ? records[0] : null;

    // Perform deletion
    await base44.entities[entityName].delete(entityId);

    // Create audit log (with deleted data stored for recovery)
    await createAuditLog(entityName, entityId, 'delete', null, oldData);

    return { success: true };
  } catch (error) {
    console.error(`Delete ${entityName} failed:`, error);
    throw error;
  }
};

export default {
  createAuditLog,
  performRollback,
  getAuditHistory,
  auditedCreate,
  auditedUpdate,
  auditedDelete,
};