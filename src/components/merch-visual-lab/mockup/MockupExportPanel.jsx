import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Download } from 'lucide-react';
import { exportMockupToUrl } from '@/lib/mockupExport';

export default function MockupExportPanel({ stageRef, products, ready }) {
  const qc = useQueryClient();
  const [productId, setProductId] = useState('');
  const [lastUrl, setLastUrl] = useState('');

  const save = useMutation({
    mutationFn: async () => {
      const product = products.find((p) => p.id === productId);
      const url = await exportMockupToUrl(stageRef.current, `${product.name}.png`);
      await base44.entities.MerchProduct.update(product.id, {
        image_url: url,
        images_array: [url, ...(product.images_array || []).filter((u) => u !== url)],
      });
      return url;
    },
    onSuccess: (url) => { setLastUrl(url); qc.invalidateQueries({ queryKey: ['MerchProduct'] }); },
  });

  return (
    <div className="space-y-3">
      <p className="text-xs text-muted-foreground">4. Save as a product's shop image</p>
      <Select value={productId} onValueChange={setProductId}>
        <SelectTrigger><SelectValue placeholder="Choose product" /></SelectTrigger>
        <SelectContent>
          {products.map((p) => <SelectItem key={p.id} value={p.id}>{p.name} · {p.publication_status}</SelectItem>)}
        </SelectContent>
      </Select>
      <Button type="button" className="w-full gradient-gold-button border-0" disabled={!ready || !productId || save.isPending} onClick={() => save.mutate()}>
        {save.isPending ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Rendering</> : <><Download className="w-4 h-4 mr-2" /> Export and set as product image</>}
      </Button>
      {save.isError && <p className="text-xs text-destructive">Export failed: {save.error?.message}</p>}
      {lastUrl && (
        <p className="text-xs text-green-400">Saved. <a href={lastUrl} target="_blank" rel="noopener noreferrer" className="underline">Open image</a> · review in <a href="/admin/merch" className="underline">Merch Management</a></p>
      )}
    </div>
  );
}