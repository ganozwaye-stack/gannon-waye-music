import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { UploadCloud, Heart, ShieldCheck } from 'lucide-react';

const STORAGE_KEY = 'sonia-family-upload-submissions-v1';

const emptyForm = {
  name: '',
  relationship: '',
  contact: '',
  uploadType: 'photo',
  memoryTitle: '',
  memory: '',
  fileName: '',
  consent: false,
};

function saveSubmission(submission) {
  const current = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  localStorage.setItem(STORAGE_KEY, JSON.stringify([{ ...submission, id: crypto?.randomUUID?.() || Date.now().toString(), status: 'pending', createdAt: new Date().toISOString() }, ...current]));
}

export default function SoniaUpload() {
  const [form, setForm] = useState(emptyForm);
  const [submitted, setSubmitted] = useState(false);

  const submit = event => {
    event.preventDefault();
    if (!form.name.trim() || !form.relationship.trim() || !form.consent) return;
    saveSubmission(form);
    setSubmitted(true);
    setForm(emptyForm);
  };

  return (
    <div className="min-h-screen bg-background text-foreground px-4 py-10">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="text-center space-y-3">
          <Heart className="h-10 w-10 text-primary mx-auto" />
          <p className="font-body text-xs tracking-[0.35em] uppercase text-primary">Sonia Family Memories</p>
          <h1 className="font-display text-4xl font-bold gradient-gold-text">Share something beautiful</h1>
          <p className="text-sm text-muted-foreground">Upload a photo, video, voice note, eulogy, speech, story, or memory for Gannon to review before it is added to Sonia’s private tribute archive.</p>
        </div>

        <Card className="border-primary/30 bg-primary/5">
          <CardContent className="p-4 flex gap-3 text-sm text-muted-foreground">
            <ShieldCheck className="h-5 w-5 text-primary shrink-0" />
            <p>Nothing submitted here is published automatically. Gannon reviews everything first. This first version stores the submission details locally until backend storage is connected.</p>
          </CardContent>
        </Card>

        {submitted && (
          <Card className="border-green-500/30 bg-green-500/10">
            <CardContent className="p-4 text-sm text-green-400">Thank you. Your memory has been saved for review.</CardContent>
          </Card>
        )}

        <Card>
          <CardHeader><CardTitle className="text-lg flex items-center gap-2"><UploadCloud className="h-5 w-5 text-primary" />Family upload form</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={submit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Input placeholder="Your name" value={form.name} onChange={event => setForm({ ...form, name: event.target.value })} />
                <Input placeholder="Relationship to Sonia" value={form.relationship} onChange={event => setForm({ ...form, relationship: event.target.value })} />
                <Input placeholder="Email or phone optional" value={form.contact} onChange={event => setForm({ ...form, contact: event.target.value })} />
                <select className="rounded-md border border-input bg-background px-3 text-sm" value={form.uploadType} onChange={event => setForm({ ...form, uploadType: event.target.value })}>
                  {['photo', 'video', 'voice note', 'eulogy', 'speech', 'story', 'other'].map(value => <option key={value}>{value}</option>)}
                </select>
              </div>
              <Input placeholder="Memory title" value={form.memoryTitle} onChange={event => setForm({ ...form, memoryTitle: event.target.value })} />
              <Textarea rows={6} placeholder="Write the memory, story, or context for the file" value={form.memory} onChange={event => setForm({ ...form, memory: event.target.value })} />
              <Input type="file" onChange={event => setForm({ ...form, fileName: event.target.files?.[0]?.name || '' })} />
              {form.fileName && <p className="text-xs text-muted-foreground">Selected file: {form.fileName}</p>}
              <label className="flex items-start gap-2 text-sm text-muted-foreground">
                <input type="checkbox" checked={form.consent} onChange={event => setForm({ ...form, consent: event.target.checked })} />
                I consent to this memory being reviewed by Gannon for Sonia’s tribute archive. I understand it will not be published automatically.
              </label>
              <Button type="submit" className="w-full">Submit memory for review</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
