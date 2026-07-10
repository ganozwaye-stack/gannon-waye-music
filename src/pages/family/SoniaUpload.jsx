import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { UploadCloud, Heart, ShieldCheck } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const STORAGE_KEY = 'sonia-family-upload-submissions-v1';

const emptyForm = {
  name: '',
  relationship: '',
  contact: '',
  uploadType: 'story',
  memoryTitle: '',
  memory: '',
  file: null,
  consent: false,
  publishConsent: false,
};

const uploadTypes = [
  { value: 'story', label: 'Story / memory' },
  { value: 'photo', label: 'Photo' },
  { value: 'video', label: 'Video' },
  { value: 'voice_note', label: 'Voice note' },
  { value: 'eulogy', label: 'Eulogy / speech' },
  { value: 'other', label: 'Other' },
];

function saveLocalBackup(submission) {
  const current = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify([
      {
        ...submission,
        id: crypto?.randomUUID?.() || Date.now().toString(),
        status: 'pending',
        createdAt: new Date().toISOString(),
      },
      ...current,
    ])
  );
}

export default function SoniaUpload() {
  const [form, setForm] = useState(emptyForm);
  const [status, setStatus] = useState('idle');
  const inviteMode = typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('invite') : '';

  const update = (field, value) => setForm((current) => ({ ...current, [field]: value }));

  const submit = async (event) => {
    event.preventDefault();

    if (!form.name.trim() || !form.relationship.trim() || !form.memory.trim() || !form.consent) {
      setStatus('missing');
      return;
    }

    setStatus('saving');

    let fileUrl = '';
    const fileName = form.file?.name || '';

    try {
      if (form.file && base44?.integrations?.Core?.UploadFile) {
        const uploaded = await base44.integrations.Core.UploadFile({ file: form.file });
        fileUrl = uploaded?.file_url || uploaded?.url || uploaded?.data?.file_url || '';
      }
    } catch (error) {
      console.warn('Family upload file could not be uploaded yet', error);
    }

    const submission = {
      submitter_name: form.name.trim(),
      relationship_to_sonia: form.relationship.trim(),
      contact: form.contact.trim(),
      memory_title: form.memoryTitle.trim(),
      memory_text: form.memory.trim(),
      submission_type: form.uploadType,
      consent_to_review: form.consent,
      consent_to_publish_if_approved: form.publishConsent,
      approval_status: 'pending',
      is_public: false,
      source_page: inviteMode ? `family-sonia-upload-${inviteMode}` : 'family-sonia-upload',
      submitted_at: new Date().toISOString(),
    };

    if (fileUrl) submission.file_url = fileUrl;
    if (fileName) submission.file_name = fileName;

    try {
      await base44.entities.SoniaMemorySubmission.create(submission);
      setStatus('saved');
    } catch (error) {
      console.warn('Base44 submission failed; saving local backup', error);
      saveLocalBackup({
        name: form.name.trim(),
        relationship: form.relationship.trim(),
        contact: form.contact.trim(),
        uploadType: form.uploadType,
        memoryTitle: form.memoryTitle.trim(),
        memory: form.memory.trim(),
        fileName,
        source_page: submission.source_page,
        base44Sync: 'pending',
      });
      setStatus('saved-local');
    }

    setForm(emptyForm);
  };

  return (
    <div className="min-h-screen bg-background px-4 py-10 text-foreground">
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="space-y-3 text-center">
          <Heart className="mx-auto h-10 w-10 text-primary" />
          <p className="font-body text-xs uppercase tracking-[0.35em] text-primary">Sonia Family Memories</p>
          <h1 className="font-display text-4xl font-bold gradient-gold-text">Share something beautiful</h1>
          <p className="text-sm text-muted-foreground">
            {inviteMode === 'family'
              ? 'Family access for Sonia’s tribute launch. Share anything Gannon should review before the page goes live.'
              : 'Share a photo, video, voice note, eulogy, speech, story, or memory for Gannon to review before it becomes part of Sonia’s tribute archive.'}
          </p>
        </div>

        <Card className="border-primary/30 bg-primary/5">
          <CardContent className="flex gap-3 p-4 text-sm text-muted-foreground">
            <ShieldCheck className="h-5 w-5 shrink-0 text-primary" />
            <p>Nothing submitted here is published automatically. Gannon reviews everything first, and only approved memories are added to Sonia’s tribute archive.</p>
          </CardContent>
        </Card>

        {status === 'saved' && (
          <Card className="border-green-500/30 bg-green-500/10">
            <CardContent className="p-4 text-sm text-green-400">Thank you. Your memory has been saved for Gannon to review.</CardContent>
          </Card>
        )}

        {status === 'saved-local' && (
          <Card className="border-green-500/30 bg-green-500/10">
            <CardContent className="p-4 text-sm text-green-400">
              Thank you. Your memory has been saved as a local preview backup. Once Base44 auth is refreshed, this page will save into the shared review queue.
            </CardContent>
          </Card>
        )}

        {status === 'missing' && (
          <Card className="border-amber-500/30 bg-amber-500/10">
            <CardContent className="p-4 text-sm text-amber-300">Please add your name, relationship, memory/context, and review consent.</CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <UploadCloud className="h-5 w-5 text-primary" />
              Family upload form
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={submit} className="space-y-4">
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <Input placeholder="Your name" value={form.name} onChange={(event) => update('name', event.target.value)} />
                <Input placeholder="Relationship to Sonia" value={form.relationship} onChange={(event) => update('relationship', event.target.value)} />
                <Input placeholder="Email or phone optional" value={form.contact} onChange={(event) => update('contact', event.target.value)} />
                <select className="rounded-md border border-input bg-background px-3 text-sm" value={form.uploadType} onChange={(event) => update('uploadType', event.target.value)}>
                  {uploadTypes.map((type) => <option key={type.value} value={type.value}>{type.label}</option>)}
                </select>
              </div>

              <Input placeholder="Memory title" value={form.memoryTitle} onChange={(event) => update('memoryTitle', event.target.value)} />
              <Textarea rows={6} placeholder="Write the memory, story, or context for the file" value={form.memory} onChange={(event) => update('memory', event.target.value)} />
              <Input type="file" onChange={(event) => update('file', event.target.files?.[0] || null)} />
              {form.file?.name && <p className="text-xs text-muted-foreground">Selected file: {form.file.name}</p>}

              <label className="flex items-start gap-2 text-sm text-muted-foreground">
                <input type="checkbox" checked={form.consent} onChange={(event) => update('consent', event.target.checked)} />
                I consent to this memory being reviewed by Gannon for Sonia’s tribute archive. I understand it will not be published automatically.
              </label>

              <label className="flex items-start gap-2 text-sm text-muted-foreground">
                <input type="checkbox" checked={form.publishConsent} onChange={(event) => update('publishConsent', event.target.checked)} />
                If Gannon approves it, I consent to this memory being considered for public display on Sonia’s page.
              </label>

              <Button type="submit" className="w-full" disabled={status === 'saving'}>
                {status === 'saving' ? 'Saving for review...' : 'Submit memory for review'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
