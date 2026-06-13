import React from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  RefreshCcw, 
  Undo2, 
  ShieldCheck,
  LogOut,
  Menu,
  X,
  Zap
} from 'lucide-react';

const Layout: React.FC = () => {
  const { logout, isAdmin, exitAdmin, user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Productos', path: '/productos', icon: Package },
    { name: 'Ventas', path: '/ventas', icon: ShoppingCart },
    { name: 'Cambios', path: '/cambios', icon: RefreshCcw },
    { name: 'Devoluciones', path: '/devoluciones', icon: Undo2 },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path: string) =>
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);

  return (
    <div className="min-h-screen bg-[#0f1117] flex overflow-hidden">
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-20 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-30 w-[260px] flex-shrink-0
        bg-[#13151f] border-r border-white/5
        transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center gap-3 px-6 py-5 border-b border-white/5">
            <div className="w-9 h-9 bg-violet-600 rounded-xl flex items-center justify-center shadow-lg shadow-violet-900/50">
              <Zap size={18} className="text-white" />
            </div>
            <div>
              <p className="font-bold text-white text-sm leading-tight">StockZap</p>
              <p className="text-white/30 text-xs">Zapatería</p>
            </div>
          </div>

          {/* Nav */}
          <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
            <p className="text-white/25 text-[10px] font-semibold uppercase tracking-widest px-3 pb-2">Principal</p>
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150
                  ${isActive(item.path)
                    ? 'bg-violet-600/20 text-violet-300 border border-violet-500/20'
                    : 'text-white/50 hover:text-white/80 hover:bg-white/5'
                  }`}
              >
                <item.icon size={17} className={isActive(item.path) ? 'text-violet-400' : ''} />
                {item.name}
              </Link>
            ))}

            <div className="pt-4">
              <p className="text-white/25 text-[10px] font-semibold uppercase tracking-widest px-3 pb-2">Administración</p>
              <Link
                to="/admin"
                onClick={() => setIsSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150
                  ${location.pathname.startsWith('/admin')
                    ? 'bg-amber-500/15 text-amber-300 border border-amber-500/20'
                    : 'text-white/50 hover:text-white/80 hover:bg-white/5'
                  }`}
              >
                <ShieldCheck size={17} className={location.pathname.startsWith('/admin') ? 'text-amber-400' : ''} />
                Panel Admin
                {isAdmin && <span className="ml-auto badge-amber text-[9px] py-0 px-1.5">ACTIVO</span>}
              </Link>
            </div>
          </nav>

          {/* Footer */}
          <div className="px-3 py-4 border-t border-white/5 space-y-1">
            {/* User info */}
            <div className="flex items-center gap-3 px-3 py-2 mb-1">
              <div className="w-8 h-8 rounded-full bg-violet-600/30 border border-violet-500/30 flex items-center justify-center text-violet-300 text-xs font-bold uppercase">
                {user?.username?.[0] || 'U'}
              </div>
              <div className="min-w-0">
                <p className="text-white/80 text-sm font-medium truncate">{user?.username}</p>
                <p className="text-white/30 text-xs">{isAdmin ? 'Administrador' : 'Vendedor'}</p>
              </div>
            </div>

            {isAdmin && (
              <button 
                onClick={exitAdmin}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-amber-400/80 hover:text-amber-300 hover:bg-amber-500/10 transition-all"
              >
                <X size={16} />
                Salir Modo Admin
              </button>
            )}
            <button 
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-all"
            >
              <LogOut size={16} />
              Cerrar Sesión
            </button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile topbar */}
        <header className="lg:hidden flex items-center justify-between px-4 py-3 border-b border-white/5 bg-[#13151f]">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-violet-600 rounded-lg flex items-center justify-center">
              <Zap size={14} className="text-white" />
            </div>
            <span className="font-bold text-white text-sm">StockZap</span>
          </div>
          <button onClick={() => setIsSidebarOpen(true)} className="p-2 text-white/50 hover:text-white">
            <Menu size={20} />
          </button>
        </header>

        <main className="flex-1 overflow-y-auto">
          <div className="p-4 md:p-8 max-w-7xl mx-auto animate-fade-in">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
