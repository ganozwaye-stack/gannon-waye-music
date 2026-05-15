import { useState, useEffect, useRef } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Zap, Send, Plus, MessageSquare } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export default function OrchestratorChat() {
  const [conversations, setConversations] = useState([]);
  const [activeConv, setActiveConv] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    base44.agents.listConversations({ agent_name: 'orchestrator' }).then(setConversations).catch(() => {});
  }, []);

  useEffect(() => {
    if (!activeConv) return;
    const unsub = base44.agents.subscribeToConversation(activeConv.id, data => setMessages(data.messages || []));
    return unsub;
  }, [activeConv?.id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const startNew = async () => {
    const conv = await base44.agents.createConversation({ agent_name: 'orchestrator', metadata: { name: `Session ${new Date().toLocaleTimeString()}` } });
    setConversations(prev => [conv, ...prev]);
    setActiveConv(conv);
    setMessages([]);
  };

  const send = async () => {
    if (!input.trim() || sending) return;
    if (!activeConv) await startNew();
    setSending(true);
    const msg = input;
    setInput('');
    await base44.agents.addMessage(activeConv || (await startNew()), { role: 'user', content: msg });
    setSending(false);
  };

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      {/* Sidebar */}
      <div className="w-64 border-r border-border flex flex-col">
        <div className="p-4 border-b border-border">
          <div className="flex items-center gap-2 mb-3">
            <Zap className="w-5 h-5 text-violet-400" />
            <span className="font-semibold text-sm">Orchestrator</span>
          </div>
          <Button size="sm" className="w-full gradient-gold-button" onClick={startNew}>
            <Plus className="w-3 h-3 mr-1" /> New Session
          </Button>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {conversations.map(c => (
            <button key={c.id} onClick={() => { setActiveConv(c); setMessages(c.messages || []); }}
              className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-colors ${activeConv?.id === c.id ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-secondary'}`}>
              <MessageSquare className="w-3 h-3 inline mr-1" />
              {c.metadata?.name || 'Session'}
            </button>
          ))}
        </div>
      </div>

      {/* Chat */}
      <div className="flex-1 flex flex-col">
        <div className="border-b border-border p-4 flex items-center gap-2">
          <Zap className="w-5 h-5 text-violet-400" />
          <div>
            <p className="font-semibold text-sm">Master Orchestrator Agent</p>
            <p className="text-xs text-muted-foreground">Routes tasks · Enforces Do-Not-Spend rule · Knows your brand & goals</p>
          </div>
          <Badge className="ml-auto bg-violet-500/10 text-violet-400">AI</Badge>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 && (
            <div className="text-center py-16 space-y-3">
              <Zap className="w-10 h-10 text-violet-400 mx-auto" />
              <p className="font-semibold text-lg">Gannon Waye AI Operating System</p>
              <p className="text-muted-foreground text-sm max-w-sm mx-auto">Ask me anything. I'll route your task to the right specialist agent, check it against your Do-Not-Spend rule, and handle it automatically or escalate for your approval.</p>
              <div className="flex flex-wrap gap-2 justify-center mt-4">
                {['What should I focus on today?','Draft a social post about Thank You','Research current music trends','Check for financial risks','Organize my legal documents'].map(s => (
                  <button key={s} onClick={() => setInput(s)} className="text-xs px-3 py-1.5 border border-border rounded-full hover:border-primary/40 text-muted-foreground hover:text-foreground transition-colors">{s}</button>
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
                    {msg.content}
                  </ReactMarkdown>
                )}
              </div>
            </div>
          ))}
          {sending && (
            <div className="flex justify-start">
              <div className="bg-card border border-border rounded-2xl px-4 py-3">
                <div className="flex gap-1"><span className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{animationDelay:'0ms'}}></span><span className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{animationDelay:'150ms'}}></span><span className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{animationDelay:'300ms'}}></span></div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        <div className="border-t border-border p-4">
          <div className="flex gap-2">
            <Input
              placeholder="Ask the Orchestrator anything..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send()}
              className="flex-1"
            />
            <Button onClick={send} disabled={sending || !input.trim()} className="gradient-gold-button">
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}