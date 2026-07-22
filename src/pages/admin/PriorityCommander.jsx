import React, { useState, useMemo } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CheckCircle2, User, Bot, RefreshCw, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const PRIORITY_COLORS = { critical: '#ef4444', high: '#f59e0b', medium: '#3b82f6', low: '#6b7280' };

function TaskRow({ task, onComplete, onDefer, onEscalate }) {
  const isOverdue = task.due_date && new Date(task.due_date) < new Date() && task.status !== 'completed';
  const isGannon = task.assigned_to === 'Gannon' || task.assigned_to === 'gannon';

  return (
    <div style={{
      padding: '14px 16px',
      borderRadius: '8px',
      background: isOverdue ? 'rgba(239,68,68,0.06)' : 'rgba(255,255,255,0.03)',
      border: `1px solid ${isOverdue ? 'rgba(239,68,68,0.3)' : 'rgba(201,168,76,0.12)'}`,
      marginBottom: '8px',
      display: 'flex',
      flexWrap: 'wrap',
      gap: '10px',
      alignItems: 'center',
    }}>
      <div style={{ flex: 1, minWidth: '200px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
          {isGannon
            ? <User style={{ width: '13px', height: '13px', color: '#C9A84C' }} />
            : <Bot style={{ width: '13px', height: '13px', color: '#3b82f6' }} />
          }
          <span style={{ color: '#fff', fontSize: '13px', fontWeight: 600 }}>{task.title || task.action_title || 'Untitled Task'}</span>
          {isOverdue && <span style={{ fontSize: '9px', background: 'rgba(239,68,68,0.2)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.4)', padding: '1px 6px', borderRadius: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>OVERDUE</span>}
        </div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {task.category && <span style={{ fontSize: '10px', color: '#888' }}>{task.category}</span>}
          {task.due_date && <span style={{ fontSize: '10px', color: isOverdue ? '#ef4444' : '#888' }}>Due {new Date(task.due_date).toLocaleDateString()}</span>}
          {task.assigned_to && <span style={{ fontSize: '10px', color: '#888' }}>→ {task.assigned_to}</span>}
        </div>
      </div>
      <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
        <button onClick={() => onComplete(task.id)} style={{ padding: '5px 10px', borderRadius: '5px', background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', color: '#22c55e', fontSize: '10px', cursor: 'pointer' }}>✓ Done</button>
        <button onClick={() => onDefer(task.id)} style={{ padding: '5px 10px', borderRadius: '5px', background: 'rgba(107,114,128,0.1)', border: '1px solid rgba(107,114,128,0.3)', color: '#9ca3af', fontSize: '10px', cursor: 'pointer' }}>Defer</button>
        <button onClick={() => onEscalate(task.id)} style={{ padding: '5px 10px', borderRadius: '5px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#ef4444', fontSize: '10px', cursor: 'pointer' }}>Escalate</button>
      </div>
    </div>
  );
}

export default function PriorityCommander() {
  const qc = useQueryClient();
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterAssigned, setFilterAssigned] = useState('all');

  const { data: approvals = [] } = useQuery({
    queryKey: ['pc-approvals'],
    queryFn: () => base44.entities.ApprovalQueue.filter({ status: 'pending' }),
  });

  const { data: notifications = [] } = useQuery({
    queryKey: ['pc-notifications'],
    queryFn: () => base44.entities.AdminNotification.filter({ is_read: false }),
  });

  const updateApproval = useMutation({
    mutationFn: ({ id, status }) => base44.entities.ApprovalQueue.update(id, { status }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['pc-approvals'] }),
  });

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Build unified task list from approvals + unread notifications
  const allTasks = useMemo(() => {
    const fromApprovals = approvals.map(a => ({
      id: a.id,
      title: a.action_title,
      category: 'Approval',
      assigned_to: a.agent_name,
      due_date: null,
      status: a.status,
      risk_level: a.risk_level,
      source: 'approval',
    }));
    const fromNotifs = notifications.map(n => ({
      id: n.id,
      title: n.title,
      category: n.notification_type,
      assigned_to: 'Gannon',
      due_date: null,
      status: 'open',
      risk_level: n.severity === 'critical' ? 'critical' : n.severity === 'high' ? 'high' : 'medium',
      source: 'notification',
    }));
    return [...fromApprovals, ...fromNotifs];
  }, [approvals, notifications]);

  const filtered = useMemo(() => allTasks.filter(t => {
    if (filterCategory !== 'all' && t.category !== filterCategory) return false;
    if (filterAssigned !== 'all') {
      if (filterAssigned === 'gannon' && t.assigned_to !== 'Gannon') return false;
      if (filterAssigned === 'agents' && t.assigned_to === 'Gannon') return false;
    }
    return true;
  }), [allTasks, filterCategory, filterAssigned]);

  const gannonTasks = allTasks.filter(t => t.assigned_to === 'Gannon');
  const agentTasks = allTasks.filter(t => t.assigned_to !== 'Gannon');

  const handleComplete = (id) => updateApproval.mutate({ id, status: 'approved' });
  const handleDefer = (id) => updateApproval.mutate({ id, status: 'archived' });
  const handleEscalate = (id) => updateApproval.mutate({ id, status: 'escalated' });

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '24px 16px 64px' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <p style={{ color: '#C9A84C', fontSize: '10px', letterSpacing: '0.3em', textTransform: 'uppercase', marginBottom: '6px' }}>Daily Commander</p>
        <h1 style={{ color: '#fff', fontSize: '28px', fontWeight: 800, marginBottom: '8px' }}>{greeting}, Gannon</h1>
        <p style={{ color: '#888', fontSize: '13px' }}>
          {allTasks.length} item{allTasks.length !== 1 ? 's' : ''} need your attention today · {gannonTasks.length} require your personal action
        </p>
      </div>

      {/* Summary cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '12px', marginBottom: '28px' }}>
        {[
          { label: 'Your Action', count: gannonTasks.length, color: '#C9A84C' },
          { label: 'Agent Tasks', count: agentTasks.length, color: '#3b82f6' },
          { label: 'Pending Approvals', count: approvals.length, color: '#f59e0b' },
          { label: 'Unread Alerts', count: notifications.length, color: '#ef4444' },
        ].map(s => (
          <div key={s.label} style={{ padding: '14px 16px', borderRadius: '8px', background: 'rgba(255,255,255,0.03)', border: `1px solid ${s.color}33` }}>
            <p style={{ fontSize: '22px', fontWeight: 800, color: s.color }}>{s.count}</p>
            <p style={{ fontSize: '11px', color: '#888', marginTop: '2px' }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <Select value={filterAssigned} onValueChange={setFilterAssigned}>
          <SelectTrigger style={{ width: '160px', background: '#1a1a1a', border: '1px solid #333', color: '#fff', fontSize: '12px' }}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Assignees</SelectItem>
            <SelectItem value="gannon">Gannon Only</SelectItem>
            <SelectItem value="agents">Agents Only</SelectItem>
          </SelectContent>
        </Select>
        <Button size="sm" variant="outline" onClick={() => qc.invalidateQueries()} style={{ fontSize: '11px', borderColor: '#333', color: '#888' }}>
          <RefreshCw style={{ width: '12px', height: '12px', marginRight: '4px' }} /> Refresh
        </Button>
        <Link to="/admin/approval-queue">
          <Button size="sm" style={{ fontSize: '11px', background: '#C9A84C', color: '#111' }}>
            View Approval Queue <ArrowUpRight style={{ width: '12px', height: '12px', marginLeft: '4px' }} />
          </Button>
        </Link>
      </div>

      {/* Task sections */}
      {gannonTasks.length > 0 && (
        <div style={{ marginBottom: '28px' }}>
          <p style={{ color: '#C9A84C', fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <User style={{ width: '12px', height: '12px' }} /> Your Action Required ({gannonTasks.length})
          </p>
          {gannonTasks.map(t => <TaskRow key={t.id} task={t} onComplete={handleComplete} onDefer={handleDefer} onEscalate={handleEscalate} />)}
        </div>
      )}

      {agentTasks.length > 0 && (
        <div style={{ marginBottom: '28px' }}>
          <p style={{ color: '#3b82f6', fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Bot style={{ width: '12px', height: '12px' }} /> Agent Tasks Waiting ({agentTasks.length})
          </p>
          {agentTasks.map(t => <TaskRow key={t.id} task={t} onComplete={handleComplete} onDefer={handleDefer} onEscalate={handleEscalate} />)}
        </div>
      )}

      {allTasks.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: '#555' }}>
          <CheckCircle2 style={{ width: '40px', height: '40px', color: '#22c55e', margin: '0 auto 12px' }} />
          <p style={{ color: '#22c55e', fontSize: '15px', fontWeight: 600 }}>All clear — nothing pending today.</p>
        </div>
      )}
    </div>
  );
}