import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { ShoppingCart, Search, Trash2, Plus, Minus, CheckCircle2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

const Sales: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [cart, setCart] = useState<any[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [selectedTalle, setSelectedTalle] = useState('');
  const [cantidad, setCantidad] = useState(1);
  const [discountType, setDiscountType] = useState<'PORCENTAJE' | 'MONTO'>('PORCENTAJE');
  const [discountValue, setDiscountValue] = useState<string>('');

  useEffect(() => {
    const fetch = async () => {
      const { data } = await api.get(`/products?search=${search}`);
      setProducts(data);
    };
    const timeoutId = setTimeout(fetch, 300);
    return () => clearTimeout(timeoutId);
  }, [search]);

  const addToCart = () => {
    if (!selectedProduct || !selectedTalle) { toast.error('Seleccione producto y talle'); return; }
    const available = selectedProduct.stock[selectedTalle];
    if (available < cantidad) { toast.error('Stock insuficiente'); return; }
    const existing = cart.find(i => i.productId === selectedProduct._id && i.talle === selectedTalle);
    if (existing) {
      if (available < existing.cantidad + cantidad) { toast.error('Excedería el stock disponible'); return; }
      setCart(cart.map(i => i === existing ? { ...i, cantidad: i.cantidad + cantidad } : i));
    } else {
      setCart([...cart, {
        productId: selectedProduct._id,
        fabrica: selectedProduct.fabrica,
        articulo: selectedProduct.articulo,
        color: selectedProduct.color,
        talle: selectedTalle,
        cantidad,
        precio: selectedProduct.precioPublico
      }]);
    }
    setSelectedProduct(null); setSelectedTalle(''); setCantidad(1);
    toast.success('Agregado al carrito');
  };

  const confirmSale = async () => {
    try {
      const payload: any = { items: cart };
      if (Number(discountValue) > 0) {
        payload.descuento = {
          tipo: discountType,
          valor: Number(discountValue)
        };
      }
      await api.post('/sales', payload);
      toast.success('¡Venta confirmada!');
      setCart([]);
      setDiscountValue('');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error al procesar venta');
    }
  };

  const totalBruto = cart.reduce((acc, i) => acc + (i.precio * i.cantidad), 0);
  const discountAmount = Number(discountValue) > 0
    ? (discountType === 'PORCENTAJE' 
        ? totalBruto * (Number(discountValue) / 100) 
        : Number(discountValue))
    : 0;
  const totalFinal = totalBruto - discountAmount;

  return (
    <div className="flex flex-col lg:flex-row gap-6 animate-slide-up h-full">
      {/* Left: Product selector */}
      <div className="flex-1 min-w-0 space-y-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Nueva Venta</h1>
          <p className="text-white/40 text-sm">Seleccioná los artículos y talles</p>
        </div>

        <div className="flex items-center gap-3 glass rounded-xl px-4 py-3">
          <Search size={16} className="text-white/30 flex-shrink-0" />
          <input
            type="text"
            placeholder="Buscar producto..."
            className="flex-1 bg-transparent outline-none text-white placeholder-white/30 text-sm"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[calc(100vh-280px)] overflow-y-auto pr-1">
          {products.map(p => (
            <div
              key={p._id}
              onClick={() => { setSelectedProduct(p); setSelectedTalle(''); }}
              className={`glass rounded-2xl p-4 cursor-pointer transition-all duration-200 ${
                selectedProduct?._id === p._id
                  ? 'border-violet-500/50 bg-violet-500/10'
                  : 'hover:bg-white/8 hover:border-white/20'
              }`}
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <span className="badge-violet text-[10px] mb-1">{p.fabrica}</span>
                  <h4 className="font-bold text-white">{p.articulo}</h4>
                  <p className="text-white/40 text-xs">{p.color}</p>
                </div>
                <p className="font-black text-white text-lg">${p.precioPublico.toLocaleString()}</p>
              </div>

              {selectedProduct?._id === p._id && (
                <div className="mt-3 pt-3 border-t border-white/10 space-y-3 animate-fade-in" onClick={e => e.stopPropagation()}>
                  <div>
                    <p className="text-white/30 text-[10px] font-bold uppercase tracking-widest mb-2">Seleccioná el talle</p>
                    <div className="flex flex-wrap gap-1.5">
                      {Object.entries(p.stock as Record<string, number>).map(([t, stock]) => (
                        <button
                          key={t}
                          disabled={stock <= 0}
                          onClick={() => setSelectedTalle(t)}
                          className={`w-12 h-10 rounded-lg text-xs font-bold border transition-all ${
                            selectedTalle === t
                              ? 'bg-violet-600 border-violet-500 text-white shadow-lg shadow-violet-900/30'
                              : stock <= 0
                              ? 'bg-white/3 border-white/5 text-white/15 cursor-not-allowed'
                              : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10 hover:text-white'
                          }`}
                        >
                          <span className="block">{t}</span>
                          <span className="block text-[9px] opacity-70">{stock}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1 glass rounded-lg border border-white/10">
                      <button onClick={() => setCantidad(Math.max(1, cantidad - 1))} className="px-3 py-2 text-white/60 hover:text-white transition-colors">
                        <Minus size={14} />
                      </button>
                      <span className="px-3 py-2 text-white font-bold text-sm min-w-[2rem] text-center">{cantidad}</span>
                      <button onClick={() => setCantidad(cantidad + 1)} className="px-3 py-2 text-white/60 hover:text-white transition-colors">
                        <Plus size={14} />
                      </button>
                    </div>
                    <button
                      onClick={addToCart}
                      disabled={!selectedTalle}
                      className="flex-1 btn-primary py-2 text-sm disabled:opacity-30 disabled:cursor-not-allowed disabled:active:scale-100"
                    >
                      Agregar al carrito
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Right: Cart */}
      <div className="w-full lg:w-80 xl:w-96 flex-shrink-0">
        <div className="glass rounded-2xl p-5 sticky top-0">
          <div className="flex items-center gap-2 mb-5">
            <ShoppingCart size={18} className="text-violet-400" />
            <h2 className="font-bold text-white">Carrito</h2>
            {cart.length > 0 && (
              <span className="ml-auto badge-violet">{cart.length} item{cart.length > 1 ? 's' : ''}</span>
            )}
          </div>

          <div className="space-y-2 max-h-[320px] overflow-y-auto pr-1 mb-5">
            {cart.length === 0 ? (
              <div className="text-center py-10">
                <ShoppingCart size={32} strokeWidth={1} className="text-white/15 mx-auto mb-2" />
                <p className="text-white/25 text-sm">El carrito está vacío</p>
              </div>
            ) : (
              cart.map((item, idx) => (
                <div key={idx} className="flex items-center gap-3 bg-white/5 rounded-xl px-3 py-2.5">
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium truncate">{item.articulo}</p>
                    <p className="text-white/40 text-xs">
                      {item.color} · t{item.talle} · {item.cantidad} par{item.cantidad > 1 ? 'es' : ''}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-bold text-sm">${(item.precio * item.cantidad).toLocaleString()}</p>
                    <button onClick={() => setCart(cart.filter((_, i) => i !== idx))} className="text-white/20 hover:text-red-400 transition-colors">
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="border-t border-white/10 pt-4 space-y-4">
            {cart.length > 0 && (
              <div className="bg-white/5 rounded-xl p-3 space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-white/40 text-xs font-bold uppercase tracking-wider">Descuento</span>
                  <div className="flex bg-black/20 rounded-lg p-0.5">
                    <button 
                      onClick={() => setDiscountType('PORCENTAJE')}
                      className={`px-2 py-1 text-[10px] rounded-md transition-all ${discountType === 'PORCENTAJE' ? 'bg-violet-600 text-white shadow-lg' : 'text-white/40 hover:text-white'}`}
                    >
                      %
                    </button>
                    <button 
                      onClick={() => setDiscountType('MONTO')}
                      className={`px-2 py-1 text-[10px] rounded-md transition-all ${discountType === 'MONTO' ? 'bg-violet-600 text-white shadow-lg' : 'text-white/40 hover:text-white'}`}
                    >
                      $
                    </button>
                  </div>
                </div>
                <div className="relative">
                  <input
                    type="number"
                    placeholder={discountType === 'PORCENTAJE' ? "0%" : "$0"}
                    className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-violet-500/50 transition-all font-bold"
                    value={discountValue}
                    onChange={e => setDiscountValue(e.target.value)}
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-white/20">
                    {discountType === 'PORCENTAJE' ? '%' : '$'}
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              {discountAmount > 0 && (
                <>
                  <div className="flex items-center justify-between text-white/50 text-sm">
                    <span>Subtotal</span>
                    <span>${totalBruto.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between text-red-400 text-sm">
                    <span>Descuento</span>
                    <span>- ${discountAmount.toLocaleString()}</span>
                  </div>
                </>
              )}
              <div className="flex items-center justify-between pt-1">
                <span className="text-white/50 font-medium text-lg">Total</span>
                <span className="text-white font-black text-3xl">${totalFinal.toLocaleString()}</span>
              </div>
            </div>

            <button
              disabled={cart.length === 0}
              onClick={confirmSale}
              className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-30 disabled:cursor-not-allowed
                text-white font-bold py-3.5 rounded-xl transition-all active:scale-95 shadow-lg shadow-emerald-900/30"
            >
              <CheckCircle2 size={18} />
              CONFIRMAR VENTA
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sales;