import { base44 } from '@/api/base44Client';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Camera, Star, Trash2 } from 'lucide-react';

export default function FanMedia() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: items } = useQuery({
    queryKey: ['fanMedia'],
    queryFn: () => base44.entities.FanMedia.list('-created_date'),
    initialData: [],
  });

  const handleDelete = async (id) => {
    await base44.entities.FanMedia.delete(id);
    queryClient.invalidateQueries({ queryKey: ['fanMedia'] });
    toast({ title: 'Deleted' });
  };

  const toggleFeatured = async (item) => {
    await base44.entities.FanMedia.update(item.id, { is_featured: !item.is_featured });
    queryClient.invalidateQueries({ queryKey: ['fanMedia'] });
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="font-display text-2xl text-foreground">Fan Media Wall</h1>
        <p className="font-body text-sm text-muted-foreground mt-1">
          {items.length} submission{items.length !== 1 ? 's' : ''}
        </p>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-24">
          <Camera className="w-12 h-12 text-muted-foreground/20 mx-auto mb-4" />
          <p className="font-body text-muted-foreground">No fan media submissions yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item) => (
            <div key={item.id} className="bg-card border border-border/40 rounded-2xl overflow-hidden">
              {item.file_type === 'video' ? (
                <video src={item.file_url} className="w-full aspect-square object-cover" controls />
              ) : (
                <img src={item.file_url} alt={item.caption || item.name} className="w-full aspect-square object-cover" />
              )}
              <div className="p-4 space-y-2">
                <p className="font-body text-sm text-foreground font-medium">{item.name}</p>
                {item.caption && <p className="font-body text-xs text-muted-foreground">{item.caption}</p>}
                <div className="flex items-center gap-2 pt-1">
                  <Button
                    size="sm"
                    variant={item.is_featured ? 'default' : 'outline'}
                    onClick={() => toggleFeatured(item)}
                    className="rounded-full font-body text-xs gap-1.5 flex-1"
                  >
                    <Star className="w-3 h-3" />
                    {item.is_featured ? 'Featured' : 'Feature'}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(item.id)}
                    className="rounded-full font-body text-xs border-destructive/30 text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}