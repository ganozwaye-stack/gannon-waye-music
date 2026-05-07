import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

// Per-customer order locking — prevent concurrent orders
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { customerEmail, action } = await req.json();

    if (!customerEmail) {
      return Response.json({ error: 'Missing customerEmail' }, { status: 400 });
    }

    if (action === 'acquire') {
      // Check for existing lock
      const locks = await base44.asServiceRole.entities.OrderLock.filter({
        customer_email: customerEmail,
      });

      if (locks.length > 0) {
        const lock = locks[0];
        if (new Date(lock.locked_until) > new Date()) {
          return Response.json({ locked: true, message: 'Order in progress. Try again in a moment.' }, { status: 429 });
        }
        // Lock expired, delete it
        await base44.asServiceRole.entities.OrderLock.delete(lock.id);
      }

      // Acquire new lock (5 min expiry)
      const lockedUntil = new Date(Date.now() + 5 * 60 * 1000);
      await base44.asServiceRole.entities.OrderLock.create({
        customer_email: customerEmail,
        locked_at: new Date().toISOString(),
        locked_until: lockedUntil.toISOString(),
      });

      return Response.json({ locked: false, message: 'Lock acquired' });
    } else if (action === 'release') {
      // Release lock
      const locks = await base44.asServiceRole.entities.OrderLock.filter({
        customer_email: customerEmail,
      });

      if (locks.length > 0) {
        await base44.asServiceRole.entities.OrderLock.delete(locks[0].id);
      }

      return Response.json({ success: true });
    }

    return Response.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});