// Idempotence Key Registry — Prevent duplicate side effects on retry
import { base44 } from '@/api/base44Client';

const IDEMPOTENCE_CACHE = new Map(); // In-memory cache for fast path

/**
 * Check if request was already processed
 * @param {String} idempotenceKey - Unique key for this operation
 * @returns {Object|null} - Previous result if exists, null if new
 */
export const checkIdempotence = async (idempotenceKey) => {
  // Fast path: check in-memory cache
  if (IDEMPOTENCE_CACHE.has(idempotenceKey)) {
    return IDEMPOTENCE_CACHE.get(idempotenceKey);
  }
  
  // Slow path: check database
  try {
    const entries = await base44.entities.IdempotenceLog.filter({
      idempotence_key: idempotenceKey,
    });
    
    if (entries.length > 0) {
      const entry = entries[0];
      IDEMPOTENCE_CACHE.set(idempotenceKey, entry.result);
      return entry.result;
    }
  } catch (error) {
    console.error('Idempotence check failed:', error);
  }
  
  return null;
};

/**
 * Record operation result for future retries
 * @param {String} idempotenceKey - Unique key for this operation
 * @param {Object} result - Result to cache
 */
export const recordIdempotence = async (idempotenceKey, result) => {
  try {
    await base44.entities.IdempotenceLog.create({
      idempotence_key: idempotenceKey,
      result,
      created_at: new Date().toISOString(),
    });
    
    IDEMPOTENCE_CACHE.set(idempotenceKey, result);
  } catch (error) {
    console.error('Idempotence recording failed:', error);
  }
};

export default { checkIdempotence, recordIdempotence };