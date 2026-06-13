import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Search, Package, SlidersHorizontal, X } from 'lucide-react';

const Products: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [filters, setFilters] = useState({ search: '', fabrica: '', articulo: '', color: '' });
  const [showFilters, setShowFilters] = useState(false);

  const hasActiveFilters = filters.fabrica || filters.articulo || filters.color;

  useEffect(() => {
    const fetch = async () => {
      const params = new URLSearchParams();
      if (filters.search) params.append('search', filters.search);
      if (filters.fabrica) params.append('fabrica', filters.fabrica);
      if (filters.articulo) params.append('articulo', filters.articulo);
      if (filters.color) params.append('color', filters.color);
      const { data } = await api.get(`/products?${params.toString()}`);
      setProducts(data);
    };
    const timeoutId = setTimeout(fetch, 300);
    return () => clearTimeout(timeoutId);
  }, [filters]);

  const clearFilters = () => setFilters({ search: '', fabrica: '', articulo: '', color: '' });

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Consulta de Stock</h1>
          <p className="text-white/40 text-sm mt-0.5">{products.length} productos encontrados</p>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="glass rounded-2xl p-4 space-y-3">
        <div className="flex gap-3">
          <div className="flex-1 flex items-center gap-3 bg-white/5 border border-white/10 focus-within:border-violet-500/50 rounded-xl px-4 py-3 transition-all">
            <Search size={16} className="text-white/30 flex-shrink-0" />
            <input 
              type="text"
              placeholder="Buscar por fábrica, artículo o color..."
              className="flex-1 bg-transparent outline-none text-white placeholder-white/30 text-sm"
              value={filters.search}
              onChange={e => setFilters({...filters, search: e.target.value})}
            />
            {filters.search && (
              <button onClick={() => setFilters({...filters, search: ''})} className="text-white/30 hover:text-white/60">
                <X size={14} />
              </button>
            )}
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-3 rounded-xl border text-sm font-medium transition-all ${
              hasActiveFilters
                ? 'bg-violet-600/20 border-violet-500/30 text-violet-300'
                : 'bg-white/5 border-white/10 text-white/50 hover:text-white/70 hover:bg-white/8'
            }`}
          >
            <SlidersHorizontal size={15} />
            <span className="hidden sm:inline">Filtros</span>
            {hasActiveFilters && <span className="w-1.5 h-1.5 rounded-full bg-violet-400" />}
          </button>
        </div>

        {showFilters && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 border-t border-white/5">
            {[
              { key: 'fabrica', placeholder: 'Fábrica' },
              { key: 'articulo', placeholder: 'Artículo' },
              { key: 'color', placeholder: 'Color' },
            ].map(f => (
              <input
                key={f.key}
                type="text"
                placeholder={f.placeholder}
                className="input-dark text-sm py-2.5"
                value={(filters as any)[f.key]}
                onChange={e => setFilters({...filters, [f.key]: e.target.value})}
              />
            ))}
            {hasActiveFilters && (
              <button onClick={clearFilters} className="sm:col-span-3 text-xs text-white/30 hover:text-white/50 text-left transition-colors">
                Limpiar filtros
              </button>
            )}
          </div>
        )}
      </div>

      {/* Products grid */}
      {products.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-white/20">
          <Package size={48} strokeWidth={1} className="mb-4" />
          <p className="font-medium">Sin resultados</p>
          <p className="text-sm mt-1">Probá con otros filtros</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map(p => {
            const totalStock = Object.values(p.stock as Record<string, number>).reduce((a, b) => a + b, 0);
            return (
              <div key={p._id} className="glass hover:bg-white/8 rounded-2xl p-5 transition-all duration-200 hover:-translate-y-0.5 group">
                <div className="flex items-start justify-between mb-4">
                  <div className="min-w-0">
                    <span className="badge-violet text-[10px] mb-1.5">{p.fabrica}</span>
                    <h3 className="text-white font-bold text-lg leading-tight truncate">{p.articulo}</h3>
                    <p className="text-white/40 text-sm">{p.color}</p>
                  </div>
                  <div className="text-right flex-shrink-0 ml-3">
                    <p className="text-white font-black text-xl">${p.precioPublico.toLocaleString()}</p>
                    <span className={`text-xs font-medium ${totalStock > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                      {totalStock} pares
                    </span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <p className="text-white/25 text-[10px] font-semibold uppercase tracking-widest">Stock por talle</p>
                  <div className="grid grid-cols-7 gap-1">
                    {Object.entries(p.stock as Record<string, number>).map(([t, qty]) => (
                      <div key={t} className={`rounded-lg p-1.5 text-center border transition-colors ${
                        qty > 0
                          ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                          : 'bg-white/3 border-white/5 text-white/15'
                      }`}>
                        <p className="text-[9px] font-bold leading-none mb-0.5">t{t}</p>
                        <p className="text-sm font-black leading-none">{qty}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Products;