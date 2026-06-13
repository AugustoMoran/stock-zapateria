import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { toast } from 'react-hot-toast';
import { Plus, Edit2, Trash2, Gauge, X } from 'lucide-react';

const TALLES = ['5', '6', '7', '8', '9', '0', '1'];

const Modal: React.FC<{ title: string; onClose: () => void; children: React.ReactNode }> = ({ title, onClose, children }) => (
  <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
    <div className="bg-[#1a1d2e] border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
      <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
        <h3 className="text-lg font-bold text-white">{title}</h3>
        <button onClick={onClose} className="text-white/30 hover:text-white/70 p-1 transition-colors"><X size={18} /></button>
      </div>
      <div className="p-6">{children}</div>
    </div>
  </div>
);

const ProductManagement: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isStockModalOpen, setIsStockModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedForStock, setSelectedForStock] = useState<any>(null);
  const [stockAdjust, setStockAdjust] = useState<any>({ talle: '5', cantidad: '', tipo: 'AJUSTE_MANUAL', descripcion: '' });
  const emptyForm = { fabrica: '', articulo: '', color: '', costo: '' as any, precioPublico: '' as any, stock: Object.fromEntries(TALLES.map(t => [t, ''])) };
  const [form, setForm] = useState<any>(emptyForm);

  const fetchProducts = async () => { const { data } = await api.get('/products'); setProducts(data); };
  useEffect(() => { fetchProducts(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const dataToSend = {
      ...form,
      costo: Number(form.costo) || 0,
      precioPublico: Number(form.precioPublico) || 0,
      stock: Object.fromEntries(Object.entries(form.stock).map(([t, v]) => [t, Number(v) || 0]))
    };
    try {
      editingId ? await api.put(`/products/${editingId}`, dataToSend) : await api.post('/products', dataToSend);
      toast.success(editingId ? 'Producto actualizado' : 'Producto creado');
      setIsModalOpen(false); setEditingId(null); setForm(emptyForm); fetchProducts();
    } catch (err: any) { toast.error(err.response?.data?.message || 'Error al guardar'); }
  };

  const handleStockAdjust = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.patch(`/admin/products/${selectedForStock._id}/stock`, {
        ...stockAdjust,
        cantidad: Number(stockAdjust.cantidad) || 0
      });
      toast.success('Stock ajustado');
      setIsStockModalOpen(false); setStockAdjust({ talle: '5', cantidad: '', tipo: 'AJUSTE_MANUAL', descripcion: '' }); fetchProducts();
    } catch { toast.error('Error al ajustar stock'); }
  };

  const handleEdit = (p: any) => {
    setEditingId(p._id);
    setForm({ 
      fabrica: p.fabrica, 
      articulo: p.articulo, 
      color: p.color, 
      costo: p.costo, 
      precioPublico: p.precioPublico, 
      stock: p.stock 
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('\u00bfEliminar este producto?')) return;
    await api.delete(`/products/${id}`); toast.success('Producto eliminado'); fetchProducts();
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">Gestión de Productos</h2>
          <p className="text-white/40 text-sm">{products.length} productos en catálogo</p>
        </div>
        <button onClick={() => { setEditingId(null); setForm(emptyForm); setIsModalOpen(true); }} className="btn-primary flex items-center gap-2">
          <Plus size={16} />
          Nuevo Producto
        </button>
      </div>

      <div className="glass rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/5">
                {['Fábrica', 'Artículo', 'Color', 'Costo', 'Precio Público', 'Stock por Talle', ''].map(h => (
                  <th key={h} className="px-4 py-3 text-white/30 text-[10px] font-semibold uppercase tracking-widest">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {products.map(p => (
                <tr key={p._id} className="border-b border-white/5 hover:bg-white/3 transition-colors">
                  <td className="px-4 py-3"><span className="badge-violet text-[10px]">{p.fabrica}</span></td>
                  <td className="px-4 py-3 text-white font-medium">{p.articulo}</td>
                  <td className="px-4 py-3 text-white/50">{p.color}</td>
                  <td className="px-4 py-3 text-red-400 text-sm">${p.costo.toLocaleString()}</td>
                  <td className="px-4 py-3 text-emerald-400 font-bold">${p.precioPublico.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      {Object.entries(p.stock as Record<string, number>).map(([t, qty]) => (
                        <span key={t} className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                          qty > 0 ? 'bg-emerald-500/15 text-emerald-400' : 'bg-white/5 text-white/15'
                        }`}>
                          {t}:{qty}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button onClick={() => { setSelectedForStock(p); setIsStockModalOpen(true); }} className="p-2 text-amber-400/60 hover:text-amber-300 hover:bg-amber-500/10 rounded-lg transition-all" title="Ajustar stock"><Gauge size={14} /></button>
                      <button onClick={() => handleEdit(p)} className="p-2 text-blue-400/60 hover:text-blue-300 hover:bg-blue-500/10 rounded-lg transition-all"><Edit2 size={14} /></button>
                      <button onClick={() => handleDelete(p._id)} className="p-2 text-red-400/60 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-all"><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Stock adjust modal */}
      {isStockModalOpen && (
        <Modal title="Ajuste de Stock Manual" onClose={() => setIsStockModalOpen(false)}>
          <p className="text-white/40 text-sm mb-5">{selectedForStock?.articulo} &mdash; {selectedForStock?.color}</p>
          <form onSubmit={handleStockAdjust} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-white/40 text-[10px] uppercase tracking-widest font-bold mb-2">Talle</label>
                <select className="input-dark" value={stockAdjust.talle} onChange={e => setStockAdjust({...stockAdjust, talle: e.target.value})}>
                  {TALLES.map(t => <option key={t} value={t} className="bg-[#1a1d2e]">Talle {t}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-white/40 text-[10px] uppercase tracking-widest font-bold mb-2">Cantidad (+/-)</label>
                <input type="number" className="input-dark" value={stockAdjust.cantidad} onChange={e => setStockAdjust({...stockAdjust, cantidad: e.target.value})} />
              </div>
            </div>
            <div>
              <label className="block text-white/40 text-[10px] uppercase tracking-widest font-bold mb-2">Motivo</label>
              <input type="text" className="input-dark" placeholder="Ej: Rotura, Error de carga..." value={stockAdjust.descripcion} onChange={e => setStockAdjust({...stockAdjust, descripcion: e.target.value})} />
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button type="button" onClick={() => setIsStockModalOpen(false)} className="btn-ghost">Cancelar</button>
              <button type="submit" className="bg-amber-500 hover:bg-amber-400 text-black font-bold px-6 py-2.5 rounded-xl transition-all active:scale-95">Aplicar Ajuste</button>
            </div>
          </form>
        </Modal>
      )}

      {/* Product form modal */}
      {isModalOpen && (
        <Modal title={editingId ? 'Editar Producto' : 'Nuevo Producto'} onClose={() => setIsModalOpen(false)}>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[{key:'fabrica',label:'Fábrica'},{key:'articulo',label:'Artículo'},{key:'color',label:'Color'}].map(f => (
                <div key={f.key}>
                  <label className="block text-white/40 text-[10px] uppercase tracking-widest font-bold mb-2">{f.label}</label>
                  <input className="input-dark" required value={(form as any)[f.key]} onChange={e => setForm({...form, [f.key]: e.target.value})} />
                </div>
              ))}
              <div>
                <label className="block text-white/40 text-[10px] uppercase tracking-widest font-bold mb-2">Costo</label>
                <input type="number" className="input-dark" required value={form.costo} onChange={e => setForm({...form, costo: e.target.value})} />
              </div>
              <div>
                <label className="block text-white/40 text-[10px] uppercase tracking-widest font-bold mb-2">Precio Público</label>
                <input type="number" className="input-dark" required value={form.precioPublico} onChange={e => setForm({...form, precioPublico: e.target.value})} />
              </div>
            </div>

            <div>
              <p className="text-white/40 text-xs uppercase tracking-widest font-semibold mb-3 border-t border-white/5 pt-4">Stock por talle</p>
              <div className="grid grid-cols-7 gap-2">
                {TALLES.map(t => (
                  <div key={t} className="text-center">
                    <p className="text-white/30 text-[10px] font-bold mb-1.5">T{t}</p>
                    <input type="number" className="w-full bg-white/5 border border-white/10 text-white text-center rounded-xl py-2 text-sm font-bold outline-none focus:border-violet-500/50 transition-colors"
                      value={(form.stock as any)[t]}
                      onChange={e => setForm({...form, stock: {...form.stock, [t]: e.target.value}})}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button type="button" onClick={() => setIsModalOpen(false)} className="btn-ghost">Cancelar</button>
              <button type="submit" className="btn-primary">Guardar Producto</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default ProductManagement;