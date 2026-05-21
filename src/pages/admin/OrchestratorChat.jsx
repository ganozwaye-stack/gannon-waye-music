import { useState, useEffect, useRef } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Zap, Send, Plus, MessageSquare, Brain, BookOpen, Trash2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const AGENTS = [
  { name: 'orchestrator', label: 'Master Orchestrator', icon: Zap, color: 'text-violet-400', bg: 'bg-violet-500/10', desc: 'Routes tasks · Knows your brand & goals · Enforces Do-Not-Spend rule' },
  { name: 'literature_researcher', label: 'Literature Researcher', icon: BookOpen, color: 'text-cyan-400', bg: 'bg-cyan-500/10', desc: 'PhD-level research · Peer-reviewed literature · Finds gaps & themes' },
  { name: 'academic_writing_coach', label: 'Academic Writing Coach', icon: Brain, color: 'text-pink-400', bg: 'bg-pink-500/10', desc: 'HD-level writing coach · Argument structure · APA 7th · Your voice' },
];

export default function OrchestratorChat() {
  const [conversations, setConversations] = useState([]);
  const [activeConv, setActiveConv] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState('orchestrator');
  const bottomRef = useRef(null);
  const activeConvRef = useRef(null);

  const agentConfig = AGENTS.find(a => a.name === selectedAgent) || AGENTS[0];

  useEffect(() => {
    loadConversations(selectedAgent);
  }, [selectedAgent]);

  useEffect(() => {
    activeConvRef.current = activeConv;
  }, [activeConv]);

  useEffect(() => {
    if (!activeConv?.id) return;
    const unsub = base44.agents.subscribeToConversation(activeConv.id, data => setMessages(data.messages || []));
    return unsub;
  }, [activeConv?.id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadConversations = async (agentName) => {
    setActiveConv(null);
    setMessages([]);
    const convs = await base44.agents.listConversations({ agent_name: agentName }).catch(() => []);
    setConversations(convs || []);
  };

  const startNew = async () => {
    const conv = await base44.agents.createConversation({
      agent_name: selectedAgent,
      metadata: { name: `${agentConfig.label} · ${new Date().toLocaleTimeString('en-AU', { hour: '2-digit', minute: '2-digit' })}` }
    });
    setConversations(prev => [conv, ...prev]);
    setActiveConv(conv);
    activeConvRef.current = conv;
    setMessages([]);
    return conv;
  };

  const selectConv = async (conv) => {
    setActiveConv(conv);
    const full = await base44.agents.getConversation(conv.id).catch(() => conv);
    setMessages(full.messages || []);
  };

  const send = async () => {
    if (!input.trim() || sending) return;
    setSending(true);
    const msg = input.trim();
    setInput('');

    let conv = activeConvRef.current;
    if (!conv) {
      conv = await startNew();
    }

    await base44.agents.addMessage(conv, { role: 'user', content: msg });
    setSending(false);
  };

  const PROMPTS = {
    orchestrator: ['What should I focus on today?', 'Draft a social post about Thank You', 'Check for financial risks', 'What agents are inactive and why?'],
    literature_researcher: ['I need peer-reviewed research on [your topic]', 'What are the key themes in [field]?', 'Identify gaps in the literature on [topic]', 'How do these studies link together?'],
    academic_writing_coach: ['Help me structure my literature review', 'How do I write a strong topic sentence?', 'Review my paragraph for depth', 'Help me link these articles together in my writing'],
  };

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      {/* Sidebar */}
      <div className="w-64 border-r border-border flex flex-col shrink-0">
        <div className="p-4 border-b border-border space-y-3">
          {/* Agent Selector */}
          <div>
            <p className="text-xs text-muted-foreground mb-1 font-semibold uppercase tracking-wider">Select Agent</p>
            <Select value={selectedAgent} onValueChange={setSelectedAgent}>
              <SelectTrigger className="text-xs h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {AGENTS.map(a => (
                  <SelectItem key={a.name} value={a.name}>
                    <span className="flex items-center gap-2">
                      <a.icon className={`w-3 h-3 ${a.color}`} />
                      {a.label}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button size="sm" className="w-full gradient-gold-button" onClick={startNew}>
            <Plus className="w-3 h-3 mr-1" /> New Conversation
          </Button>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {conversations.length === 0 && (
            <p className="text-xs text-muted-foreground text-center py-4">No conversations yet</p>
          )}
          {conversations.map(c => (
            <button key={c.id} onClick={() => selectConv(c)}
              className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-colors ${activeConv?.id === c.id ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-secondary'}`}>
              <MessageSquare className="w-3 h-3 inline mr-1" />
              {c.metadata?.name || 'Session'}
            </button>
          ))}
        </div>
      </div>

      {/* Chat */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <div className={`border-b border-border p-4 flex items-center gap-3 ${agentConfig.bg}`}>
          <agentConfig.icon className={`w-5 h-5 ${agentConfig.color} shrink-0`} />
          <div className="min-w-0">
            <p className="font-semibold text-sm">{agentConfig.label}</p>
            <p className="text-xs text-muted-foreground truncate">{agentConfig.desc}</p>
          </div>
          <Badge className={`ml-auto shrink-0 ${agentConfig.bg} ${agentConfig.color}`}>AI</Badge>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 && (
            <div className="text-center py-12 space-y-4 max-w-lg mx-auto">
              <agentConfig.icon className={`w-10 h-10 ${agentConfig.color} mx-auto`} />
              <p className="font-semibold text-lg">{agentConfig.label}</p>
              <p className="text-muted-foreground text-sm">{agentConfig.desc}</p>
              <div className="flex flex-wrap gap-2 justify-center mt-4">
                {(PROMPTS[selectedAgent] || []).map(s => (
                  <button key={s} onClick={() => setInput(s)}
                    className="text-xs px-3 py-1.5 border border-border rounded-full hover:border-primary/40 text-muted-foreground hover:text-foreground transition-colors text-left">
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-card border border-border'}`}>
                {msg.role === 'user' ? (
                  <p className="text-sm">{msg.content}</p>
                ) : (
                  <ReactMarkdown className="text-sm prose prose-sm prose-invert max-w-none [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
                    {msg.content || ''}
                  </ReactMarkdown>
                )}
              </div>
            </div>
          ))}
          {sending && (
            <div className="flex justify-start">
              <div className="bg-card border border-border rounded-2xl px-4 py-3">
                <div className="flex gap-1">
                  {[0, 150, 300].map(d => (
                    <span key={d} className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: `${d}ms` }} />
                  ))}
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="border-t border-border p-4">
          <div className="flex gap-2">
            <Input
              placeholder={`Message ${agentConfig.label}...`}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send()}
              className="flex-1"
            />
            <Button onClick={send} disabled={sending || !input.trim()} className="gradient-gold-button shrink-0">
              <Send className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-1.5 text-center">
            Talking to: <span className={agentConfig.color}>{agentConfig.label}</span> · Press Enter to send
          </p>
        </div>
      </div>
    </div>
  );
}