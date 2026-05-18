import { useState } from 'react';
import TopBar from '../components/layout/TopBar';
import waitsData from '../data/waits.json';
import { Send, ExternalLink, Clock } from 'lucide-react';

const AGE_STYLE = {
  red: { bg: '#FCEBEB', color: '#791F1F', border: '#E24B4A' },
  amber: { bg: '#FAEEDA', color: '#854F0B', border: '#EF9F27' },
  grey: { bg: '#F3F4F6', color: '#6B7280', border: '#D1D5DB' },
};

export default function OpenWaitsPage() {
  const [waits, setWaits] = useState(waitsData);

  function handleChase(i) {
    setWaits(prev => prev.map((w, idx) => idx === i ? { ...w, chases: w.chases + 1 } : w));
  }

  const aging = waits.filter(w => w.ageStatus === 'red' || (w.ageStatus === 'amber' && w.ageDays >= 5));
  const oldest = Math.max(...waits.map(w => w.ageDays));

  return (
    <div className="flex-1 overflow-y-auto p-6">
      <TopBar breadcrumbs={['Home', 'Open waits']} />
      <div className="mt-4 mb-5">
        <h1 className="text-lg font-medium" style={{ color: '#1A1A1A' }}>Open waits — James Anderson</h1>
        <div className="flex items-center gap-3 mt-1 text-sm" style={{ color: '#6B7280' }}>
          <span>{waits.length} items</span>
          <span>·</span>
          <span style={{ color: '#E24B4A' }}>{aging.length} aging</span>
          <span>·</span>
          <span>oldest {oldest} days</span>
        </div>
      </div>

      <div className="rounded-xl overflow-hidden" style={{ background: '#fff', border: '1px solid #E5E7EB' }}>
        <div className="px-5 py-3 border-b text-xs font-medium grid grid-cols-12 gap-4" style={{ borderColor: '#E5E7EB', color: '#6B7280' }}>
          <div className="col-span-1">Age</div>
          <div className="col-span-4">Item</div>
          <div className="col-span-3">Recipient</div>
          <div className="col-span-2">Case</div>
          <div className="col-span-1">Chases</div>
          <div className="col-span-1">Actions</div>
        </div>

        {waits.sort((a, b) => b.ageDays - a.ageDays).map((wait, i) => {
          const style = AGE_STYLE[wait.ageStatus] || AGE_STYLE.grey;
          return (
            <div key={i} className="px-5 py-3.5 border-b grid grid-cols-12 gap-4 items-center hover:bg-gray-50" style={{ borderColor: '#F3F4F6' }}>
              <div className="col-span-1">
                <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: style.bg, color: style.color, border: `1px solid ${style.border}` }}>
                  <Clock size={9} />
                  {wait.ageDays}d
                </span>
              </div>
              <div className="col-span-4">
                <div className="text-sm" style={{ color: '#1A1A1A' }}>{wait.what}</div>
                <div className="text-xs mt-0.5" style={{ color: '#9CA3AF' }}>{wait.product}</div>
              </div>
              <div className="col-span-3 text-xs" style={{ color: '#6B7280' }}>{wait.who}</div>
              <div className="col-span-2">
                <span className="text-xs font-medium" style={{ color: '#1A2B47' }}>{wait.caseId}</span>
              </div>
              <div className="col-span-1 text-xs text-center" style={{ color: wait.chases > 0 ? '#854F0B' : '#9CA3AF' }}>
                {wait.chases > 0 ? `${wait.chases}×` : '—'}
              </div>
              <div className="col-span-1 flex items-center gap-1.5">
                <button
                  onClick={() => handleChase(i)}
                  className="p-1.5 rounded border hover:bg-gray-50"
                  style={{ border: '1px solid #E5E7EB', color: '#1A2B47' }}
                  title="Chase"
                >
                  <Send size={11} />
                </button>
                <button
                  className="p-1.5 rounded border hover:bg-gray-50"
                  style={{ border: '1px solid #E5E7EB', color: '#6B7280' }}
                  title="Open case"
                >
                  <ExternalLink size={11} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 text-xs" style={{ color: '#9CA3AF' }}>
        Age thresholds: red ≥ 7 days · amber 4–6 days · grey &lt; 4 days. Solicitor undertakings flagged red at ≥ 5 days.
      </div>
    </div>
  );
}
