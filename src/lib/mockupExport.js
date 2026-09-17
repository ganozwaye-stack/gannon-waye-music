import html2canvas from 'html2canvas';
import { base44 } from '@/api/base44Client';

// Renders the mockup stage to a PNG and uploads it, returning the public URL.
export async function exportMockupToUrl(stageEl, fileName = 'mockup.png') {
  const canvas = await html2canvas(stageEl, { useCORS: true, backgroundColor: null, scale: 2 });
  const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/png'));
  const file = new File([blob], fileName, { type: 'image/png' });
  const { file_url } = await base44.integrations.Core.UploadPublicFile({ file });
  return file_url;
}