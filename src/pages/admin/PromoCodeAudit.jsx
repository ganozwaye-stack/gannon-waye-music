import { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tag, AlertTriangle, CheckCircle2, Calendar, DollarSign, Edit2, Trash2, Loader2, ChevronRight, Copy } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { toast as sonnerToast } from 'sonner';

export default function PromoCodeAudit() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedCode, setSelectedCode] = useState(null);
  const [editingCode, setEditingCode] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    code: '', discount_percent: 15, expires_at: '', max_uses: null, one_use_per_email: false,
    requires_approval: false, approved_emails: [], allowed_categories: [], excluded_categories: [],
    excludes_shipping: true, excludes_support: true, description: '', is_active: true
  });

  const { data: codes = [], isLoading } = useQuery({
    queryKey: ['promo-codes'],
    queryFn: () => base44.entities.PromoCode.list('-created_date'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.PromoCode.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['promo-codes'] });
      setEditingCode(null);
      toast({ title: 'Code updated' });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.PromoCode.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['promo-codes'] });
      setSelectedCode(null);
      toast({ title: 'Code deleted' });
    },
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.PromoCode.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['promo-codes'] });
      resetForm();
      toast({ title: 'Code created' });
    },
  });

  const resetForm = () => {
    setShowForm(false);
    setFormData({
      code: '', discount_percent: 15, expires_at: '', max_uses: null, one_use_per_email: false,
      requires_approval: false, approved_emails: [], allowed_categories: [], excluded_categories: [],
      excludes_shipping: true, excludes_support: true, description: '', is_active: true
    });
  };

  const handleSubmit = () => {
    if (!formData.code) { toast({ title: 'Code required', variant: 'destructive' }); return; }
    if (editingCode) {
      updateMutation.mutate({ id: editingCode.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const copyCode = (code) => { navigator.clipboard.writeText(code); sonnerToast.success('Code copied'); };

  // Audit checks
  const expiredButActive = codes.filter(c => c.is_active && c.expires_at && new Date(c.expires_at) < new Date());
  const oneHundredPercent = codes.filter(c => c.discount_percent === 100);
  const noExpiry = codes.filter(c => c.is_active && !c.expires_at);
  const requiresApprovalNoEmails = codes.filter(c => c.requires_approval && (!c.approved_emails || c.approved_emails.length === 0));

  return (
    <div className="space-y-6 pb-10">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold gradient-gold-text">Promo Code Audit</h1>
          <p className="text-muted-foreground text-sm mt-1">Full audit: expiry, usage, limits, approval, categories, checkout validation</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="gap-2"><Tag className="w-4 h-4" /> New Code</Button>
      </div>

      {/* Live Customer-Facing Code Clarity */}
      <Card className="border-amber-500/30 bg-amber-500/5">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2 text-amber-400">
            <AlertTriangle className="w-4 h-4" /> Important: Friendly codes like THANKYOU15 / FAMILYFRIENDS30 are NOT active
          </CardTitle>
        </CardHeader>
        <CardContent className="text-xs text-muted-foreground space-y-2">
          <p>The current live codes use deliberately complex strings (e.g. <code className="font-mono bg-secondary/40 px-1 rounded">F20UN26DVIP</code>, <code className="font-mono bg-secondary/40 px-1 rounded">F30MOM26A</code>) to prevent guessing. Codes like <code className="font-mono bg-secondary/40 px-1 rounded">THANKYOU15</code>, <code className="font-mono bg-secondary/40 px-1 rounded">FAMILYFRIENDS30</code>, <code className="font-mono bg-secondary/40 px-1 rounded">GIFTAPPROVED25</code>, <code className="font-mono bg-secondary/40 px-1 rounded">FRIENDS30</code> are <strong className="text-amber-400">not in the database</strong> — they will return "Code not found" if a customer tries them.</p>
          <p>If you want to give those friendly codes to fans/family, create them below using the <strong>New Code</strong> button with the exact string you want customers to type. The <strong>Description</strong> field is your internal note about who the code is for.</p>
          <p className="text-amber-400 font-semibold">Current live codes and their intended audience are shown in the table below under "Description".</p>
        </CardContent>
      </Card>

      {/* Global Discount Guard Banner */}
      <div className="bg-primary/5 border border-primary/30 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-primary mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-semibold text-primary mb-1">Global Discount Guard Active — v1.0</p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Discounts apply <strong>only to approved eligible merch product subtotal</strong>. The following are <strong>always excluded</strong> regardless of any promo code:
              shipping, postage, handling, processing fees, Stripe/merchant fees, support contributions, donations, tips, CDs, vinyl, songs, digital music releases, limited edition music releases, and music bundles containing CDs/vinyl/songs.
              This rule is enforced in backend checkout logic and <strong>cannot be bypassed by frontend</strong>.
            </p>
            <p className="text-xs text-primary mt-1 font-medium">Approved active codes: fnd@gwTYV!P (20% merch) · F@mFr!3NdsOFg@noz (30% merch)</p>
          </div>
        </div>
      </div>

      {/* Audit Summary */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <AuditStatCard label="Total Codes" value={codes.length} icon={Tag} color="text-blue-400" bg="bg-blue-500/10" />
        <AuditStatCard label="Active" value={codes.filter(c => c.is_active).length} icon={CheckCircle2} color="text-green-400" bg="bg-green-500/10" />
        <AuditStatCard label="Expired But Active" value={expiredButActive.length} icon={AlertTriangle} color="text-red-400" bg="bg-red-500/10" urgent />
        <AuditStatCard label="100% Discount" value={oneHundredPercent.length} icon={DollarSign} color="text-amber-400" bg="bg-amber-500/10" urgent />
        <AuditStatCard label="No Expiry" value={noExpiry.length} icon={Calendar} color="text-purple-400" bg="bg-purple-500/10" />
      </div>

      {/* Critical Issues */}
      {expiredButActive.length > 0 && (
        <Card className="border-red-500/30 bg-red-500/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2 text-red-400">
              <AlertTriangle className="w-4 h-4" /> Expired But Still Active
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {expiredButActive.map(c => (
              <div key={c.id} className="flex items-center justify-between border border-red-500/20 rounded-lg p-3">
                <div>
                  <p className="font-semibold text-sm">{c.code}</p>
                  <p className="text-xs text-muted-foreground">Expired: {new Date(c.expires_at).toLocaleString('en-AU')}</p>
                </div>
                <Button size="sm" variant="outline" onClick={() => { setEditingCode(c); setFormData(c); setShowForm(true); }} className="text-xs">Fix</Button>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {oneHundredPercent.length > 0 && (
        <Card className="border-amber-500/30 bg-amber-500/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2 text-amber-400">
              <DollarSign className="w-4 h-4" /> 100% Discount Codes (Revenue Risk)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {oneHundredPercent.map(c => (
              <div key={c.id} className="flex items-center justify-between border border-amber-500/20 rounded-lg p-3">
                <div>
                  <p className="font-semibold text-sm">{c.code}</p>
                  <p className="text-xs text-muted-foreground">Uses: {c.times_used || 0}{c.max_uses ? ` / ${c.max_uses}` : ''}</p>
                </div>
                <Button size="sm" variant="outline" onClick={() => { setEditingCode(c); setFormData(c); setShowForm(true); }} className="text-xs">Review</Button>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* All Codes */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">All Promo Codes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {codes.map(code => (
            <button
              key={code.id}
              onClick={() => setSelectedCode(code)}
              className="w-full text-left border border-border rounded-lg p-3 hover:border-primary/40 hover:bg-secondary/30 transition-all group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <code className="text-sm font-mono font-semibold">{code.code}</code>
                  {code.is_active ? <Badge className="bg-green-500/10 text-green-400">Active</Badge> : <Badge variant="outline">Inactive</Badge>}
                  {code.requires_approval && <Badge variant="outline" className="text-xs">Approval Required</Badge>}
                  {code.expires_at && new Date(code.expires_at) < new Date() && <Badge className="bg-red-500/10 text-red-400">Expired</Badge>}
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-muted-foreground">{code.discount_percent}% off</span>
                  {code.times_used > 0 && <span className="text-xs text-muted-foreground">{code.times_used} uses</span>}
                  <ChevronRight className="w-3 h-3 text-muted-foreground group-hover:text-primary" />
                </div>
              </div>
            </button>
          ))}
        </CardContent>
      </Card>

      {/* Code Detail Modal */}
      {selectedCode && (
        <Dialog open onOpenChange={() => setSelectedCode(null)}>
          <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="font-display text-xl flex items-center gap-2">
                <Tag className="w-5 h-5 text-primary" /> {selectedCode.code}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-2">
              <div className="grid grid-cols-2 gap-4">
                <DetailRow label="Discount" value={`${selectedCode.discount_percent}%`} />
                <DetailRow label="Status" value={selectedCode.is_active ? 'Active' : 'Inactive'} />
                <DetailRow label="Expiry" value={selectedCode.expires_at ? new Date(selectedCode.expires_at).toLocaleString('en-AU') : 'No expiry'} />
                <DetailRow label="Usage" value={`${selectedCode.times_used || 0}${selectedCode.max_uses ? ` / ${selectedCode.max_uses}` : ' (unlimited)'}`} />
                <DetailRow label="One Use Per Email" value={selectedCode.one_use_per_email ? 'Yes' : 'No'} />
                <DetailRow label="Requires Approval" value={selectedCode.requires_approval ? 'Yes' : 'No'} />
                <DetailRow label="Excludes Shipping" value={selectedCode.excludes_shipping ? 'Yes' : 'No'} />
                <DetailRow label="Excludes Support" value={selectedCode.excludes_support ? 'Yes' : 'No'} />
              </div>

              {selectedCode.description && (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Description</p>
                  <p className="text-sm text-foreground/80 bg-secondary/30 rounded-lg p-3">{selectedCode.description}</p>
                </div>
              )}

              {selectedCode.allowed_categories?.length > 0 && (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Allowed Categories</p>
                  <div className="flex flex-wrap gap-1">{selectedCode.allowed_categories.map(c => <Badge key={c} variant="outline">{c}</Badge>)}</div>
                </div>
              )}

              {selectedCode.excluded_categories?.length > 0 && (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Excluded Categories</p>
                  <div className="flex flex-wrap gap-1">{selectedCode.excluded_categories.map(c => <Badge key={c} variant="outline">{c}</Badge>)}</div>
                </div>
              )}

              {selectedCode.approved_emails?.length > 0 && (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Approved Emails ({selectedCode.approved_emails.length})</p>
                  <div className="max-h-32 overflow-y-auto text-xs font-mono bg-secondary/20 rounded p-2">
                    {selectedCode.approved_emails.join(', ')}
                  </div>
                </div>
              )}

              {selectedCode.used_by_emails?.length > 0 && (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Used By Emails ({selectedCode.used_by_emails.length})</p>
                  <div className="max-h-32 overflow-y-auto text-xs font-mono bg-secondary/20 rounded p-2">
                    {selectedCode.used_by_emails.join(', ')}
                  </div>
                </div>
              )}

              <div className="flex gap-2 flex-wrap pt-2 border-t border-border">
                <Button size="sm" onClick={() => { setEditingCode(selectedCode); setFormData(selectedCode); setShowForm(true); setSelectedCode(null); }} className="gap-1"><Edit2 className="w-3 h-3" /> Edit</Button>
                <Button size="sm" variant="outline" onClick={() => copyCode(selectedCode.code)} className="gap-1"><Copy className="w-3 h-3" /> Copy Code</Button>
                <Button size="sm" variant="destructive" onClick={() => deleteMutation.mutate(selectedCode.id)} className="gap-1"><Trash2 className="w-3 h-3" /> Delete</Button>
              </div>

              <p className="text-xs text-muted-foreground italic border-t border-border pt-2">
                Source chain: PromoCode entity → validatePromoCode function → CheckoutModal → createCheckoutSession → Stripe → MerchOrder
              </p>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Edit/Create Form */}
      {showForm && (
        <Dialog open onOpenChange={() => { setShowForm(false); resetForm(); }}>
          <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingCode ? 'Edit Code' : 'New Promo Code'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-2">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs uppercase tracking-wider">Code *</Label>
                  <Input value={formData.code} onChange={(e) => setFormData({ ...formData, code: e.target.value })} placeholder="e.g. fnd@gwTYV!P — stored exactly as typed" />
                  <p className="text-xs text-muted-foreground mt-1">⚠️ Code is stored and matched EXACTLY as typed. Do not transform case.</p>
                </div>
                <div>
                  <Label className="text-xs uppercase tracking-wider">Discount % *</Label>
                  <Input type="number" value={formData.discount_percent} onChange={(e) => setFormData({ ...formData, discount_percent: parseInt(e.target.value) })} />
                </div>
              </div>

              <div>
                <Label className="text-xs uppercase tracking-wider">Description</Label>
                <Textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="h-20" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs uppercase tracking-wider">Expiry Date</Label>
                  <Input type="datetime-local" value={formData.expires_at ? formData.expires_at.slice(0, 16) : ''} onChange={(e) => setFormData({ ...formData, expires_at: e.target.value ? new Date(e.target.value).toISOString() : null })} />
                </div>
                <div>
                  <Label className="text-xs uppercase tracking-wider">Max Uses (blank = unlimited)</Label>
                  <Input type="number" value={formData.max_uses || ''} onChange={(e) => setFormData({ ...formData, max_uses: e.target.value ? parseInt(e.target.value) : null })} />
                </div>
              </div>

              <div className="space-y-2 border border-border rounded-lg p-3">
                <Label className="text-xs uppercase tracking-wider">Restrictions</Label>
                <div className="flex items-center gap-2">
                  <Switch checked={formData.one_use_per_email} onCheckedChange={(v) => setFormData({ ...formData, one_use_per_email: v })} />
                  <span className="text-sm">One use per email</span>
                </div>
                <div className="flex items-center gap-2">
                  <Switch checked={formData.requires_approval} onCheckedChange={(v) => setFormData({ ...formData, requires_approval: v })} />
                  <span className="text-sm">Requires approval (email must be in approved list)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Switch checked={formData.excludes_shipping} onCheckedChange={(v) => setFormData({ ...formData, excludes_shipping: v })} />
                  <span className="text-sm">Excludes shipping</span>
                </div>
                <div className="flex items-center gap-2">
                  <Switch checked={formData.excludes_support} onCheckedChange={(v) => setFormData({ ...formData, excludes_support: v })} />
                  <span className="text-sm">Excludes support contributions</span>
                </div>
              </div>

              <div className="flex gap-2">
                <Button onClick={handleSubmit} disabled={createMutation.isPending || updateMutation.isPending}>
                  {createMutation.isPending || updateMutation.isPending ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : null}
                  {editingCode ? 'Update' : 'Create'}
                </Button>
                <Button variant="outline" onClick={() => { setShowForm(false); resetForm(); }}>Cancel</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

function AuditStatCard({ label, value, icon: Icon, color, bg, urgent }) {
  if (!Icon) return null;
  return (
    <Card className={urgent ? 'border-red-500/30' : ''}>
      <CardContent className="p-4 flex items-center gap-3">
        <div className={`${bg} p-2 rounded-lg shrink-0`}><Icon className={`w-5 h-5 ${color}`} /></div>
        <div>
          <p className={`text-2xl font-bold ${urgent ? 'text-red-400' : ''}`}>{value}</p>
          <p className="text-xs text-muted-foreground">{label}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function DetailRow({ label, value }) {
  return (
    <div className="border border-border/50 rounded-lg p-2">
      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">{label}</p>
      <p className="text-sm font-medium">{value}</p>
    </div>
  );
}