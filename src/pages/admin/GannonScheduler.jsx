import React, { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, CheckCircle2, Circle, Clock, ListChecks, Plus, Trash2, Zap } from 'lucide-react';

const STORAGE_KEY = 'gwm-admin-scheduler-v1';

const SEED_TASKS = [
  { title: 'Make Mum page private', category: 'Mum Tribute', priority: 'critical', status: 'todo', suggestedBy: 'System', notes: 'Protect /mum and /without-you-here from public access.' },
  { title: 'Build family upload portal', category: 'Family', priority: 'critical', status: 'todo', suggestedBy: 'System', notes: 'Create a place for family to submit photos, videos, voice notes, eulogies, speeches, and stories.' },
  { title: 'Review family photos and voice messages', category: 'Family', priority: 'high', status: 'todo', suggestedBy: 'Agent', notes: 'Approve only the files that should become part of the tribute archive.' },
  { title: 'Create Mum Tribute Studio layout', category: 'Mum Tribute', priority: 'high', status: 'todo', suggestedBy: 'Agent', notes: 'Private admin studio for garden scenes, children priority, eulogy, voice archive, and scroll story.' },
  { title: 'Collect eulogy and speeches', category: 'Family', priority: 'high', status: 'todo', suggestedBy: 'Gannon', notes: 'Ask family for funeral recording, eulogy, and sibling speeches.' },
  { title: 'Prepare Sonia Memory Chat knowledge base', category: 'Mum Tribute', priority: 'medium', status: 'todo', suggestedBy: 'Agent', notes: 'Use approved memories only. Do not invent. Do not clone voice yet.' },
  { title: 'Review website routes after privacy update', category: 'Website', priority: 'high', status: 'todo', suggestedBy: 'System', notes: 'Check /mum, /without-you-here, /admin/mum, and /admin/mum-tribute.' },
  { title: 'Confirm store and checkout still work', category: 'Store', priority: 'critical', status: 'todo', suggestedBy: 'System', notes: 'Do not break Stripe, cart, orders, webhooks, promo codes, inventory, or checkout.' },
  { title: 'Review next music release plan', category: 'Music', priority: 'medium', status: 'todo', suggestedBy: 'Gannon', notes: 'Use the album planner and hook engine after scheduler is stable.' },
];

const emptyTask = {
  title: '',
  category: 'Website',
  priority: 'medium',
  status: 'todo',
  dueDate: '',
  notes: '',
  suggestedBy: 'Gannon',
};

const priorityClasses = {
  critical: 'bg-red-500/10 text-red-400 border-red-500/30',
  high: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
  medium: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
  low: 'bg-secondary text-muted-foreground border-border',
};

const statusLabels = {
  todo: 'To do',
  doing: 'Doing',
  waiting: 'Waiting',
  done: 'Done',
};

function createTask(input) {
  return {
    id: crypto?.randomUUID?.() || `${Date.now()}-${Math.random()}`,
    createdAt: new Date().toISOString(),
    dueDate: '',
    ...input,
  };
}

function loadTasks() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (error) {
    console.warn('Could not load scheduler tasks', error);
  }
  return SEED_TASKS.map(createTask);
}

function TaskCard({ task, onStatus, onDelete }) {
  return (
    <Card className="border-border/50 bg-card/70">
      <CardContent className="p-4 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="font-semibold text-sm text-foreground">{task.title}</h3>
            <p className="text-xs text-muted-foreground mt-1">{task.notes}</p>
          </div>
          <Button size="icon" variant="ghost" className="h-7 w-7 text-muted-foreground" onClick={() => onDelete(task.id)}>
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
        <div className="flex flex-wrap gap-2 items-center">
          <Badge variant="outline" className={priorityClasses[task.priority] || priorityClasses.medium}>{task.priority}</Badge>
          <Badge variant="outline" className="border-border text-muted-foreground">{task.category}</Badge>
          <Badge variant="outline" className="border-primary/30 text-primary">{task.suggestedBy}</Badge>
          {task.dueDate && <Badge variant="outline" className="border-border text-muted-foreground"><CalendarDays className="h-3 w-3 mr-1" />{task.dueDate}</Badge>}
        </div>
        <div className="flex flex-wrap gap-2">
          <Button size="sm" variant={task.status === 'doing' ? 'default' : 'outline'} onClick={() => onStatus(task.id, 'doing')}>Doing</Button>
          <Button size="sm" variant={task.status === 'waiting' ? 'default' : 'outline'} onClick={() => onStatus(task.id, 'waiting')}>Waiting</Button>
          <Button size="sm" className="gap-1" onClick={() => onStatus(task.id, 'done')}><CheckCircle2 className="h-3.5 w-3.5" />Done</Button>
        </div>
      </CardContent>
    </Card>
  );
}

function TaskColumn({ title, icon: Icon, tasks, onStatus, onDelete }) {
  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-lg font-semibold flex items-center gap-2"><Icon className="h-4 w-4 text-primary" />{title}</h2>
        <Badge variant="outline">{tasks.length}</Badge>
      </div>
      <div className="space-y-3">
        {tasks.length === 0 ? (
          <Card className="border-dashed border-border/60"><CardContent className="p-4 text-xs text-muted-foreground">Nothing here.</CardContent></Card>
        ) : tasks.map(task => <TaskCard key={task.id} task={task} onStatus={onStatus} onDelete={onDelete} />)}
      </div>
    </section>
  );
}

export default function GannonScheduler() {
  const [tasks, setTasks] = useState(loadTasks);
  const [form, setForm] = useState(emptyTask);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  const today = new Date().toISOString().slice(0, 10);

  const groups = useMemo(() => {
    const active = tasks.filter(task => task.status !== 'done');
    return {
      today: active.filter(task => !task.dueDate || task.dueDate <= today),
      suggested: active.filter(task => task.suggestedBy !== 'Gannon'),
      waiting: active.filter(task => task.status === 'waiting'),
      done: tasks.filter(task => task.status === 'done'),
    };
  }, [tasks, today]);

  const addTask = event => {
    event.preventDefault();
    if (!form.title.trim()) return;
    setTasks(current => [createTask({ ...form, title: form.title.trim() }), ...current]);
    setForm(emptyTask);
  };

  const updateStatus = (id, status) => {
    setTasks(current => current.map(task => task.id === id ? { ...task, status } : task));
  };

  const deleteTask = id => {
    setTasks(current => current.filter(task => task.id !== id));
  };

  return (
    <div className="space-y-6 pb-16">
      <div className="space-y-2">
        <p className="font-body text-xs tracking-[0.3em] uppercase gradient-gold-glow">Gannon Waye Music OS</p>
        <h1 className="font-display text-3xl font-bold gradient-gold-text">Scheduler and Action Centre</h1>
        <p className="text-sm text-muted-foreground max-w-3xl">Your daily brain for music, website, family, legal, admin, store, and personal tasks. Agents can suggest tasks, but you stay in control.</p>
      </div>

      <Card className="border-primary/30 bg-primary/5">
        <CardHeader><CardTitle className="text-sm flex items-center gap-2"><Plus className="h-4 w-4 text-primary" />Add task</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={addTask} className="grid grid-cols-1 md:grid-cols-6 gap-3">
            <Input className="md:col-span-2" placeholder="Task title" value={form.title} onChange={event => setForm({ ...form, title: event.target.value })} />
            <select className="rounded-md border border-input bg-background px-3 text-sm" value={form.category} onChange={event => setForm({ ...form, category: event.target.value })}>
              {['Music', 'Website', 'Mum Tribute', 'Store', 'Legal', 'Personal', 'Family', 'Admin'].map(value => <option key={value}>{value}</option>)}
            </select>
            <select className="rounded-md border border-input bg-background px-3 text-sm" value={form.priority} onChange={event => setForm({ ...form, priority: event.target.value })}>
              {['critical', 'high', 'medium', 'low'].map(value => <option key={value}>{value}</option>)}
            </select>
            <select className="rounded-md border border-input bg-background px-3 text-sm" value={form.suggestedBy} onChange={event => setForm({ ...form, suggestedBy: event.target.value })}>
              {['Gannon', 'Agent', 'System'].map(value => <option key={value}>{value}</option>)}
            </select>
            <Input type="date" value={form.dueDate} onChange={event => setForm({ ...form, dueDate: event.target.value })} />
            <Textarea className="md:col-span-5" placeholder="Notes or guidance" value={form.notes} onChange={event => setForm({ ...form, notes: event.target.value })} />
            <Button type="submit" className="gap-2"><Plus className="h-4 w-4" />Add</Button>
          </form>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <TaskColumn title="Today and overdue" icon={Clock} tasks={groups.today} onStatus={updateStatus} onDelete={deleteTask} />
        <TaskColumn title="Agent and system suggested" icon={Zap} tasks={groups.suggested} onStatus={updateStatus} onDelete={deleteTask} />
        <TaskColumn title="Waiting" icon={Circle} tasks={groups.waiting} onStatus={updateStatus} onDelete={deleteTask} />
        <TaskColumn title="Completed" icon={ListChecks} tasks={groups.done} onStatus={updateStatus} onDelete={deleteTask} />
      </div>
    </div>
  );
}
