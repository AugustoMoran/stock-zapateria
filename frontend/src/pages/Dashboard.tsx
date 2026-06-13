import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Package, ShoppingCart, RefreshCcw, Undo2, TrendingUp, ChevronRight, Sparkles, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  const cards = [
    { title: 'Nueva Venta', desc: 'Registrar venta al cliente', path: '/ventas', icon: ShoppingCart, color: 'from-violet-600 to-violet-800', glow: 'shadow-violet-900/40', accent: 'violet' },
    { title: 'Cambios', desc: 'Gestionar cambios de artículos', path: '/cambios', icon: RefreshCcw, color: 'from-blue-600 to-blue-800', glow: 'shadow-blue-900/40', accent: 'blue' },
    { title: 'Devoluciones', desc: 'Registrar devolución y reingreso', path: '/devoluciones', icon: Undo2, color: 'from-orange-500 to-orange-700', glow: 'shadow-orange-900/40', accent: 'orange' },
    { title: 'Consultar Stock', desc: 'Ver disponibilidad por talle', path: '/productos', icon: Package, color: 'from-emerald-600 to-emerald-800', glow: 'shadow-emerald-900/40', accent: 'emerald' },
  ];

  return (
    <div className="space-y-8 animate-slide-up">
      {/* Header with gradient background */}
      <div className="relative">
        <div className="absolute -inset-0 bg-gradient-to-r from-violet-600/10 via-transparent to-blue-600/10 rounded-3xl blur-xl pointer-events-none" />
        <div className="relative flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 bg-gradient-to-br from-violet-600 to-blue-600 rounded-lg flex items-center justify-center">
                <Zap size={16} className="text-white" />
              </div>
              <span className="text-violet-400 text-xs font-bold uppercase tracking-wider">Panel Principal</span>
            </div>
            <h1 className="text-4xl font-black text-white tracking-tight">
              ¡Hola, <span className="bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent">{user?.username}</span>!
            </h1>
            <p className="text-white/50 mt-2 text-lg font-medium">¿Qué querés hacer hoy?</p>
          </div>
          <div className="hidden md:flex items-center gap-3 bg-white/5 backdrop-blur-xl border border-white/15 rounded-2xl px-5 py-3 text-white/60">
            <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-emerald-400 to-green-400 shadow-lg shadow-emerald-400/50" />
            <span className="text-sm font-medium">Sistema en línea</span>
          </div>
        </div>
      </div>

      {/* Quick actions grid - Enhanced */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map(c => (
          <Link key={c.path} to={c.path} className="group relative">
            {/* Glow effect behind card */}
            <div className={`absolute inset-0 bg-gradient-to-br ${c.color} rounded-2xl blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-300`} />
            
            {/* Card */}
            <div className="relative bg-white/5 hover:bg-white/10 backdrop-blur-sm border border-white/10 hover:border-white/20 rounded-2xl p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl group-hover:shadow-xl">
              {/* Icon container with enhanced styling */}
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${c.color} shadow-lg ${c.glow} flex items-center justify-center mb-4 group-hover:scale-110 group-hover:-rotate-6 transition-transform duration-300 relative`}>
                <div className="absolute inset-0 rounded-xl bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <c.icon size={22} className="text-white relative z-10" />
              </div>
              
              <p className="font-bold text-white/95 text-sm leading-tight mb-1">{c.title}</p>
              <p className="text-white/40 text-xs leading-snug">{c.desc}</p>
              
              {/* Hover indicator */}
              <div className="mt-4 flex items-center gap-1 text-white/40 group-hover:text-white/70 transition-colors opacity-0 group-hover:opacity-100 transform translate-y-1 group-hover:translate-y-0 transition-all duration-300">
                <span className="text-xs font-medium">Acceder</span>
                <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Admin CTA - Premium style */}
      <Link to="/admin" className="group block">
        <div className="relative overflow-hidden rounded-3xl border border-amber-500/30 bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-amber-500/5 p-8 hover:border-amber-500/60 transition-all duration-300">
          {/* Animated gradient background */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-50 transition-opacity duration-300">
            <div className="absolute right-0 top-0 w-96 h-96 bg-gradient-to-l from-amber-500/20 to-transparent rounded-full blur-3xl" />
          </div>
          
          <div className="relative flex items-center justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-7 h-7 bg-gradient-to-br from-amber-500 to-orange-500 rounded-lg flex items-center justify-center">
                  <TrendingUp size={16} className="text-white" />
                </div>
                <span className="text-amber-400 text-xs font-bold uppercase tracking-widest">Panel Administrativo</span>
              </div>
              <h2 className="text-2xl font-black text-white mb-2">Estadísticas, reportes y gestión avanzada</h2>
              <p className="text-white/50 text-sm max-w-md">Accedé a métricas en tiempo real, auditoría completa del sistema y administración profesional de inventario</p>
            </div>
            <div className="flex-shrink-0">
              <button className="relative group/btn">
                <div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl blur-lg opacity-75 group-hover/btn:opacity-100 transition-opacity duration-300" />
                <div className="relative bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black font-bold py-3 px-6 rounded-xl flex items-center gap-2.5 transition-all duration-200 active:scale-95 shadow-lg shadow-amber-900/50">
                  <span className="text-sm whitespace-nowrap">Panel Admin</span>
                  <ChevronRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
                </div>
              </button>
            </div>
          </div>
        </div>
      </Link>

      {/* Quick help section - Enhanced */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {[
          {
            title: '💰 Guía · Proceso de Ventas',
            color: 'border-violet-500/30',
            dot: 'bg-violet-500',
            items: ['Buscá el producto por nombre o marca', 'Seleccioná talles disponibles en el stock actual', 'Agregá múltiples artículos al mismo ticket', 'Confirmá la venta y genera el comprobante']
          },
          {
            title: '🔄 Guía · Cambios y Devoluciones',
            color: 'border-blue-500/30',
            dot: 'bg-blue-500',
            items: ['Registrá el calzado que devuelve el cliente', 'Seleccioná el nuevo par que llevará', 'El sistema calcula automáticamente diferencias', 'Imprimí el comprobante de cambio']
          }
        ].map(section => (
          <div key={section.title} className={`group relative`}>
            {/* Subtle glow behind card */}
            <div className="absolute inset-0 bg-white/5 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            {/* Card */}
            <div className={`relative bg-white/5 backdrop-blur-sm border ${section.color} rounded-2xl p-6 hover:bg-white/8 transition-all duration-300 hover:border-white/40`}>
              <h3 className="font-bold text-white mb-4 text-sm">{section.title}</h3>
              <ul className="space-y-3">
                {section.items.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-white/60 group-hover:text-white/80 transition-colors">
                    <span className={`mt-1.5 w-2 h-2 rounded-full flex-shrink-0 ${section.dot} shadow-lg`} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      {/* Footer info */}
      <div className="text-center pt-4">
        <p className="text-white/30 text-xs font-medium tracking-wide">
          StockZap v1.0 • Sistema de Gestión de Zapatería
        </p>
      </div>
    </div>
  );
};

export default Dashboard;
