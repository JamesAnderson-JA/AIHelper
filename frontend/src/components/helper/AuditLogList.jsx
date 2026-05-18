import { Check, X, MessageSquare, Upload, Clock, Send } from 'lucide-react';

const ACTION_ICON = {
  'Suggestion accepted': { icon: Check, color: '#22A06B' },
  'Suggestion dismissed': { icon: X, color: '#E24B4A' },
  'Suggestion flagged for underwriter': { icon: Clock, color: '#854F0B' },
  'Suggestion amended': { icon: Check, color: '#854F0B' },
  'Suggestion noted': { icon: Check, color: '#6B7280' },
  'Policy question asked': { icon: MessageSquare, color: '#1A2B47' },
  'Case chat question': { icon: MessageSquare, color: '#1A2B47' },
  'Document uploaded': { icon: Upload, color: '#1A2B47' },
  'Chase sent': { icon: Send, color: '#854F0B' },
  'Case assigned': { icon: Check, color: '#22A06B' },
  'Case created': { icon: Check, color: '#22A06B' },
};

function formatTime(ts) {
  const d = new Date(ts);
  return d.toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
}

export default function AuditLogList({ entries, compact }) {
  if (!entries.length) {
    return <div className="text-xs text-center py-8" style={{ color: '#6B7280' }}>No audit entries yet.</div>;
  }
  return (
    <div className="flex flex-col gap-0">
      {entries.map((entry, i) => {
        const meta = ACTION_ICON[entry.action] || { icon: Check, color: '#6B7280' };
        const Icon = meta.icon;
        return (
          <div key={entry.id || i} className="flex items-start gap-2.5 py-2.5 border-b" style={{ borderColor: '#F3F4F6' }}>
            <div className="mt-0.5 shrink-0 w-5 h-5 flex items-center justify-center rounded-full" style={{ background: '#F3F4F6' }}>
              <Icon size={10} color={meta.color} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <div className="text-xs font-medium" style={{ color: '#1A1A1A' }}>{entry.action}</div>
                <div className="text-xs shrink-0" style={{ color: '#6B7280' }}>{formatTime(entry.timestamp)}</div>
              </div>
              <div className="text-xs" style={{ color: '#6B7280' }}>{entry.target}</div>
              {!compact && <div className="text-xs mt-0.5" style={{ color: '#9CA3AF' }}>{entry.detail}</div>}
              {!compact && entry.user && (
                <div className="text-xs mt-0.5" style={{ color: '#9CA3AF' }}>by {entry.user}</div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
