import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { RefreshCcw, Search, ArrowRight, CheckCircle2, X } from 'lucide-react';
import { toast } from 'react-hot-toast';

const ProductPicker: React.FC<{
  label: string;
  step: number;
  accent: string;
  selected: any;
  talle: string;
  products: any[];
  onSelect: (p: any, t: string) => void;
  onClear: () => void;
  requireStock?: boolean;
}> = ({ label, step, accent, selected, talle, products, onSelect, onClear, requireStock }) => (
  <div className={`glass rounded-2xl p-5 border ${selected ? accent : 'border-white/10'} transition-all`}>
    <div className="flex items-center gap-2 mb-4">
      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
        selected ? 'bg-white/20 text-white' : 'bg-white/5 text-white/40'
      }`}>{step}</span>
      <p className="text-white/60 text-sm font-medium">{label}</p>
    </div>

    {selected ? (
      <div className="flex items-center justify-between bg-white/5 rounded-xl p-4">
        <div>
          <p className="text-white font-bold">{selected.articulo}</p>
          <p className="text-white/40 text-sm">{selected.color} · talle {talle}</p>
          <p className="text-white font-black text-lg mt-1">${selected.precioPublico.toLocaleString()}</p>
        </div>
        <button onClick={onClear} className="text-white/20 hover:text-red-400 p-2 transition-colors">
          <X size={16} />
        </button>
      </div>
    ) : (
      <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
        {products.map(p => (
          <div key={p._id} className="bg-white/3 hover:bg-white/8 rounded-xl p-3 cursor-pointer transition-all border border-transparent hover:border-white/10">
            <div className="flex justify-between items-start mb-2">
              <div>
                <p className="text-white font-medium text-sm">{p.articulo}</p>
                <p className="text-white/40 text-xs">{p.fabrica} · {p.color}</p>
              </div>
              <p className="text-white/70 font-bold text-sm">${p.precioPublico.toLocaleString()}</p>
            </div>
            <div className="flex flex-wrap gap-1">
              {Object.entries(p.stock as Record<string, number>).map(([t, stock]) => (
                <button
                  key={t}
                  disabled={requireStock ? stock <= 0 : false}
                  onClick={() => onSelect(p, t)}
                  className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all ${
                    (requireStock && stock <= 0)
                      ? 'bg-white/3 text-white/15 cursor-not-allowed'
                      : 'bg-white/8 text-white/60 hover:bg-violet-600/30 hover:text-violet-300'
                  }`}
                >
                  t{t}{requireStock ? ` (${stock})` : ''}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
);

const Exchanges: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [selectedDev, setSelectedDev] = useState<any>(null);
  const [talleDev, setTalleDev] = useState('');
  const [selectedEnt, setSelectedEnt] = useState<any>(null);
  const [talleEnt, setTalleEnt] = useState('');

  useEffect(() => {
    const fetch = async () => {
      const { data } = await api.get(`/products?search=${search}`);
      setProducts(data);
    };
    const tid = setTimeout(fetch, 300);
    return () => clearTimeout(tid);
  }, [search]);

  const handleConfirm = async () => {
    if (!selectedDev || !talleDev || !selectedEnt || !talleEnt) {
      toast.error('Complete la selección de ambos productos'); return;
    }
    try {
      await api.post('/exchanges', {
        devuelto: { productId: selectedDev._id, talle: talleDev, cantidad: 1 },
        entregado: { productId: selectedEnt._id, talle: talleEnt, cantidad: 1 }
      });
      toast.success('Cambio realizado con éxito');
      setSelectedDev(null); setSelectedEnt(null); setTalleDev(''); setTalleEnt('');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error al procesar cambio');
    }
  };

  const diferencia = (selectedEnt?.precioPublico || 0) - (selectedDev?.precioPublico || 0);

  return (
    <div className="space-y-6 animate-slide-up">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 bg-blue-600/20 border border-blue-500/20 rounded-xl flex items-center justify-center">
          <RefreshCcw size={17} className="text-blue-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Gestión de Cambios</h1>
          <p className="text-white/40 text-sm">Seleccioná el calzado que entra y el que sale</p>
        </div>
      </div>

      <div className="flex items-center gap-3 glass rounded-xl px-4 py-3">
        <Search size={16} className="text-white/30" />
        <input
          type="text"
          placeholder="Buscar productos..."
          className="flex-1 bg-transparent outline-none text-white placeholder-white/30 text-sm"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ProductPicker
          label="Producto que entra (Devolución)"
          step={1}
          accent="border-red-500/30 bg-red-500/5"
          selected={selectedDev} talle={talleDev} products={products}
          onSelect={(p, t) => { setSelectedDev(p); setTalleDev(t); }}
          onClear={() => { setSelectedDev(null); setTalleDev(''); }}
        />
        <ProductPicker
          label="Producto que sale (Entrega)"
          step={2}
          accent="border-emerald-500/30 bg-emerald-500/5"
          selected={selectedEnt} talle={talleEnt} products={products}
          onSelect={(p, t) => { setSelectedEnt(p); setTalleEnt(t); }}
          onClear={() => { setSelectedEnt(null); setTalleEnt(''); }}
          requireStock
        />
      </div>

      {/* Summary bar */}
      <div className="glass rounded-2xl p-5 flex flex-col sm:flex-row items-center gap-5">
        <div className="flex items-center gap-4 flex-1">
          <div className="text-center">
            <p className="text-white/30 text-[10px] uppercase font-bold tracking-widest mb-1">Precio entrada</p>
            <p className="text-white text-xl font-black">${(selectedDev?.precioPublico || 0).toLocaleString()}</p>
          </div>
          <ArrowRight size={20} className="text-white/20" />
          <div className="text-center">
            <p className="text-white/30 text-[10px] uppercase font-bold tracking-widest mb-1">Precio salida</p>
            <p className="text-white text-xl font-black">${(selectedEnt?.precioPublico || 0).toLocaleString()}</p>
          </div>
          <div className="ml-auto text-right">
            <p className="text-white/30 text-[10px] uppercase font-bold tracking-widest mb-1">Diferencia</p>
            <p className={`text-3xl font-black ${
              diferencia > 0 ? 'text-emerald-400' : diferencia < 0 ? 'text-red-400' : 'text-white/40'
            }`}>
              {diferencia > 0 ? `+$${diferencia.toLocaleString()}` : diferencia < 0 ? `-$${Math.abs(diferencia).toLocaleString()}` : '$0'}
            </p>
          </div>
        </div>
        <button
          onClick={handleConfirm}
          disabled={!selectedDev || !talleDev || !selectedEnt || !talleEnt}
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500
            disabled:opacity-30 disabled:cursor-not-allowed text-white font-bold py-3 px-8 rounded-xl
            transition-all active:scale-95 shadow-lg shadow-blue-900/30"
        >
          <CheckCircle2 size={17} />
          CONFIRMAR CAMBIO
        </button>
      </div>
    </div>
  );
};

export default Exchanges;
