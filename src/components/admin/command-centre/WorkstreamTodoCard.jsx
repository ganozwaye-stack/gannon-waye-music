import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { base44 } from '@/api/base44Client';
import { CalendarDays, CheckCircle2, Circle, Play } from 'lucide-react';

const today = () => new Date().toISOString().slice(0, 10);

function daysLeft(dueDate) {
  if (!dueDate) return null;
  const diff = new Date(dueDate + 'T00:00:00') - new Date(today() + 'T00:00:00');
  return Math.round(diff / 86400000);
}

function statusBadge(status, overdue) {
  if (overdue) return 'bg-red-500/15 text-red-400 border border-red-500/30';
  if (status === 'in_progress') return 'bg-amber-500/15 text-amber-400 border border-amber-500/30';
  if (status === 'blocked') return 'bg-red-500/10 text-red-300 border border-red-500/20';
  return 'bg-secondary text-muted-foreground border border-border/40';
}

// The owner's active workstream to-do list with deadlines, so progress on
// every project stays visible and nothing slips. Start and Done are one
// press each, straight from the Command Centre.
export default function WorkstreamTodoCard() {
  const queryClient = useQueryClient();

  const { data: todos = [], isLoading } = useQuery({
    queryKey: ['ownerWorkstreamTodos'],
    queryFn: () => base44.entities.OwnerWorkstreamTodo.list('due_date'),
    initialData: [],
  });

  const updateStatus = useMutation({
    mutationFn: ({ id, status }) => base44.entities.OwnerWorkstreamTodo.update(id, { status }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['ownerWorkstreamTodos'] }),
  });

  const active = todos.filter((t) => t.status !== 'done');
  const done = todos.filter((t) => t.status === 'done');

  return (
    <Card className="border-border/40 h-full">
      <CardHeader>
        <CardTitle className="font-display text-lg text-white flex items-center gap-2">
          <CalendarDays className="w-5 h-5 text-primary" /> Workstream To-Do
        </CardTitle>
        <CardDescription className="text-xs">
          Active projects with deadlines, so everything stays complete on time.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2 max-h-[380px] overflow-y-auto">
        {isLoading && <p className="text-xs text-muted-foreground">Loading your to-do list…</p>}
        {!isLoading && active.length === 0 && (
          <div className="p-4 text-center border border-dashed border-border/30 rounded-xl text-xs text-muted-foreground">
            <CheckCircle2 className="w-10 h-10 text-green-400 mx-auto mb-2 opacity-60" />
            <span>Nothing open. Every workstream item is complete.</span>
          </div>
        )}
        {active.map((t) => {
          const left = daysLeft(t.due_date);
          const overdue = left !== null && left < 0;
          return (
            <div key={t.id} className={`p-3 rounded-xl border ${overdue ? 'border-red-500/30 bg-red-500/5' : 'border-border/40 bg-secondary/15'}`}>
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="font-body text-sm text-foreground">{t.title}</p>
                  <p className="font-body text-[11px] text-muted-foreground mt-0.5">
                    {t.workstream}
                    {t.due_date && (
                      <span className={overdue ? 'text-red-400' : ''}>
                        {' · due ' + t.due_date + (overdue ? ', overdue' : left === 0 ? ', today' : ` in ${left} day${left === 1 ? '' : 's'}`)}
                      </span>
                    )}
                  </p>
                </div>
                <span className={`shrink-0 rounded-full px-2 py-0.5 font-body text-[9px] uppercase tracking-wide ${statusBadge(t.status, overdue)}`}>
                  {t.status === 'in_progress' ? 'In progress' : t.status === 'blocked' ? 'Blocked' : 'To do'}
                </span>
              </div>
              <div className="flex items-center gap-2 mt-2.5">
                {t.status === 'todo' && (
                  <Button
                    type="button" size="sm" variant="outline"
                    className="h-7 rounded-full border-primary/40 text-primary text-[10px] uppercase tracking-wider"
                    onClick={() => updateStatus.mutate({ id: t.id, status: 'in_progress' })}
                  >
                    <Play className="w-3 h-3 mr-1" /> Start
                  </Button>
                )}
                <Button
                  type="button" size="sm" variant="outline"
                  className="h-7 rounded-full border-green-500/40 text-green-400 hover:bg-green-500/10 text-[10px] uppercase tracking-wider"
                  onClick={() => updateStatus.mutate({ id: t.id, status: 'done' })}
                >
                  <CheckCircle2 className="w-3 h-3 mr-1" /> Done
                </Button>
                {t.linked_route && (
                  <Link to={t.linked_route} className="ml-auto font-body text-[10px] uppercase tracking-wider text-primary hover:underline">
                    Open
                  </Link>
                )}
              </div>
            </div>
          );
        })}
        {done.length > 0 && (
          <div className="pt-2 space-y-1.5">
            {done.slice(0, 4).map((t) => (
              <p key={t.id} className="flex items-center gap-2 font-body text-[11px] text-muted-foreground">
                <Circle className="w-3 h-3 fill-green-500/40 text-green-500/60 shrink-0" />
                <span className="line-through decoration-border">{t.title}</span>
              </p>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}