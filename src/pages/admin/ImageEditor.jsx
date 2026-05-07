import React, { useRef, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { base44 } from '@/api/base44Client';
import {
  Upload, Download, RotateCw, Filter, Type, Copy, ZoomIn, ZoomOut, X,
  Sun, Eye, Palette, Trash2
} from 'lucide-react';

export default function ImageEditor() {
  const { toast } = useToast();
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const [image, setImage] = useState(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState('select');
  const [fontSize, setFontSize] = useState(20);
  const [color, setColor] = useState('#ffffff');
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [rotation, setRotation] = useState(0);
  const [scale, setScale] = useState(100);
  const [history, setHistory] = useState([]);

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        setImage(img);
        setHistory([img]);
        redrawCanvas(img);
      };
      img.src = event.target?.result;
    };
    reader.readAsDataURL(file);
  };

  const redrawCanvas = (img, brightness_ = brightness, contrast_ = contrast, rotation_ = rotation) => {
    const canvas = canvasRef.current;
    if (!canvas || !img) return;

    const ctx = canvas.getContext('2d');
    canvas.width = img.width;
    canvas.height = img.height;

    ctx.save();

    // Apply filters
    ctx.filter = `brightness(${brightness_ || brightness}%) contrast(${contrast_ || contrast}%)`;

    // Apply rotation
    if (rotation_ || rotation) {
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate((rotation_ || rotation) * (Math.PI / 180));
      ctx.translate(-canvas.width / 2, -canvas.height / 2);
    }

    // Draw image with scale
    const scaleFactor = (scale || 100) / 100;
    ctx.drawImage(img, 0, 0, img.width * scaleFactor, img.height * scaleFactor);

    ctx.restore();
  };

  useEffect(() => {
    if (image) {
      redrawCanvas(image);
    }
  }, [brightness, contrast, rotation, scale]);

  const handleAddText = () => {
    const text = prompt('Enter text:');
    if (!text) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    ctx.font = `${fontSize}px Arial`;
    ctx.fillStyle = color;
    ctx.fillText(text, 50, 50);
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/png');
    link.download = `edited-image-${Date.now()}.png`;
    link.click();

    toast({ title: 'Image downloaded!' });
  };

  const handleUploadToCloud = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.toBlob(async (blob) => {
      try {
        const { file_url } = await base44.integrations.Core.UploadFile({ file: blob });
        toast({ title: 'Image uploaded!', description: file_url });
      } catch (e) {
        toast({ title: 'Upload failed', variant: 'destructive' });
      }
    });
  };

  const handleCrop = () => {
    const width = prompt('Width (px):', canvasRef.current?.width.toString());
    const height = prompt('Height (px):', canvasRef.current?.height.toString());

    if (!width || !height) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const imageData = ctx.getImageData(0, 0, parseInt(width), parseInt(height));

    canvas.width = parseInt(width);
    canvas.height = parseInt(height);
    ctx.putImageData(imageData, 0, 0);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="font-display text-3xl text-foreground mb-8">Image Editor</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Canvas */}
        <div className="lg:col-span-2">
          <div className="bg-secondary/40 rounded-2xl p-6 border border-border/40">
            <div className="bg-black rounded-lg overflow-auto max-h-[600px] flex items-center justify-center">
              <canvas
                ref={canvasRef}
                className="max-w-full max-h-[600px]"
              />
            </div>
          </div>

          {/* Tools */}
          <div className="mt-6 grid grid-cols-4 gap-2">
            <Button
              variant={tool === 'select' ? 'default' : 'outline'}
              onClick={() => setTool('select')}
              size="sm"
              className="rounded-full"
            >
              Select
            </Button>
            <Button
              variant={tool === 'text' ? 'default' : 'outline'}
              onClick={handleAddText}
              size="sm"
              className="rounded-full gap-1"
            >
              <Type className="w-3 h-3" /> Text
            </Button>
            <Button
              variant="outline"
              onClick={handleCrop}
              size="sm"
              className="rounded-full gap-1"
            >
              <Copy className="w-3 h-3" /> Crop
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setImage(null);
                setHistory([]);
              }}
              size="sm"
              className="rounded-full gap-1"
            >
              <Trash2 className="w-3 h-3" /> Clear
            </Button>
          </div>
        </div>

        {/* Controls */}
        <div className="space-y-6">
          {/* Upload */}
          <div>
            <Label className="font-body text-xs tracking-wider uppercase mb-2 block">Upload Image</Label>
            <div className="border-2 border-dashed border-border/40 rounded-xl p-6 text-center cursor-pointer hover:border-primary/40 transition-colors"
              onClick={() => fileInputRef.current?.click()}>
              <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
              <p className="font-body text-xs text-muted-foreground">Click to upload</p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
            </div>
          </div>

          {image && (
            <>
              {/* Brightness */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Sun className="w-4 h-4 text-muted-foreground" />
                  <Label className="font-body text-xs tracking-wider uppercase">Brightness</Label>
                </div>
                <Slider
                  min={0}
                  max={200}
                  step={1}
                  value={[brightness]}
                  onValueChange={(val) => setBrightness(val[0])}
                  className="w-full"
                />
                <p className="font-body text-xs text-muted-foreground mt-1">{brightness}%</p>
              </div>

              {/* Contrast */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Eye className="w-4 h-4 text-muted-foreground" />
                  <Label className="font-body text-xs tracking-wider uppercase">Contrast</Label>
                </div>
                <Slider
                  min={0}
                  max={200}
                  step={1}
                  value={[contrast]}
                  onValueChange={(val) => setContrast(val[0])}
                  className="w-full"
                />
                <p className="font-body text-xs text-muted-foreground mt-1">{contrast}%</p>
              </div>

              {/* Rotation */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <RotateCw className="w-4 h-4 text-muted-foreground" />
                  <Label className="font-body text-xs tracking-wider uppercase">Rotation</Label>
                </div>
                <Slider
                  min={0}
                  max={360}
                  step={15}
                  value={[rotation]}
                  onValueChange={(val) => setRotation(val[0])}
                  className="w-full"
                />
                <p className="font-body text-xs text-muted-foreground mt-1">{rotation}°</p>
              </div>

              {/* Scale */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <ZoomIn className="w-4 h-4 text-muted-foreground" />
                  <Label className="font-body text-xs tracking-wider uppercase">Scale</Label>
                </div>
                <Slider
                  min={50}
                  max={150}
                  step={5}
                  value={[scale]}
                  onValueChange={(val) => setScale(val[0])}
                  className="w-full"
                />
                <p className="font-body text-xs text-muted-foreground mt-1">{scale}%</p>
              </div>

              {/* Text Color */}
              <div>
                <Label className="font-body text-xs tracking-wider uppercase mb-2 block">Text Color</Label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="w-12 h-10 rounded-lg cursor-pointer"
                  />
                  <span className="font-body text-xs text-muted-foreground flex items-center">{color}</span>
                </div>
              </div>

              {/* Font Size */}
              <div>
                <Label className="font-body text-xs tracking-wider uppercase mb-2 block">Font Size</Label>
                <Input
                  type="number"
                  min={8}
                  max={100}
                  value={fontSize}
                  onChange={(e) => setFontSize(parseInt(e.target.value))}
                  className="bg-secondary/50"
                />
              </div>

              {/* Export */}
              <div className="space-y-2 pt-4 border-t border-border/30">
                <Button onClick={handleDownload} className="w-full rounded-full gap-2">
                  <Download className="w-4 h-4" /> Download
                </Button>
                <Button onClick={handleUploadToCloud} variant="outline" className="w-full rounded-full">
                  Upload to Cloud
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}