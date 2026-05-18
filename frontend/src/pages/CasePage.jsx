import { useState, useEffect } from 'react';
import { Upload } from 'lucide-react';
import TopBar from '../components/layout/TopBar';
import CaseHeader from '../components/case/CaseHeader';
import TaskBanner from '../components/case/TaskBanner';
import NumberedTabs from '../components/case/NumberedTabs';
import HelperPanel from '../components/helper/HelperPanel';
import DocumentUpload from '../components/docs/DocumentUpload';
import caseData from '../data/case.json';
import initialSuggestions from '../data/suggestions.json';
import initialAudit from '../data/audit.json';

const AUDIT_KEY = 'mtf_audit_log';
const SUGG_KEY = 'mtf_suggestions';

function loadFromStorage(key, fallback) {
  try {
    const v = localStorage.getItem(key);
    return v ? JSON.parse(v) : fallback;
  } catch {
    return fallback;
  }
}

function saveToStorage(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
}

export default function CasePage() {
  const [suggestions, setSuggestions] = useState(() => loadFromStorage(SUGG_KEY, initialSuggestions));
  const [auditLog, setAuditLog] = useState(() => loadFromStorage(AUDIT_KEY, initialAudit));
  const [uploadOpen, setUploadOpen] = useState(false);

  useEffect(() => { saveToStorage(SUGG_KEY, suggestions); }, [suggestions]);
  useEffect(() => { saveToStorage(AUDIT_KEY, auditLog); }, [auditLog]);

  function handleAction(suggId, action) {
    setSuggestions(prev => prev.map(s => {
      if (s.id !== suggId) return s;
      const actionLower = action.toLowerCase();
      let newStatus = s.status;
      if (actionLower.includes('dismiss') || actionLower.includes('mark n/a') || actionLower.includes('note discrepancy')) {
        newStatus = 'rejected';
      } else if (['run check', 'trigger screening', 'run search', 'log exception', 'note for credit paper'].some(a => actionLower.includes(a))) {
        newStatus = 'accepted';
      }
      return { ...s, status: newStatus };
    }));

    const entry = {
      id: `aud_${Date.now()}`,
      timestamp: new Date().toISOString(),
      user: 'James Anderson',
      action: `Suggestion actioned: ${action}`,
      target: suggestions.find(s => s.id === suggId)?.title || suggId,
      caseId: caseData.caseId,
      detail: `Action "${action}" taken on suggestion.`,
    };
    setAuditLog(prev => [entry, ...prev]);
  }

  function handleDocumentUpload() {
    setSuggestions(prev => prev.map(s => {
      if (s.id === 'sug_005') return { ...s, updatedRecently: true };
      return s;
    }));
    const entry = {
      id: `aud_${Date.now()}`,
      timestamp: new Date().toISOString(),
      user: 'James Anderson',
      action: 'Document uploaded',
      target: 'Assured Shorthold Tenancy — 27 Belmont Road',
      caseId: caseData.caseId,
      detail: '3 fields extracted. Rent £1,200/month confirmed by AST. 1 discrepancy updated.',
    };
    setAuditLog(prev => [entry, ...prev]);
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <TopBar breadcrumbs={['Home', 'Case manager', 'Create DIP']} />
      <CaseHeader caseData={caseData} />
      <TaskBanner caseData={caseData} />
      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 overflow-y-auto flex flex-col">
          <NumberedTabs stagesComplete={caseData.stagesComplete} />
          <div className="flex-1 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm font-medium" style={{ color: '#1A1A1A' }}>Application type</div>
              <button
                onClick={() => setUploadOpen(true)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-white"
                style={{ background: '#1A2B47' }}
              >
                <Upload size={14} />
                Upload document
              </button>
            </div>
            <div className="rounded-lg p-4 mb-4" style={{ background: '#fff', border: '1px solid #E5E7EB' }}>
              <div className="flex items-center justify-between">
                <div className="text-sm" style={{ color: '#6B7280' }}>Application type</div>
                <div className="text-sm font-medium px-3 py-1 rounded border" style={{ border: '1px solid #E5E7EB', color: '#1A1A1A' }}>
                  Buy to Let ▾
                </div>
              </div>
            </div>
            <div className="rounded-lg p-4" style={{ background: '#fff', border: '1px solid #E5E7EB' }}>
              <div className="text-sm font-medium mb-3" style={{ color: '#1A1A1A' }}>Pre-check summary</div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                {[
                  ['Applicant', caseData.applicant.name],
                  ['Applicant type', caseData.applicant.type],
                  ['Companies House', caseData.applicant.companiesHouseNumber],
                  ['Security', caseData.security.address],
                  ['Loan amount', `£${caseData.loan.amount.toLocaleString()}`],
                  ['LTV', `${caseData.loan.ltv}%`],
                  ['Product', caseData.loan.product],
                  ['Term', `${caseData.loan.term} months`],
                ].map(([label, value]) => (
                  <div key={label}>
                    <div className="text-xs" style={{ color: '#6B7280' }}>{label}</div>
                    <div className="font-medium mt-0.5" style={{ color: '#1A1A1A' }}>{value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <HelperPanel
          suggestions={suggestions}
          onAction={handleAction}
          auditLog={auditLog}
          caseData={caseData}
        />
      </div>
      {uploadOpen && (
        <DocumentUpload
          onClose={() => setUploadOpen(false)}
          onComplete={handleDocumentUpload}
        />
      )}
    </div>
  );
}
