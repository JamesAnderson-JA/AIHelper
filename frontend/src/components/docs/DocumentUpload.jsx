import { useState, useRef } from 'react';
import { Upload, X, Check, Loader2, FileText } from 'lucide-react';

const STEPS = [
  'Classifying document…',
  'Extracting fields…',
  'Reconciling against case data…',
];

export default function DocumentUpload({ onClose, onComplete }) {
  const [phase, setPhase] = useState('idle'); // idle | processing | done
  const [stepIndex, setStepIndex] = useState(0);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef();

  function handleFile() {
    setPhase('processing');
    setStepIndex(0);
    const advance = (i) => {
      if (i >= STEPS.length) {
        setPhase('done');
        return;
      }
      setStepIndex(i);
      setTimeout(() => advance(i + 1), 1000);
    };
    advance(0);
  }

  function handleDrop(e) {
    e.preventDefault();
    setDragging(false);
    handleFile();
  }

  function handleDone() {
    onComplete();
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.4)' }}>
      <div className="rounded-xl shadow-xl w-full max-w-md" style={{ background: '#fff' }}>
        <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: '#E5E7EB' }}>
          <div className="font-medium text-sm" style={{ color: '#1A1A1A' }}>Upload document</div>
          <button onClick={onClose} className="p-1 rounded hover:bg-gray-100" style={{ color: '#6B7280' }}>
            <X size={16} />
          </button>
        </div>

        <div className="p-5">
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
              <div className="text-xs" style={{ color: '#9CA3AF' }}>Any file type accepted</div>
              <input ref={inputRef} type="file" className="hidden" onChange={handleFile} />
            </div>
          )}

          {phase === 'processing' && (
            <div className="py-6 flex flex-col gap-4">
              {STEPS.map((step, i) => {
                const done = i < stepIndex;
                const active = i === stepIndex;
                return (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                      style={{ background: done ? '#E1F5EE' : active ? '#EBF3FB' : '#F3F4F6' }}>
                      {done ? <Check size={11} color="#22A06B" /> : active ? <Loader2 size={11} color="#1A2B47" className="animate-spin" /> : null}
                    </div>
                    <span className="text-sm" style={{ color: done ? '#22A06B' : active ? '#1A1A1A' : '#9CA3AF' }}>{step}</span>
                  </div>
                );
              })}
            </div>
          )}

          {phase === 'done' && (
            <div className="py-4">
              <div className="flex items-center gap-3 mb-4 p-3 rounded-lg" style={{ background: '#E1F5EE', border: '1px solid #22A06B' }}>
                <Check size={18} color="#22A06B" />
                <div>
                  <div className="text-sm font-medium" style={{ color: '#1A1A1A' }}>Document classified as: Assured Shorthold Tenancy</div>
                  <div className="text-xs mt-0.5" style={{ color: '#6B7280' }}>3 fields extracted · 1 discrepancy raised</div>
                </div>
              </div>
              <div className="flex items-start gap-2 p-3 rounded-lg text-xs" style={{ background: '#FAEEDA', border: '1px solid #EF9F27' }}>
                <FileText size={13} color="#854F0B" className="mt-0.5 shrink-0" />
                <div style={{ color: '#854F0B' }}>
                  <strong>New suggestion:</strong> Stated rent £1,200/month confirmed by AST — but conflicts with existing comparables flag.
                  The rent discrepancy card will be updated.
                </div>
              </div>
              <button onClick={handleDone} className="mt-4 w-full py-2 rounded-lg text-sm font-medium text-white" style={{ background: '#1A2B47' }}>
                Close and view suggestions
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
