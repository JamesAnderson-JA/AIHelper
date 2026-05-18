import { useState, useRef, useEffect } from 'react';
import { Send, Loader2, MessageSquare } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { policyChat } from '../api/claude';

const SEED = [
  {
    role: 'user',
    content: "What's the max LTV on a BTL for a foreign-national director without ILR?",
  },
  {
    role: 'assistant',
    content: "Per **§1.1**, foreign nationals without indefinite leave to remain are considered case-by-case with a maximum LTV of **65%**. This applies to the SPV structure where the director is a foreign national without ILR. The case would be referred to the Head of Underwriting for sign-off (§6). Evidence of visa status and right to remain would be required.",
  },
  {
    role: 'user',
    content: "Do we accept SA302s from a sole trader with only 12 months trading?",
  },
  {
    role: 'assistant',
    content: "The MT Finance BTL policy (§5) references the FMA and bank statements but does not specify a minimum trading period for sole traders in the context of BTL SPV cases — the policy is structured around the SPV entity, not personal trading income. However, the policy does not explicitly cover SA302 income assessment for SPV directors. For personal-name BTL, this would typically fall under income verification requirements. If this is a director income question, I'd recommend raising it with underwriting as the policy corpus doesn't cover this scenario directly.",
  },
];

export default function PolicyAssistant() {
  const [messages, setMessages] = useState(SEED);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const endRef = useRef();

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  async function send(e) {
    e.preventDefault();
    if (!input.trim() || loading) return;
    const userMsg = { role: 'user', content: input.trim() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setLoading(true);
    try {
      const apiMessages = newMessages.map(m => ({ role: m.role, content: m.content }));
      const resp = await policyChat(apiMessages);
      const text = resp.content?.[0]?.text || 'No response.';
      setMessages(prev => [...prev, { role: 'assistant', content: text }]);
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Error connecting to backend. Is the server running on :3001?' }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col h-screen">
      <div className="px-6 py-4 flex items-center gap-3" style={{ background: '#1A2B47' }}>
        <MessageSquare size={18} color="white" />
        <div>
          <div className="text-sm font-medium text-white">Policy assistant</div>
          <div className="text-xs" style={{ color: 'rgba(255,255,255,0.6)' }}>MT Finance lending policy — ask anything</div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-4 max-w-3xl w-full mx-auto">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className="rounded-2xl px-4 py-3 text-sm max-w-xl"
              style={{
                background: msg.role === 'user' ? '#1A2B47' : '#fff',
                color: msg.role === 'user' ? '#fff' : '#1A1A1A',
                border: msg.role === 'assistant' ? '1px solid #E5E7EB' : undefined,
                borderRadius: msg.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
              }}
            >
              {msg.role === 'assistant' ? (
                <div className="prose prose-sm"><ReactMarkdown>{msg.content}</ReactMarkdown></div>
              ) : msg.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="rounded-2xl px-4 py-3 text-sm flex items-center gap-2" style={{ background: '#fff', border: '1px solid #E5E7EB', color: '#6B7280', borderRadius: '18px 18px 18px 4px' }}>
              <Loader2 size={13} className="animate-spin" /> Thinking…
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      <div className="border-t px-6 py-4 max-w-3xl w-full mx-auto" style={{ borderColor: '#E5E7EB' }}>
        <form onSubmit={send} className="flex gap-3">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Ask a policy question — e.g. What documents do I need for a commercial second charge?"
            className="flex-1 px-4 py-2.5 rounded-xl border text-sm outline-none"
            style={{ border: '1px solid #E5E7EB' }}
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="px-4 py-2.5 rounded-xl text-white font-medium disabled:opacity-50"
            style={{ background: '#1A2B47' }}
          >
            <Send size={15} />
          </button>
        </form>
      </div>
    </div>
  );
}
