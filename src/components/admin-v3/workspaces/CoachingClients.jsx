import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { SectionCard, RowItem, LoadingState, EmptyState } from '@/components/admin-v3/shared/SharedComponents';
import { COACHING_STAGES, mapCoachingStage } from '@/lib/adminV3Adapters';

export default function CoachingClients() {
  const { data: leads = [], isLoading } = useQuery({
    queryKey: ['v3-ws-coaching-leads'],
    queryFn: () => base44.entities.CoachingLead.list('-created_date', 100),
    staleTime: 30_000,
  });
  const { data: clients = [] } = useQuery({
    queryKey: ['v3-ws-coaching-clients'],
    queryFn: () => base44.entities.CoachingClient.list('-created_date', 50),
    staleTime: 30_000,
  });
  const { data: intakes = [] } = useQuery({
    queryKey: ['v3-ws-coaching-intakes'],
    queryFn: () => base44.entities.CoachingIntake.list('-created_date', 50),
    staleTime: 30_000,
  });
  const { data: sessions = [] } = useQuery({
    queryKey: ['v3-ws-coaching-sessions'],
    queryFn: () => base44.entities.CoachingSession.list('-created_date', 50),
    staleTime: 30_000,
  });
  const { data: offers = [] } = useQuery({
    queryKey: ['v3-ws-coaching-offers'],
    queryFn: () => base44.entities.CoachingOffer.list('-sort_order', 20),
    staleTime: 60_000,
  });
  const { data: resources = [] } = useQuery({
    queryKey: ['v3-ws-coaching-resources'],
    queryFn: () => base44.entities.CoachingResource.list('-created_date', 30),
    staleTime: 60_000,
  });
  const { data: workbooks = [] } = useQuery({
    queryKey: ['v3-ws-coaching-workbooks'],
    queryFn: () => base44.entities.CoachingWorkbook.list('-created_date', 30),
    staleTime: 60_000,
  });
  const { data: testimonials = [] } = useQuery({
    queryKey: ['v3-ws-coaching-testimonials'],
    queryFn: () => base44.entities.CoachingTestimonial.list('-created_date', 20),
    staleTime: 60_000,
  });
  const { data: bookings = [] } = useQuery({
    queryKey: ['v3-ws-booking-enquiries'],
    queryFn: () => base44.entities.BookingEnquiry.list('-created_date', 30),
    staleTime: 30_000,
  });

  // ── Group leads by stage ──
  const leadsByStage = useMemo(() => {
    const groups = {};
    COACHING_STAGES.forEach(s => groups[s] = []);
    leads.forEach(l => {
      const stage = mapCoachingStage(l);
      if (!groups[stage]) groups[stage] = [];
      groups[stage].push(l);
    });
    return groups;
  }, [leads]);

  return (
    <div className="space-y-6">
      {/* ── Stats ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="border border-border/40 rounded-xl px-4 py-3 bg-card/30"><p className="text-[10px] uppercase tracking-wide text-muted-foreground">Leads</p><p className="text-xl font-semibold text-foreground">{leads.length}</p></div>
        <div className="border border-border/40 rounded-xl px-4 py-3 bg-card/30"><p className="text-[10px] uppercase tracking-wide text-muted-foreground">Clients</p><p className="text-xl font-semibold text-foreground">{clients.length}</p></div>
        <div className="border border-border/40 rounded-xl px-4 py-3 bg-card/30"><p className="text-[10px] uppercase tracking-wide text-muted-foreground">Sessions</p><p className="text-xl font-semibold text-foreground">{sessions.length}</p></div>
        <div className="border border-border/40 rounded-xl px-4 py-3 bg-card/30"><p className="text-[10px] uppercase tracking-wide text-muted-foreground">Booking Enquiries</p><p className="text-xl font-semibold text-foreground">{bookings.length}</p></div>
      </div>

      {/* ── Coaching Pipeline ── */}
      <SectionCard title="Coaching Pipeline" count={leads.length} actionLabel="Leads" actionPath="/admin/coaching-leads">
        {isLoading ? <LoadingState /> : leads.length === 0 ? <EmptyState message="No coaching leads." /> : (
          <div className="p-3 space-y-3">
            {COACHING_STAGES.map(stage => {
              const stageLeads = leadsByStage[stage] || [];
              if (stageLeads.length === 0) return null;
              return (
                <div key={stage}>
                  <p className="text-[10px] uppercase tracking-wide text-muted-foreground mb-1.5">{stage} <span className="opacity-50">({stageLeads.length})</span></p>
                  {stageLeads.slice(0, 5).map(l => (
                    <RowItem key={l.id} title={l.name || l.customer_name || 'Lead'} subtitle={l.email || l.program_type || ''} status={l.status || 'new'} statusLevel={stage === 'Enquiry' ? 'orange' : stage === 'Session' ? 'green' : 'grey'} path="/admin/coaching-leads" />
                  ))}
                  {stageLeads.length > 5 && <p className="text-[10px] text-muted-foreground/40 px-3">+{stageLeads.length - 5} more</p>}
                </div>
              );
            })}
          </div>
        )}
      </SectionCard>

      {/* ── Sessions & Bookings ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <SectionCard title="Upcoming Sessions" count={sessions.length} actionLabel="Scheduler" actionPath="/admin/appointment-scheduler">
          {sessions.length === 0 ? <EmptyState message="No sessions scheduled." /> : sessions.slice(0, 8).map(s => (
            <RowItem key={s.id} title={s.client_name || 'Client'} subtitle={s.session_date ? new Date(s.session_date).toLocaleString('en-AU') : 'Unscheduled'} status={s.status || 'scheduled'} statusLevel={s.status === 'completed' ? 'green' : 'blue'} path="/admin/appointment-scheduler" />
          ))}
        </SectionCard>

        <SectionCard title="Booking Enquiries" count={bookings.length} actionLabel="View" actionPath="/admin/coaching-leads">
          {bookings.length === 0 ? <EmptyState message="No booking enquiries." /> : bookings.slice(0, 8).map(b => (
            <RowItem key={b.id} title={b.name || b.contact_name || 'Enquiry'} subtitle={b.event_type || b.booking_type || ''} status={b.status || 'new'} statusLevel={b.status === 'confirmed' ? 'green' : 'orange'} path="/admin/coaching-leads" />
          ))}
        </SectionCard>
      </div>

      {/* ── Literature Studio ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <SectionCard title="Workbooks" count={workbooks.length} actionLabel="Workbook builder" actionPath="/admin/workbook-builder">
          {workbooks.length === 0 ? <EmptyState message="No workbooks." /> : workbooks.slice(0, 5).map(w => (
            <RowItem key={w.id} title={w.title || 'Workbook'} subtitle={w.description || ''} status={w.status || 'draft'} statusLevel="grey" path="/admin/workbook-builder" />
          ))}
        </SectionCard>
        <SectionCard title="Resources" count={resources.length} actionLabel="Library" actionPath="/admin/client-resource-library">
          {resources.length === 0 ? <EmptyState message="No resources." /> : resources.slice(0, 5).map(r => (
            <RowItem key={r.id} title={r.title || 'Resource'} subtitle={r.type || ''} status="Available" statusLevel="green" path="/admin/client-resource-library" />
          ))}
        </SectionCard>
        <SectionCard title="Offers" count={offers.length} actionLabel="View" actionPath="/admin/coaching-programs">
          {offers.length === 0 ? <EmptyState message="No offers." /> : offers.slice(0, 5).map(o => (
            <RowItem key={o.id} title={o.title || o.name || 'Offer'} subtitle={o.price ? `$${o.price}` : ''} status={o.status || 'active'} statusLevel="grey" path="/admin/coaching-programs" />
          ))}
        </SectionCard>
      </div>

      {/* ── Testimonials ── */}
      {testimonials.length > 0 && (
        <SectionCard title="Testimonials" count={testimonials.length} actionLabel="View" actionPath="/admin/coaching-clients">
          {testimonials.slice(0, 5).map(t => (
            <RowItem key={t.id} title={t.client_name || 'Client'} subtitle={t.content || ''} status={t.is_approved ? 'Approved' : 'Pending'} statusLevel={t.is_approved ? 'green' : 'orange'} path="/admin/coaching-clients" />
          ))}
        </SectionCard>
      )}

      {/* ── Privacy notice ── */}
      <div className="border border-border/20 rounded-lg px-4 py-3 bg-card/20">
        <p className="text-[10px] text-muted-foreground/50">
          Coaching records are private. The distinction between coaching and therapy is maintained. Client information is never exposed to public pages. Nothing is sent to a client without explicit approval.
        </p>
      </div>
    </div>
  );
}