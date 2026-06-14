import { Schema, model, Document, Types } from 'mongoose';

export interface ISaleItem {
  productId: Types.ObjectId;
  fabrica: string;
  articulo: string;
  color: string;
  talle: string;
  cantidad: number;
  precioVenta: number;
  costoVenta: number;
}

export interface ISale extends Document {
  items: ISaleItem[];
  totalVenta: number;
  totalBruto?: number;
  descuento?: {
    tipo: 'PORCENTAJE' | 'MONTO';
    valor: number;
  };
  totalCosto: number;
  totalGanancia: number;
  usuario: Types.ObjectId;
  fecha: Date;
}

const saleSchema = new Schema<ISale>({
  items: [{
    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    fabrica: String,
    articulo: String,
    color: String,
    talle: String,
    cantidad: { type: Number, required: true },
    precioVenta: { type: Number, required: true },
    costoVenta: { type: Number, required: true }
  }],
  totalVenta: { type: Number, required: true },
  totalBruto: { type: Number },
  descuento: {
    tipo: { type: String, enum: ['PORCENTAJE', 'MONTO'] },
    valor: { type: Number }
  },
  totalCosto: { type: Number, required: true },
  totalGanancia: { type: Number, required: true },
  usuario: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  fecha: { type: Date, default: Date.now }
}, { timestamps: true });

export default model<ISale>('Sale', saleSchema);
