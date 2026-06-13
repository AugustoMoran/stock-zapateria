import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { TrendingUp, ShoppingBag, DollarSign, Undo2 } from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const [report, setReport] = useState<any>(null);

  useEffect(() => {
    api.get('/admin/reports').then(({ data }) => setReport(data));
  }, []);

  if (!report) return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="glass rounded-2xl p-5 h-24 animate-pulse bg-white/3" />
      ))}
    </div>
  );

  const stats = [
    {
      label: 'Ganancia Neta (Hoy)',
      value: `$${Number(report.netProfit).toLocaleString()}`,
      icon: TrendingUp,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10 border-emerald-500/20',
      glow: 'shadow-emerald-900/20',
    },
    {
      label: 'Ventas Realizadas',
      value: report.cantidadVentas,
      icon: ShoppingBag,
      color: 'text-violet-400',
      bg: 'bg-violet-500/10 border-violet-500/20',
      glow: 'shadow-violet-900/20',
    },
    {
      label: 'Ingresos Totales',
      value: `$${Number(report.totalIngresos).toLocaleString()}`,
      icon: DollarSign,
      color: 'text-blue-400',
      bg: 'bg-blue-500/10 border-blue-500/20',
      glow: 'shadow-blue-900/20',
    },
    {
      label: 'Devoluciones',
      value: report.cantidadDevoluciones,
      icon: Undo2,
      color: 'text-orange-400',
      bg: 'bg-orange-500/10 border-orange-500/20',
      glow: 'shadow-orange-900/20',
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-lg font-bold text-white">Resumen del día</h2>
        <p className="text-white/40 text-sm">Métricas actualizadas en tiempo real</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(s => (
          <div key={s.label} className={`glass rounded-2xl p-5 border ${s.bg} shadow-lg ${s.glow}`}>
            <div className="flex items-start justify-between mb-4">
              <p className="text-white/40 text-xs font-medium leading-tight">{s.label}</p>
              <s.icon size={16} className={s.color} />
            </div>
            <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
