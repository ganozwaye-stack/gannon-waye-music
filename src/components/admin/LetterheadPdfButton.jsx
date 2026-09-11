import { useState } from 'react';
import { jsPDF } from 'jspdf';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Download, Loader2 } from 'lucide-react';

// Brand palette (from Brand Kit)
const GOLD = [201, 168, 76];
const INK = [38, 42, 51];
const MUTED = [122, 126, 136];

// The official GW circle logo (transparent PNG) from the approved brand assets.
const LOGO_URL = 'https://base44.app/api/apps/69eb7905ca6eb4180010f794/files/mp/public/69eb7905ca6eb4180010f794/6e6f577bf_GW.png';

async function loadLogoDataUrl() {
  try {
    const res = await fetch(LOGO_URL);
    if (!res.ok) return null;
    const blob = await res.blob();
    return await new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(blob);
    });
  } catch {
    return null;
  }
}

// Gannon's real signature (transparent PNG) — placed between "Regards," and his name.
const SIGNATURE_URL = 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/6eda965a4_image.png';

async function loadSignature() {
  try {
    const res = await fetch(SIGNATURE_URL);
    if (!res.ok) return null;
    const blob = await res.blob();
    const dataUrl = await new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(blob);
    });
    if (!dataUrl) return null;
    const dims = await new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight });
      img.onerror = () => resolve(null);
      img.src = dataUrl;
    });
    return dims ? { dataUrl, ...dims } : null;
  } catch {
    return null;
  }
}

function drawHeader(doc, logoDataUrl) {
  let y = 14;
  if (logoDataUrl) {
    doc.addImage(logoDataUrl, 'PNG', 97.5, 12, 15, 15);
    y = 31;
  } else {
    // Fallback: typographic GW roundel so the letterhead always renders
    doc.setDrawColor(...GOLD);
    doc.setLineWidth(0.5);
    doc.circle(105, 19.5, 7.5, 'S');
    doc.setTextColor(...GOLD);
    doc.setFont('times', 'bold');
    doc.setFontSize(12);
    doc.text('GW', 105, 21, { align: 'center' });
    y = 31;
  }
  doc.setTextColor(...INK);
  doc.setFont('times', 'bold');
  doc.setFontSize(14);
  doc.text('GANNON WAYE MUSIC', 105, y, { align: 'center', charSpace: 1.2 });
  y += 5;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(...MUTED);
  doc.text('Independent music, merchandise and care-led gifting', 105, y, { align: 'center' });
  y += 4;
  doc.setDrawColor(...GOLD);
  doc.setLineWidth(0.4);
  doc.line(22, y, 188, y);
  return y + 9;
}

function drawFooter(doc) {
  const y = 281;
  doc.setDrawColor(...GOLD);
  doc.setLineWidth(0.3);
  doc.line(22, y - 6, 188, y - 6);
  // Sonico wordmark (Gannon Waye Music sits in the header with the GW logo)
  doc.setFont('times', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(...GOLD);
  doc.text('Sonico', 78, y, { align: 'center', charSpace: 0.4 });
  // Divider dot
  doc.setTextColor(...MUTED);
  doc.setFontSize(8);
  doc.text('·', 105, y, { align: 'center' });
  // Thanking You Kindly wordmark
  doc.setFont('times', 'italic');
  doc.setFontSize(10);
  doc.setTextColor(...GOLD);
  doc.text('Thanking You Kindly', 132, y, { align: 'center', charSpace: 0.4 });
}

function renderLetter(doc, letterText, startY, signature) {
  const margin = 22;
  const width = 210 - margin * 2;
  let y = startY;
  const blocks = letterText.split('\n\n');

  blocks.forEach((block, index) => {
    if (index > 0) y += 3;

    // The [SIGNATURE] marker draws Gannon's real signature image, never text.
    if (block.trim() === '[SIGNATURE]') {
      if (signature) {
        if (y > 268) { doc.addPage(); y = 22; }
        const sigWidth = 42;
        const sigHeight = Math.min(16, sigWidth * (signature.height / signature.width));
        doc.addImage(signature.dataUrl, 'PNG', margin, y, sigWidth, sigHeight);
        y += sigHeight + 6;
      }
      return;
    }

    const isSubject = block.startsWith('Subject:');
    const isSignoff = block.startsWith('Regards,');

    if (isSubject) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10.5);
      doc.setTextColor(...INK);
    } else if (isSignoff) {
      doc.setFont('times', 'italic');
      doc.setFontSize(10);
      doc.setTextColor(...INK);
    } else {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9.5);
      doc.setTextColor(...INK);
    }

    const lines = doc.splitTextToSize(block, width);
    lines.forEach((line) => {
      if (y > 268) {
        doc.addPage();
        y = 22;
      }
      doc.text(line, margin, y);
      y += isSubject ? 6 : 4.6;
    });
  });

  return y;
}

export default function LetterheadPdfButton({ letterText, blank = false }) {
  const { toast } = useToast();
  const [building, setBuilding] = useState(false);

  const generate = async () => {
    setBuilding(true);
    try {
      const doc = new jsPDF({ unit: 'mm', format: 'a4' });
      const logo = await loadLogoDataUrl();
      const bodyY = drawHeader(doc, logo);
      if (!blank) {
        const signature = await loadSignature();
        renderLetter(doc, letterText, bodyY, signature);
      }
      // Footer on the final page
      const pageCount = doc.getNumberOfPages();
      doc.setPage(pageCount);
      drawFooter(doc);
      doc.save(blank ? 'gannon-waye-blank-letterhead.pdf' : 'gannon-waye-termination-letter.pdf');
      toast(
        blank
          ? { title: 'Blank letterhead downloaded', description: 'Ready to save, print and sign.' }
          : { title: 'Letterhead PDF downloaded', description: 'Review before sending.' }
      );
    } catch {
      toast({ title: 'Could not build the PDF', description: 'Please try again.', variant: 'destructive' });
    }
    setBuilding(false);
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={generate}
      disabled={building}
      className="rounded-full text-xs gap-1.5"
    >
      {building ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
      {building ? 'Building…' : blank ? 'Blank Letterhead' : 'Letterhead PDF'}
    </Button>
  );
}