import { Bell, Search } from 'lucide-react';

export default function TopBar({ breadcrumbs = [] }) {
  return (
    <header style={{ background: '#fff', borderBottom: '1px solid #E5E7EB' }} className="flex items-center justify-between px-6 py-3">
      <nav className="flex items-center gap-1 text-xs" style={{ color: '#6B7280' }}>
        {breadcrumbs.map((crumb, i) => (
          <span key={i} className="flex items-center gap-1">
            {i > 0 && <span>/</span>}
            <span className={i === breadcrumbs.length - 1 ? 'text-gray-900 font-medium' : ''}>
              {crumb}
            </span>
          </span>
        ))}
      </nav>
      <div className="flex items-center gap-3">
        <button className="p-1.5 rounded hover:bg-gray-100" style={{ color: '#6B7280' }}>
          <Search size={15} />
        </button>
        <button className="relative p-1.5 rounded hover:bg-gray-100" style={{ color: '#6B7280' }}>
          <Bell size={15} />
          <span className="absolute top-0.5 right-0.5 w-2 h-2 rounded-full" style={{ background: '#E24B4A' }} />
        </button>
      </div>
    </header>
  );
}
