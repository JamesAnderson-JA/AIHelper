import { MapPin, Lock, ChevronDown } from 'lucide-react';

export default function CaseHeader({ caseData }) {
  const { caseId, stage, lockedBy, applicant, broker, security } = caseData;
  return (
    <div className="px-6 py-4" style={{ background: '#fff', borderBottom: '1px solid #E5E7EB' }}>
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-medium" style={{ color: '#6B7280' }}>{caseId}</span>
            <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: '#FAEEDA', color: '#854F0B' }}>{stage}</span>
          </div>
          <div className="text-lg font-medium" style={{ color: '#1A1A1A' }}>{applicant.name}</div>
          <div className="flex items-center gap-1 mt-0.5 text-xs" style={{ color: '#6B7280' }}>
            <MapPin size={11} />
            <span>{security.address}</span>
            <span className="mx-1">·</span>
            <span>{broker.contact} at {broker.firm}</span>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <div className="flex items-center gap-1 text-xs" style={{ color: '#6B7280' }}>
            <Lock size={11} />
            <span>Locked by {lockedBy}</span>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1 text-xs px-3 py-1.5 rounded border font-medium" style={{ border: '1px solid #E5E7EB', color: '#1A1A1A' }}>
              Case options <ChevronDown size={12} />
            </button>
            <button className="text-xs px-3 py-1.5 rounded border" style={{ border: '1px solid #E5E7EB', color: '#6B7280' }}>Analyst report</button>
            <button className="text-xs px-3 py-1.5 rounded border" style={{ border: '1px solid #E5E7EB', color: '#6B7280' }}>Client invitation</button>
          </div>
        </div>
      </div>
    </div>
  );
}
