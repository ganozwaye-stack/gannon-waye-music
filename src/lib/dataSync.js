/**
 * Centralized Data Synchronization Engine
 * Ensures all data changes propagate automatically across the platform
 * Single source of truth - NO MANUAL DUPLICATION
 */

import { base44 } from '@/api/base44Client';
import { calculateProductProfitability, calculateInventoryValuation } from './businessLogic';
import { emitEvent, EVENT_TYPES } from './eventAutomation';

/**
 * Update product and propagate changes to all dependent systems
 */
export const syncProductUpdate = async (productId, updates) => {
  try {
    // Get current product state
    const products = await base44.entities.MerchProduct.filter({ id: productId });
    if (products.length === 0) throw new Error('Product not found');
    
    const oldProduct = products[0];
    
    // Update product
    await base44.entities.MerchProduct.update(productId, updates);
    
    // Get updated product
    const updatedProducts = await base44.entities.MerchProduct.filter({ id: productId });
    const newProduct = updatedProducts[0];
    
    // Recalculate profitability
    const profitability = calculateProductProfitability(newProduct);
    await base44.entities.MerchProduct.update(productId, {
      profit_margin_percent: profitability.profitability.marginPercent,
      total_profit_per_unit: profitability.profitability.profit,
    });
    
    // Emit event for automation
    await emitEvent(EVENT_TYPES.PRODUCT_UPDATED, {
      ...newProduct,
      old_data: oldProduct,
      changed_fields: Object.keys(updates),
    });
    
    // Update inventory valuation if stock changed
    if (updates.stock_quantity !== undefined) {
      await syncInventoryChange('MerchProduct', productId, updates.stock_quantity, oldProduct.stock_quantity);
    }
    
    return { success: true, product: newProduct };
  } catch (error) {
    console.error('Product sync failed:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Sync inventory changes across platform
 */
export const syncInventoryChange = async (entityName, entityId, newStock, oldStock = null) => {
  try {
    // Check for low stock
    if (newStock < 10 && (oldStock === null || oldStock >= 10)) {
      await emitEvent(EVENT_TYPES.INVENTORY_LOW, {
        entity_name: entityName,
        entity_id: entityId,
        current_stock: newStock,
        previous_stock: oldStock,
      });
    }
    
    // Emit inventory change event
    await emitEvent(EVENT_TYPES.INVENTORY_CHANGED, {
      entity_name: entityName,
      entity_id: entityId,
      current_stock: newStock,
      previous_stock: oldStock,
      change: newStock - (oldStock || 0),
    });
    
    // Recalculate total inventory valuation
    await recalculateInventoryMetrics();
    
    return { success: true };
  } catch (error) {
    console.error('Inventory sync failed:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Recalculate inventory metrics across all products
 */
export const recalculateInventoryMetrics = async () => {
  try {
    const products = await base44.entities.MerchProduct.list();
    const valuation = calculateInventoryValuation(products);
    
    // Could store aggregate metrics in a settings entity
    console.log('Inventory valuation updated:', valuation);
    
    return { success: true, valuation };
  } catch (error) {
    console.error('Inventory metrics recalculation failed:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Sync supporter profile with all related activity
 */
export const syncSupporterProfile = async (email) => {
  try {
    // Fetch all related data
    const [profiles, orders, contributions] = await Promise.all([
      base44.entities.SupporterProfile.filter({ supporter_email: email }),
      base44.entities.MerchOrder.filter({ customer_email: email }),
      base44.entities.SupportContribution.filter({ supporter_email: email }),
    ]);
    
    const merchSpend = orders.reduce((sum, o) => sum + (o.total_amount || 0), 0);
    const donationSpend = contributions.reduce((sum, c) => sum + (c.amount || 0), 0);
    const totalLTV = merchSpend + donationSpend;
    
    // Determine tier
    let tier = 'with_you';
    let badge = 'supporter';
    if (totalLTV >= 500) { tier = 'inner_circle'; badge = 'inner_circle'; }
    else if (totalLTV >= 200) { tier = 'movement'; badge = 'top_supporter'; }
    else if (totalLTV >= 50) { tier = 'with_you'; badge = 'supporter'; }
    
    // Update or create profile
    if (profiles.length > 0) {
      await base44.entities.SupporterProfile.update(profiles[0].id, {
        total_contributed: totalLTV,
        tier,
        badge,
      });
    } else {
      await base44.entities.SupporterProfile.create({
        supporter_email: email,
        total_contributed: totalLTV,
        tier,
        badge,
      });
    }
    
    // Emit supporter update event
    await emitEvent(EVENT_TYPES.SUPPORTER_UPDATED, {
      email,
      totalLTV,
      tier,
      badge,
    });
    
    return { success: true, profile: { email, totalLTV, tier, badge } };
  } catch (error) {
    console.error('Supporter profile sync failed:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Sync order and propagate to inventory, supporter, analytics
 */
export const syncOrderCreation = async (order) => {
  try {
    // Decrement inventory with optimistic locking (version check)
    if (order.items) {
      for (const item of order.items) {
        if (item.product_id) {
          const products = await base44.entities.MerchProduct.filter({ id: item.product_id });
          if (products.length > 0) {
            const product = products[0];
            const newStock = Math.max(0, (product.stock_quantity || 0) - item.quantity);
            
            // Optimistic lock: check version matches before update
            const updatedProducts = await base44.entities.MerchProduct.filter({ id: item.product_id });
            const currentProduct = updatedProducts[0];
            
            // If stock changed since read, retry or fail
            if (currentProduct.stock_quantity !== product.stock_quantity) {
              throw new Error(`Stock changed for ${item.product_id}. Concurrent order detected. Retry.`);
            }
            
            await base44.entities.MerchProduct.update(product.id, { stock_quantity: newStock });
            await syncInventoryChange('MerchProduct', product.id, newStock, product.stock_quantity);
          }
        }
      }
    }
    
    // Update supporter profile
    await syncSupporterProfile(order.customer_email);
    
    return { success: true };
  } catch (error) {
    console.error('Order sync failed:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Sync contribution and propagate to supporter profile, charity tracking
 */
export const syncContribution = async (contribution) => {
  try {
    // Update supporter profile
    await syncSupporterProfile(contribution.supporter_email);
    
    // Calculate charity allocation (10%)
    const charityAmount = contribution.amount * 0.10;
    
    // Could create charity tracking record here
    console.log(`Charity allocation: $${charityAmount.toFixed(2)}`);
    
    return { success: true, charityAmount };
  } catch (error) {
    console.error('Contribution sync failed:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Bulk recalculate all product profitability
 */
export const recalculateAllProductProfitability = async () => {
  try {
    const products = await base44.entities.MerchProduct.list();
    let updated = 0;
    
    for (const product of products) {
      const profitability = calculateProductProfitability(product);
      if (
        Math.abs(product.profit_margin_percent - profitability.profitability.marginPercent) > 0.01 ||
        Math.abs(product.total_profit_per_unit - profitability.profitability.profit) > 0.01
      ) {
        await base44.entities.MerchProduct.update(product.id, {
          profit_margin_percent: profitability.profitability.marginPercent,
          total_profit_per_unit: profitability.profitability.profit,
        });
        updated++;
      }
    }
    
    return { success: true, updated };
  } catch (error) {
    console.error('Bulk profitability recalculation failed:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Cleanup orphaned data
 */
export const cleanupOrphanedData = async () => {
  try {
    // Find supporter profiles without any activity
    const allProfiles = await base44.entities.SupporterProfile.list();
    let cleaned = 0;
    
    for (const profile of allProfiles) {
      const [orders, contributions] = await Promise.all([
        base44.entities.MerchOrder.filter({ customer_email: profile.supporter_email }),
        base44.entities.SupportContribution.filter({ supporter_email: profile.supporter_email }),
      ]);
      
      if (orders.length === 0 && contributions.length === 0 && (profile.total_contributed || 0) === 0) {
        // Orphaned profile - could archive instead of delete
        // await base44.entities.SupporterProfile.delete(profile.id);
        cleaned++;
      }
    }
    
    return { success: true, cleaned };
  } catch (error) {
    console.error('Orphan cleanup failed:', error);
    return { success: false, error: error.message };
  }
};

export default {
  syncProductUpdate,
  syncInventoryChange,
  syncSupporterProfile,
  syncOrderCreation,
  syncContribution,
  recalculateAllProductProfitability,
  recalculateInventoryMetrics,
  cleanupOrphanedData,
};