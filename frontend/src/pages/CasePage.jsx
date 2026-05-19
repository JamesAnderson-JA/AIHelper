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
      if (actionLower === 'reopen') {
        newStatus = 'open';
      } else if (actionLower.includes('dismiss') || actionLower.includes('mark n/a') || actionLower.includes('note discrepancy')) {
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

  function handleReset() {
    localStorage.removeItem(SUGG_KEY);
    localStorage.removeItem(AUDIT_KEY);
    setSuggestions(initialSuggestions);
    setAuditLog(initialAudit);
  }

  function handleDocumentUpload(docType) {
    if (docType === 'ast') {
      const newSuggestions = [
        {
          id: 'sug_ast_001',
          section: 'discrepancy',
          severity: 'danger',
          confidence: 'high',
          title: 'AST confirms rent £1,100/month — ICR fails at 111.9%',
          description: 'The uploaded AST confirms a monthly rent of £1,100 — £100 below the stated figure of £1,200. At the correct minimum stressed interest rate of 5.50% (§24, <5-year fixed, all other borrowers), the stressed ICR = (£1,100 × 12) / (£214,200 × 5.5%) = £13,200 / £11,781 = 111.9%. This is a Policy Limit breach — the 125% minimum for a Limited Company borrower has not been met. Credit Committee approval required before Offer.',
          sourceStage: 'Document upload — ast.doc',
          evidence: {
            rows: [
              { label: 'Confirmed rent (AST)',    value: '£1,100 / month' },
              { label: 'Stated rent (FMA)',        value: '£1,200 / month' },
              { label: 'Shortfall',               value: '£100 / month' },
              { label: 'Stressed interest (5.5%)', value: '£11,781 / year' },
              { label: 'ICR at confirmed rent',   value: '111.9%' },
              { label: 'Policy minimum (Ltd Co)', value: '125%  (§24)' },
            ],
          },
          actions: ['Revise income model', 'Flag for Credit Committee', 'Request higher rent evidence'],
          status: 'open',
        },
        {
          id: 'sug_ast_002',
          section: 'outstanding',
          severity: 'warning',
          confidence: 'high',
          title: 'AST predates RRA 2025 — APT transition must be confirmed',
          description: 'The uploaded agreement is an Assured Shorthold Tenancy dated before 1 May 2026. Under the Renters Rights Act 2025 (in force 1 May 2026), all ASTs automatically transitioned to Assured Periodic Tenancies. The tenancy terms and landlord obligations under the APT framework must be confirmed by solicitors before Offer. Standard legacy AST wording is no longer sufficient (§43, updated v13).',
          sourceStage: 'Document upload — ast.doc',
          evidence: {
            rows: [
              { label: 'Agreement type',       value: 'Assured Shorthold Tenancy' },
              { label: 'Tenancy start',         value: '1 March 2026' },
              { label: 'RRA 2025 in force',     value: '1 May 2026' },
              { label: 'Required action',       value: 'APT compliance confirmation from solicitors' },
              { label: 'Policy reference',      value: '§43 (updated v13, April 2026)' },
            ],
          },
          actions: ['Request APT confirmation', 'Raise with solicitors', 'Update case notes'],
          status: 'open',
        },
      ];
      setSuggestions(prev => [...newSuggestions, ...prev]);
      setAuditLog(prev => [{
        id: `aud_${Date.now()}`,
        timestamp: new Date().toISOString(),
        user: 'James Anderson',
        action: 'Document uploaded',
        target: 'Assured Shorthold Tenancy — 27 Belmont Road (ast.doc)',
        caseId: caseData.caseId,
        detail: '5 fields extracted. Confirmed rent £1,100/month (below stated £1,200). 2 new suggestions raised: ICR fail at confirmed rent; RRA 2025 APT compliance required.',
      }, ...prev]);
    }

    if (docType === 'valuation') {
      const newSuggestions = [
        {
          id: 'sug_val_001',
          section: 'policy',
          severity: 'danger',
          confidence: 'high',
          title: 'Confirmed LTV 78.8% — breach widens materially on RICS value',
          description: 'The RICS valuation confirms market value of £272,000, against the estimated £285,000 used at DIP. Revised LTV = £214,200 / £272,000 = 78.8% — a 3.8 percentage point breach of the 75% product maximum, compared to the 0.2pp breach flagged at DIP. Per §21, LTV is calculated against the lower of purchase price or valuation. This is a Policy Limit *(L)* requiring Credit Committee approval.',
          sourceStage: 'Document upload — valuation.doc',
          evidence: {
            rows: [
              { label: 'RICS market value',    value: '£272,000' },
              { label: 'Estimated value (DIP)', value: '£285,000' },
              { label: 'Loan amount',           value: '£214,200' },
              { label: 'Revised LTV',           value: '78.8%' },
              { label: 'Product maximum LTV',   value: '75%' },
              { label: 'Breach',                value: '3.8pp  (was 0.2pp at DIP)' },
            ],
          },
          actions: ['Log exception', 'Refer to Credit Committee', 'Consider loan reduction'],
          status: 'open',
        },
        {
          id: 'sug_val_002',
          section: 'outstanding',
          severity: 'danger',
          confidence: 'high',
          title: 'EPC rating D confirmed — hard gate, case cannot proceed to Offer',
          description: 'The valuation report confirms the property holds an EPC rating of D. Policy §46 requires all security properties to have a minimum EPC rating of E *(L)*. This is an absolute hard gate — the case cannot be offered until the applicant provides evidence of improvements bringing the rating to at least E, or a valid exemption. The case should be paused pending EPC remediation.',
          sourceStage: 'Document upload — valuation.doc',
          evidence: {
            rows: [
              { label: 'EPC rating (confirmed)', value: 'D' },
              { label: 'Policy minimum',         value: 'E  (§46)' },
              { label: 'Status',                 value: 'Hard gate — cannot proceed to Offer' },
              { label: 'Required action',        value: 'Evidence of EPC improvement to E or above' },
            ],
          },
          actions: ['Pause case', 'Request EPC improvement plan', 'Refer to Director'],
          status: 'open',
        },
        {
          id: 'sug_val_003',
          section: 'discrepancy',
          severity: 'danger',
          confidence: 'high',
          title: 'Valuer rent £1,050/month — ICR collapses to 106.9%',
          description: 'The valuer\'s independent market rent assessment is £1,050/month — £150 below the stated figure and at the lower end of comparables. At the correct 5.50% stressed interest rate (§24), ICR = (£1,050 × 12) / (£214,200 × 5.5%) = £12,600 / £11,781 = 106.9%. This is a serious Policy Limit breach against the 125% Ltd Co minimum. The valuer also notes deferred maintenance to the roof, which may further impact rental demand and saleability.',
          sourceStage: 'Document upload — valuation.doc',
          evidence: {
            rows: [
              { label: 'Valuer market rent',      value: '£1,050 / month' },
              { label: 'Stated rent (FMA)',        value: '£1,200 / month' },
              { label: 'Shortfall vs stated',      value: '£150 / month' },
              { label: 'Stressed interest (5.5%)', value: '£11,781 / year' },
              { label: 'ICR at valuer rent',       value: '106.9%' },
              { label: 'Policy minimum (Ltd Co)',  value: '125%  (§24)' },
              { label: 'Valuer caveat',            value: 'Deferred maintenance to roof — monitor for deterioration' },
            ],
          },
          actions: ['Revise income model', 'Flag for Credit Committee', 'Consider declining'],
          status: 'open',
        },
      ];
      setSuggestions(prev => [...newSuggestions, ...prev]);
      setAuditLog(prev => [{
        id: `aud_${Date.now()}`,
        timestamp: new Date().toISOString(),
        user: 'James Anderson',
        action: 'Document uploaded',
        target: 'RICS Valuation Report — 27 Belmont Road (valuation.doc)',
        caseId: caseData.caseId,
        detail: '6 fields extracted. Market value £272,000 (revised LTV 78.8%). EPC D — hard gate. Valuer rent £1,050/month (ICR 106.9%). 3 new danger suggestions raised.',
      }, ...prev]);
    }
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
          onReset={handleReset}
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
