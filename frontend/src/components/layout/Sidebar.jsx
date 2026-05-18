import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Briefcase, Clock, MessageSquare, FileText, Building2 } from 'lucide-react';

const nav = [
  { label: 'Dashboard', icon: LayoutDashboard, to: '/' },
  { label: 'Case manager', icon: Briefcase, to: '/case/MTFBTL19559' },
  { label: 'Open waits', icon: Clock, to: '/waits' },
  { label: 'Policy assistant', icon: MessageSquare, to: '/policy' },
  { label: 'Audit log', icon: FileText, to: '/audit' },
];

export default function Sidebar() {
  return (
    <aside className="flex flex-col h-full" style={{ background: '#1A2B47', width: 220, minWidth: 220 }}>
      <div className="flex items-center gap-2 px-5 py-5 border-b border-white/10">
        <Building2 size={20} color="white" />
        <span className="font-medium text-white text-sm tracking-wide">MT Finance</span>
      </div>
      <nav className="flex-1 py-4">
        {nav.map(({ label, icon: Icon, to }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-5 py-2.5 text-sm transition-colors ${
                isActive
                  ? 'bg-white/10 text-white font-medium'
                  : 'text-white/60 hover:bg-white/5 hover:text-white/90'
              }`
            }
          >
            <Icon size={16} />
            {label}
          </NavLink>
        ))}
      </nav>
      <div className="px-5 py-4 border-t border-white/10">
        <div className="text-xs text-white/40">Logged in as</div>
        <div className="text-sm text-white/80 font-medium mt-0.5">James Anderson</div>
        <div className="text-xs text-white/40">Case manager</div>
      </div>
    </aside>
  );
}
