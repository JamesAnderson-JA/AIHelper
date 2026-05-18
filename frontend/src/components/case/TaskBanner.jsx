import { Calendar, User, Layers, Tag } from 'lucide-react';

export default function TaskBanner({ caseData }) {
  const { currentTask, stage, workflow, assignedTo, dueDate } = caseData;
  const due = new Date(dueDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  return (
    <div className="px-6 py-3 flex items-center justify-between" style={{ background: '#EBF3FB', borderBottom: '1px solid #BDD6F0' }}>
      <div className="flex items-center gap-6 text-xs">
        <div>
          <div style={{ color: '#4A6B8A' }} className="mb-0.5">Current task</div>
          <div className="font-medium" style={{ color: '#1A2B47' }}>{currentTask}</div>
        </div>
        <div className="flex items-center gap-1" style={{ color: '#4A6B8A' }}>
          <Layers size={12} />
          <span>{stage}</span>
        </div>
        <div className="flex items-center gap-1" style={{ color: '#4A6B8A' }}>
          <Tag size={12} />
          <span>{workflow}</span>
        </div>
        <div className="flex items-center gap-1" style={{ color: '#4A6B8A' }}>
          <User size={12} />
          <span>{assignedTo}</span>
        </div>
        <div className="flex items-center gap-1" style={{ color: '#4A6B8A' }}>
          <Calendar size={12} />
          <span>Due {due}</span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button className="text-xs px-3 py-1.5 rounded font-medium text-white" style={{ background: '#1A2B47' }}>Open task</button>
        <button className="text-xs px-3 py-1.5 rounded border" style={{ border: '1px solid #BDD6F0', color: '#1A2B47' }}>Reassign</button>
      </div>
    </div>
  );
}
