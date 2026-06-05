import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { FileText, AlertTriangle, Clock, Shield, Scale } from 'lucide-react';
import { Link } from 'react-router-dom';

const LEGAL_CATEGORIES = ['legal','evidence','risks_protections','important_dates'];

export default function LegalDashboard() {
  const { data: vault = [] } = useQuery({
    queryKey: ['knowledge-vault-legal'],
    queryFn: () => base44.entities.KnowledgeVault.list('-created_date', 100),
  });
  const { data: alerts = [] } = useQuery({
    queryKey: ['risk-alerts-legal'],
    queryFn: () => base44.entities.RiskAlert.filter({ alert_type: 'legal', status: 'open' }),
  });
  const { data: approvals = [] } = useQuery({
    queryKey: ['approval-legal'],
    queryFn: () => base44.entities.ApprovalQueue.filter({ status: 'pending' }),
  });

  const legalDocs = vault.filter(v => LEGAL_CATEGORIES.includes(v.category));
  const legalApprovals = approvals.filter(a => a.risk_type?.includes('legal'));

  const QUICK_ACTIONS = [
    { label: 'Add Legal Document', icon: FileText, link: '/admin/knowledge-vault' },
    { label: 'View Risk Alerts', icon: AlertTriangle, link: '/admin/risk-alerts' },
    { label: 'Approval Queue', icon: Clock, link: '/admin/approval-queue' },
    { label: 'Knowledge Vault', icon: Shield, link: '/admin/knowledge-vault' },
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold gradient-gold-text">Legal Dashboard</h1>
        <p className="text-muted-foreground text-sm">Legal ops, documents, evidence, timelines — organized automatically. For final advice, always consult a qualified lawyer.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard icon={FileText} color="text-orange-400" bg="bg-orange-500/10" label="Legal Documents" value={legalDocs.length} />
        <StatCard icon={AlertTriangle} color="text-red-400" bg="bg-red-500/10" label="Open Legal Alerts" value={alerts.length} />
        <StatCard icon={Clock} color="text-yellow-400" bg="bg-yellow-500/10" label="Pending Approvals" value={legalApprovals.length} />
        <StatCard icon={Scale} color="text-blue-400" bg="bg-blue-500/10" label="Evidence Items" value={vault.filter(v => v.category === 'evidence').length} />
      </div>

      <div className="bg-orange-500/5 border border-orange-500/20 rounded-lg p-4">
        <p className="text-orange-300 text-sm font-semibold">⚖️ Important Notice</p>
        <p className="text-muted-foreground text-xs mt-1">This dashboard organizes, summarizes, and flags legal matters. It does NOT provide legal advice. Always consult a qualified lawyer before taking legal action, sending legal communications, or making decisions that affect your legal position.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {QUICK_ACTIONS.map(a => (
          <Link key={a.label} to={a.link}>
            <Card className="hover:border-primary/30 transition-all cursor-pointer">
              <CardContent className="p-4">
                <a.icon className="w-5 h-5 text-orange-400 mb-2" />
                <p className="text-sm font-medium">{a.label}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {legalDocs.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-3">Legal Documents</h2>
          <div className="space-y-2">
            {legalDocs.slice(0, 10).map(doc => (
              <div key={doc.id} className="border border-border rounded-lg p-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-orange-400" />
                  <div>
                    <p className="text-sm font-medium">{doc.title}</p>
                    <p className="text-xs text-muted-foreground capitalize">{doc.category?.replace(/_/g,' ')}</p>
                  </div>
                </div>
                {doc.is_sensitive && <Badge className="bg-red-500/10 text-red-400 text-xs">Sensitive</Badge>}
              </div>
            ))}
          </div>
        </div>
      )}

      {legalDocs.length === 0 && (
        <div className="text-center py-12 border border-dashed border-border rounded-lg">
          <Scale className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground text-sm">No legal documents yet. Add them to the Knowledge Vault with category "legal" or "evidence".</p>
          <Link to="/admin/knowledge-vault">
            <Button className="mt-3 gradient-gold-button">Open Knowledge Vault</Button>
          </Link>
        </div>
      )}
    </div>
  );
}

function StatCard({ icon: Icon, color, bg, label, value }) {  
  return (
    <Card>
      <CardContent className="p-4 flex items-center gap-3">
        <div className={`${bg} p-2 rounded-lg`}><Icon className={`w-5 h-5 ${color}`} /></div>
        <div><p className="text-2xl font-bold">{value}</p><p className="text-xs text-muted-foreground">{label}</p></div>
      </CardContent>
    </Card>
  );
}