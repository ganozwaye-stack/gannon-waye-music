import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Heart, Inbox, XCircle } from 'lucide-react';

const STORAGE_KEY = 'sonia-family-upload-submissions-v1';

function loadUploads() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch (error) {
    console.warn('Could not load family uploads', error);
    return [];
  }
}

export default function FamilyUploads() {
  const [uploads, setUploads] = useState(loadUploads);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(uploads));
  }, [uploads]);

  const setStatus = (id, status) => {
    setUploads(current => current.map(upload => upload.id === id ? { ...upload, status } : upload));
  };

  const grouped = {
    pending: uploads.filter(upload => upload.status === 'pending'),
    approved: uploads.filter(upload => upload.status === 'approved'),
    rejected: uploads.filter(upload => upload.status === 'rejected'),
  };

  return (
    <div className="space-y-6 pb-16">
      <div className="space-y-2">
        <p className="font-body text-xs tracking-[0.3em] uppercase gradient-gold-glow">Sonia Family Archive</p>
        <h1 className="font-display text-3xl font-bold gradient-gold-text">Family Upload Review</h1>
        <p className="text-sm text-muted-foreground max-w-3xl">Review family submitted photos, videos, voice notes, eulogies, speeches, stories, and memories before anything becomes part of the tribute archive.</p>
      </div>

      <Card className="border-amber-500/30 bg-amber-500/5">
        <CardContent className="p-4 text-sm text-amber-300">Prototype note: this first version reads local browser submissions. Connect persistent backend storage before sharing widely with family.</CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <Card><CardContent className="p-4"><p className="text-2xl font-display font-bold">{grouped.pending.length}</p><p className="text-xs text-muted-foreground">Pending</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-2xl font-display font-bold text-green-400">{grouped.approved.length}</p><p className="text-xs text-muted-foreground">Approved</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-2xl font-display font-bold text-red-400">{grouped.rejected.length}</p><p className="text-xs text-muted-foreground">Rejected</p></CardContent></Card>
      </div>

      <section className="space-y-3">
        <h2 className="font-display text-lg font-semibold flex items-center gap-2"><Inbox className="h-4 w-4 text-primary" />Submissions</h2>
        {uploads.length === 0 ? (
          <Card className="border-dashed"><CardContent className="p-6 text-sm text-muted-foreground">No submissions yet.</CardContent></Card>
        ) : uploads.map(upload => (
          <Card key={upload.id} className="border-border/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center justify-between gap-3">
                <span className="flex items-center gap-2"><Heart className="h-4 w-4 text-primary" />{upload.memoryTitle || upload.uploadType}</span>
                <Badge variant="outline">{upload.status}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-muted-foreground">
                <p><span className="text-foreground">Name:</span> {upload.name}</p>
                <p><span className="text-foreground">Relationship:</span> {upload.relationship}</p>
                <p><span className="text-foreground">Contact:</span> {upload.contact || 'Not provided'}</p>
                <p><span className="text-foreground">Type:</span> {upload.uploadType}</p>
                <p><span className="text-foreground">File:</span> {upload.fileName || 'No file selected'}</p>
                <p><span className="text-foreground">Submitted:</span> {upload.createdAt ? new Date(upload.createdAt).toLocaleString() : 'Unknown'}</p>
              </div>
              {upload.memory && <p className="text-muted-foreground border border-border/50 rounded-lg p-3">{upload.memory}</p>}
              <div className="flex flex-wrap gap-2">
                <Button size="sm" className="gap-1" onClick={() => setStatus(upload.id, 'approved')}><CheckCircle2 className="h-3.5 w-3.5" />Approve</Button>
                <Button size="sm" variant="outline" className="gap-1" onClick={() => setStatus(upload.id, 'rejected')}><XCircle className="h-3.5 w-3.5" />Reject</Button>
                <Button size="sm" variant="outline" onClick={() => setStatus(upload.id, 'pending')}>Needs follow up</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </section>
    </div>
  );
}
