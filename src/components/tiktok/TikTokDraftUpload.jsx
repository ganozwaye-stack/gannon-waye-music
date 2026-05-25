import { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, Loader2, CheckCircle2, AlertTriangle, Shield } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const APPROVAL_STATES = [
  { key: 'draft_created', label: 'Draft Created', color: 'bg-slate-500/20 text-slate-300' },
  { key: 'awaiting_review', label: 'Awaiting Review', color: 'bg-yellow-500/20 text-yellow-300' },
  { key: 'approved', label: 'Approved', color: 'bg-green-500/20 text-green-300' },
  { key: 'uploaded', label: 'Uploaded to TikTok Drafts', color: 'bg-blue-500/20 text-blue-300' },
  { key: 'creator_review', label: 'Ready for Creator Final Approval', color: 'bg-purple-500/20 text-purple-300' },
];

export default function TikTokDraftUpload({ connected = false }) {
  const { toast } = useToast();
  const [videoUrl, setVideoUrl] = useState('');
  const [caption, setCaption] = useState('');
  const [title, setTitle] = useState('');
  const [approvalState, setApprovalState] = useState('draft_created');
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);
  const [generatingCaption, setGeneratingCaption] = useState(false);

  const generateCaption = async () => {
    setGeneratingCaption(true);
    try {
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `Write a TikTok caption for Gannon Waye's new single "Thank You" — an emotional debut about gratitude born from heartbreak. 
        
The caption should:
- Be authentic and personal
- Include emotional hook in first line
- Include 2-3 hashtags inline
- End with a clear CTA
- Be under 150 characters for the caption text (before hashtags)
- Feel human, not AI-generated

Return just the caption text, no explanation.`,
      });
      setCaption(result);
      toast({ title: 'Caption generated' });
    } catch (_) {
      toast({ title: 'Caption generation failed', variant: 'destructive' });
    }
    setGeneratingCaption(false);
  };

  const advanceToReview = () => {
    if (!videoUrl || !caption) {
      toast({ title: 'Add a video URL and caption first', variant: 'destructive' });
      return;
    }
    setApprovalState('awaiting_review');
    toast({ title: 'Draft sent to Approval Queue' });
  };

  const approveDraft = () => {
    setApprovalState('approved');
    toast({ title: 'Draft approved — ready to upload' });
  };

  const uploadToTikTok = async () => {
    if (!connected) {
      toast({ title: 'Connect your TikTok account first', variant: 'destructive' });
      return;
    }
    if (approvalState !== 'approved') {
      toast({ title: 'Draft must be approved before uploading', variant: 'destructive' });
      return;
    }

    setUploading(true);
    try {
      const res = await base44.functions.invoke('tiktokUploadDraft', {
        video_url: videoUrl,
        caption,
        title: title || 'Gannon Waye — Thank You',
        privacy_level: 'SELF_ONLY',
      });

      if (res.data?.success) {
        setApprovalState('uploaded');
        setUploadResult(res.data);
        toast({ title: 'Draft uploaded to TikTok — awaiting creator review' });
        // Brief pause then advance to final state
        setTimeout(() => setApprovalState('creator_review'), 1500);
      } else {
        toast({ title: res.data?.error || 'Upload failed', variant: 'destructive' });
      }
    } catch (err) {
      toast({ title: err.message || 'Upload failed', variant: 'destructive' });
    }
    setUploading(false);
  };

  const reset = () => {
    setApprovalState('draft_created');
    setUploadResult(null);
    setVideoUrl('');
    setCaption('');
    setTitle('');
  };

  const currentStateIdx = APPROVAL_STATES.findIndex(s => s.key === approvalState);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <Upload className="w-4 h-4 text-primary" /> TikTok Draft Upload Flow
          <Badge className="bg-green-500/20 text-green-300 text-xs">video.upload</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">

        {/* Approval pipeline */}
        <div>
          <p className="text-xs text-muted-foreground mb-2 uppercase tracking-wider">Approval Pipeline</p>
          <div className="flex flex-wrap gap-1.5">
            {APPROVAL_STATES.map((s, i) => (
              <div key={s.key} className="flex items-center gap-1">
                <Badge className={`text-xs ${i <= currentStateIdx ? s.color : 'bg-secondary/50 text-muted-foreground'}`}>
                  {i < currentStateIdx ? '✓ ' : ''}{s.label}
                </Badge>
                {i < APPROVAL_STATES.length - 1 && <span className="text-muted-foreground text-xs">→</span>}
              </div>
            ))}
          </div>
        </div>

        {/* Form */}
        <div className="space-y-3">
          <div>
            <Label className="text-xs text-muted-foreground uppercase tracking-wider">Video URL</Label>
            <Input
              value={videoUrl}
              onChange={e => setVideoUrl(e.target.value)}
              placeholder="https://... (direct MP4 URL)"
              className="mt-1 text-sm"
              disabled={approvalState !== 'draft_created'}
            />
            <p className="text-xs text-muted-foreground/60 mt-0.5">Must be a publicly accessible direct video URL (MP4)</p>
          </div>
          <div>
            <Label className="text-xs text-muted-foreground uppercase tracking-wider">Post Title (internal)</Label>
            <Input
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. Thank You — TikTok Draft #1"
              className="mt-1 text-sm"
              disabled={approvalState !== 'draft_created'}
            />
          </div>
          <div>
            <div className="flex items-center justify-between mb-1">
              <Label className="text-xs text-muted-foreground uppercase tracking-wider">Caption</Label>
              <Button size="sm" variant="ghost" className="h-6 text-xs gap-1" onClick={generateCaption} disabled={generatingCaption || approvalState !== 'draft_created'}>
                {generatingCaption ? <Loader2 className="w-3 h-3 animate-spin" /> : '✨'}
                AI Caption
              </Button>
            </div>
            <Textarea
              value={caption}
              onChange={e => setCaption(e.target.value)}
              placeholder="Write or generate a TikTok caption..."
              className="text-sm h-20"
              disabled={approvalState !== 'draft_created'}
            />
            <p className="text-xs text-muted-foreground/60 mt-0.5">{caption.length}/150 characters</p>
          </div>
        </div>

        {/* Safety notice */}
        <div className="border border-amber-500/20 bg-amber-500/5 rounded-lg p-3 flex items-start gap-2">
          <Shield className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
          <p className="text-xs text-amber-300/80">
            <strong>Manual approval required.</strong> Nothing auto-posts. After upload, you must open the TikTok app and manually publish from your Drafts folder.
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-2 flex-wrap">
          {approvalState === 'draft_created' && (
            <Button size="sm" className="text-xs gap-1.5" onClick={advanceToReview} disabled={!videoUrl || !caption}>
              Send to Approval Queue →
            </Button>
          )}
          {approvalState === 'awaiting_review' && (
            <Button size="sm" className="gradient-gold-button border-0 text-xs gap-1.5" onClick={approveDraft}>
              <CheckCircle2 className="w-3 h-3" /> Approve Draft
            </Button>
          )}
          {approvalState === 'approved' && (
            <Button size="sm" className="gradient-gold-button border-0 text-xs gap-1.5" onClick={uploadToTikTok} disabled={uploading || !connected}>
              {uploading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Upload className="w-3 h-3" />}
              {uploading ? 'Uploading to TikTok...' : 'Upload Draft to TikTok'}
            </Button>
          )}
          {(approvalState === 'uploaded' || approvalState === 'creator_review') && (
            <Button size="sm" variant="outline" className="text-xs" onClick={reset}>
              Start New Draft
            </Button>
          )}
        </div>

        {/* Upload result */}
        {uploadResult && (
          <div className="border border-green-500/30 bg-green-500/5 rounded-lg p-3 space-y-1">
            <p className="text-xs font-semibold text-green-400">✓ Upload Successful</p>
            <p className="text-xs text-muted-foreground">Publish ID: <code className="text-primary">{uploadResult.publish_id}</code></p>
            <p className="text-xs text-muted-foreground">Status: {uploadResult.status}</p>
            <p className="text-xs text-green-300/80">{uploadResult.message}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}