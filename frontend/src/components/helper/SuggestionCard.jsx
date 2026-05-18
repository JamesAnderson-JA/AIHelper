import { useState } from 'react';
import { AlertTriangle, CircleX, Info, Check, X, ChevronDown, ChevronUp } from 'lucide-react';

const SEVERITY = {
  danger: { icon: CircleX, color: '#E24B4A', bg: '#FCEBEB', border: '#E24B4A' },
  warning: { icon: AlertTriangle, color: '#854F0B', bg: '#FAEEDA', border: '#EF9F27' },
  info: { icon: Info, color: '#1A2B47', bg: '#EBF3FB', border: '#BDD6F0' },
};

const CONFIDENCE = {
  high: { label: 'High priority', bg: '#FCEBEB', color: '#791F1F' },
  medium: { label: 'Medium priority', bg: '#FAEEDA', color: '#854F0B' },
  low: { label: 'Low priority', bg: '#F3F4F6', color: '#6B7280' },
};

export default function SuggestionCard({ suggestion, onAction }) {
  const [expanded, setExpanded] = useState(true);
  const [confirming, setConfirming] = useState(null);
  const { severity, confidence, title, description, evidence, actions, status, updatedRecently } = suggestion;

  const sev = SEVERITY[severity] || SEVERITY.info;
  const conf = CONFIDENCE[confidence] || CONFIDENCE.medium;
  const Icon = sev.icon;

  if (status === 'accepted') {
    return (
      <div className="rounded-lg px-3 py-2 text-sm opacity-60" style={{ border: '1px solid #E5E7EB', background: '#F9FAFB' }}>
        <div className="flex items-center gap-2" style={{ color: '#6B7280' }}>
          <Check size={13} color="#22A06B" />
          <span className="line-through">{title}</span>
          <span className="ml-auto text-xs">Accepted</span>
        </div>
      </div>
    );
  }

  if (status === 'rejected') {
    return (
      <div className="rounded-lg px-3 py-2 text-sm opacity-60" style={{ border: '1px solid #E5E7EB', background: '#F9FAFB' }}>
        <div className="flex items-center gap-2" style={{ color: '#6B7280' }}>
          <X size={13} />
          <span className="line-through">{title}</span>
          <span className="ml-auto text-xs">Dismissed</span>
        </div>
      </div>
    );
  }

  return (
    <div
      className="rounded-lg transition-all"
      style={{ border: `1px solid ${sev.border}`, background: '#fff' }}
    >
      <div className="px-3 pt-3 pb-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-start gap-2 flex-1 min-w-0">
            <Icon size={14} color={sev.color} className="mt-0.5 shrink-0" />
            <div className="min-w-0">
              <div className="text-sm font-medium leading-snug" style={{ color: '#1A1A1A' }}>{title}</div>
              {updatedRecently && (
                <span className="text-xs px-1.5 py-0.5 rounded font-medium" style={{ background: '#E1F5EE', color: '#22A06B' }}>
                  Updated 2s ago
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <span className="text-xs px-1.5 py-0.5 rounded" style={{ background: conf.bg, color: conf.color }}>
              {conf.label}
            </span>
            <button onClick={() => setExpanded(e => !e)} className="p-0.5 rounded hover:bg-gray-100" style={{ color: '#6B7280' }}>
              {expanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
            </button>
          </div>
        </div>

        {expanded && (
          <>
            <p className="text-xs mt-2 leading-relaxed" style={{ color: '#6B7280' }}>{description}</p>

            {evidence?.rows?.length > 0 && (
              <div className="mt-2 rounded p-2 text-xs" style={{ background: sev.bg, border: `1px solid ${sev.border}` }}>
                {evidence.rows.map((row, i) => (
                  <div key={i} className="flex items-start gap-2 py-0.5">
                    <span className="shrink-0 font-medium" style={{ color: '#6B7280', minWidth: 120 }}>{row.label}:</span>
                    <span style={{ color: '#1A1A1A' }}>{row.value}</span>
                  </div>
                ))}
              </div>
            )}

            {confirming ? (
              <div className="mt-2 p-2 rounded text-xs" style={{ background: '#F3F4F6' }}>
                <div className="font-medium mb-1">Confirm: {confirming}</div>
                <div className="flex gap-2">
                  <button
                    onClick={() => { onAction(suggestion.id, confirming); setConfirming(null); }}
                    className="px-2 py-1 rounded text-white text-xs font-medium"
                    style={{ background: '#1A2B47' }}
                  >
                    Confirm
                  </button>
                  <button
                    onClick={() => setConfirming(null)}
                    className="px-2 py-1 rounded text-xs border"
                    style={{ border: '1px solid #E5E7EB', color: '#6B7280' }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {actions.map(action => (
                  <button
                    key={action}
                    onClick={() => setConfirming(action)}
                    className="text-xs px-2 py-1 rounded border font-medium transition-colors hover:bg-gray-50"
                    style={{ border: '1px solid #E5E7EB', color: '#1A2B47' }}
                  >
                    {action}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
