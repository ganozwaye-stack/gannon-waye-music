import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Link } from 'react-router-dom';
import {
  Shield, DollarSign, Star, Film, AlertTriangle, CheckCircle2,
  Clock, Zap, ChevronRight
} from 'lucide-react';
import {
  KpiCard, SectionCard, RowItem, StatusBadge, LoadingState, EmptyState, StatusDot
} from '@/components/admin-v3/shared/SharedComponents';
import {
  calcPendingApprovals, calcVerifiedRevenue, calcPaymentExceptions
} from '@/lib/adminV3Metrics';

export default function TodayView() {
  // ── Bounded read-only queries ──
  const { data: approvalQueue = [], isLoading: aqLoading } = useQuery({
    queryKey: ['v3-approval-queue'],
    queryFn: () => base44.entities.ApprovalQueue.filter({ status: 'pending' }, '-created_date', 500),
    staleTime: 30_000,
  });
  const { data: approvalItems = [] } = useQuery({
    queryKey: ['v3-approval-items'],
    queryFn: () => base44.entities.ApprovalQueueItem.filter({ status: 'needs_approval' }, '-created_date', 100),
    staleTime: 30_000,
  });
  const { data: blocked = [] } = useQuery({
    queryKey: ['v3-blocked'],
    queryFn: () => base44.entities.BlockedItem.filter({ status: 'blocked' }, '-created_date', 50),
    staleTime: 30_000,
  });
  const { data: tasks = [] } = useQuery({
    queryKey: ['v3-tasks-open'],
    queryFn: () => base44.entities.DailyDashboardTask.filter({ status: { $in: ['not_started', 'in_progress', 'blocked'] } }, 'priority', 50),
    staleTime: 30_000,
  });
  const { data: strategic = [] } = useQuery({
    queryKey: ['v3-strategic-open'],
    queryFn: () => base44.entities.StrategicPlanItem.filter({ status: { $in: ['not_started', 'in_progress', 'blocked'] } }, 'priority', 50),
    staleTime: 30_000,
  });
  const { data: orders = [] } = useQuery({
    queryKey: ['v3-orders-all'],
    queryFn: () => base44.entities.MerchOrder.list('-created_date', 200),
    staleTime: 60_000,
  });
  const { data: diagnostics = [] } = useQuery({
    queryKey: ['v3-payment-diag'],
    queryFn: () => base44.entities.PaymentDiagnostic.filter({ is_resolved: { $ne: true } }, '-created_date', 50),
    staleTime: 60_000,
  });
  const { data: releases = [] } = useQuery({
    queryKey: ['v3-releases'],
    queryFn: () => base44.entities.Release.list('-updated_date', 20),
    staleTime: 30_000,
  });
  const { data: contentPosts = [] } = useQuery({
    queryKey: ['v3-content-calendar'],
    queryFn: () => base44.entities.ContentCalendarPost.filter({ status: { $in: ['needs_approval', 'ready_for_review'] } }, '-created_date', 50),
    staleTime: 30_000,
  });
  const { data: systemIssues = [] } = useQuery({
    queryKey: ['v3-system-issues-open'],
    queryFn: () => base44.entities.SystemHealthIssue.filter({ status: 'open' }, '-created_date', 100),
    staleTime: 30_000,
  });
  const { data: recentTasks = [] } = useQuery({
    queryKey: ['v3-agent-tasks-recent'],
    queryFn: () => base44.entities.AgentTaskLog.list('-created_date', 20),
    staleTime: 30_000,
  });
  const { data: completedTasks = [] } = useQuery({
    queryKey: ['v3-tasks-complete'],
    queryFn: () => base44.entities.DailyDashboardTask.filter({ status: 'complete' }, '-updated_date', 10),
    staleTime: 60_000,
  });

  // ── Metric calculations ──
  const approvals = calcPendingApprovals(approvalQueue, approvalItems);
  const revenue = calcVerifiedRevenue(orders);
  const paymentExcs = calcPaymentExceptions(orders, diagnostics);

  // ── Do Now: Safety, payment, customer risks ──
  const doNowItems = [
    ...blocked.slice(0, 4).map(b => ({ title: b.title, subtitle: b.blocker_reason || 'Blocked', status: 'Blocked', level: 'red', path: '/admin/dashboard' })),
    ...diagnostics.slice(0, 3).map(d => ({ title: d.title || d.issue_type || 'Payment diagnostic', subtitle: d.description || 'Unresolved', status: 'Diagnostic', level: 'orange', path: '/admin/payment-diagnostics' })),
  ];

  // ── Waiting for Gannon ──
  const waitingItems = approvals.items.slice(0, 6).map(a => ({
    title: a.action_title || a.title || 'Untitled action',
    subtitle: a.agent_name || a.category || 'Needs review',
    status: 'Review',
    level: 'orange',
    path: '/admin/approval-queue',
  }));

  // ── Money & customer exceptions ──
  const moneyItems = [
    ...paymentExcs.failedOrders.slice(0, 3).map(o => ({ title: `Order ${o.customer_name || '—'}`, subtitle: `$${o.total_amount || 0} · ${o.payment_status}`, status: o.payment_status, level: 'red', path: '/admin/orders' })),
  ];

  // ── Release deadlines ──
  const releaseItems = releases
    .filter(r => r.status !== 'released' && r.status !== 'idea')
    .slice(0, 5)
    .map(r => ({ title: r.title, subtitle: r.release_date ? `Due: ${new Date(r.release_date).toLocaleDateString('en-AU')}` : r.status, status: r.status, level: r.status === 'mastering' || r.status === 'recording' ? 'orange' : 'grey', path: '/admin/releases' }));

  // ── Content ready for review ──
  const contentItems = contentPosts.slice(0, 5).map(c => ({ title: c.title || 'Untitled post', subtitle: c.platform || c.content_type || 'Content', status: 'Review', level: 'orange', path: '/admin/content-studio' }));

  // ── System incidents requiring approval ──
  const incidentItems = systemIssues.filter(i => i.severity === 'critical' || i.severity === 'high').slice(0, 5).map(i => ({
    title: i.title || 'System issue', subtitle: i.category || i.issue_type || 'Open', status: i.severity, level: i.severity === 'critical' ? 'red' : 'orange', path: '/admin/site-health'
  }));

  // ── Handled automatically ──
  const autoItems = recentTasks.filter(t => t.status === 'completed' || t.status === 'success').slice(0, 5).map(t => ({
    title: t.action || t.task || 'Agent task', subtitle: t.agent_name || 'System', status: 'Auto', level: 'green', path: '/admin/agent-task-log'
  }));

  // ── Recently completed ──
  const completedItems = completedTasks.slice(0, 5).map(t => ({ title: t.title, subtitle: t.category || 'Completed', status: 'Done', level: 'green', path: '/admin/dashboard' }));

  return (
    <div className="space-y-6">
      {/* ── KPIs ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <KpiCard icon={Shield} label="Pending Approvals" value={approvals.count} sublabel={`${approvals.fromApprovalQueue} queue + ${approvals.fromApprovalQueueItems} items`} path="/admin/approval-queue" tooltip={approvals.formula} level={approvals.count > 0 ? 'orange' : 'green'} />
        <KpiCard icon={DollarSign} label="Verified Revenue" value={`$${revenue.total.toLocaleString('en-AU')}`} sublabel={`${revenue.count} paid orders`} path="/admin/orders" tooltip={revenue.formula} level="green" />
        <KpiCard icon={AlertTriangle} label="Payment Exceptions" value={paymentExcs.count} sublabel="Needs resolution" path="/admin/payment-diagnostics" tooltip={paymentExcs.formula} level={paymentExcs.count > 0 ? 'red' : 'green'} />
        <KpiCard icon={Star} label="Active Releases" value={releases.length} sublabel={`${releases.filter(r => r.status !== 'released').length} in progress`} path="/admin/releases" level="grey" />
      </div>

      {/* ── Do Now + Waiting ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <SectionCard title="Do Now" count={doNowItems.length} actionLabel="All blocked" actionPath="/admin/dashboard">
          {aqLoading ? <LoadingState /> : doNowItems.length === 0 ? <EmptyState message="Nothing urgent. You're all caught up." icon={CheckCircle2} /> : doNowItems.map((item, i) => <RowItem key={i} {...item} />)}
        </SectionCard>
        <SectionCard title="Waiting for Gannon" count={waitingItems.length} actionLabel="View all" actionPath="/admin/approval-queue">
          {waitingItems.length === 0 ? <EmptyState message="No approvals waiting." icon={CheckCircle2} /> : waitingItems.map((item, i) => <RowItem key={i} {...item} />)}
        </SectionCard>
      </div>

      {/* ── Money + Release ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <SectionCard title="Money & Customer Exceptions" count={moneyItems.length} actionLabel="Orders" actionPath="/admin/orders">
          {moneyItems.length === 0 ? <EmptyState message="No payment exceptions." icon={CheckCircle2} /> : moneyItems.map((item, i) => <RowItem key={i} {...item} />)}
        </SectionCard>
        <SectionCard title="Release & Campaign Deadlines" count={releaseItems.length} actionLabel="All releases" actionPath="/admin/releases">
          {releaseItems.length === 0 ? <EmptyState message="No active release campaigns." /> : releaseItems.map((item, i) => <RowItem key={i} {...item} />)}
        </SectionCard>
      </div>

      {/* ── Content + Incidents ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <SectionCard title="Content Ready for Review" count={contentItems.length} actionLabel="Content studio" actionPath="/admin/content-studio">
          {contentItems.length === 0 ? <EmptyState message="No content awaiting review." /> : contentItems.map((item, i) => <RowItem key={i} {...item} />)}
        </SectionCard>
        <SectionCard title="System Incidents Requiring Approval" count={incidentItems.length} actionLabel="Site health" actionPath="/admin/site-health">
          {incidentItems.length === 0 ? <EmptyState message="No critical system incidents." icon={CheckCircle2} /> : incidentItems.map((item, i) => <RowItem key={i} {...item} />)}
        </SectionCard>
      </div>

      {/* ── Handled Automatically + Recently Completed ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <SectionCard title="Handled Automatically" count={autoItems.length} actionLabel="Agent log" actionPath="/admin/agent-task-log">
          {autoItems.length === 0 ? <EmptyState message="No recent automated activity." /> : autoItems.map((item, i) => <RowItem key={i} {...item} />)}
        </SectionCard>
        <SectionCard title="Recently Completed" count={completedItems.length} actionLabel="Dashboard" actionPath="/admin/dashboard">
          {completedItems.length === 0 ? <EmptyState message="Nothing completed recently." /> : completedItems.map((item, i) => <RowItem key={i} {...item} />)}
        </SectionCard>
      </div>

      {/* ── Strategic Plan Preview ── */}
      {strategic.length > 0 && (
        <SectionCard title="Strategic Plan — Open Items" count={strategic.length} actionLabel="View" actionPath="/admin/strategic-execution-plan">
          {strategic.slice(0, 5).map(item => (
            <RowItem key={item.id} title={item.title} subtitle={`${item.category || 'Strategic'} · ${item.timeframe || ''}`} status={item.priority} level={item.priority === 'critical' ? 'red' : item.priority === 'high' ? 'orange' : 'grey'} path="/admin/strategic-execution-plan" />
          ))}
        </SectionCard>
      )}
    </div>
  );
}