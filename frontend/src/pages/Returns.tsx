import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Undo2, Search, ArrowLeft } from 'lucide-react';
import { toast } from 'react-hot-toast';

const Returns: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<any>(null);
  const [talle, setTalle] = useState('');
  const [monto, setMonto] = useState<number | string>('');

  useEffect(() => {
    const fetch = async () => {
      const { data } = await api.get(`/products?search=${search}`);
      setProducts(data);
    };
    const tid = setTimeout(fetch, 300);
    return () => clearTimeout(tid);
  }, [search]);

  const handleConfirm = async () => {
    if (!selected || !talle) return toast.error('Seleccione producto y talle');
    const finalMonto = monto === '' ? selected.precioPublico : Number(monto);
    try {
      await api.post('/returns', {
        productId: selected._id, talle, cantidad: 1,
        montoDevuelto: finalMonto
      });
      toast.success('Devolución registrada');
      setSelected(null); setTalle(''); setMonto('');
    } catch {
      toast.error('Error al registrar devolución');
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-slide-up">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 bg-orange-500/20 border border-orange-500/20 rounded-xl flex items-center justify-center">
          <Undo2 size={17} className="text-orange-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Devoluciones</h1>
          <p className="text-white/40 text-sm">Registrá una devolución y reingresá el stock</p>
        </div>
      </div>

      {selected ? (
        <div className="glass rounded-2xl p-6 border-orange-500/30 border space-y-6">
          {/* Selected product header */}
          <div className="flex items-start justify-between border-b border-white/10 pb-4">
            <div>
              <span className="badge-amber text-[10px] mb-2">{selected.fabrica}</span>
              <h2 className="text-2xl font-black text-white">{selected.articulo}</h2>
              <p className="text-white/40">{selected.color}</p>
            </div>
            <button
              onClick={() => setSelected(null)}
              className="flex items-center gap-1.5 text-white/30 hover:text-white/60 text-sm transition-colors"
            >
              <ArrowLeft size={14} />
              Volver
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Talle selector */}
            <div>
              <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest mb-3">Talle a devolver</p>
              <div className="flex flex-wrap gap-2">
                {['5','6','7','8','9','0','1'].map(t => (
                  <button
                    key={t}
                    onClick={() => setTalle(t)}
                    className={`w-12 h-12 rounded-xl font-bold text-sm transition-all border ${
                      talle === t
                        ? 'bg-orange-500 border-orange-400 text-white shadow-lg shadow-orange-900/30'
                        : 'bg-white/5 border-white/10 text-white/50 hover:border-orange-500/40 hover:text-white/80'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Amount */}
            <div>
              <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest mb-3">Monto a devolver</p>
              <div className="flex items-center gap-3 glass rounded-xl px-4 py-3">
                <span className="text-white/30 font-bold text-lg">$</span>
                <input
                  type="number"
                  className="flex-1 bg-transparent outline-none text-white font-black text-2xl placeholder-white/20"
                  placeholder={selected.precioPublico.toString()}
                  value={monto}
                  onChange={e => setMonto(e.target.value)}
                />
              </div>
              <p className="text-white/25 text-xs mt-2">Precio sugerido: ${selected.precioPublico.toLocaleString()}</p>
            </div>
          </div>

          <button
            onClick={handleConfirm}
            disabled={!talle}
            className="w-full flex items-center justify-center gap-2 bg-orange-600 hover:bg-orange-500
              disabled:opacity-30 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl
              transition-all active:scale-95 shadow-lg shadow-orange-900/30"
          >
            <Undo2 size={18} />
            CONFIRMAR DEVOLUCIÓN
          </button>
        </div>
      ) : (
        <>
          <div className="flex items-center gap-3 glass rounded-xl px-4 py-3">
            <Search size={16} className="text-white/30" />
            <input
              type="text"
              placeholder="Buscar producto para devolver..."
              className="flex-1 bg-transparent outline-none text-white placeholder-white/30 text-sm"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {products.map(p => (
              <div
                key={p._id}
                onClick={() => setSelected(p)}
                className="glass hover:bg-white/8 hover:border-orange-500/30 rounded-2xl p-4 cursor-pointer transition-all"
              >
                <span className="badge-amber text-[10px] mb-1.5">{p.fabrica}</span>
                <h4 className="font-bold text-white">{p.articulo}</h4>
                <p className="text-white/40 text-sm">{p.color}</p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Returns;
