import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import AdminDashboard from './AdminDashboard';
import ProductManagement from './ProductManagement';
import Reports from './Reports';
import AuditLogs from './AuditLogs';
import ChangeAdminPassword from './ChangeAdminPassword';
import { ShieldCheck, LayoutDashboard, Package, BarChart2, ScrollText, KeyRound, Eye, EyeOff } from 'lucide-react';

const AdminPanel: React.FC = () => {
  const { isAdmin, verifyAdmin } = useAuth();
  const [passwordInput, setPasswordInput] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const location = useLocation();

  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] animate-slide-up">
        <div className="glass rounded-2xl p-8 w-full max-w-sm border-amber-500/20 border space-y-5">
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 bg-amber-500/15 border border-amber-500/20 rounded-2xl flex items-center justify-center">
              <ShieldCheck size={22} className="text-amber-400" />
            </div>
            <div className="text-center">
              <h2 className="text-lg font-bold text-white">Acceso Administrativo</h2>
              <p className="text-white/40 text-sm mt-1">Ingresá la clave para continuar</p>
            </div>
          </div>

          <div className="relative">
            <input
              type={showPass ? 'text' : 'password'}
              className="input-dark pr-12"
              placeholder="Contraseña admin"
              value={passwordInput}
              onChange={e => setPasswordInput(e.target.value)}
              onKeyDown={async e => {
                if (e.key === 'Enter') {
                  setLoading(true);
                  const ok = await verifyAdmin(passwordInput);
                  if (!ok) toast.error('Contraseña incorrecta');
                  setLoading(false);
                }
              }}
            />
            <button
              type="button"
              onClick={() => setShowPass(!showPass)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
            >
              {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          <button
            disabled={loading}
            onClick={async () => {
              setLoading(true);
              const ok = await verifyAdmin(passwordInput);
              if (!ok) toast.error('Contraseña incorrecta');
              setLoading(false);
            }}
            className="w-full btn-primary flex items-center justify-center gap-2 py-3 disabled:opacity-50"
          >
            {loading
              ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              : <><ShieldCheck size={16} /> Verificar acceso</>
            }
          </button>
        </div>
      </div>
    );
  }

  const tabs = [
    { label: 'Dashboard', path: '/admin', icon: LayoutDashboard, exact: true },
    { label: 'Productos', path: '/admin/productos', icon: Package },
    { label: 'Reportes', path: '/admin/reportes', icon: BarChart2 },
    { label: 'Auditoría', path: '/admin/auditoria', icon: ScrollText },
    { label: 'Clave Admin', path: '/admin/password', icon: KeyRound },
  ];

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Tab bar */}
      <div className="flex items-center gap-1 overflow-x-auto pb-1">
        {tabs.map(tab => {
          const isExactAdmin = tab.exact && location.pathname === '/admin';
          const isActive = isExactAdmin || (!tab.exact && location.pathname.startsWith(tab.path));
          return (
            <Link
              key={tab.path}
              to={tab.path}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                isActive || (tab.exact && location.pathname === '/admin')
                  ? 'bg-amber-500/15 text-amber-300 border border-amber-500/20'
                  : 'text-white/40 hover:text-white/70 hover:bg-white/5'
              }`}
            >
              <tab.icon size={15} />
              {tab.label}
            </Link>
          );
        })}
      </div>

      <Routes>
        <Route path="/" element={<AdminDashboard />} />
        <Route path="/productos" element={<ProductManagement />} />
        <Route path="/reportes" element={<Reports />} />
        <Route path="/auditoria" element={<AuditLogs />} />
        <Route path="/password" element={<ChangeAdminPassword />} />
      </Routes>
    </div>
  );
};

export default AdminPanel;
