// ─── Owner Command V3 — Metric Calculations ───────────────────────────────
// All functions are pure and read-only. No side effects, no writes.
// Every formula is documented for tooltip display.

// 1. Pending approvals = ApprovalQueue (status=pending) + ApprovalQueueItem (status=needs_approval)
export function calcPendingApprovals(approvalQueue = [], approvalQueueItems = []) {
  const pendingQueue = approvalQueue.filter(a => a.status === 'pending');
  const pendingItems = approvalQueueItems.filter(a => a.status === 'needs_approval');
  return {
    count: pendingQueue.length + pendingItems.length,
    fromApprovalQueue: pendingQueue.length,
    fromApprovalQueueItems: pendingItems.length,
    items: [...pendingQueue, ...pendingItems],
    formula: 'ApprovalQueue (status=pending) + ApprovalQueueItem (status=needs_approval). Excludes approved, rejected, archived, actioned, expired.',
  };
}

// 2. Verified revenue = paid orders with reconciled payment reference, not excluded, not duplicate/cancelled
export function calcVerifiedRevenue(orders = []) {
  const verified = orders.filter(o =>
    o.payment_status === 'paid' &&
    !o.excluded_from_revenue &&
    o.status !== 'duplicate' &&
    o.status !== 'cancelled' &&
    (o.stripe_session_id || o.stripe_payment_intent)
  );
  const total = verified.reduce((sum, o) => sum + (o.total_amount || 0), 0);
  return {
    total,
    count: verified.length,
    orders: verified,
    formula: 'MerchOrder where payment_status=paid, has reconciled payment reference (stripe_session_id or stripe_payment_intent), excluded_from_revenue is not true, status is not duplicate or cancelled.',
  };
}

// 3. Orders awaiting fulfilment = paid, not excluded, not already fulfilled
export function calcOrdersAwaitingFulfilment(orders = []) {
  const fulfilledStatuses = ['shipped', 'delivered', 'cancelled', 'duplicate'];
  const awaiting = orders.filter(o =>
    o.payment_status === 'paid' &&
    !o.excluded_from_revenue &&
    !fulfilledStatuses.includes(o.status)
  );
  return {
    count: awaiting.length,
    orders: awaiting,
    formula: 'MerchOrder where payment_status=paid, excluded_from_revenue is not true, status is not shipped, delivered, cancelled, or duplicate.',
  };
}

// 4. Payment exceptions
export function calcPaymentExceptions(orders = [], diagnostics = []) {
  const exceptionStatuses = ['failed', 'refunded', 'partially_refunded', 'disputed'];
  const failedOrders = orders.filter(o => exceptionStatuses.includes(o.payment_status));
  const openDiagnostics = diagnostics.filter(d => !d.is_resolved && d.status !== 'resolved');
  return {
    count: failedOrders.length + openDiagnostics.length,
    failedOrders,
    openDiagnostics,
    formula: 'MerchOrder with failed/refunded/partially_refunded/disputed payment_status + PaymentDiagnostic records not resolved.',
  };
}

// 5. Duplicate/excluded orders
export function calcDuplicateExcluded(orders = []) {
  const duplicates = orders.filter(o => o.status === 'duplicate' || o.excluded_from_revenue);
  return {
    count: duplicates.length,
    orders: duplicates,
    formula: 'MerchOrder where status=duplicate or excluded_from_revenue=true.',
  };
}

// 6. Content ready for approval = records genuinely at approval stage (not every draft)
export function calcContentReadyForApproval(contentPosts = [], pipelineItems = []) {
  const approvalStatuses = ['needs_approval', 'ready_for_review', 'waiting_for_approval'];
  const fromPosts = contentPosts.filter(c => approvalStatuses.includes(c.status));
  const fromPipeline = pipelineItems.filter(c => approvalStatuses.includes(c.status));
  return {
    count: fromPosts.length + fromPipeline.length,
    items: [...fromPosts, ...fromPipeline],
    formula: 'ContentCalendarPost and ContentPipelineItem where status is needs_approval, ready_for_review, or waiting_for_approval. Drafts are not counted.',
  };
}

// 7. Release readiness — only from visible checklist
export function calcReleaseReadiness(release, actionPlans = []) {
  const plans = actionPlans.filter(p =>
    p.release_name === release.title || p.related_release === release.title
  );
  if (plans.length === 0) {
    return {
      canCalculate: false,
      actualStatus: release.status,
      missingRequirements: 'No ReleaseActionPlan checklist found. Showing actual release status only.',
    };
  }
  const completed = plans.filter(p => p.status === 'complete').length;
  return {
    canCalculate: true,
    percentage: Math.round((completed / plans.length) * 100),
    completed,
    total: plans.length,
    actualStatus: release.status,
    missingSteps: plans.filter(p => p.status !== 'complete').map(p => p.title),
    formula: 'ReleaseActionPlan steps with status=complete ÷ total steps for this release.',
  };
}

// 8. Agent status — never just 'active' from registry
export function calcAgentStatus(agent, taskLogs = []) {
  const agentName = agent.name || agent.agent_name || '';
  const agentTasks = taskLogs.filter(t =>
    t.agent_name === agentName || t.agent_name?.toLowerCase() === agentName?.toLowerCase()
  );
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const hasRecentExecution = agentTasks.some(t => {
    const executed = new Date(t.created_date || t.updated_date || 0);
    return executed > sevenDaysAgo;
  });
  const hasSuccessfulResult = agentTasks.some(t =>
    t.status === 'completed' || t.status === 'success' || t.result_status === 'success'
  );

  if (hasRecentExecution && hasSuccessfulResult) return { label: 'Verified working', level: 'green' };
  if (hasRecentExecution) return { label: 'Connected, not end-to-end verified', level: 'orange' };
  if (agent.status === 'blocked') return { label: 'Blocked', level: 'red' };
  if (agent.status === 'failed') return { label: 'Failed', level: 'red' };
  if (agent.status === 'waiting' || agent.status === 'pending') return { label: 'Waiting for approval', level: 'orange' };
  if (agent.status === 'inactive' || agent.status === 'archived') return { label: 'Inactive', level: 'grey' };
  return { label: 'Registered only', level: 'grey' };
}

// 9. System health — not healthy unless recent e2e test passed
export function calcSystemHealth(issues = [], lastHealthCheck = null) {
  const openIssues = issues.filter(i => i.status === 'open' || (!i.resolved && !i.is_resolved));
  const criticalIssues = openIssues.filter(i => i.severity === 'critical' || i.severity === 'high');
  const hasRecentTest = lastHealthCheck && new Date(lastHealthCheck) > new Date(Date.now() - 24 * 60 * 60 * 1000);

  if (criticalIssues.length > 0) {
    return { label: 'Issues require attention', level: 'red', openCount: openIssues.length, criticalCount: criticalIssues.length };
  }
  if (openIssues.length > 0) {
    return { label: 'Minor issues present', level: 'orange', openCount: openIssues.length };
  }
  if (hasRecentTest) {
    return { label: 'Verified healthy', level: 'green' };
  }
  return { label: 'Not end-to-end verified', level: 'grey', openCount: 0 };
}

// 10. Product cost completeness — don't show profit if costs missing
export function calcProductCostCompleteness(product) {
  const missing = [];
  if (product.cost_price == null || product.cost_price === undefined) missing.push('cost_price');
  if (product.delivery_cost == null || product.delivery_cost === undefined) missing.push('delivery_cost');
  if (product.merchant_fee_percent == null) missing.push('merchant_fee_percent');

  return {
    isComplete: missing.length === 0,
    missing,
    canShowProfit: missing.length === 0 && product.sale_price != null,
    formula: 'Profit requires cost_price, delivery_cost, and merchant_fee_percent. If any missing, profit is not shown.',
  };
}

// 11. True profit per unit (only if cost complete)
export function calcTrueProfit(product) {
  const completeness = calcProductCostCompleteness(product);
  if (!completeness.canShowProfit) return { canCalculate: false, ...completeness };
  const merchantFee = (product.sale_price || 0) * ((product.merchant_fee_percent || 0) / 100);
  const profit = (product.sale_price || 0) - (product.cost_price || 0) - (product.delivery_cost || 0) - merchantFee;
  const margin = product.sale_price > 0 ? Math.round((profit / product.sale_price) * 100) : 0;
  return { canCalculate: true, profit, margin, merchantFee, ...completeness };
}

// 12. Fan inbox categorization
export function categorizeFanMessage(item, type) {
  const text = `${item.title || ''} ${item.description || ''} ${item.message || ''} ${item.notes || ''}`.toLowerCase();
  if (type === 'booking' || text.includes('booking') || text.includes('enquiry') || text.includes('inquiry')) return 'booking';
  if (type === 'coaching' || text.includes('coach') || text.includes('session')) return 'coaching';
  if (type === 'order' || text.includes('order') || text.includes('refund') || text.includes('shipping')) return 'customer';
  if (type === 'supporter' || text.includes('donat') || text.includes('support')) return 'supporter';
  if (type === 'moderation' || text.includes('report') || text.includes('flag')) return 'moderation';
  if (text.includes('reply') || text.includes('response')) return 'reply_required';
  if (text.includes('approval') || text.includes('approve')) return 'approval';
  return 'information';
}