import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const STATUS_COLORS = {
  draft: 'bg-secondary text-muted-foreground',
  awaiting_approval: 'bg-yellow-500/20 text-yellow-300',
  approved: 'bg-green-500/20 text-green-300',
  rejected: 'bg-red-500/20 text-red-300',
  published: 'bg-blue-500/20 text-blue-300',
};

export default function VisualApprovalTab() {
  const qc = useQueryClient();

  const { data: compositions = [], isLoading } = useQuery({
    queryKey: ['MerchVisualComposition'],
    queryFn: () => base44.entities.MerchVisualComposition.list('-created_date', 100),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.MerchVisualComposition.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['MerchVisualComposition'] }),
  });

  const pending = compositions.filter(c => c.approval_status === 'awaiting_approval');
  const approved = compositions.filter(c => c.approval_status === 'approved');
  const all = compositions;

  const handleApprove = (id) => updateMutation.mutate({ id, data: { approval_status: 'approved' } });
  const handleReject = (id) => updateMutation.mutate({ id, data: { approval_status: 'rejected' } });
  const handlePublish = (id) => updateMutation.mutate({ id, data: { approval_status: 'published' } });

  if (isLoading) return <p className="text-muted-foreground text-sm">Loading...</p>;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-1">Approval Queue</h2>
        <p className="text-sm text-muted-foreground">
          {pending.length} awaiting approval · {approved.length} approved · All publishing requires Gannon sign-off.
        </p>
      </div>

      <div className="rounded-xl border border-yellow-500/30 bg-yellow-500/5 p-4">
        <p className="text-xs text-muted-foreground">
          <strong className="text-yellow-300">Auto-post is blocked.</strong> Approved compositions can be queued to Metricool or ContentPost only after Gannon explicitly approves each asset. No content goes live without this step.
        </p>
      </div>

      {all.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground/50">
          <p className="text-sm">No compositions yet. Build one in the Composition Builder tab.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {all.map(c => (
            <div key={c.id} className="border border-border rounded-xl p-4 bg-card">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="space-y-1">
                  <p className="font-medium text-sm text-foreground">{c.title}</p>
                  <div className="flex gap-2 flex-wrap">
                    <Badge className={`text-[10px] ${STATUS_COLORS[c.approval_status]}`}>{c.approval_status}</Badge>
                    <Badge className="text-[10px] bg-secondary text-muted-foreground">{c.layout_type}</Badge>
                    {c.canvas_size && <Badge className="text-[10px] bg-secondary text-muted-foreground">{c.canvas_size}</Badge>}
                  </div>
                  {c.text_overlay && <p className="text-xs text-muted-foreground italic">"{c.text_overlay}"</p>}
                  {c.cta && <p className="text-xs text-primary/70">{c.cta}</p>}
                </div>

                <div className="flex gap-2 flex-wrap">
                  {c.approval_status === 'awaiting_approval' && (
                    <>
                      <Button size="sm" onClick={() => handleApprove(c.id)} className="bg-green-600 hover:bg-green-700 text-white text-xs h-7">Approve</Button>
                      <Button size="sm" variant="destructive" onClick={() => handleReject(c.id)} className="text-xs h-7">Reject</Button>
                    </>
                  )}
                  {c.approval_status === 'approved' && (
                    <Button size="sm" onClick={() => handlePublish(c.id)} className="bg-blue-600 hover:bg-blue-700 text-white text-xs h-7">Publish</Button>
                  )}
                  {c.approval_status === 'draft' && (
                    <Button size="sm" variant="outline" onClick={() => updateMutation.mutate({ id: c.id, data: { approval_status: 'awaiting_approval' } })} className="text-xs h-7">
                      Send to Queue
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}