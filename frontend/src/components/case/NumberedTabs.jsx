import { Check } from 'lucide-react';

const ALL_STAGES = [
  'Pre-Case Eligibility', 'Loan', 'Applicants', 'Income', 'Adverse', 'Portfolio', 'Security Property',
  'Criteria Rules', 'Product Calculator', 'Product', 'Credit Search', 'Creditsafe', 'LexisNexis', 'Fees',
  'Document Checklist', 'Documents', 'Notes', 'Introducer', 'Linked Cases', 'Credit Paper',
];

export default function NumberedTabs({ stagesComplete }) {
  const completeSet = new Set(stagesComplete);
  return (
    <div className="px-6 py-4 flex flex-wrap gap-2" style={{ background: '#fff', borderBottom: '1px solid #E5E7EB' }}>
      {ALL_STAGES.map((stage, i) => {
        const done = completeSet.has(stage);
        return (
          <button
            key={i}
            title={stage}
            className="flex flex-col items-center justify-center gap-1 rounded-lg text-xs font-medium transition-colors"
            style={{
              width: 70,
              height: 60,
              border: done ? '2px solid #22A06B' : '2px solid #D1D5DB',
              background: done ? '#F0FBF6' : '#F9FAFB',
              color: done ? '#22A06B' : '#6B7280',
            }}
          >
            <div
              className="flex items-center justify-center rounded-full text-xs font-medium"
              style={{
                width: 22, height: 22,
                background: done ? '#22A06B' : '#E5E7EB',
                color: done ? '#fff' : '#6B7280',
              }}
            >
              {done ? <Check size={11} strokeWidth={2.5} /> : i + 1}
            </div>
            <span className="text-center leading-tight px-1" style={{ fontSize: 10 }}>
              {stage}
            </span>
          </button>
        );
      })}
    </div>
  );
}
