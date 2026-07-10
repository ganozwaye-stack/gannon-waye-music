import React, { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Heart, Inbox, RefreshCw, XCircle } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const STORAGE_KEY = 'sonia-family-upload-submissions-v1';

function loadLocalUploads() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch (error) {
    console.warn('Could not load local family uploads', error);
    return [];
  }
}

function normalizeRemote(upload) {
  return {
    id: upload.id,
    source: 'base44',
    name: upload.submitter_name || '',
    relationship: upload.relationship_to_sonia || '',
    contact: upload.contact || '',
    uploadType: upload.submission_type || 'story',
    memoryTitle: upload.memory_title || '',
    memory: upload.memory_text || '',
    fileName: upload.file_name || '',
    fileUrl: upload.file_url || '',
    status: upload.approval_status || 'pending',
    createdAt: upload.submitted_at || upload.created_date,
    publishConsent: upload.consent_to_publish_if_approved,
    raw: upload,
  };
}

function normalizeLocal(upload) {
  return {
    id: upload.id,
    source: 'local',
    name: upload.name || '',
    relationship: upload.relationship || '',
    contact: upload.contact || '',
    uploadType: upload.uploadType || 'story',
    memoryTitle: upload.memoryTitle || '',
    memory: upload.memory || '',
    fileName: upload.fileName || '',
    fileUrl: upload.fileUrl || '',
    status: upload.status || 'pending',
    createdAt: upload.createdAt,
    publishConsent: upload.publishConsent,
    raw: upload,
  };
}

export default function FamilyUploads() {
  const [remoteUploads, setRemoteUploads] = useState([]);
  const [localUploads, setLocalUploads] = useState(() => loadLocalUploads().map(normalizeLocal));
  const [loading, setLoading] = useState(false);
  const [remoteStatus, setRemoteStatus] = useState('idle');

  const refresh = async () => {
    setLoading(true);
    try {
      const rows = await base44.entities.SoniaMemorySubmission.list('-submitted_at');
      setRemoteUploads(Array.isArray(rows) ? rows.map(normalizeRemote) : []);
      setRemoteStatus('connected');
    } catch (error) {
      console.warn('Could not load Base44 family submissions', error);
      setRemoteStatus('local-only');
    } finally {
      setLocalUploads(loadLocalUploads().map(normalizeLocal));
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  useEffect(() => {
    const rawLocal = localUploads.filter((upload) => upload.source === 'local').map((upload) => upload.raw || upload);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(rawLocal));
  }, [localUploads]);

  const uploads = useMemo(() => {
    const remoteIds = new Set(remoteUploads.map((upload) => upload.id));
    const locals = localUploads.filter((upload) => !remoteIds.has(upload.id));
    return [...remoteUploads, ...locals].sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
  }, [remoteUploads, localUploads]);

  const setStatus = async (upload, status) => {
    if (upload.source === 'base44') {
      try {
        await base44.entities.SoniaMemorySubmission.update(upload.id, {
          approval_status: status,
          is_public: status === 'approved' && Boolean(upload.publishConsent),
          approved_at: status === 'approved' ? new Date().toISOString() : upload.raw?.approved_at,
        });
        setRemoteUploads((current) => current.map((item) => item.id === upload.id ? { ...item, status } : item));
      } catch (error) {
        console.warn('Could not update Base44 submission status', error);
      }
      return;
    }

    setLocalUploads((current) => current.map((item) => item.id === upload.id ? { ...item, status, raw: { ...(item.raw || item), status } } : item));
  };

  const grouped = {
    pending: uploads.filter((upload) => upload.status === 'pending'),
    approved: uploads.filter((upload) => upload.status === 'approved'),
    rejected: uploads.filter((upload) => upload.status === 'rejected'),
    needs_follow_up: uploads.filter((upload) => upload.status === 'needs_follow_up'),
  };

  return (
    <div className="space-y-6 pb-16">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
        <div className="space-y-2">
          <p className="font-body text-xs uppercase tracking-[0.3em] gradient-gold-glow">Sonia Family Archive</p>
          <h1 className="font-display text-3xl font-bold gradient-gold-text">Family Upload Review</h1>
          <p className="max-w-3xl text-sm text-muted-foreground">
            Review family submitted photos, videos, voice notes, eulogies, speeches, stories, and memories before anything becomes part of the tribute archive.
          </p>
        </div>
        <Button variant="outline" size="sm" className="gap-2" onClick={refresh} disabled={loading}>
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      <Card className="border-amber-500/30 bg-amber-500/5">
        <CardContent className="p-4 text-sm text-amber-300">
          Approval control: keep memories pending until Gannon has reviewed the text, image, consent, and public-placement fit. Base44 status: {remoteStatus === 'connected' ? 'connected' : 'local preview/fallback'}.
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
        <Card><CardContent className="p-4"><p className="font-display text-2xl font-bold">{grouped.pending.length}</p><p className="text-xs text-muted-foreground">Pending</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="font-display text-2xl font-bold text-green-400">{grouped.approved.length}</p><p className="text-xs text-muted-foreground">Approved</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="font-display text-2xl font-bold text-amber-400">{grouped.needs_follow_up.length}</p><p className="text-xs text-muted-foreground">Needs follow-up</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="font-display text-2xl font-bold text-red-400">{grouped.rejected.length}</p><p className="text-xs text-muted-foreground">Rejected</p></CardContent></Card>
      </div>

      <section className="space-y-3">
        <h2 className="flex items-center gap-2 font-display text-lg font-semibold">
          <Inbox className="h-4 w-4 text-primary" />
          Submissions
        </h2>
        {uploads.length === 0 ? (
          <Card className="border-dashed"><CardContent className="p-6 text-sm text-muted-foreground">No submissions yet.</CardContent></Card>
        ) : uploads.map((upload) => (
          <Card key={`${upload.source}-${upload.id}`} className="border-border/50">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center justify-between gap-3 text-base">
                <span className="flex items-center gap-2">
                  <Heart className="h-4 w-4 text-primary" />
                  {upload.memoryTitle || upload.uploadType}
                </span>
                <div className="flex gap-2">
                  <Badge variant="outline">{upload.source}</Badge>
                  <Badge variant="outline">{upload.status}</Badge>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="grid grid-cols-1 gap-2 text-muted-foreground md:grid-cols-2">
                <p><span className="text-foreground">Name:</span> {upload.name}</p>
                <p><span className="text-foreground">Relationship:</span> {upload.relationship}</p>
                <p><span className="text-foreground">Contact:</span> {upload.contact || 'Not provided'}</p>
                <p><span className="text-foreground">Type:</span> {upload.uploadType}</p>
                <p><span className="text-foreground">File:</span> {upload.fileUrl ? <a className="text-primary underline" href={upload.fileUrl} target="_blank" rel="noreferrer">{upload.fileName || 'Open file'}</a> : (upload.fileName || 'No file selected')}</p>
                <p><span className="text-foreground">Submitted:</span> {upload.createdAt ? new Date(upload.createdAt).toLocaleString() : 'Unknown'}</p>
                <p><span className="text-foreground">Public consent:</span> {upload.publishConsent ? 'Yes' : 'No / not provided'}</p>
              </div>
              {upload.memory && <p className="rounded-lg border border-border/50 p-3 text-muted-foreground">{upload.memory}</p>}
              <div className="flex flex-wrap gap-2">
                <Button size="sm" className="gap-1" onClick={() => setStatus(upload, 'approved')}><CheckCircle2 className="h-3.5 w-3.5" />Approve</Button>
                <Button size="sm" variant="outline" className="gap-1" onClick={() => setStatus(upload, 'rejected')}><XCircle className="h-3.5 w-3.5" />Reject</Button>
                <Button size="sm" variant="outline" onClick={() => setStatus(upload, 'needs_follow_up')}>Needs follow-up</Button>
                <Button size="sm" variant="outline" onClick={() => setStatus(upload, 'pending')}>Back to pending</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </section>
    </div>
  );
}
