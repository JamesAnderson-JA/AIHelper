import { useState, useRef } from 'react';
import { Upload, X, Check, Loader2, FileText, AlertTriangle } from 'lucide-react';

const STEPS = [
  'Classifying document…',
  'Extracting fields…',
  'Reconciling against case data…',
];

const DOC_PROFILES = {
  'ast.doc': {
    docType: 'ast',
    classification: 'Assured Shorthold Tenancy Agreement',
    fieldsExtracted: 5,
    fields: [
      { label: 'Tenant',         value: 'Sarah Mitchell' },
      { label: 'Monthly rent',   value: '£1,100 / month' },
      { label: 'Tenancy start',  value: '1 March 2026' },
      { label: 'Agreement type', value: 'Assured Shorthold Tenancy' },
      { label: 'Term',           value: '12 months' },
    ],
    discrepancies: [
      {
        severity: 'danger',
        text: 'Confirmed rent £1,100/month is £100 below the stated figure of £1,200. At the correct 5.50% stress rate, ICR = 111.9% — fails the 125% minimum for a Limited Company borrower (§24).',
      },
      {
        severity: 'warning',
        text: 'Agreement is a pre-RRA 2025 Assured Shorthold Tenancy. Under the Renters Rights Act 2025 (in force 1 May 2026) this has automatically transitioned to an Assured Periodic Tenancy. APT compliance must be confirmed before Offer (§43).',
      },
    ],
  },
  'valuation.doc': {
    docType: 'valuation',
    classification: 'RICS Red Book Valuation Report',
    fieldsExtracted: 6,
    fields: [
      { label: 'Market value',      value: '£272,000  (estimated: £285,000)' },
      { label: 'Market rent',       value: '£1,050 / month  (stated: £1,200)' },
      { label: 'EPC rating',        value: 'D  —  below minimum E' },
      { label: 'Valuer',            value: 'John Harris MRICS' },
      { label: 'Valuation date',    value: '15 May 2026' },
      { label: 'Material caveats',  value: 'Deferred maintenance to roof — monitor for deterioration' },
    ],
    discrepancies: [
      {
        severity: 'danger',
        text: 'Revised LTV: £214,200 / £272,000 = 78.8% — up from 75.2% on estimated value. Product maximum is 75%. Breach has widened from 0.2pp to 3.8pp (§22).',
      },
      {
        severity: 'danger',
        text: 'EPC rating D confirmed by valuer. Policy §46 requires a minimum E rating. This is a hard gate — the case cannot proceed to Offer without evidence of improvement.',
      },
      {
        severity: 'danger',
        text: 'Valuer market rent £1,050/month. At 5.50% stress rate, ICR = 106.9% — a serious fail against the 125% Ltd Co minimum. Roof caveat may further impact rental demand (§24).',
      },
    ],
  },
};

const SEVERITY_STYLES = {
  danger:  { bg: '#FCEBEB', border: '#E24B4A', text: '#791F1F', icon: '#E24B4A' },
  warning: { bg: '#FAEEDA', border: '#EF9F27', text: '#854F0B', icon: '#EF9F27' },
};

export default function DocumentUpload({ onClose, onComplete }) {
  const [phase, setPhase] = useState('idle');
  const [stepIndex, setStepIndex] = useState(0);
  const [profile, setProfile] = useState(null);
  const [unknownFile, setUnknownFile] = useState(null);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef();

  function processFile(file) {
    const name = file?.name?.toLowerCase() || '';
    const matched = DOC_PROFILES[name];
    if (!matched) {
      setUnknownFile(file?.name || 'unknown file');
    }
    setProfile(matched || null);
    setPhase('processing');
    setStepIndex(0);
    const advance = (i) => {
      if (i >= STEPS.length) { setPhase('done'); return; }
      setStepIndex(i);
      setTimeout(() => advance(i + 1), 900);
    };
    advance(0);
  }

  function handleInputChange(e) {
    processFile(e.target.files?.[0]);
  }

  function handleDrop(e) {
    e.preventDefault();
    setDragging(false);
    processFile(e.dataTransfer.files?.[0]);
  }

  function handleDone() {
    if (profile) onComplete(profile.docType);
    onClose();
  }

  const discrepancyCount = profile?.discrepancies?.length ?? 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.4)' }}>
      <div className="rounded-xl shadow-xl w-full max-w-md" style={{ background: '#fff' }}>
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: '#E5E7EB' }}>
          <div className="font-medium text-sm" style={{ color: '#1A1A1A' }}>Upload document</div>
          <button onClick={onClose} className="p-1 rounded hover:bg-gray-100" style={{ color: '#6B7280' }}>
            <X size={16} />
          </button>
        </div>

        <div className="p-5">
          {/* Idle — drop zone */}
          {phase === 'idle' && (
            <div
              onDragOver={e => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={handleDrop}
              onClick={() => inputRef.current?.click()}
              className="border-2 border-dashed rounded-xl p-10 flex flex-col items-center gap-3 cursor-pointer transition-colors"
              style={{ borderColor: dragging ? '#1A2B47' : '#D1D5DB', background: dragging ? '#EBF3FB' : '#F9FAFB' }}
            >
              <Upload size={24} color="#6B7280" />
              <div className="text-sm text-center" style={{ color: '#6B7280' }}>
                Drag and drop a document, or <span style={{ color: '#1A2B47' }} className="font-medium">browse</span>
              </div>
              <div className="text-xs" style={{ color: '#9CA3AF' }}>Try: ast.doc · valuation.doc</div>
              <input ref={inputRef} type="file" className="hidden" onChange={handleInputChange} />
            </div>
          )}

          {/* Processing */}
          {phase === 'processing' && (
            <div className="py-6 flex flex-col gap-4">
              {STEPS.map((step, i) => {
                const done   = i < stepIndex;
                const active = i === stepIndex;
                return (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                      style={{ background: done ? '#E1F5EE' : active ? '#EBF3FB' : '#F3F4F6' }}>
                      {done   ? <Check size={11} color="#22A06B" /> :
                       active ? <Loader2 size={11} color="#1A2B47" className="animate-spin" /> : null}
                    </div>
                    <span className="text-sm" style={{ color: done ? '#22A06B' : active ? '#1A1A1A' : '#9CA3AF' }}>
                      {step}
                    </span>
                  </div>
                );
              })}
            </div>
          )}

          {/* Done */}
          {phase === 'done' && (
            <div className="flex flex-col gap-3">
              {/* Classification banner */}
              {profile ? (
                <div className="flex items-center gap-3 p-3 rounded-lg" style={{ background: '#E1F5EE', border: '1px solid #22A06B' }}>
                  <Check size={18} color="#22A06B" className="shrink-0" />
                  <div>
                    <div className="text-sm font-medium" style={{ color: '#1A1A1A' }}>
                      {profile.classification}
                    </div>
                    <div className="text-xs mt-0.5" style={{ color: '#6B7280' }}>
                      {profile.fieldsExtracted} fields extracted · {discrepancyCount} issue{discrepancyCount !== 1 ? 's' : ''} raised
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3 p-3 rounded-lg" style={{ background: '#FAEEDA', border: '1px solid #EF9F27' }}>
                  <FileText size={18} color="#854F0B" className="shrink-0" />
                  <div>
                    <div className="text-sm font-medium" style={{ color: '#854F0B' }}>
                      Document not recognised
                    </div>
                    <div className="text-xs mt-0.5" style={{ color: '#854F0B' }}>
                      "{unknownFile}" — no fields extracted. Try ast.doc or valuation.doc.
                    </div>
                  </div>
                </div>
              )}

              {/* Extracted fields */}
              {profile && (
                <div className="rounded-lg overflow-hidden" style={{ border: '1px solid #E5E7EB' }}>
                  <div className="px-3 py-2 text-xs font-medium" style={{ background: '#F9FAFB', color: '#6B7280', borderBottom: '1px solid #E5E7EB' }}>
                    Extracted fields
                  </div>
                  {profile.fields.map(({ label, value }) => (
                    <div key={label} className="flex justify-between px-3 py-2 text-xs border-b last:border-0" style={{ borderColor: '#F3F4F6' }}>
                      <span style={{ color: '#6B7280' }}>{label}</span>
                      <span className="font-medium text-right ml-4" style={{ color: '#1A1A1A', maxWidth: '55%' }}>{value}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Discrepancies */}
              {profile && profile.discrepancies.map((d, i) => {
                const s = SEVERITY_STYLES[d.severity];
                return (
                  <div key={i} className="flex items-start gap-2 p-3 rounded-lg text-xs"
                    style={{ background: s.bg, border: `1px solid ${s.border}` }}>
                    <AlertTriangle size={13} color={s.icon} className="mt-0.5 shrink-0" />
                    <div style={{ color: s.text }}>{d.text}</div>
                  </div>
                );
              })}

              <button
                onClick={handleDone}
                className="mt-1 w-full py-2 rounded-lg text-sm font-medium text-white"
                style={{ background: '#1A2B47' }}
              >
                {profile ? 'Close and view updated suggestions' : 'Close'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
