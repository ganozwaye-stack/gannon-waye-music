import { createClientFromRequest } from 'npm:@base44/sdk@0.8.44';

// Temporary one-shot cleanup: deletes the 5 duplicate Supplier records created
// in February 2026 and keeps only the original record from 2026-05-27.
// The original ID is hard-guarded so this function can never delete it.

const DUPLICATE_IDS = [
  '6a71fd0543e6d7419cd000d3',
  '6a71fd0543e6d7419cd000c2',
  '6a71fd0543e6d7419cd00099',
  '6a71fd0543e6d7419cd0000e',
  '6a71fd0543e6d7419ccfffdc',
];

const KEEP_ID = '6a16abb0198d4c5d294edc13';

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const sr = base44.asServiceRole;

    const deleted = [];
    const failed = [];

    for (const id of DUPLICATE_IDS) {
      if (id === KEEP_ID) {
        return Response.json({ error: 'Refusing to delete the protected original record' }, { status: 500 });
      }
      try {
        await sr.entities.Supplier.delete(id);
        deleted.push(id);
      } catch (e) {
        failed.push({ id, error: e?.message || 'unknown error' });
      }
    }

    const remaining = await sr.entities.Supplier.list();
    const remainingIds = remaining.map((record) => record.id);

    return Response.json({
      success: failed.length === 0,
      deleted,
      failed,
      remaining_count: remaining.length,
      remaining_ids: remainingIds,
      original_kept: remainingIds.includes(KEEP_ID),
    });
  } catch (error) {
    return Response.json({ error: error?.message || 'Unknown error' }, { status: 500 });
  }
}