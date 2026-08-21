import { useState } from 'react';
import { motion, Reorder } from 'framer-motion';
import { Upload, GripVertical, Star, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { base44 } from '@/api/base44Client';

export default function MultiImageGallery({ images = [], onChange }) {
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Prevent duplicate uploads of same file
    if (images.some(img => img === file.name)) {
      return;
    }
    
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    onChange([...images, file_url]);
  };

  const removeImage = (index) => {
    // Remove from local state
    const updatedImages = images.filter((_, i) => i !== index);
    onChange(updatedImages);
    // Note: Actual file deletion from storage should be handled by backend
    // when product is saved to database
  };

  const setHeroImage = (index) => {
    const newImages = [...images];
    const [removed] = newImages.splice(index, 1);
    newImages.unshift(removed);
    onChange(newImages);
  };

  const handleReorder = (newOrder) => {
    onChange(newOrder);
  };

  if (images.length === 0) {
    return (
      <div className="aspect-square rounded-xl border-2 border-dashed border-primary/40 flex flex-col items-center justify-center bg-secondary/30">
        <label className="cursor-pointer flex flex-col items-center">
          <input type="file" accept="image/*" className="hidden" onChange={handleUpload} multiple />
          <Upload className="w-10 h-10 text-primary mb-3" />
          <p className="font-body text-sm text-primary">Upload Product Images</p>
          <p className="font-body text-xs text-muted-foreground mt-1">Drag & drop or click to upload</p>
          <p className="font-body text-[10px] text-muted-foreground mt-2">Supports multiple images</p>
        </label>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative aspect-square rounded-xl overflow-hidden bg-secondary/50 border border-border/40 group">
        <img
          src={images[0]}
          alt="Primary product image"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          <Button
            size="sm"
            variant="secondary"
            onClick={() => {
              const input = document.createElement('input');
              input.type = 'file';
              input.accept = 'image/*';
              input.multiple = true;
              input.onchange = handleUpload;
              input.click();
            }}
          >
            <Upload className="w-4 h-4 mr-2" /> Add More
          </Button>
        </div>
        <Badge className="absolute top-3 left-3 bg-primary/80">
          <Star className="w-3 h-3 mr-1" /> Hero Image
        </Badge>
      </div>

      {/* Thumbnail Strip with Reorder */}
      {images.length > 1 && (
        <Reorder.Group axis="x" values={images} onReorder={handleReorder} className="flex gap-2 overflow-x-auto pb-2">
          {images.map((url, index) => (
            <Reorder.Item key={url} value={url} dragListener={index > 0}>
              <motion.div
                drag={index > 0}
                dragSnapToOrigin
                onDragStart={() => setDraggedIndex(index)}
                onDragEnd={() => setDraggedIndex(null)}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                className={`relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${
                  index === 0 ? 'border-primary' : 'border-transparent hover:border-primary/50'
                } ${draggedIndex === index ? 'opacity-50 scale-105' : ''}`}
              >
                <img src={url} alt={`Product view ${index + 1}`} className="w-full h-full object-cover" />
                
                {/* Overlay Controls */}
                <div className={`absolute inset-0 bg-black/60 flex items-center justify-center gap-1 transition-opacity ${
                  hoveredIndex === index || draggedIndex === index ? 'opacity-100' : 'opacity-0'
                }`}>
                  {index > 0 && (
                    <>
                      <button
                        onClick={() => setHeroImage(index)}
                        className="p-1.5 rounded-full bg-white/20 hover:bg-white/40 transition-colors"
                        title="Set as hero"
                      >
                        <Star className="w-3 h-3 text-white" />
                      </button>
                      <button
                        onClick={() => removeImage(index)}
                        className="p-1.5 rounded-full bg-destructive/60 hover:bg-destructive transition-colors"
                        title="Remove"
                      >
                        <Trash2 className="w-3 h-3 text-white" />
                      </button>
                    </>
                  )}
                  {index > 0 && (
                    <div className="absolute top-1 right-1 cursor-grab active:cursor-grabbing">
                      <GripVertical className="w-3 h-3 text-white/60" />
                    </div>
                  )}
                </div>

                {/* Hero Badge */}
                {index === 0 && (
                  <div className="absolute top-1 left-1">
                    <Star className="w-3 h-3 text-primary fill-primary" />
                  </div>
                )}

                {/* Image Number */}
                <div className="absolute bottom-1 right-1 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded">
                  {index + 1}
                </div>
              </motion.div>
            </Reorder.Item>
          ))}
          
          {/* Add More Button in Thumbnail Strip */}
          <label className="flex-shrink-0 w-20 h-20 rounded-lg border-2 border-dashed border-primary/40 hover:border-primary cursor-pointer flex items-center justify-center bg-secondary/30">
            <input type="file" accept="image/*" className="hidden" onChange={handleUpload} multiple />
            <Upload className="w-5 h-5 text-primary" />
          </label>
        </Reorder.Group>
      )}

      {/* Info Bar */}
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <p>{images.length} image{images.length > 1 ? 's' : ''} uploaded</p>
        <p>Drag thumbnails to reorder • Click star to set hero</p>
      </div>
    </div>
  );
}