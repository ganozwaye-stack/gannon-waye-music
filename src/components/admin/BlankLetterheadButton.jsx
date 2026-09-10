import { useState } from 'react';
import { jsPDF } from 'jspdf';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Download, Loader2 } from 'lucide-react';
import { drawHeader, drawFooter, loadImageDataUrl, LOGO_URL } from '@/components/admin/LetterheadPdfButton';

// Blank brand letterhead — header and footer only, ready to print and sign by hand.
export default function BlankLetterheadButton() {
  const { toast } = useToast();
  const [building, setBuilding] = useState(false);

  const generate = async () => {
    setBuilding(true);
    try {
      const doc = new jsPDF({ unit: 'mm', format: 'a4' });
      const logo = await loadImageDataUrl(LOGO_URL);
      drawHeader(doc, logo);
      drawFooter(doc);
      doc.save('gannon-waye-blank-letterhead.pdf');
      toast({ title: 'Blank letterhead downloaded', description: 'Print and sign by hand, or save for future use.' });
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
      {building ? 'Building…' : 'Blank Letterhead'}
    </Button>
  );
}