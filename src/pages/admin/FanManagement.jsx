import React from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Trash2, MessageCircle } from 'lucide-react';
import { format } from 'date-fns';

export default function FanManagement() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: posts } = useQuery({
    queryKey: ['fanPosts'], queryFn: () => base44.entities.FanPost.list('-created_date'), initialData: [],
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.FanPost.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fanPosts'] });
      toast({ title: 'Post deleted' });
    },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-3xl text-foreground">Fan Community</h1>
        <p className="font-body text-sm text-muted-foreground">{posts.length} posts</p>
      </div>

      <div className="space-y-3">
        {posts.map(post => (
          <Card key={post.id} className="bg-card border-border/40">
            <CardContent className="p-4 flex items-start justify-between gap-4">
              <div className="flex items-start gap-3 flex-1">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="font-display text-sm text-primary">{post.author_name?.[0]?.toUpperCase() || '?'}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-body text-sm font-medium text-foreground">{post.author_name || 'Anonymous'}</p>
                    {post.author_email && <p className="font-body text-xs text-muted-foreground">{post.author_email}</p>}
                    <p className="font-body text-xs text-muted-foreground">
                      {post.created_date ? format(new Date(post.created_date), 'MMM d, yyyy h:mm a') : ''}
                    </p>
                  </div>
                  <p className="font-body text-sm text-foreground/80 mt-1">{post.content}</p>
                </div>
              </div>
              <Button size="icon" variant="ghost" onClick={() => deleteMutation.mutate(post.id)}>
                <Trash2 className="w-4 h-4 text-destructive" />
              </Button>
            </CardContent>
          </Card>
        ))}
        {posts.length === 0 && (
          <div className="text-center py-16">
            <MessageCircle className="w-12 h-12 text-muted-foreground/20 mx-auto mb-4" />
            <p className="font-body text-muted-foreground">No community posts yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}