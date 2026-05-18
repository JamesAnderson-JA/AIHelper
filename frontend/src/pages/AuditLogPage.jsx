import { useState, useEffect } from 'react';
import TopBar from '../components/layout/TopBar';
import AuditLogList from '../components/helper/AuditLogList';
import initialAudit from '../data/audit.json';

const AUDIT_KEY = 'mtf_audit_log';

export default function AuditLogPage() {
  const [auditLog] = useState(() => {
    try {
      const v = localStorage.getItem(AUDIT_KEY);
      return v ? JSON.parse(v) : initialAudit;
    } catch {
      return initialAudit;
    }
  });

  return (
    <div className="flex-1 overflow-y-auto p-6">
      <TopBar breadcrumbs={['Home', 'Audit log']} />
      <div className="mt-4 mb-5">
        <h1 className="text-lg font-medium" style={{ color: '#1A1A1A' }}>Audit log</h1>
        <p className="text-sm mt-0.5" style={{ color: '#6B7280' }}>All helper actions, document events and policy queries</p>
      </div>

      <div className="rounded-xl overflow-hidden max-w-3xl" style={{ background: '#fff', border: '1px solid #E5E7EB' }}>
        <div className="px-5 py-3 border-b text-xs font-medium grid grid-cols-12 gap-4" style={{ borderColor: '#E5E7EB', color: '#6B7280' }}>
          <div className="col-span-2">Time</div>
          <div className="col-span-2">User</div>
          <div className="col-span-3">Action</div>
          <div className="col-span-3">Target</div>
          <div className="col-span-2">Case</div>
        </div>
        {auditLog.map((entry, i) => {
          const d = new Date(entry.timestamp);
          const ts = d.toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
          return (
            <div key={entry.id || i} className="px-5 py-3 border-b grid grid-cols-12 gap-4 items-start hover:bg-gray-50 text-sm" style={{ borderColor: '#F3F4F6' }}>
              <div className="col-span-2 text-xs" style={{ color: '#9CA3AF' }}>{ts}</div>
              <div className="col-span-2 text-xs font-medium" style={{ color: '#1A1A1A' }}>{entry.user}</div>
              <div className="col-span-3 text-xs" style={{ color: '#1A2B47' }}>{entry.action}</div>
              <div className="col-span-3 text-xs" style={{ color: '#6B7280' }}>{entry.target}</div>
              <div className="col-span-2">
                {entry.caseId ? (
                  <span className="text-xs font-medium" style={{ color: '#1A2B47' }}>{entry.caseId}</span>
                ) : (
                  <span className="text-xs" style={{ color: '#9CA3AF' }}>—</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
