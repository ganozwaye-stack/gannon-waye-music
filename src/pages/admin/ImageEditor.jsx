import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { base44 } from '@/api/base44Client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Upload, Download, RotateCw, Type, Trash2, Layers, Wand2, Image as ImageIcon,
  Sun, Contrast, Palette, Crop, Scissors, Copy, Plus, Minus, Undo, Redo,
  Sparkles, Move, Square, Type as TypeIcon, Smile, Star, Heart, Circle,
  Maximize, Grid3X3, Eraser, Save, Share2, Film, Music, Mic
} from 'lucide-react';

const FILTERS = {
  none: 'none',
  grayscale: 'grayscale(100%)',
  sepia: 'sepia(100%)',
  vintage: 'sepia(50%) contrast(120%) brightness(90%)',
  warm: 'sepia(30%) saturate(140%) hue-rotate(-10deg)',
  cool: 'saturate(80%) hue-rotate(15deg)',
  dramatic: 'contrast(150%) saturate(120%)',
  fade: 'contrast(90%) brightness(110%) saturate(80%)',
  noir: 'grayscale(100%) contrast(150%)',
  vibrant: 'saturate(200%) contrast(110%)',
  pastel: 'saturate(60%) brightness(115%) contrast(90%)',
  cinematic: 'contrast(110%) saturate(90%) hue-rotate(-5deg)',
};

const STICKERS = [
  { emoji: '❤️', name: 'heart' },
  { emoji: '⭐', name: 'star' },
  { emoji: '🔥', name: 'fire' },
  { emoji: '✨', name: 'sparkles' },
  { emoji: '🎵', name: 'music' },
  { emoji: '🎶', name: 'notes' },
  { emoji: '💫', name: 'dizzy' },
  { emoji: '🌟', name: 'glow' },
  { emoji: '💖', name: 'sparkle-heart' },
  { emoji: '🎨', name: 'art' },
  { emoji: '📸', name: 'camera' },
  { emoji: '🎬', name: 'film' },
];

const TRANSITIONS = [
  { name: 'Fade', duration: 500 },
  { name: 'Slide Left', duration: 500 },
  { name: 'Slide Right', duration: 500 },
  { name: 'Zoom In', duration: 500 },
  { name: 'Zoom Out', duration: 500 },
];

export default function ImageEditor() {
  const { toast } = useToast();
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const containerRef = useRef(null);
  
  // State
  const [image, setImage] = useState(null);
  const [layers, setLayers] = useState([]);
  const [selectedLayer, setSelectedLayer] = useState(null);
  const [activeTab, setActiveTab] = useState('adjust');
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  
  // Adjustments
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturation, setSaturation] = useState(100);
  const [hue, setHue] = useState(0);
  const [blur, setBlur] = useState(0);
  const [rotation, setRotation] = useState(0);
  const [scale, setScale] = useState(100);
  const [filter, setFilter] = useState('none');
  
  // Crop
  const [cropMode, setCropMode] = useState(false);
  const [cropArea, setCropArea] = useState({ x: 0, y: 0, width: 100, height: 100 });
  
  // Text
  const [textTool, setTextTool] = useState({ active: false, text: '', x: 50, y: 50, size: 32, color: '#ffffff', font: 'Arial' });
  
  // Stickers
  const [stickerTool, setStickerTool] = useState({ active: false, emoji: '', x: 50, y: 50, size: 48, rotation: 0 });

  const saveToHistory = useCallback((state) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push({
      brightness, contrast, saturation, hue, blur, rotation, scale, filter,
      layers: JSON.parse(JSON.stringify(layers)),
      cropArea,
    });
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  }, [history, historyIndex, brightness, contrast, saturation, hue, blur, rotation, scale, filter, layers, cropArea]);

  const undo = () => {
    if (historyIndex > 0) {
      const prev = history[historyIndex - 1];
      setBrightness(prev.brightness);
      setContrast(prev.contrast);
      setSaturation(prev.saturation);
      setHue(prev.hue);
      setBlur(prev.blur);
      setRotation(prev.rotation);
      setScale(prev.scale);
      setFilter(prev.filter);
      setLayers(prev.layers);
      setCropArea(prev.cropArea);
      setHistoryIndex(historyIndex - 1);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      const next = history[historyIndex + 1];
      setBrightness(next.brightness);
      setContrast(next.contrast);
      setSaturation(next.saturation);
      setHue(next.hue);
      setBlur(next.blur);
      setRotation(next.rotation);
      setScale(next.scale);
      setFilter(next.filter);
      setLayers(next.layers);
      setCropArea(next.cropArea);
      setHistoryIndex(historyIndex + 1);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        setImage(img);
        setLayers([]);
        setBrightness(100);
        setContrast(100);
        setSaturation(100);
        setHue(0);
        setBlur(0);
        setRotation(0);
        setScale(100);
        setFilter('none');
        setHistory([]);
        setHistoryIndex(-1);
        saveToHistory();
      };
      img.src = event.target?.result;
    };
    reader.readAsDataURL(file);
  };

  const redrawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !image) return;

    const ctx = canvas.getContext('2d');
    canvas.width = image.width;
    canvas.height = image.height;

    ctx.save();
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Apply filters
    const filterString = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%) hue-rotate(${hue}deg) blur(${blur}px) ${FILTERS[filter]}`;
    ctx.filter = filterString;

    // Apply rotation & scale
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.scale(scale / 100, scale / 100);
    ctx.translate(-canvas.width / 2, -canvas.height / 2);

    // Draw image
    ctx.drawImage(image, 0, 0);
    ctx.restore();

    // Draw layers (stickers, text)
    layers.forEach((layer, idx) => {
      ctx.save();
      if (layer.type === 'text') {
        ctx.font = `${layer.size}px ${layer.font}`;
        ctx.fillStyle = layer.color;
        ctx.fillText(layer.text, layer.x, layer.y);
      } else if (layer.type === 'sticker') {
        ctx.font = `${layer.size}px Arial`;
        ctx.translate(layer.x, layer.y);
        ctx.rotate((layer.rotation * Math.PI) / 180);
        ctx.fillText(layer.emoji, 0, 0);
      }
      ctx.restore();
    });
  }, [image, brightness, contrast, saturation, hue, blur, rotation, scale, filter, layers]);

  useEffect(() => {
    if (image) {
      redrawCanvas();
    }
  }, [image, brightness, contrast, saturation, hue, blur, rotation, scale, filter, layers, redrawCanvas]);

  const addText = () => {
    if (!textTool.text) return;
    const newLayer = {
      id: Date.now(),
      type: 'text',
      text: textTool.text,
      x: textTool.x,
      y: textTool.y,
      size: textTool.size,
      color: textTool.color,
      font: textTool.font,
    };
    setLayers([...layers, newLayer]);
    setTextTool({ ...textTool, text: '', active: false });
    saveToHistory();
  };

  const addSticker = (emoji) => {
    const newLayer = {
      id: Date.now(),
      type: 'sticker',
      emoji,
      x: image ? image.width / 2 : 200,
      y: image ? image.height / 2 : 200,
      size: stickerTool.size,
      rotation: 0,
    };
    setLayers([...layers, newLayer]);
    saveToHistory();
  };

  const removeLayer = (id) => {
    setLayers(layers.filter(l => l.id !== id));
    saveToHistory();
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/png', 1.0);
    link.download = `edited-${Date.now()}.png`;
    link.click();
    toast({ title: 'Image downloaded!' });
  };

  const handleUploadToCloud = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.toBlob(async (blob) => {
      try {
        const { file_url } = await base44.integrations.Core.UploadFile({ file: blob });
        toast({ title: 'Uploaded!', description: file_url });
      } catch (e) {
        toast({ title: 'Upload failed', variant: 'destructive' });
      }
    }, 'image/png', 0.95);
  };

  const handleCrop = () => {
    if (!image) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    const x = (cropArea.x / 100) * image.width;
    const y = (cropArea.y / 100) * image.height;
    const w = (cropArea.width / 100) * image.width;
    const h = (cropArea.height / 100) * image.height;
    
    const imageData = ctx.getImageData(x, y, w, h);
    canvas.width = w;
    canvas.height = h;
    ctx.putImageData(imageData, 0, 0);
    setCropMode(false);
    saveToHistory();
    toast({ title: 'Image cropped!' });
  };

  const resetAdjustments = () => {
    setBrightness(100);
    setContrast(100);
    setSaturation(100);
    setHue(0);
    setBlur(0);
    setRotation(0);
    setScale(100);
    setFilter('none');
    saveToHistory();
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <div className="border-b border-border/40 px-6 py-3 flex items-center justify-between bg-card/50">
        <div className="flex items-center gap-4">
          <h1 className="font-display text-xl text-foreground">Pro Image Editor</h1>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={undo} disabled={historyIndex <= 0}>
              <Undo className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={redo} disabled={historyIndex >= history.length - 1}>
              <Redo className="w-4 h-4" />
            </Button>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()} className="gap-2">
            <Upload className="w-4 h-4" /> Import
          </Button>
          <Button variant="outline" size="sm" onClick={handleDownload} disabled={!image} className="gap-2">
            <Download className="w-4 h-4" /> Export
          </Button>
          <Button size="sm" onClick={handleUploadToCloud} disabled={!image} className="gap-2 gradient-gold-button border-0">
            <Save className="w-4 h-4" /> Save to Cloud
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Tools */}
        <div className="w-64 border-r border-border/40 bg-card/30 overflow-hidden">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
            <TabsList className="w-full justify-start rounded-none border-b border-border/40 bg-transparent p-0 h-auto">
              <TabsTrigger value="adjust" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary">Adjust</TabsTrigger>
              <TabsTrigger value="filters" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary">Filters</TabsTrigger>
              <TabsTrigger value="text" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary">Text</TabsTrigger>
              <TabsTrigger value="stickers" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary">Stickers</TabsTrigger>
              <TabsTrigger value="layers" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary">Layers</TabsTrigger>
            </TabsList>

            <ScrollArea className="flex-1 p-4">
              <TabsContent value="adjust" className="space-y-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Sun className="w-4 h-4 text-muted-foreground" />
                    <Label className="font-body text-xs">Brightness</Label>
                  </div>
                  <Slider min={0} max={200} value={[brightness]} onValueChange={(v) => setBrightness(v[0])} />
                  <p className="text-xs text-muted-foreground mt-1">{brightness}%</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Contrast className="w-4 h-4 text-muted-foreground" />
                    <Label className="font-body text-xs">Contrast</Label>
                  </div>
                  <Slider min={0} max={200} value={[contrast]} onValueChange={(v) => setContrast(v[0])} />
                  <p className="text-xs text-muted-foreground mt-1">{contrast}%</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Palette className="w-4 h-4 text-muted-foreground" />
                    <Label className="font-body text-xs">Saturation</Label>
                  </div>
                  <Slider min={0} max={200} value={[saturation]} onValueChange={(v) => setSaturation(v[0])} />
                  <p className="text-xs text-muted-foreground mt-1">{saturation}%</p>
                </div>
                <div>
                  <Label className="font-body text-xs">Hue Rotate</Label>
                  <Slider min={0} max={360} value={[hue]} onValueChange={(v) => setHue(v[0])} />
                  <p className="text-xs text-muted-foreground mt-1">{hue}°</p>
                </div>
                <div>
                  <Label className="font-body text-xs">Blur</Label>
                  <Slider min={0} max={20} value={[blur]} onValueChange={(v) => setBlur(v[0])} />
                  <p className="text-xs text-muted-foreground mt-1">{blur}px</p>
                </div>
                <div>
                  <Label className="font-body text-xs">Rotation</Label>
                  <Slider min={0} max={360} step={15} value={[rotation]} onValueChange={(v) => setRotation(v[0])} />
                  <p className="text-xs text-muted-foreground mt-1">{rotation}°</p>
                </div>
                <div>
                  <Label className="font-body text-xs">Scale</Label>
                  <Slider min={50} max={150} value={[scale]} onValueChange={(v) => setScale(v[0])} />
                  <p className="text-xs text-muted-foreground mt-1">{scale}%</p>
                </div>
                <Button variant="outline" size="sm" onClick={resetAdjustments} className="w-full">Reset All</Button>
              </TabsContent>

              <TabsContent value="filters" className="space-y-2">
                {Object.keys(FILTERS).map(f => (
                  <Button
                    key={f}
                    variant={filter === f ? 'default' : 'outline'}
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => setFilter(f)}
                  >
                    {f.charAt(0).toUpperCase() + f.slice(1)}
                  </Button>
                ))}
              </TabsContent>

              <TabsContent value="text" className="space-y-4">
                <Input
                  placeholder="Enter text..."
                  value={textTool.text}
                  onChange={(e) => setTextTool({ ...textTool, text: e.target.value })}
                />
                <div>
                  <Label className="font-body text-xs">Size</Label>
                  <Slider min={12} max={120} value={[textTool.size]} onValueChange={(v) => setTextTool({ ...textTool, size: v[0] })} />
                </div>
                <div>
                  <Label className="font-body text-xs">Color</Label>
                  <Input type="color" value={textTool.color} onChange={(e) => setTextTool({ ...textTool, color: e.target.value })} className="h-10" />
                </div>
                <Button onClick={addText} className="w-full">Add Text</Button>
              </TabsContent>

              <TabsContent value="stickers" className="space-y-3">
                <div className="grid grid-cols-4 gap-2">
                  {STICKERS.map(s => (
                    <Button
                      key={s.name}
                      variant="outline"
                      size="sm"
                      className="text-2xl p-2"
                      onClick={() => addSticker(s.emoji)}
                    >
                      {s.emoji}
                    </Button>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="layers" className="space-y-2">
                {layers.map((layer, idx) => (
                  <div key={layer.id} className="flex items-center gap-2 p-2 bg-secondary/30 rounded-lg">
                    <span className="flex-1 text-xs">
                      {layer.type === 'text' ? '📝' : '🎨'} {layer.type === 'text' ? layer.text : layer.emoji}
                    </span>
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => removeLayer(layer.id)}>
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
                {layers.length === 0 && <p className="text-xs text-muted-foreground text-center py-4">No layers</p>}
              </TabsContent>
            </ScrollArea>
          </Tabs>
        </div>

        {/* Canvas Area */}
        <div className="flex-1 bg-black/50 flex items-center justify-center p-8" ref={containerRef}>
          {image ? (
            <canvas ref={canvasRef} className="max-w-full max-h-full shadow-2xl" />
          ) : (
            <div
              className="border-2 border-dashed border-border/40 rounded-2xl p-12 text-center cursor-pointer hover:border-primary/40 transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="font-body text-muted-foreground">Click to upload image</p>
              <p className="font-body text-xs text-muted-foreground/60 mt-2">Supports JPG, PNG, WebP</p>
            </div>
          )}
        </div>

        {/* Right Sidebar - Quick Actions */}
        <div className="w-48 border-l border-border/40 bg-card/30 p-4 space-y-4">
          <div>
            <Label className="font-body text-xs mb-2 block">Quick Crop</Label>
            <div className="grid grid-cols-3 gap-2">
              {[1, 1.5, 0.75].map(ratio => (
                <Button key={ratio} variant="outline" size="sm" className="text-xs">
                  {ratio}:1
                </Button>
              ))}
            </div>
          </div>
          <div>
            <Label className="font-body text-xs mb-2 block">Transitions</Label>
            {TRANSITIONS.map(t => (
              <Button key={t.name} variant="outline" size="sm" className="w-full justify-start text-xs mb-1">
                <Film className="w-3 h-3 mr-1" /> {t.name}
              </Button>
            ))}
          </div>
          <div className="pt-4 border-t border-border/30">
            <p className="font-body text-xs text-muted-foreground mb-2">Export Settings</p>
            <div className="space-y-2">
              <Button variant="outline" size="sm" className="w-full justify-start text-xs">
                <ImageIcon className="w-3 h-3 mr-1" /> PNG (Lossless)
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start text-xs">
                <ImageIcon className="w-3 h-3 mr-1" /> JPG (95%)
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start text-xs">
                <ImageIcon className="w-3 h-3 mr-1" /> WebP (80%)
              </Button>
            </div>
          </div>
        </div>
      </div>

      <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
    </div>
  );
}