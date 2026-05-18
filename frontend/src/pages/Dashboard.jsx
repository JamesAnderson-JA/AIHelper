import { useNavigate } from 'react-router-dom';
import { Sparkles, Clock, AlertTriangle } from 'lucide-react';
import TopBar from '../components/layout/TopBar';

const CASES = [
  { caseId: 'MTFBTL19559', applicant: 'Hartwell Properties Ltd', stage: 'DIP (Referred)', due: '21 May 2026', alerts: 8, waits: 2, lastActivity: '5 days ago', highlight: true },
  { caseId: 'MTFCOM18234', applicant: 'Crestwood Holdings Ltd', stage: 'Offer', due: '28 May 2026', alerts: 2, waits: 1, lastActivity: '1 day ago', highlight: false },
  { caseId: 'MTFBR17712', applicant: 'T. Ashworth', stage: 'Underwriting', due: '19 May 2026', alerts: 1, waits: 1, lastActivity: '3 days ago', highlight: false },
  { caseId: 'MTFBTL19560', applicant: 'J. Ellison', stage: 'DIP', due: '22 May 2026', alerts: 0, waits: 1, lastActivity: '2 days ago', highlight: false },
  { caseId: 'MTFBTL19561', applicant: 'Pemberton Property Ltd', stage: 'DIP', due: '24 May 2026', alerts: 1, waits: 1, lastActivity: '1 day ago', highlight: false },
  { caseId: 'MTFCOM18240', applicant: 'Greenvale Retail Ltd', stage: 'Pre-offer', due: '30 May 2026', alerts: 0, waits: 0, lastActivity: 'Today', highlight: false },
];

const TILES = [
  { label: 'Total cases', value: 47 },
  { label: 'DIP referred', value: 6 },
  { label: 'At watch', value: 3 },
  { label: 'Open waits', value: 12 },
  { label: 'Aging waits', value: 3 },
  { label: 'Helper alerts', value: 8 },
];

export default function Dashboard() {
  const nav = useNavigate();
  return (
    <div className="flex-1 overflow-y-auto p-6">
      <TopBar breadcrumbs={['Home', 'Dashboard']} />
      <div className="mt-4 mb-6">
        <h1 className="text-lg font-medium" style={{ color: '#1A1A1A' }}>Welcome, James Anderson</h1>
        <p className="text-sm mt-0.5" style={{ color: '#6B7280' }}>Monday, 18 May 2026</p>
      </div>

      {/* Summary tiles */}
      <div className="grid grid-cols-6 gap-3 mb-6">
        {TILES.map(({ label, value }) => (
          <div key={label} className="rounded-xl p-4" style={{ background: '#fff', border: '1px solid #E5E7EB' }}>
            <div className="text-2xl font-medium" style={{ color: '#1A1A1A' }}>{value}</div>
            <div className="text-xs mt-0.5" style={{ color: '#6B7280' }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Case table */}
      <div className="rounded-xl overflow-hidden" style={{ background: '#fff', border: '1px solid #E5E7EB' }}>
        <div className="px-5 py-3 border-b flex items-center justify-between" style={{ borderColor: '#E5E7EB' }}>
          <div className="text-sm font-medium" style={{ color: '#1A1A1A' }}>Active cases</div>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr style={{ borderBottom: '1px solid #E5E7EB' }}>
              {['Case ID', 'Applicant', 'Stage', 'Due date', 'Helper alerts', 'Open waits', 'Last activity'].map(h => (
                <th key={h} className="px-4 py-2.5 text-left text-xs font-medium" style={{ color: '#6B7280' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {CASES.map(c => (
              <tr
                key={c.caseId}
                onClick={() => nav(`/case/${c.caseId}`)}
                className="cursor-pointer border-b transition-colors hover:bg-gray-50"
                style={{
                  borderColor: '#F3F4F6',
                  background: c.highlight ? '#FAFBFF' : undefined,
                }}
              >
                <td className="px-4 py-3 text-xs font-medium" style={{ color: '#1A2B47' }}>{c.caseId}</td>
                <td className="px-4 py-3">
                  <div className="text-sm font-medium" style={{ color: '#1A1A1A' }}>{c.applicant}</div>
                </td>
                <td className="px-4 py-3">
                  <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: '#F3F4F6', color: '#6B7280' }}>{c.stage}</span>
                </td>
                <td className="px-4 py-3 text-xs" style={{ color: '#6B7280' }}>{c.due}</td>
                <td className="px-4 py-3">
                  {c.alerts > 0 ? (
                    <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: '#FCEBEB', color: '#791F1F' }}>
                      <Sparkles size={10} />
                      {c.alerts}
                    </span>
                  ) : (
                    <span className="text-xs" style={{ color: '#9CA3AF' }}>—</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  {c.waits > 0 ? (
                    <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full" style={{ background: '#FAEEDA', color: '#854F0B' }}>
                      <Clock size={10} />
                      {c.waits}
                    </span>
                  ) : (
                    <span className="text-xs" style={{ color: '#9CA3AF' }}>—</span>
                  )}
                </td>
                <td className="px-4 py-3 text-xs" style={{ color: '#6B7280' }}>{c.lastActivity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
