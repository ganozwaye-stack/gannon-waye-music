import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Upload, Music, Mic, Calendar, Users, FileText, Link as LinkIcon, Send, Heart, Sparkles, Clock, Shield } from 'lucide-react';
import VoiceTextarea from '@/components/ui/VoiceTextarea';
import { createBookingEnquiry } from '@/lib/bookingSystem';

const BOOKING_TYPE_LABELS = {
  live_performance: 'Live Performance',
  festival: 'Festival',
  private_event: 'Private Event',
  corporate_event: 'Corporate Event',
  wedding: 'Wedding',
  lgbtqia_event: 'LGBTQIA+ Event',
  charity_event: 'Charity Event',
  interview: 'Interview',
  podcast: 'Podcast',
  media_appearance: 'Media Appearance',
  brand_collaboration: 'Brand Collaboration',
  partnership: 'Partnership',
  songwriting_session: 'Songwriting Session',
  creative_collaboration: 'Creative Collaboration',
};

const BUDGET_RANGES = [
  { value: 'under_5k', label: 'Under $5,000' },
  { value: '5k_10k', label: '$5,000 - $10,000' },
  { value: '10k_25k', label: '$10,000 - $25,000' },
  { value: '25k_50k', label: '$25,000 - $50,000' },
  { value: '50k_plus', label: '$50,000+' },
  { value: 'negotiable', label: 'Negotiable' },
];

export default function Bookings() {
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({
    full_name: '',
    company_venue: '',
    email: '',
    phone: '',
    booking_type: '',
    event_date: '',
    budget_range: '',
    location: '',
    audience_size: '',
    event_details: '',
    accessibility_needs: '',
    technical_requirements: '',
    social_links: [],
    referral_source: '',
    attachment_urls: [],
  });

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const result = await base44.integrations.Core.UploadFile({ file });
      setForm({ ...form, attachment_urls: [...form.attachment_urls, result.file_url] });
      toast({ title: 'File uploaded successfully' });
    } catch (error) {
      toast({ title: 'Upload failed', variant: 'destructive' });
    }
    setUploading(false);
  };

  const removeAttachment = (url) => {
    setForm({ ...form, attachment_urls: form.attachment_urls.filter(u => u !== url) });
  };

  const addSocialLink = (url) => {
    if (url && !form.social_links.includes(url)) {
      setForm({ ...form, social_links: [...form.social_links, url] });
    }
  };

  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.full_name.trim()) e.full_name = 'Full name is required';
    if (!form.email.trim()) e.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email address';
    if (!form.booking_type) e.booking_type = 'Please select a booking type';
    if (!form.event_details.trim()) e.event_details = 'Please describe your event';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast({ title: 'Please fix the errors below', variant: 'destructive' });
      return;
    }
    setErrors({});
    
    const result = await createBookingEnquiry(form);
    
    if (result.success) {
      toast({ 
        title: 'Enquiry submitted!', 
        description: `We'll respond within 2-3 business days. Enquiry ID: ${result.enquiry.id}` 
      });
      setStep(3);
    } else {
      toast({ title: 'Submission failed', description: result.error, variant: 'destructive' });
    }
  };

  if (step === 3) {
    return (
      <div className="min-h-screen py-24 px-4 md:px-8">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-3xl mx-auto text-center space-y-8"
        >
          <Heart className="w-20 h-20 text-primary mx-auto" />
          <h1 className="font-display text-5xl text-foreground">Thank You</h1>
          <p className="font-body text-lg text-foreground/70 leading-relaxed max-w-xl mx-auto">
            Your booking enquiry has been received. Our team will review it and respond within 2-3 business days.
          </p>
          <div className="bg-card border border-border/40 rounded-2xl p-8 max-w-lg mx-auto">
            <p className="font-body text-sm text-muted-foreground mb-2">What happens next:</p>
            <ol className="space-y-3 text-left font-body text-sm text-foreground/80">
              <li className="flex items-start gap-3">
                <span className="font-display text-primary">1.</span>
                <span>Our team reviews your enquiry</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="font-display text-primary">2.</span>
                <span>You receive a confirmation email</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="font-display text-primary">3.</span>
                <span>We respond within 2-3 business days</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="font-display text-primary">4.</span>
                <span>If confirmed, we'll send contract and payment details</span>
              </li>
            </ol>
          </div>
          <div className="flex gap-4 justify-center">
            <Button onClick={() => window.location.href = '/'} className="gradient-gold-button rounded-full">
              Back to Home
            </Button>
            <Button variant="outline" onClick={() => window.location.href = '/music'} className="rounded-full">
              Listen to Music
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-24 px-4 md:px-8">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto text-center mb-16"
      >
        <p className="font-body text-xs tracking-[0.3em] uppercase gradient-gold-glow mb-4">Bookings</p>
        <h1 className="font-display text-5xl md:text-6xl text-foreground mb-6">Work With Gannon</h1>
        <p className="font-body text-lg text-foreground/70 leading-relaxed max-w-2xl mx-auto">
          Available for live performances, festivals, private events, corporate functions, media appearances, and creative collaborations.
        </p>
        
        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12">
          {[
            { icon: Music, label: 'Live Performances', desc: 'Intimate venues to festivals' },
            { icon: Mic, label: 'Media & Podcasts', desc: 'Interviews and appearances' },
            { icon: Heart, label: 'LGBTQIA+ Events', desc: 'Proudly supporting community' },
            { icon: Sparkles, label: 'Creative Collabs', desc: 'Songwriting and partnerships' },
          ].map((item, i) => {
            const Icon = item.icon;
            return (
              <div key={i} className="bg-card border border-border/40 rounded-xl p-4">
                <Icon className="w-5 h-5 text-primary mx-auto mb-2" />
                <p className="font-display text-sm text-foreground">{item.label}</p>
                <p className="font-body text-xs text-muted-foreground mt-1">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Urgency + Trust Signals */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="max-w-4xl mx-auto mb-12"
      >
        <div className="flex items-center justify-center gap-3 mb-8">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
          </span>
          <p className="font-body text-sm text-foreground/80">
            <strong className="text-primary">3 booking slots</strong> remaining for late 2026 · <span className="text-muted-foreground">Enquiries answered within 48 hours</span>
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { icon: Clock, title: '48-Hour Response', desc: 'Every enquiry answered within 2 business days — no waiting, no chasing.' },
            { icon: Shield, title: 'Professional Delivery', desc: 'Full technical rider, stage plot, and promo assets provided.' },
            { icon: Heart, title: 'Authentic Performance', desc: 'Every show is personal. Raw, honest, and unforgettable.' },
          ].map((item, i) => {
            const Icon = item.icon;
            return (
              <div key={i} className="bg-card border border-border/40 rounded-2xl p-5">
                <Icon className="w-5 h-5 text-primary mb-3" />
                <p className="font-display text-sm text-foreground mb-1">{item.title}</p>
                <p className="font-body text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Booking Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="max-w-4xl mx-auto"
      >
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Contact Information */}
          <Card className="bg-card border-border/40">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Users className="w-5 h-5 text-primary" />
                <h2 className="font-display text-xl text-foreground">Contact Information</h2>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="font-body text-xs tracking-wider uppercase">Full Name *</Label>
                  <Input 
                    value={form.full_name} 
                    onChange={e => { setForm({ ...form, full_name: e.target.value }); setErrors(er => ({ ...er, full_name: '' })); }}
                    placeholder="Your name"
                    className={errors.full_name ? 'border-destructive' : ''}
                  />
                  {errors.full_name && <p className="font-body text-xs text-destructive mt-1">{errors.full_name}</p>}
                </div>
                <div>
                  <Label className="font-body text-xs tracking-wider uppercase">Company/Venue</Label>
                  <Input 
                    value={form.company_venue} 
                    onChange={e => setForm({ ...form, company_venue: e.target.value })} 
                    placeholder="Organization name" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="font-body text-xs tracking-wider uppercase">Email *</Label>
                  <Input 
                    type="email"
                    value={form.email} 
                    onChange={e => { setForm({ ...form, email: e.target.value }); setErrors(er => ({ ...er, email: '' })); }}
                    placeholder="you@example.com"
                    className={errors.email ? 'border-destructive' : ''}
                  />
                  {errors.email && <p className="font-body text-xs text-destructive mt-1">{errors.email}</p>}
                </div>
                <div>
                  <Label className="font-body text-xs tracking-wider uppercase">Phone</Label>
                  <Input 
                    value={form.phone} 
                    onChange={e => setForm({ ...form, phone: e.target.value })} 
                    placeholder="+61 400 000 000" 
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Event Details */}
          <Card className="bg-card border-border/40">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="w-5 h-5 text-primary" />
                <h2 className="font-display text-xl text-foreground">Event Details</h2>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="font-body text-xs tracking-wider uppercase">Booking Type *</Label>
                  <Select 
                    value={form.booking_type} 
                    onValueChange={v => { setForm({ ...form, booking_type: v }); setErrors(er => ({ ...er, booking_type: '' })); }}
                  >
                    <SelectTrigger className={errors.booking_type ? 'border-destructive' : ''}><SelectValue placeholder="Select type" /></SelectTrigger>
                    <SelectContent>
                      {Object.entries(BOOKING_TYPE_LABELS).map(([key, label]) => (
                        <SelectItem key={key} value={key}>{label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.booking_type && <p className="font-body text-xs text-destructive mt-1">{errors.booking_type}</p>}
                </div>
                <div>
                  <Label className="font-body text-xs tracking-wider uppercase">Event Date</Label>
                  <Input 
                    type="date"
                    value={form.event_date} 
                    onChange={e => setForm({ ...form, event_date: e.target.value })} 
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="font-body text-xs tracking-wider uppercase">Location</Label>
                  <Input 
                    value={form.location} 
                    onChange={e => setForm({ ...form, location: e.target.value })} 
                    placeholder="City or venue" 
                  />
                </div>
                <div>
                  <Label className="font-body text-xs tracking-wider uppercase">Budget Range</Label>
                  <Select 
                    value={form.budget_range} 
                    onValueChange={v => setForm({ ...form, budget_range: v })}
                  >
                    <SelectTrigger><SelectValue placeholder="Select range" /></SelectTrigger>
                    <SelectContent>
                      {BUDGET_RANGES.map(range => (
                        <SelectItem key={range.value} value={range.value}>{range.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label className="font-body text-xs tracking-wider uppercase">Expected Audience Size</Label>
                <Input 
                  type="number"
                  value={form.audience_size} 
                  onChange={e => setForm({ ...form, audience_size: e.target.value })} 
                  placeholder="Number of attendees" 
                />
              </div>

              <div>
                <Label className="font-body text-xs tracking-wider uppercase">Event Details *</Label>
                <VoiceTextarea 
                  value={form.event_details} 
                  onChange={e => { setForm({ ...form, event_details: e.target.value }); setErrors(er => ({ ...er, event_details: '' })); }}
                  rows={4} 
                  placeholder="Tell us about your event, vision, and what you're looking for..."
                  className={errors.event_details ? 'border-destructive' : ''}
                />
                {errors.event_details && <p className="font-body text-xs text-destructive mt-1">{errors.event_details}</p>}
              </div>

              <div>
                <Label className="font-body text-xs tracking-wider uppercase">Accessibility Needs</Label>
                <VoiceTextarea 
                  value={form.accessibility_needs} 
                  onChange={e => setForm({ ...form, accessibility_needs: e.target.value })} 
                  rows={2} 
                  placeholder="Any accessibility requirements we should know about?" 
                />
              </div>

              <div>
                <Label className="font-body text-xs tracking-wider uppercase">Technical Requirements</Label>
                <VoiceTextarea 
                  value={form.technical_requirements} 
                  onChange={e => setForm({ ...form, technical_requirements: e.target.value })} 
                  rows={2} 
                  placeholder="Stage plot, sound requirements, or other technical needs" 
                />
              </div>
            </CardContent>
          </Card>

          {/* Additional Information */}
          <Card className="bg-card border-border/40">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <LinkIcon className="w-5 h-5 text-primary" />
                <h2 className="font-display text-xl text-foreground">Additional Information</h2>
              </div>

              <div>
                <Label className="font-body text-xs tracking-wider uppercase">Social Links</Label>
                <div className="flex gap-2 mb-2">
                  <Input 
                    placeholder="https://instagram.com/yourprofile" 
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addSocialLink(e.target.value);
                        e.target.value = '';
                      }
                    }}
                  />
                  <Button type="button" variant="outline" size="sm" onClick={() => {
                    const input = document.querySelector('input[placeholder="https://instagram.com/yourprofile"]');
                    if (input?.value) {
                      addSocialLink(input.value);
                      input.value = '';
                    }
                  }}>Add</Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {form.social_links.map((link, i) => (
                    <Badge key={i} variant="outline" className="cursor-pointer" onClick={() => {
                      setForm({ ...form, social_links: form.social_links.filter((_, idx) => idx !== i) });
                    }}>{link} ×</Badge>
                  ))}
                </div>
              </div>

              <div>
                <Label className="font-body text-xs tracking-wider uppercase">How did you find Gannon?</Label>
                <Select 
                  value={form.referral_source} 
                  onValueChange={v => setForm({ ...form, referral_source: v })}
                >
                  <SelectTrigger><SelectValue placeholder="Select source" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="google">Google Search</SelectItem>
                    <SelectItem value="instagram">Instagram</SelectItem>
                    <SelectItem value="facebook">Facebook</SelectItem>
                    <SelectItem value="tiktok">TikTok</SelectItem>
                    <SelectItem value="friend_referral">Friend Referral</SelectItem>
                    <SelectItem value="past_client">Past Client</SelectItem>
                    <SelectItem value="media">Media/Press</SelectItem>
                    <SelectItem value="agency">Agency</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="font-body text-xs tracking-wider uppercase">Attachments</Label>
                <div className="border-2 border-dashed border-border/40 rounded-xl p-6 text-center">
                  <input
                    type="file"
                    id="attachment-upload"
                    onChange={handleFileUpload}
                    className="hidden"
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  />
                  <label htmlFor="attachment-upload" className="cursor-pointer">
                    <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                    <p className="font-body text-sm text-foreground/70">Click to upload files</p>
                    <p className="font-body text-xs text-muted-foreground mt-1">PDFs, images, briefs, contracts (max 10MB)</p>
                  </label>
                  {uploading && <p className="font-body text-xs text-primary mt-2">Uploading...</p>}
                </div>
                {form.attachment_urls.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {form.attachment_urls.map((url, i) => (
                      <Badge key={i} variant="outline" className="cursor-pointer flex items-center gap-1" onClick={() => removeAttachment(url)}>
                        <FileText className="w-3 h-3" />
                        Attachment {i + 1} ×
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Submit */}
          <div className="text-center">
            <Button 
              type="submit" 
              className="gradient-gold-button rounded-full px-12 py-6 font-body text-sm tracking-wider uppercase gap-2"
              disabled={!form.full_name || !form.email || !form.booking_type || !form.event_details}
            >
              <Send className="w-4 h-4" />
              Submit Enquiry
            </Button>
            <p className="font-body text-xs text-muted-foreground mt-4">
              By submitting, you agree to our privacy policy. We'll respond within 2-3 business days.
            </p>
          </div>
        </form>
      </motion.div>
    </div>
  );
}