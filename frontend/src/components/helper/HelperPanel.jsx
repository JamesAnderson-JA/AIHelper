import { useState, useRef, useEffect } from 'react';
import { Sparkles, ListChecks, Flag, AlertTriangle, Send, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import SuggestionCard from './SuggestionCard';
import CaseHealth from '../health/CaseHealth';
import AuditLogList from '../helper/AuditLogList';
import { caseChat } from '../../api/claude';
import healthData from '../../data/health.json';

const SECTION_META = {
  outstanding: { label: 'Outstanding items', icon: ListChecks, color: '#854F0B' },
  discrepancy: { label: 'Discrepancies & suggestions', icon: AlertTriangle, color: '#E24B4A' },
  policy: { label: 'Policy flags', icon: Flag, color: '#1A2B47' },
};

export default function HelperPanel({ suggestions, onAction, auditLog, caseData }) {
  const [tab, setTab] = useState('suggestions');
  const [collapsed, setCollapsed] = useState({});
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const sections = ['outstanding', 'discrepancy', 'policy'];
  const bySection = sec => suggestions.filter(s => s.section === sec);
  const openCount = sec => bySection(sec).filter(s => s.status === 'open').length;

  const outstanding = suggestions.filter(s => s.section === 'outstanding' && s.status === 'open').length;
  const discrepancies = suggestions.filter(s => s.section === 'discrepancy' && s.status === 'open').length;
  const policy = suggestions.filter(s => s.section === 'policy' && s.status === 'open').length;

  async function sendChat(e) {
    e.preventDefault();
    if (!chatInput.trim() || chatLoading) return;
    const userMsg = { role: 'user', content: chatInput.trim() };
    const newMessages = [...chatMessages, userMsg];
    setChatMessages(newMessages);
    setChatInput('');
    setChatLoading(true);
    try {
      const apiMessages = newMessages.map(m => ({ role: m.role, content: m.content }));
      const resp = await caseChat(apiMessages, caseData);
      const text = resp.content?.[0]?.text || 'No response.';
      setChatMessages(prev => [...prev, { role: 'assistant', content: text }]);
    } catch {
      setChatMessages(prev => [...prev, { role: 'assistant', content: 'Error connecting to backend. Is the server running?' }]);
    } finally {
      setChatLoading(false);
    }
  }

  return (
    <div className="flex flex-col h-full" style={{ width: 400, minWidth: 400, background: '#fff', borderLeft: '1px solid #E5E7EB' }}>
      {/* Header */}
      <div className="px-4 py-3 flex items-center justify-between" style={{ background: '#1A2B47' }}>
        <div className="flex items-center gap-2">
          <Sparkles size={15} color="white" />
          <div>
            <div className="text-sm font-medium text-white">Case helper</div>
            <div className="text-xs" style={{ color: 'rgba(255,255,255,0.6)' }}>{caseData.caseId} · {caseData.applicant.name}</div>
          </div>
        </div>
        <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: '#FAEEDA', color: '#854F0B' }}>
          {caseData.stage}
        </span>
      </div>

      {/* Tab bar */}
      <div className="flex border-b" style={{ borderColor: '#E5E7EB' }}>
        {['suggestions', 'health', 'audit'].map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className="flex-1 py-2 text-xs font-medium transition-colors capitalize"
            style={{
              color: tab === t ? '#1A2B47' : '#6B7280',
              borderBottom: tab === t ? '2px solid #1A2B47' : '2px solid transparent',
            }}
          >
            {t === 'audit' ? 'Audit log' : t === 'health' ? 'Case health' : 'Suggestions'}
          </button>
        ))}
      </div>

      {tab === 'suggestions' && (
        <div className="flex-1 overflow-y-auto flex flex-col">
          <div className="flex-1 overflow-y-auto">
            {/* Referral callout */}
            <div className="mx-3 mt-3 px-3 py-2 rounded-lg text-xs" style={{ background: '#FAEEDA', border: '1px solid #EF9F27' }}>
              <div className="font-medium mb-0.5" style={{ color: '#854F0B' }}>Key underwriting issues</div>
              <div style={{ color: '#854F0B' }}>
                LTV of 75.2% marginally exceeds the 75% product cap and requires a Policy Limit exception.
                Director DOB mismatch between FMA and Companies House must be resolved before Offer.
                ICR is fragile — stressed at the correct 5.50% rate, case fails 125% minimum even at stated rent.
              </div>
            </div>

            {/* Summary tiles */}
            <div className="grid grid-cols-3 gap-2 mx-3 mt-3">
              {[
                { label: 'Outstanding', count: outstanding, color: '#854F0B', bg: '#FAEEDA' },
                { label: 'Discrepancies', count: discrepancies, color: '#791F1F', bg: '#FCEBEB' },
                { label: 'Policy flags', count: policy, color: '#1A2B47', bg: '#EBF3FB' },
              ].map(({ label, count, color, bg }) => (
                <div key={label} className="text-center py-2 rounded-lg" style={{ background: bg }}>
                  <div className="text-lg font-medium" style={{ color }}>{count}</div>
                  <div className="text-xs" style={{ color, opacity: 0.8 }}>{label}</div>
                </div>
              ))}
            </div>

            {/* Sections */}
            {sections.map(sec => {
              const meta = SECTION_META[sec];
              const Icon = meta.icon;
              const items = bySection(sec);
              const open = collapsed[sec];
              return (
                <div key={sec} className="mt-3">
                  <button
                    onClick={() => setCollapsed(c => ({ ...c, [sec]: !c[sec] }))}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium"
                    style={{ color: '#1A1A1A' }}
                  >
                    <Icon size={13} color={meta.color} />
                    <span className="flex-1 text-left">{meta.label}</span>
                    <span className="px-1.5 py-0.5 rounded-full text-xs" style={{ background: '#F3F4F6', color: '#6B7280' }}>
                      {openCount(sec)} open
                    </span>
                  </button>
                  {!open && (
                    <div className="px-3 pb-3 flex flex-col gap-2">
                      {items.map(s => (
                        <SuggestionCard key={s.id} suggestion={s} onAction={onAction} />
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
            <div ref={chatEndRef} />
          </div>

          {/* Chat thread */}
          {chatMessages.length > 0 && (
            <div className="border-t mx-3 mt-2 pt-2 pb-1 flex flex-col gap-2 max-h-64 overflow-y-auto">
              {chatMessages.map((msg, i) => (
                <div key={i} className={`text-xs rounded-lg px-3 py-2 ${msg.role === 'user' ? 'self-end' : 'self-start'}`}
                  style={{
                    maxWidth: '90%',
                    background: msg.role === 'user' ? '#1A2B47' : '#F3F4F6',
                    color: msg.role === 'user' ? '#fff' : '#1A1A1A',
                  }}>
                  {msg.role === 'assistant' ? (
                    <div className="prose prose-sm"><ReactMarkdown>{msg.content}</ReactMarkdown></div>
                  ) : msg.content}
                </div>
              ))}
              {chatLoading && (
                <div className="self-start text-xs flex items-center gap-1.5 px-3 py-2 rounded-lg" style={{ background: '#F3F4F6', color: '#6B7280' }}>
                  <Loader2 size={11} className="animate-spin" /> Thinking…
                </div>
              )}
            </div>
          )}

          {/* Chat input */}
          <form onSubmit={sendChat} className="border-t p-3 flex gap-2" style={{ borderColor: '#E5E7EB' }}>
            <input
              value={chatInput}
              onChange={e => setChatInput(e.target.value)}
              placeholder="Ask about this case…"
              className="flex-1 text-xs px-3 py-2 rounded-lg border outline-none"
              style={{ border: '1px solid #E5E7EB', color: '#1A1A1A' }}
            />
            <button
              type="submit"
              disabled={chatLoading || !chatInput.trim()}
              className="px-3 py-2 rounded-lg text-white disabled:opacity-50"
              style={{ background: '#1A2B47' }}
            >
              <Send size={13} />
            </button>
          </form>
        </div>
      )}

      {tab === 'health' && (
        <div className="flex-1 overflow-y-auto p-3">
          <CaseHealth health={healthData} caseId={caseData.caseId} />
        </div>
      )}

      {tab === 'audit' && (
        <div className="flex-1 overflow-y-auto p-3">
          <AuditLogList entries={auditLog.filter(e => e.caseId === caseData.caseId)} compact />
        </div>
      )}
    </div>
  );
}
