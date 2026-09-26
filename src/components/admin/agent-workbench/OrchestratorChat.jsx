import { useState, useEffect, useRef } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Zap, Send, Plus, MessageSquare, Brain, BookOpen } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import VoiceButton from '@/components/ui/VoiceButton';
import ReactMarkdown from 'react-markdown';
import { createChatSender } from '@/lib/deegoChatSession';

const AGENTS = [
  { name: 'orchestrator', label: 'Master Orchestrator', icon: Zap, color: 'text-violet-400', bg: 'bg-violet-500/10', desc: 'Routes tasks · Knows your brand & goals · Enforces Do-Not-Spend rule' },
  { name: 'deego_master_ai', label: 'Deego', icon: Brain, color: 'text-emerald-400', bg: 'bg-emerald-500/10', desc: 'Private planning chat · No task executor or cross-chat relay' },
  { name: 'literature_researcher', label: 'Literature Researcher', icon: BookOpen, color: 'text-cyan-400', bg: 'bg-cyan-500/10', desc: 'PhD-level research · Peer-reviewed literature · Finds gaps & themes' },
  { name: 'academic_writing_coach', label: 'Academic Writing Coach', icon: Brain, color: 'text-pink-400', bg: 'bg-pink-500/10', desc: 'HD-level writing coach · Argument structure · APA 7th · Your voice' },
];

export default function OrchestratorChat() {
  const [conversations, setConversations] = useState([]);
  const [activeConv, setActiveConv] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState('deego_master_ai');
  const [chatError, setChatError] = useState('');
  const [loading, setLoading] = useState(false);
  const [policyCount, setPolicyCount] = useState(0);
  const [deliveryBlocked, setDeliveryBlocked] = useState(false);
  const [deliveryReviewed, setDeliveryReviewed] = useState(false);
  const senderRef = useRef(null);
  if (!senderRef.current) senderRef.current = createChatSender(base44);
  const loadRequestRef = useRef(0);
  const mountedRef = useRef(true);
  const sendLockRef = useRef(false);
  const bottomRef = useRef(null);
  const activeConvRef = useRef(null);

  const agentConfig = AGENTS.find(a => a.name === selectedAgent) || AGENTS[0];

  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; loadRequestRef.current++; };
  }, []);

  useEffect(() => {
    loadConversations(selectedAgent);
  }, [selectedAgent]);

  useEffect(() => {
    activeConvRef.current = activeConv;
  }, [activeConv]);

  useEffect(() => {
    if (!activeConv?.id) return;
    const conversationId = activeConv.id;
    const unsub = base44.agents.subscribeToConversation(conversationId, data => {
      if (mountedRef.current && activeConvRef.current?.id === conversationId) setMessages(data.messages || []);
    });
    return unsub;
  }, [activeConv?.id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadConversations = async (agentName) => {
    const request = ++loadRequestRef.current;
    activeConvRef.current = null;
    setActiveConv(null);
    setMessages([]);
    setConversations([]);
    setPolicyCount(0);
    setLoading(true);
    try {
      const convs = await base44.agents.listConversations({ agent_name: agentName });
      if (!Array.isArray(convs)) throw new Error('invalid_conversations');
      if (mountedRef.current && request === loadRequestRef.current) setConversations(convs);
    } catch {
      if (mountedRef.current && request === loadRequestRef.current) setChatError('Conversations could not be loaded. No conversation was deleted.');
    } finally {
      if (mountedRef.current && request === loadRequestRef.current) setLoading(false);
    }
  };

  const acceptConversation = (conv) => {
    if (!mountedRef.current) return;
    setConversations(prev => prev.some(item => item.id === conv.id) ? prev : [conv, ...prev]);
    activeConvRef.current = conv;
    setActiveConv(conv);
    setMessages(conv.messages || []);
  };

  const startNew = async () => {
    if (sendLockRef.current || loading || deliveryBlocked) return;
    setLoading(true);
    setChatError('');
    const request = ++loadRequestRef.current;
    try {
      const conv = await base44.agents.createConversation({
        agent_name: selectedAgent,
        metadata: { name: `${agentConfig.label} · ${new Date().toLocaleTimeString('en-AU', { hour: '2-digit', minute: '2-digit' })}` },
      });
      if (!conv?.id || conv.agent_name !== selectedAgent) throw new Error('invalid_conversation');
      if (mountedRef.current && request === loadRequestRef.current) acceptConversation(conv);
    } catch {
      if (mountedRef.current && request === loadRequestRef.current) setChatError('Conversation creation could not be confirmed. Refresh the list before creating another.');
    } finally {
      if (mountedRef.current && request === loadRequestRef.current) setLoading(false);
    }
  };

  const selectConv = async (conv) => {
    if (sendLockRef.current || loading) return;
    const request = ++loadRequestRef.current;
    activeConvRef.current = null;
    setActiveConv(null);
    setMessages([]);
    setLoading(true);
    setDeliveryReviewed(false);
    try {
      const full = await base44.agents.getConversation(conv.id);
      if (full?.id !== conv.id || full.agent_name !== selectedAgent) throw new Error('invalid_conversation');
      if (mountedRef.current && request === loadRequestRef.current) {
        acceptConversation(full);
        setDeliveryReviewed(true);
        if (!deliveryBlocked) setChatError('');
      }
    } catch {
      if (mountedRef.current && request === loadRequestRef.current) setChatError('That conversation could not be opened. Your draft is unchanged.');
    } finally {
      if (mountedRef.current && request === loadRequestRef.current) setLoading(false);
    }
  };

  const send = async () => {
    if (!input.trim() || sendLockRef.current || loading || deliveryBlocked) return;
    sendLockRef.current = true;
    setSending(true);
    setChatError('');
    setPolicyCount(0);
    const submittedInput = input;
    const request = loadRequestRef.current;
    try {
      const result = await senderRef.current.send({
        agentName: selectedAgent,
        conversation: activeConvRef.current,
        content: submittedInput.trim(),
        metadata: { name: `${agentConfig.label} · ${new Date().toLocaleTimeString('en-AU', { hour: '2-digit', minute: '2-digit' })}` },
        onCreated: acceptConversation,
        isCurrent: () => mountedRef.current && request === loadRequestRef.current,
      });
      if (mountedRef.current && request === loadRequestRef.current) {
        setInput(current => current === submittedInput ? '' : current);
        setPolicyCount(result.policyCount);
      }
    } catch (error) {
      if (mountedRef.current) {
        setChatError(error.name === 'ChatSessionError' ? error.message : 'Message submission failed. Your draft is unchanged.');
        if (error.code === 'delivery_unconfirmed') {
          setDeliveryBlocked(true);
          setDeliveryReviewed(false);
        }
      }
    } finally {
      sendLockRef.current = false;
      if (mountedRef.current) setSending(false);
    }
  };

  const PROMPTS = {
    orchestrator: ['What should I focus on today?', 'Draft a social post about Thank You', 'Check for financial risks', 'What agents are inactive and why?'],
    deego_master_ai: ['Help me prioritise my top money move', 'Draft a money-radar checklist', 'Help me prepare interview questions for awareness content', "Draft a Gannon's Mix Direct product-test checklist"],
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
            <Select value={selectedAgent} onValueChange={setSelectedAgent} disabled={sending || loading || deliveryBlocked}>
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
          <Button size="sm" className="w-full gradient-gold-button" onClick={startNew} disabled={sending || loading || deliveryBlocked}>
            <Plus className="w-3 h-3 mr-1" /> New Conversation
          </Button>
          <Button size="sm" variant="outline" onClick={() => loadConversations(selectedAgent)} disabled={sending || loading}>Refresh conversations</Button>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {conversations.length === 0 && (
            <p className="text-xs text-muted-foreground text-center py-4">No conversations yet</p>
          )}
          {conversations.map(c => (
            <button key={c.id} onClick={() => selectConv(c)} disabled={sending || loading}
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
        {selectedAgent === 'deego_master_ai' && (
          <p className="border-b border-border px-4 py-2 text-xs text-muted-foreground">
            Deego is planning-only: no task executor or cross-chat relay is started here. His configured tools may prepare internal drafts and approval items. External actions require separate exact approval and a verified execution path.
          </p>
        )}

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
          {chatError && <p role="alert" className="text-sm text-muted-foreground mb-2">{chatError}</p>}
          {deliveryBlocked && <Button size="sm" variant="outline" className="mb-2" disabled={!deliveryReviewed || loading} onClick={() => {
            senderRef.current.acknowledgeDeliveryReview();
            setDeliveryBlocked(false);
            setChatError('');
          }}>I have checked the conversation</Button>}
          {policyCount > 0 && <p role="status" className="text-xs text-muted-foreground mb-2">{policyCount} saved owner rule records loaded for the submitted message. This is not a task completion receipt.</p>}
          <div className="flex gap-2 items-end">
            <div className="relative flex-1">
              <Textarea
                placeholder={`Message ${agentConfig.label}...`}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
                    e.preventDefault();
                    send();
                  }
                }}
                className="resize-none min-h-[52px] max-h-[200px] pr-11"
                rows={2}
              />
              <div className="absolute bottom-2.5 right-2.5">
                <VoiceButton value={input} onChange={setInput} size="sm" />
              </div>
            </div>
            <Button onClick={send} disabled={sending || loading || deliveryBlocked || !input.trim()} className="gradient-gold-button shrink-0 h-[52px] px-4">
              <Send className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-1.5 text-center">
            Talking to: <span className={agentConfig.color}>{agentConfig.label}</span> · Enter to send · Shift+Enter for new line
          </p>
        </div>
      </div>
    </div>
  );
}