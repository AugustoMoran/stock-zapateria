import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const AuditLogs: React.FC = () => {
  const [logs, setLogs] = useState<any[]>([]);
  const [movements, setMovements] = useState<any[]>([]);
  const [tab, setTab] = useState<'audit' | 'stock'>('audit');

  useEffect(() => {
    const fetch = async () => {
      const logRes = await api.get('/admin/audit-logs');
      setLogs(logRes.data);
      const moveRes = await api.get('/admin/movements');
      setMovements(moveRes.data);
    };
    fetch();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex bg-white/5 border border-white/10 rounded-lg p-1 shadow-sm w-fit">
        <button 
          onClick={() => setTab('audit')}
          className={`px-6 py-2 rounded-lg font-bold text-sm transition-all ${tab === 'audit' ? 'bg-white/20 text-white' : 'text-white/40 hover:text-white/70'}`}
        >
          Acciones de Usuarios
        </button>
        <button 
          onClick={() => setTab('stock')}
          className={`px-6 py-2 rounded-lg font-bold text-sm transition-all ${tab === 'stock' ? 'bg-white/20 text-white' : 'text-white/40 hover:text-white/70'}`}
        >
          Movimientos de Stock
        </button>
      </div>

      <div className="bg-[#1a1d2e] rounded-2xl shadow-lg border border-white/10 overflow-hidden">
        {tab === 'audit' ? (
          <table className="w-full text-left">
            <thead className="bg-white/5 border-b border-white/10 text-white/40 text-xs uppercase tracking-widest">
              <tr>
                <th className="p-4">Fecha/Hora</th>
                <th className="p-4">Usuario</th>
                <th className="p-4">Acción</th>
                <th className="p-4">Detalles</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-white/5">
              {logs.map(log => (
                <tr key={log._id} className="hover:bg-white/5 transition-colors">
                  <td className="p-4 font-mono text-xs text-white/60">{new Date(log.fecha).toLocaleString()}</td>
                  <td className="p-4 font-bold text-white">{log.usuario?.username}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${
                      log.accion.includes('CREATE') ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                      log.accion.includes('DELETE') ? 'bg-red-500/20 text-red-300 border border-red-500/30' :
                      'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                    }`}>
                      {log.accion}
                    </span>
                  </td>
                  <td className="p-4 text-white/40">{log.detalles}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <table className="w-full text-left">
            <thead className="bg-white/5 border-b border-white/10 text-white/40 text-xs uppercase tracking-widest">
              <tr>
                <th className="p-4">Fecha</th>
                <th className="p-4">Producto</th>
                <th className="p-4">Talle</th>
                <th className="p-4">Cant.</th>
                <th className="p-4">Tipo</th>
                <th className="p-4">Responsable</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-white/5">
              {movements.map(m => (
                <tr key={m._id} className="hover:bg-white/5 transition-colors">
                  <td className="p-4 font-mono text-xs">{new Date(m.fecha).toLocaleString()}</td>
                  <td className="p-4 font-bold">
                    <span className="text-xs text-blue-600 uppercase block">{m.productId?.fabrica}</span>
                    {m.productId?.articulo}
                  </td>
                  <td className="p-4 font-bold">{m.talle}</td>
                  <td className={`p-4 font-black ${m.cantidad > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {m.cantidad > 0 ? `+${m.cantidad}` : m.cantidad}
                  </td>
                  <td className="p-4 text-xs font-bold">{m.tipo}</td>
                  <td className="p-4 text-gray-500">{m.usuario?.username}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AuditLogs;
