import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Sidebar from './components/layout/Sidebar';
import Dashboard from './pages/Dashboard';
import CasePage from './pages/CasePage';
import OpenWaitsPage from './pages/OpenWaitsPage';
import PolicyAssistant from './pages/PolicyAssistant';
import AuditLogPage from './pages/AuditLogPage';

export default function App() {
  return (
    <BrowserRouter>
      <div className="flex h-screen overflow-hidden" style={{ background: '#F5F6F8' }}>
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/case/:caseId" element={<CasePage />} />
            <Route path="/waits" element={<OpenWaitsPage />} />
            <Route path="/policy" element={<PolicyAssistant />} />
            <Route path="/audit" element={<AuditLogPage />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}
