import { useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import TemplatePicker from './TemplatePicker';
import DesignPicker, { designUrl } from './DesignPicker';
import MockupStage from './MockupStage';
import MockupControls from './MockupControls';
import MockupExportPanel from './MockupExportPanel';

const fromTemplate = (t) => ({ x: t?.print_x_pct ?? 50, y: t?.print_y_pct ?? 42, w: t?.print_w_pct ?? 36, rot: 0, opacity: 0.96, blend: false });

export default function MockupStudioTab() {
  const stageRef = useRef(null);
  const [template, setTemplate] = useState(null);
  const [design, setDesign] = useState(null);
  const [placement, setPlacement] = useState(fromTemplate(null));

  const { data: templates = [] } = useQuery({ queryKey: ['MerchMockupTemplate'], queryFn: () => base44.entities.MerchMockupTemplate.list('-created_date', 50) });
  const { data: assets = [] } = useQuery({ queryKey: ['MerchVisualAsset'], queryFn: () => base44.entities.MerchVisualAsset.list('-created_date', 100) });
  const { data: products = [] } = useQuery({ queryKey: ['MerchProduct'], queryFn: () => base44.entities.MerchProduct.list('-created_date', 100) });

  const pickTemplate = (t) => { setTemplate(t); setPlacement(fromTemplate(t)); };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-1">Product Mockups</h2>
        <p className="text-sm text-muted-foreground">Apply a design to a blank product template, position it, and export the result straight onto the product in the shop.</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_minmax(320px,420px)] gap-6 items-start">
        <div className="space-y-5">
          <TemplatePicker templates={templates} selectedId={template?.id} onSelect={pickTemplate} />
          <DesignPicker assets={assets} selectedId={design?.id} onSelect={setDesign} />
          <MockupControls placement={placement} onChange={setPlacement} onReset={() => setPlacement(fromTemplate(template))} />
          <MockupExportPanel stageRef={stageRef} products={products} ready={Boolean(template && design)} />
        </div>
        <div className="lg:sticky lg:top-6">
          <MockupStage ref={stageRef} blankUrl={template?.blank_image_url} designUrl={design ? designUrl(design) : null} placement={placement} onPlacementChange={setPlacement} />
          <p className="text-[11px] text-muted-foreground mt-2 text-center">Drag the design to move it. The export is exactly what you see here.</p>
        </div>
      </div>
    </div>
  );
}