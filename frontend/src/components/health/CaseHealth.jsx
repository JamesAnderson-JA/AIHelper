import { TrendingDown, TrendingUp, Minus, AlertTriangle } from 'lucide-react';

const TREND_ICON = {
  worsening: TrendingDown,
  slowing: TrendingDown,
  aging: TrendingDown,
  stable: Minus,
  improving: TrendingUp,
};

const TREND_COLOR = {
  worsening: '#E24B4A',
  slowing: '#E24B4A',
  aging: '#854F0B',
  stable: '#6B7280',
  improving: '#22A06B',
};

function DimensionCard({ label, value, trend, context }) {
  const Icon = TREND_ICON[trend] || Minus;
  const color = TREND_COLOR[trend] || '#6B7280';
  return (
    <div className="rounded-lg p-3" style={{ border: '1px solid #E5E7EB', background: '#fff' }}>
      <div className="flex items-center justify-between mb-1">
        <div className="text-xs font-medium" style={{ color: '#6B7280' }}>{label}</div>
        <div className="flex items-center gap-1 text-xs" style={{ color }}>
          <Icon size={11} />
          <span className="capitalize">{trend}</span>
        </div>
      </div>
      <div className="text-sm font-medium mb-1" style={{ color: '#1A1A1A' }}>{value}</div>
      <div className="text-xs" style={{ color: '#9CA3AF' }}>{context}</div>
    </div>
  );
}

export default function CaseHealth({ health, caseId }) {
  const { overall, trend, dimensions } = health;
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <div className="text-xs font-medium" style={{ color: '#6B7280' }}>{caseId}</div>
        <div>
          <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: '#FAEEDA', color: '#854F0B' }}>
            {overall}
          </span>
        </div>
      </div>
      <div className="text-xs mb-3" style={{ color: '#6B7280' }}>{trend}</div>
      <div className="grid grid-cols-2 gap-2 mb-3">
        {Object.values(dimensions).map(dim => (
          <DimensionCard key={dim.label} {...dim} />
        ))}
      </div>
      <div className="rounded-lg p-3 text-xs" style={{ background: '#EBF3FB', border: '1px solid #BDD6F0' }}>
        <div className="flex items-center gap-1.5 font-medium mb-1" style={{ color: '#1A2B47' }}>
          <AlertTriangle size={12} />
          What's driving the watch state
        </div>
        <div style={{ color: '#4A6B8A' }}>
          The DOB mismatch has been unresolved for 6 days and the AST chase is ageing beyond Northbridge's typical response time.
          ICR headroom is thin — any rent adjustment would push the case into exception territory. Combined with a quiet activity
          window, the case is at elevated risk of timeline drift.
        </div>
      </div>
    </div>
  );
}
