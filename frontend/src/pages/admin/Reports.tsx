import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Calendar, TrendingUp, DollarSign, Package, Undo2, ShoppingBag } from 'lucide-react';

const Reports: React.FC = () => {
  const today = new Date().toISOString().split('T')[0];
  const [dates, setDates] = useState({ from: today, to: today });
  const [data, setData] = useState<any>(null);
  const [topProducts, setTopProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const [repRes, topRes] = await Promise.all([
        api.get(`/admin/reports?from=${dates.from}&to=${dates.to}`),
        api.get(`/admin/top-products?from=${dates.from}&to=${dates.to}`)
      ]);
      setData(repRes.data); setTopProducts(topRes.data);
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchReports(); }, [dates]);

  const stats = data ? [
    { label: 'Ganancia Neta', value: `$${Number(data.netProfit).toLocaleString()}`, icon: TrendingUp, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
    { label: 'Ventas Netas', value: `$${Number(data.totalIngresos).toLocaleString()}`, icon: DollarSign, color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' },
    { label: 'Costos Netos', value: `$${Number(data.totalCostos).toLocaleString()}`, icon: Package, color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20' },
    { label: 'Cant. Operaciones', value: data.cantidadVentas + data.cantidadCambios + data.cantidadDevoluciones, icon: ShoppingBag, color: 'text-violet-400', bg: 'bg-violet-500/10 border-violet-500/20' },
  ] : [];

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Date range filter */}
      <div className="glass rounded-2xl p-5 flex flex-col sm:flex-row gap-4 items-end sm:items-center">
        <div className="flex-1 grid grid-cols-2 gap-4">
          {[{key:'from', label:'Desde'},{key:'to', label:'Hasta'}].map(f => (
            <div key={f.key}>
              <label className="block text-white/40 text-[10px] uppercase tracking-widest font-bold mb-2">{f.label}</label>
              <input
                type="date"
                className="input-dark text-sm py-2.5 w-full"
                value={(dates as any)[f.key]}
                onChange={e => setDates({...dates, [f.key]: e.target.value})}
              />
            </div>
          ))}
        </div>
        <button
          onClick={fetchReports}
          disabled={loading}
          className="btn-primary flex items-center gap-2 h-11 px-6 disabled:opacity-50 mt-4 sm:mt-0"
        >
          {loading
            ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            : <Calendar size={15} />
          }
          Filtrar
        </button>
      </div>

      {/* Stats */}
      {data && (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map(s => (
              <div key={s.label} className={`glass rounded-2xl p-5 border ${s.bg}`}>
                <div className="flex items-start justify-between mb-3">
                  <p className="text-white/40 text-xs font-medium leading-tight">{s.label}</p>
                  <s.icon size={15} className={s.color} />
                </div>
                <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Top products */}
            <div className="lg:col-span-2 glass rounded-2xl overflow-hidden">
              <div className="px-5 py-4 border-b border-white/5">
                <h3 className="text-white font-bold text-sm">Más vendidos en el período</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/5">
                      {['Producto', 'Color', 'Cant.', 'Recaudado'].map(h => (
                        <th key={h} className="px-4 py-3 text-white/25 text-[10px] uppercase tracking-widest text-left">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {topProducts.length === 0 ? (
                      <tr><td colSpan={4} className="px-4 py-8 text-center text-white/20 text-sm">Sin datos en el período</td></tr>
                    ) : topProducts.map((p, i) => (
                      <tr key={i} className="border-b border-white/5 hover:bg-white/3 transition-colors">
                        <td className="px-4 py-3">
                          <span className="badge-violet text-[10px] mr-2">{p._id.fabrica}</span>
                          <span className="text-white text-sm">{p._id.articulo}</span>
                        </td>
                        <td className="px-4 py-3 text-white/40 text-sm">{p._id.color}</td>
                        <td className="px-4 py-3 text-white font-bold">{p.cantidadVendida}</td>
                        <td className="px-4 py-3 text-emerald-400 font-bold">${Number(p.totalRecaudado).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Summary */}
            <div className="glass rounded-2xl p-5 space-y-4">
              <h3 className="text-white font-bold text-sm border-b border-white/5 pb-3">Detalle Operativo</h3>
              {[
                { label: 'Ventas Realizadas', value: data.cantidadVentas, icon: ShoppingBag, color: 'text-blue-400' },
                { label: 'Devoluciones', value: data.cantidadDevoluciones, icon: Undo2, color: 'text-red-400' },
                { label: 'Cambios con Diferencia', value: `$${Number(data.exchangeRevenueDiff).toLocaleString()}`, icon: Package, color: 'text-violet-400' },
                { label: 'Efectivo Devuelto', value: `$${Number(data.totalMontoDevuelto).toLocaleString()}`, icon: DollarSign, color: 'text-red-300' },
                { label: 'Total Descuentos', value: `$${Number(data.totalDescuentos || 0).toLocaleString()}`, icon: TrendingUp, color: 'text-orange-400' },
              ].map(item => (
                <div key={item.label} className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-white/40 text-sm">
                    <item.icon size={14} className={item.color} />
                    {item.label}
                  </div>
                  <span className={`font-bold ${item.color}`}>{item.value}</span>
                </div>
              ))}
              <div className="pt-3 border-t border-white/5">
                <p className="text-white/20 text-[11px] leading-relaxed">
                  Lógica aplicada: <br />
                  • <b>Ventas Netas</b>: Ventas + Dif. de Cambios - Devoluciones. <br />
                  • <b>Costos Netos</b>: Costo de Ventas + Costo de Cambios - Recupero de Devoluciones. <br />
                  • <b>Ganancia Neta</b>: Ventas Netas - Costos Netos.
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Reports;