import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import PhoneNumberSetup from '@/components/phone/PhoneNumberSetup';
import ProviderOptions from '@/components/phone/ProviderOptions';
import InboundLeads from '@/components/phone/InboundLeads';
import CallLogs from '@/components/phone/CallLogs';
import SmsDrafts from '@/components/phone/SmsDrafts';
import LeadSources from '@/components/phone/LeadSources';
import PhoneActionRequired from '@/components/phone/PhoneActionRequired';
import { Phone, Users, MessageSquare, MapPin, AlertTriangle, BookOpen, PhoneCall } from 'lucide-react';

const TABS = [
  { id: 'setup', label: 'Number Setup', icon: Phone },
  { id: 'providers', label: 'Providers', icon: BookOpen },
  { id: 'leads', label: 'Inbound Leads', icon: Users },
  { id: 'calls', label: 'Call Logs', icon: PhoneCall },
  { id: 'sms', label: 'SMS Drafts', icon: MessageSquare },
  { id: 'sources', label: 'Lead Sources', icon: MapPin },
  { id: 'actions', label: 'Action Required', icon: AlertTriangle },
];

export default function PhoneSystem() {
  const [activeTab, setActiveTab] = useState('setup');

  const { data: phoneNumbers = [] } = useQuery({
    queryKey: ['businessPhoneNumbers'],
    queryFn: () => base44.entities.BusinessPhoneNumber.list(),
  });

  const { data: leads = [] } = useQuery({
    queryKey: ['salesCallLeads'],
    queryFn: () => base44.entities.SalesCallLead.list('-created_date'),
  });

  const { data: callLogs = [] } = useQuery({
    queryKey: ['callLogs'],
    queryFn: () => base44.entities.CallLog.list('-call_date'),
  });

  const primaryNumber = phoneNumbers[0] || null;
  const newLeads = leads.filter(l => l.crm_stage === 'new_lead').length;
  const pendingFollowUps = leads.filter(l => l.crm_stage === 'follow_up').length;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <p className="font-body text-[10px] tracking-[0.25em] uppercase text-primary mb-1">Admin</p>
        <h1 className="font-display text-3xl text-foreground flex items-center gap-3">
          <Phone className="w-7 h-7 text-primary/60" />
          Phone Sales CRM
        </h1>
        <p className="font-body text-sm text-muted-foreground mt-1">
          One business number strategy — provider not yet active — safe build mode
        </p>
      </div>

      {/* Safety Banner */}
      <div className="mb-6 bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 flex items-start gap-3">
        <AlertTriangle className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5" />
        <div>
          <p className="font-body text-xs font-semibold text-yellow-300">Safe Build Mode — No Provider Active</p>
          <p className="font-body text-xs text-yellow-200/60 mt-0.5">
            No phone number is live. No SMS will be sent automatically. No calls will be made. No money has been spent.
            This system is CRM-ready for when you choose a provider and approve the go-live.
          </p>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        {[
          { label: 'Business Number', value: primaryNumber ? '1' : '0', sub: primaryNumber?.status === 'provider_needed' ? 'Provider needed' : 'Active', color: 'text-yellow-400' },
          { label: 'New Leads', value: newLeads, sub: 'Awaiting contact', color: newLeads > 0 ? 'text-primary' : 'text-foreground' },
          { label: 'Total Leads', value: leads.length, sub: 'All time', color: 'text-foreground' },
          { label: 'Call Logs', value: callLogs.length, sub: 'Logged manually', color: 'text-foreground' },
        ].map(s => (
          <div key={s.label} className="bg-card/50 border border-border/40 rounded-xl p-4 text-center">
            <p className={`font-display text-2xl ${s.color}`}>{s.value}</p>
            <p className="font-body text-[10px] uppercase tracking-widest text-muted-foreground mt-0.5">{s.label}</p>
            <p className="font-body text-[9px] text-muted-foreground/50 mt-0.5">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-1.5 mb-6 border-b border-border/30 pb-3">
        {TABS.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-body text-xs transition-all ${
                isActive
                  ? 'bg-primary/15 text-primary border border-primary/30'
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary/40'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {tab.label}
              {tab.id === 'leads' && newLeads > 0 && (
                <span className="bg-primary text-primary-foreground rounded-full px-1.5 py-0 text-[9px] font-bold">{newLeads}</span>
              )}
              {tab.id === 'actions' && (
                <span className="bg-yellow-500 text-black rounded-full px-1.5 py-0 text-[9px] font-bold">!</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      {activeTab === 'setup' && <PhoneNumberSetup primaryNumber={primaryNumber} />}
      {activeTab === 'providers' && <ProviderOptions />}
      {activeTab === 'leads' && <InboundLeads leads={leads} />}
      {activeTab === 'calls' && <CallLogs callLogs={callLogs} leads={leads} />}
      {activeTab === 'sms' && <SmsDrafts />}
      {activeTab === 'sources' && <LeadSources />}
      {activeTab === 'actions' && <PhoneActionRequired primaryNumber={primaryNumber} />}
    </div>
  );
}