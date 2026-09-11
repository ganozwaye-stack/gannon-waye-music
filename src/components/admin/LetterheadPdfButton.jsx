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
// Gannon's signature, placed between "Regards," and his name on signed letters.
const SIGNATURE_URL = 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/6eda965a4_image.png';

async function loadImageDataUrl(url) {
  try {
    const res = await fetch(url);
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

export function drawHeader(doc, logoDataUrl) {
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

export function drawFooter(doc) {
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

function renderLetter(doc, letterText, startY, signatureDataUrl) {
  const margin = 22;
  const width = 210 - margin * 2;
  let y = startY;
  const blocks = letterText.split('\n\n');

  blocks.forEach((block, index) => {
    if (index > 0) y += 3;

    const isSubject = block.startsWith('Subject:');
    const isSignoff = block.startsWith('Regards,');

    // Signature marker: renders Gannon's signature image between "Regards,"
    // and his name — falls back to a hand-sign line if the image can't load.
    if (block.trim().toLowerCase() === '[signature]') {
      if (signatureDataUrl) {
        doc.addImage(signatureDataUrl, 'PNG', margin, y - 3, 36, 12);
        y += 13;
      } else {
        doc.setDrawColor(...INK);
        doc.setLineWidth(0.3);
        doc.line(margin, y + 5, margin + 42, y + 5);
        y += 10;
      }
      return;
    }

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

// letterText: the full letter, signed with the signature image after "Regards,".
// blank: true renders only the letterhead itself, ready to save, print and sign by hand.
export default function LetterheadPdfButton({ letterText = '', blank = false, label, filename }) {
  const { toast } = useToast();
  const [building, setBuilding] = useState(false);

  const generate = async () => {
    setBuilding(true);
    try {
      const doc = new jsPDF({ unit: 'mm', format: 'a4' });
      const logo = await loadImageDataUrl(LOGO_URL);
      const bodyY = drawHeader(doc, logo);
      if (!blank) {
        const signature = await loadImageDataUrl(SIGNATURE_URL);
        renderLetter(doc, letterText, bodyY, signature);
      }
      // Footer on the final page
      const pageCount = doc.getNumberOfPages();
      doc.setPage(pageCount);
      drawFooter(doc);
      doc.save(filename || (blank ? 'gannon-waye-blank-letterhead.pdf' : 'gannon-waye-letterhead.pdf'));
      toast({
        title: blank ? 'Blank letterhead downloaded' : 'Letterhead PDF downloaded',
        description: blank ? 'Save it, print it, sign it by hand.' : 'Review before sending.',
      });
    } catch {
      toast({ title: 'Could not build the PDF', description: 'Please try again.', variant: 'destructive' });
    }
    setBuilding(false);
  };

  const text = label || (blank ? 'Blank Letterhead' : 'Letterhead PDF');

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={generate}
      disabled={building}
      className="rounded-full text-xs gap-1.5"
    >
      {building ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
      {building ? 'Building…' : text}
    </Button>
  );
}