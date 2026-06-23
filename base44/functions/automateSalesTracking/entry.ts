import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const orders = await base44.asServiceRole.entities.MerchOrder.list('-created_date', 500);

    const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
    const totalOrders = orders.length;
    const pendingOrders = orders.filter(o => !o.status || o.status === 'pending' || o.status === 'processing').length;
    const completedOrders = orders.filter(o => o.status === 'delivered' || o.status === 'completed' || o.status === 'shipped').length;

    await base44.asServiceRole.entities.AdminNotification.create({
      notification_type: 'system',
      severity: 'info',
      title: 'Daily Sales Tracking Summary',
      summary: `${totalOrders} orders · $${totalRevenue.toFixed(2)} revenue · ${pendingOrders} pending · ${completedOrders} completed`,
      source: 'sales_tracking_automation',
      requires_action: pendingOrders > 0,
    });

    return Response.json({
      success: true,
      summary: { totalOrders, totalRevenue, pendingOrders, completedOrders },
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});