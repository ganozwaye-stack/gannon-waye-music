import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import HeroDesignWorkbench from '@/components/admin/hero-design/HeroDesignWorkbench';
import HeroDesignEditor from '@/components/admin/hero-design/HeroDesignEditor';

// Dedicated owner-only section for the hero artwork. The Canvas Studio is
// the full design tool: uploads, drag and drop, fonts, brand colours, glow
// and shadow. The Fine Sliders tab keeps the classic simple controls.
// Nothing goes live until Go Live is pressed.
export default function HeroDesignStudio() {
  return (
    <div className="pb-10">
      <div>
        <p className="font-body text-xs tracking-[0.3em] uppercase gradient-gold-glow mb-1">Owner Only</p>
        <h1 className="font-display text-3xl font-bold gradient-gold-text">Hero Design Studio</h1>
        <p className="font-body text-sm text-muted-foreground mt-1 max-w-2xl">
          Design the home hero your way. Upload as many images as you want, drop them on the canvas, drag, resize,
          rotate, add text in your brand fonts, glow, shadow and colour, then press Save Draft. The site only changes
          when you press Go Live, so you can perfect everything now and publish on the day.
        </p>
      </div>
      <Tabs defaultValue="canvas" className="mt-4">
        <TabsList>
          <TabsTrigger value="canvas">Canvas Studio</TabsTrigger>
          <TabsTrigger value="sliders">Fine Sliders</TabsTrigger>
        </TabsList>
        <TabsContent value="canvas">
          <HeroDesignWorkbench />
        </TabsContent>
        <TabsContent value="sliders">
          <HeroDesignEditor />
        </TabsContent>
      </Tabs>
    </div>
  );
}